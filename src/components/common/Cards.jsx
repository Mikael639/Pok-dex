// src/components/common/Cards.jsx
import React from 'react';

/**
 * Affichage factice (Skeleton) utilisé pendant le chargement des Pokémon.
 */
export const PokemonSkeleton = () => {
  return (
    <div className="p-8 rounded-[3rem] bg-white dark:bg-slate-900 border-4 border-transparent shadow-xl relative overflow-hidden">
       <div className="relative mb-8 mt-4 h-48 bg-slate-100 dark:bg-slate-800 rounded-full w-48 mx-auto skeleton-box" />
       <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl w-3/4 mb-4 skeleton-box" />
       <div className="flex gap-2">
          <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl w-16 skeleton-box" />
          <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl w-16 skeleton-box" />
       </div>
    </div>
  );
};

