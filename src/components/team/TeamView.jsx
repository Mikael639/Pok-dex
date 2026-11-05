import React from 'react';
import { Users } from 'lucide-react';
import PokemonTile from '../pokemon/PokemonTile';
import TeamSynergy from './TeamSynergy';

/**
 * Onglet « Mon équipe » : les Pokémon de l'équipe (tuiles) puis l'analyse de synergie, sur un seul écran.
 */
export default function TeamView({ team, favorites, isDarkMode, onSelect, onCatch, onToggleFavorite }) {
  if (team.length === 0) {
    return (
      <div role="status" className="flex h-full min-h-[18rem] flex-col items-center justify-center rounded-[2rem] border-4 border-dashed border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <Users size={56} className="mb-4 text-slate-200 dark:text-slate-800" />
        <h3 className="text-xl font-black dark:text-white sm:text-3xl">Votre équipe est vide</h3>
        <p className="mt-2 text-sm font-bold text-slate-500">Explorez la collection pour sélectionner 6 champions.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[26rem] flex-col gap-2 sm:gap-3">
      <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-2 sm:gap-3 lg:grid-cols-6 lg:grid-rows-1">
        {team.map((p) => (
          <PokemonTile
            key={p.id}
            pokemon={p}
            isDarkMode={isDarkMode}
            isCaught
            isFavorite={favorites.includes(p.id)}
            onClick={() => onSelect(p)}
            onCatch={() => onCatch(p)}
            onToggleFavorite={() => onToggleFavorite(p.id)}
          />
        ))}
      </div>
      <div className="flex max-h-[42%] min-h-0 shrink-0 flex-col">
        <TeamSynergy team={team} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}
