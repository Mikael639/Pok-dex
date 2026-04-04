// src/components/games/PokeMemory.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Trophy } from 'lucide-react';

/**
 * Jeu de Memory utilisant les sprites des Pokémon.
 * Gère les animations de retournement (flip) et la détection des paires.
 */
const PokeMemory = ({ state, onCardClick, onRestart, isDarkMode }) => {
  const isWon = state.endTime !== null && state.cards.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 pb-20">
       <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
             <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Poké-Memory</h2>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Tentez de trouver les 6 paires</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-3xl shadow-xl border-4 border-slate-100 dark:border-slate-800 text-center">
                <div className="text-[8px] font-black uppercase text-slate-400 opacity-50 mb-1">Essais</div>
                <div className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">{state.moves}</div>
             </div>
             <button onClick={onRestart} className="p-4 bg-rose-500 text-white rounded-3xl shadow-xl hover:rotate-6 transition-all"><Shuffle size={24}/></button>
          </div>
       </div>

       {/* Message de Victoire */}
       {isWon && (
         <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-8 bg-emerald-500/10 rounded-[3rem] border-4 border-emerald-500/20 text-center space-y-4">
            <Trophy size={48} className="mx-auto text-emerald-500" />
            <h3 className="text-3xl font-black text-emerald-500 uppercase">INCROYABLE !</h3>
            <p className="font-bold text-slate-500">Victoire en {state.moves} coups.</p>
            <button onClick={onRestart} className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase hover:scale-105 shadow-xl transition-all">Rejouer</button>
         </motion.div>
       )}

       {/* Grille de cartes */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {state.cards.map((card, index) => {
             const flipped = state.flipped.includes(index);
             const solved = state.solved.includes(index);
             const active = flipped || solved;
             
             return (
               <div key={card.uniqueId} className="aspect-square relative cursor-pointer" onClick={() => !isWon && onCardClick(index)}>
                  <motion.div 
                    animate={{ rotateY: active ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    className="w-full h-full relative"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Dos de la carte */}
                    <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 border-4 border-slate-300 dark:border-slate-700 rounded-3xl shadow-xl flex items-center justify-center p-4" style={{ backfaceVisibility: 'hidden' }}>
                       <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-[8px] border-slate-300 opacity-20" />
                    </div>
                    
                    {/* Face de la carte (Pokémon) */}
                    <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex flex-col items-center justify-center p-3 border-4 border-rose-500" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                       <img src={card.image} alt={card.nom} className="w-full h-full object-contain drop-shadow-2xl mb-1" />
                       <span className="text-[10px] font-black text-rose-500 uppercase truncate text-center w-full mt-2">{card.nom}</span>
                    </div>
                  </motion.div>
               </div>
             );
          })}
       </div>
    </div>
  );
};

export default PokeMemory;
