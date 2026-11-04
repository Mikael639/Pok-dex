// src/components/common/Cards.jsx
import React from 'react';

/**
 * Affichage factice (Skeleton) d'une tuile Pokémon, utilisé pendant le chargement.
 */
export const PokemonSkeleton = () => {
  return (
    <div className="flex h-full min-h-0 flex-col gap-2 rounded-2xl border-2 border-transparent bg-white p-3 shadow-md dark:bg-slate-900 sm:rounded-3xl">
      <div className="skeleton-box mx-auto min-h-0 w-3/4 flex-1 rounded-full bg-slate-100 dark:bg-slate-800" />
      <div className="skeleton-box mx-auto h-4 w-2/3 rounded-lg bg-slate-100 dark:bg-slate-800" />
      <div className="mx-auto flex gap-1">
        <div className="skeleton-box h-4 w-10 rounded-md bg-slate-100 dark:bg-slate-800" />
        <div className="skeleton-box h-4 w-10 rounded-md bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
};
