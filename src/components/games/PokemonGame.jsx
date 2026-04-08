// src/components/games/PokemonGame.jsx
import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

/**
 * Jeu "Qui est ce Pokémon ?" (Silhouette Game).
 * Affiche l'ombre du Pokémon et propose 4 choix.
 */
const PokemonGame = ({ gameState, onGuess, onNext, isDarkMode }) => {
  if (!gameState.target) return null;
  const revealMessage = gameState.status === 'revealed'
    ? gameState.selectedId === gameState.target.id
      ? `Bonne reponse, c'etait ${gameState.target.nom}.`
      : gameState.selectedId === -1
        ? `Temps ecoule. La bonne reponse etait ${gameState.target.nom}.`
        : `Mauvaise reponse. La bonne reponse etait ${gameState.target.nom}.`
    : null;
  return (
    <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-4xl px-2 sm:px-0">
       <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between md:mb-8">
          <div className="text-left">
             <h3 className="mb-1 text-2xl font-black sm:text-3xl">Qui est ce Pokémon ?</h3>
             <div className="flex flex-wrap gap-3 sm:gap-4">
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Score: {gameState.score}</p>
                <p className="text-rose-500 font-bold uppercase text-[10px] tracking-widest">Record: {gameState.highscore}</p>
             </div>
          </div>
          <div className="text-left sm:text-right">
             {/* Minuteur visuel qui change de couleur en cas d'urgence (< 4s) */}
             <div className={`text-3xl font-black sm:text-4xl ${gameState.timeLeft < 4 ? 'text-rose-500 animate-bounce' : 'text-slate-900 dark:text-white'}`}>{gameState.timeLeft}s</div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vite !</p>
          </div>
       </div>

       <div className={`rounded-[2rem] border-4 p-4 text-center shadow-2xl transition-all sm:rounded-[3rem] sm:p-6 md:p-8 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          {/* Section Silhouette : assombrie tant que le Pokémon n'est pas révélé */}
          <div className="relative mb-5 flex h-40 items-center justify-center overflow-hidden rounded-[1.5rem] bg-slate-50 p-4 shadow-inner dark:bg-slate-950 sm:mb-6 sm:h-48 sm:rounded-[2rem] sm:p-6 md:h-64">
             <Motion.img 
               key={gameState.target.id} 
               initial={{ scale: 0.5, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
               src={gameState.target.image} 
               alt={gameState.status === 'playing' ? '' : gameState.target.nom}
               aria-hidden={gameState.status === 'playing'}
               className={`w-full h-full object-contain filter transition-all duration-1000 ${gameState.status === 'playing' ? 'brightness-0 contrast-200 blur-sm' : 'brightness-110 scale-105'}`} 
             />
          </div>

          {/* Grille de 4 choix possibles */}
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
             {gameState.choices.map(p => (
                <button
                  type="button"
                  aria-label={`Choisir ${p.nom}`}
                  key={p.id}
                  disabled={gameState.status !== 'playing'}
                  onClick={() => onGuess(p.id)}
                  className={`rounded-[1.5rem] px-4 py-3 font-black text-base transition-all shadow-lg sm:rounded-3xl sm:py-4 sm:text-lg md:text-xl ${
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

          {revealMessage && <p role="status" aria-live="polite" className="mt-6 text-xs font-black uppercase tracking-widest text-slate-400 sm:mt-8 sm:text-sm">{revealMessage}</p>}

          {gameState.status === 'revealed' && (
             <Motion.button 
               type="button"
               initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
               onClick={onNext} 
               className="mt-6 rounded-[1.5rem] bg-slate-900 px-8 py-3 text-lg font-black text-white shadow-2xl transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-slate-900 sm:rounded-3xl sm:px-10 sm:py-4 sm:text-xl"
             >
                SUIVANT <ChevronRight className="inline ml-2" />
             </Motion.button>
          )}
       </div>
    </Motion.div>
  );
};

export default PokemonGame;
