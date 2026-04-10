// src/components/common/QuickCard.jsx
import React from 'react';

/**
 * Petite carte interactive utilisée sur le tableau de bord pour les accès rapides.
 */
export const QuickCard = ({ icon, title, text, onClick }) => {
  return (
    <button type="button" onClick={onClick} className="w-full text-left p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer group relative overflow-hidden">
       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4">{icon}</div>
       <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl inline-block mb-8 group-hover:scale-110 transition-transform shadow-inner">{icon}</div>
       <h4 className="text-xl font-black dark:text-white mb-3 tracking-tight uppercase leading-tight">{title}</h4>
       <p className="text-slate-500 font-bold text-xs tracking-widest uppercase opacity-80">{text}</p>
    </button>
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
