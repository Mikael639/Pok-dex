// src/components/pokemon/PokemonCard.jsx
import React from 'react';
import { Star, Heart } from 'lucide-react';
import { TYPE_COLORS } from '../../constants/pokemon';
import { cn } from '../../lib/utils';

/**
 * Tuile compacte d'un Pokémon (collection et équipe).
 * Elle remplit la cellule de la grille : l'illustration prend la hauteur disponible.
 */
const PokemonCard = ({ pokemon, isCaught, isFavorite, isDarkMode, onClick, onCatch, onToggleFavorite }) => {
  const color = (pokemon?.types && pokemon.types[0] && TYPE_COLORS[pokemon.types[0].nom]) || '#94A3B8';

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border-2 text-left shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl sm:rounded-3xl',
        isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900',
        isCaught ? 'border-brand-500' : isDarkMode ? 'border-slate-800' : 'border-white'
      )}
    >
      <button
        type="button"
        aria-label={`Voir ${pokemon?.nom}`}
        onClick={(event) => { event.stopPropagation(); onClick(); }}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-4 ring-brand-500/30 sm:rounded-3xl"
      />

      <button
        type="button"
        aria-label={isFavorite ? `Retirer ${pokemon?.nom} des favoris` : `Ajouter ${pokemon?.nom} aux favoris`}
        onClick={(event) => { event.stopPropagation(); onToggleFavorite(); }}
        className={cn(
          'absolute left-1.5 top-1.5 z-20 rounded-full p-1.5 shadow transition-all sm:left-2 sm:top-2 sm:p-2',
          isFavorite ? 'bg-amber-400 text-white' : 'bg-slate-100/90 text-slate-400 hover:text-amber-500 dark:bg-slate-800/90'
        )}
      >
        <Star size={14} fill={isFavorite ? 'white' : 'none'} />
      </button>
      <button
        type="button"
        aria-label={isCaught ? `Retirer ${pokemon?.nom} de l equipe` : `Ajouter ${pokemon?.nom} a l equipe`}
        onClick={(event) => { event.stopPropagation(); onCatch(); }}
        className={cn(
          'absolute right-1.5 top-1.5 z-20 rounded-full p-1.5 shadow transition-all sm:right-2 sm:top-2 sm:p-2',
          isCaught ? 'bg-brand-500 text-white' : 'bg-slate-100/90 text-slate-400 hover:text-brand-500 dark:bg-slate-800/90'
        )}
      >
        <Heart size={14} fill={isCaught ? 'white' : 'none'} />
      </button>

      {/* Illustration : prend toute la hauteur restante */}
      <div className="relative min-h-0 flex-1 px-2 pt-6 sm:px-3 sm:pt-7">
        <div aria-hidden="true" className="absolute inset-x-4 inset-y-3 rounded-full blur-2xl" style={{ backgroundColor: color, opacity: 0.3 }} />
        <img src={pokemon?.image} alt={pokemon?.nom} loading="lazy" className="relative z-[1] h-full w-full object-contain drop-shadow-xl" />
      </div>

      <div className="relative shrink-0 px-2 pb-2 pt-1 text-center sm:pb-3">
        <h3 className="truncate text-xs font-black capitalize tracking-tight sm:text-base">{pokemon?.nom}</h3>
        <div className="mt-1 flex flex-wrap justify-center gap-1">
          {pokemon?.types?.map((t) => (
            <span key={t.nom} className="rounded-md px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wider text-white sm:rounded-lg sm:px-2 sm:text-[9px]" style={{ backgroundColor: TYPE_COLORS[t.nom] || '#94A3B8' }}>
              {t.nom}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
