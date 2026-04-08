// src/components/games/PokeMemory.jsx
import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Shuffle, Trophy } from 'lucide-react';

/**
 * Jeu de Memory utilisant les sprites des Pokémon.
 * Gère les animations de retournement (flip) et la détection des paires.
 */
const PokeMemory = ({ state, onCardClick, onRestart }) => {
  const isWon = state.endTime !== null && state.cards.length > 0;

  return (
    <div className="mx-auto mt-2 max-w-4xl space-y-4 px-2 pb-6 sm:px-4 md:mt-4 md:space-y-6">
       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="text-center md:text-left">
             <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white sm:text-3xl md:text-4xl">Poké-Memory</h2>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Tentez de trouver les 6 paires</p>
          </div>
          <div className="flex items-center justify-center gap-3 sm:gap-4">
             <div className="bg-white dark:bg-slate-900 px-4 py-2 md:px-6 md:py-4 rounded-2xl shadow-md border-4 border-slate-100 dark:border-slate-800 text-center">
                <div className="text-[8px] font-black uppercase text-slate-400 opacity-50 mb-1">Essais</div>
                <div className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">{state.moves}</div>
             </div>
             <button type="button" aria-label="Relancer le Poké-Memory" onClick={onRestart} className="flex items-center justify-center rounded-2xl bg-rose-500 p-3 text-white shadow-md transition-all hover:rotate-6 md:p-4"><Shuffle size={20}/></button>
          </div>
       </div>

       {/* Message de Victoire */}
       {isWon && (
         <Motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-3 rounded-[2rem] border-4 border-emerald-500/20 bg-emerald-500/10 p-5 text-center sm:p-6">
            <Trophy size={48} className="mx-auto text-emerald-500" />
            <h3 className="text-2xl font-black uppercase text-emerald-500 sm:text-3xl">INCROYABLE !</h3>
            <p className="font-bold text-slate-500">Victoire en {state.moves} coups.</p>
            <button type="button" onClick={onRestart} className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase hover:scale-105 shadow-xl transition-all">Rejouer</button>
         </Motion.div>
       )}

       {/* Grille de cartes */}
       <div role="grid" aria-label="Grille du Poké-Memory" className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:grid-cols-4">
          {state.cards.map((card, index) => {
             const flipped = state.flipped.includes(index);
             const solved = state.solved.includes(index);
             const active = flipped || solved;
             const cardLabel = solved
               ? `Paire trouvee ${card.nom}`
               : flipped
                 ? `Carte revelee ${card.nom}`
                 : `Carte cachee ${index + 1}`;
             
             return (
               <button type="button" role="gridcell" aria-label={cardLabel} aria-pressed={active} disabled={isWon || solved || flipped} key={card.uniqueId} className="relative aspect-square cursor-pointer" onClick={() => !isWon && onCardClick(index)}>
                  <Motion.div 
                    animate={{ rotateY: active ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    className="w-full h-full relative"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Dos de la carte */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl border-4 border-slate-300 bg-slate-100 p-2 shadow dark:border-slate-700 dark:bg-slate-800 sm:rounded-2xl md:rounded-3xl" style={{ backfaceVisibility: 'hidden' }}>
                       <div className="h-10 w-10 rounded-full border-[6px] border-slate-300 opacity-20 sm:h-12 sm:w-12 md:h-16 md:w-16 md:border-[8px]" />
                    </div>
                    
                    {/* Face de la carte (Pokémon) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border-4 border-rose-500 bg-white p-2 shadow dark:bg-slate-800 sm:rounded-2xl md:rounded-3xl" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                       <img src={card.image} alt={card.nom} className="w-full h-full object-contain drop-shadow-2xl mb-1" />
                       <span className="mt-1 w-full truncate text-center text-[8px] font-black uppercase text-rose-500 sm:mt-2 sm:text-[10px]">{card.nom}</span>
                    </div>
                  </Motion.div>
               </button>
             );
          })}
       </div>
    </div>
  );
};

export default PokeMemory;
