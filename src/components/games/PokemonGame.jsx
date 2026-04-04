// src/components/games/PokemonGame.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

/**
 * Jeu "Qui est ce Pokémon ?" (Silhouette Game).
 * Affiche l'ombre du Pokémon et propose 4 choix.
 */
const PokemonGame = ({ gameState, onGuess, onNext, isDarkMode }) => {
  if (!gameState.target) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto">
       <div className="flex justify-between items-end mb-8">
          <div className="text-left">
             <h3 className="text-3xl font-black mb-1">Qui est ce Pokémon ?</h3>
             <div className="flex gap-4">
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Score: {gameState.score}</p>
                <p className="text-rose-500 font-bold uppercase text-[10px] tracking-widest">Record: {gameState.highscore}</p>
             </div>
          </div>
          <div className="text-right">
             {/* Minuteur visuel qui change de couleur en cas d'urgence (< 4s) */}
             <div className={`text-4xl font-black ${gameState.timeLeft < 4 ? 'text-rose-500 animate-bounce' : 'text-slate-900 dark:text-white'}`}>{gameState.timeLeft}s</div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vite !</p>
          </div>
       </div>

       <div className={`p-12 rounded-[4rem] text-center shadow-2xl border-4 transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          {/* Section Silhouette : assombrie tant que le Pokémon n'est pas révélé */}
          <div className="relative mb-12 h-80 flex items-center justify-center overflow-hidden rounded-[3rem] bg-slate-50 dark:bg-slate-950 shadow-inner p-10">
             <motion.img 
               key={gameState.target.id} 
               initial={{ scale: 0.5, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
               src={gameState.target.image} 
               className={`w-full h-full object-contain filter transition-all duration-1000 ${gameState.status === 'playing' ? 'brightness-0 contrast-200 blur-sm' : 'brightness-110 scale-105'}`} 
             />
          </div>

          {/* Grille de 4 choix possibles */}
          <div className="grid grid-cols-2 gap-6 w-full">
             {gameState.choices.map(p => (
                <button
                  key={p.id}
                  disabled={gameState.status !== 'playing'}
                  onClick={() => onGuess(p.id)}
                  className={`py-6 rounded-[2rem] font-black text-xl transition-all shadow-lg ${
                    gameState.status === 'revealed'
                      ? p.id === gameState.target.id
                        ? 'bg-emerald-500 text-white scale-105 shadow-xl shadow-emerald-500/20'
                        : p.id === gameState.selectedId
                          ? 'bg-rose-500 text-white opacity-50'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-20'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white hover:scale-[1.02] active:scale-95'
                  }`}
                >
                   {p.nom}
                </button>
             ))}
          </div>

          {gameState.status === 'revealed' && (
             <motion.button 
               initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
               onClick={onNext} 
               className="mt-12 px-12 py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[2rem] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
             >
                SUIVANT <ChevronRight className="inline ml-2" />
             </motion.button>
          )}
       </div>
    </motion.div>
  );
};

export default PokemonGame;
