import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import PokemonCard from './PokemonCard';
import { PokemonSkeleton } from '../common/Cards';
import { useGridCapacity } from '../../hooks/useGridCapacity';

const PageButton = ({ label, disabled, onClick, children }) => (
  <button
    type="button"
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-lg transition-all hover:text-brand-500 active:scale-95 disabled:opacity-20 dark:bg-slate-900 sm:h-11 sm:w-11"
  >
    {children}
  </button>
);

/**
 * Collection paginée : le nombre de Pokémon par page s'adapte à l'écran
 * (colonnes x lignes visibles) pour ne jamais avoir à faire défiler la page.
 */
export default function PokemonBrowser({ pokemons, loading, page, setPage, team, favorites, isDarkMode, onSelect, onCatch, onToggleFavorite }) {
  const { ref, cols, rows, capacity } = useGridCapacity({ minTileWidth: 104, minTileHeight: 132, gap: 12 });

  const totalPages = Math.max(1, Math.ceil(pokemons.length / capacity));
  const currentPage = Math.min(page, totalPages);
  const visible = pokemons.slice((currentPage - 1) * capacity, currentPage * capacity);
  const gridStyle = { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` };

  return (
    <div className="flex h-full min-h-[22rem] flex-col gap-2 sm:gap-3">
      <div ref={ref} className="relative min-h-0 flex-1">
        {loading ? (
          <div className="grid h-full gap-3" style={gridStyle}>
            {Array.from({ length: capacity }).map((_, i) => <PokemonSkeleton key={i} />)}
          </div>
        ) : visible.length === 0 ? (
          <div role="status" className="flex h-full items-center justify-center text-center text-sm font-black uppercase tracking-widest opacity-50">
            Aucun Pokémon trouvé
          </div>
        ) : (
          <div className="grid h-full gap-3" style={gridStyle}>
            {visible.map((p, i) => (
              <PokemonCard
                key={p.id}
                pokemon={p}
                index={i}
                isDarkMode={isDarkMode}
                isCaught={team.some((t) => t.id === p.id)}
                isFavorite={favorites.includes(p.id)}
                onClick={() => onSelect(p)}
                onCatch={() => onCatch(p)}
                onToggleFavorite={() => onToggleFavorite(p.id)}
              />
            ))}
          </div>
        )}
      </div>

      {!loading && (
        <nav aria-label="Pagination" className="flex shrink-0 items-center justify-center gap-2 sm:gap-3">
          <PageButton label="Premiere page" disabled={currentPage === 1} onClick={() => setPage(1)}><ChevronsLeft size={18} /></PageButton>
          <PageButton label="Page precedente" disabled={currentPage === 1} onClick={() => setPage(Math.max(1, currentPage - 1))}><ChevronLeft size={20} /></PageButton>
          <span className="min-w-[5.5rem] text-center text-base font-black tabular-nums sm:text-xl dark:text-white">{currentPage} / {totalPages}</span>
          <PageButton label="Page suivante" disabled={currentPage === totalPages} onClick={() => setPage(Math.min(totalPages, currentPage + 1))}><ChevronRight size={20} /></PageButton>
          <PageButton label="Derniere page" disabled={currentPage === totalPages} onClick={() => setPage(totalPages)}><ChevronsRight size={18} /></PageButton>
        </nav>
      )}
    </div>
  );
}
