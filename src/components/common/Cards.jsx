// src/components/common/QuickCard.jsx
import React from 'react';

/**
 * Petite carte interactive utilisée sur le tableau de bord pour les accès rapides.
 */
export const QuickCard = ({ icon, title, text, onClick }) => {
  return (
    <div onClick={onClick} className="p-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border-4 border-transparent hover:border-rose-500 transition-all cursor-pointer group">
       <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl inline-block mb-6 group-hover:scale-110 transition-transform">{icon}</div>
       <h4 className="text-2xl font-black dark:text-white mb-2">{title}</h4>
       <p className="text-slate-500 font-bold text-sm tracking-tight">{text}</p>
    </div>
  );
};

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
