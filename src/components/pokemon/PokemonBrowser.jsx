import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PokemonCard from './PokemonCard';
import { PokemonSkeleton } from '../common/Cards';

const PAGE_SIZE = 32;

/** Vue Archives : grandes cartes, 32 par page, défilement dans la page. */
export default function PokemonBrowser({ pokemons, loading, page, setPage, team, favorites, isDarkMode, onSelect, onCatch, onToggleFavorite }) {
  const totalPages = Math.max(1, Math.ceil(pokemons.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = pokemons.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const goTo = (next) => {
    setPage(next);
    document.getElementById('page-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="mx-auto grid w-full max-w-[2000px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <PokemonSkeleton key={i} />)
          : visible.map((p, i) => (
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

      {!loading && visible.length === 0 && (
        <div role="status" className="py-20 text-center font-black uppercase tracking-widest opacity-50">Aucun Pokémon trouvé</div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-8 pb-6 pt-12">
          <button type="button" aria-label="Page precedente" disabled={currentPage === 1} onClick={() => goTo(Math.max(1, currentPage - 1))} className="rounded-3xl bg-white p-5 shadow-xl disabled:opacity-20 dark:bg-slate-900"><ChevronLeft /></button>
          <span className="text-2xl font-black dark:text-white">{currentPage} / {totalPages}</span>
          <button type="button" aria-label="Page suivante" disabled={currentPage === totalPages} onClick={() => goTo(Math.min(totalPages, currentPage + 1))} className="rounded-3xl bg-white p-5 shadow-xl disabled:opacity-20 dark:bg-slate-900"><ChevronRight /></button>
        </div>
      )}
    </div>
  );
}
