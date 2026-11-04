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
    <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto flex h-full min-h-[26rem] w-full max-w-3xl flex-col gap-2 sm:gap-3">
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-black sm:text-2xl">Qui est ce Pokémon ?</h3>
          <div className="flex flex-wrap gap-x-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Score: {gameState.score}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-500">Record: {gameState.highscore}</p>
          </div>
        </div>
        {/* Minuteur : passe en Amber Red sous 4 secondes */}
        <div className="shrink-0 text-right">
          <div className={`text-2xl font-black leading-none sm:text-4xl ${gameState.timeLeft < 4 ? 'text-brand-500' : 'text-slate-900 dark:text-white'}`}>{gameState.timeLeft}s</div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Vite !</p>
        </div>
      </div>

      <div className={`flex min-h-0 flex-1 flex-col gap-2 rounded-[1.5rem] border-2 p-3 text-center shadow-xl sm:gap-3 sm:rounded-[2rem] sm:border-4 sm:p-5 ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
        {/* Silhouette : assombrie tant que le Pokémon n'est pas révélé */}
        <div className="relative min-h-[6rem] flex-1 overflow-hidden rounded-[1.25rem] bg-slate-50 p-3 shadow-inner dark:bg-slate-950 sm:rounded-[1.5rem] sm:p-5">
          <Motion.img
            key={gameState.target.id}
            initial={{ scale: 0.5, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
            src={gameState.target.image}
            alt={gameState.status === 'playing' ? '' : gameState.target.nom}
            aria-hidden={gameState.status === 'playing'}
            className={`h-full w-full object-contain filter transition-all duration-1000 ${
              gameState.status === 'playing'
                ? `brightness-0 ${isDarkMode ? 'invert opacity-40' : ''} contrast-200 blur-sm`
                : 'brightness-110 scale-105'
            }`}
          />
        </div>

        {/* 4 choix */}
        <div className="grid w-full shrink-0 grid-cols-2 gap-2 sm:gap-3">
          {gameState.choices.map(p => (
            <button
              type="button"
              aria-label={`Choisir ${p.nom}`}
              key={p.id}
              disabled={gameState.status !== 'playing'}
              onClick={() => onGuess(p.id)}
              className={`truncate rounded-2xl px-2 py-3 text-sm font-black shadow-md transition-all sm:py-4 sm:text-lg ${
                gameState.status === 'revealed'
                  ? p.id === gameState.target.id
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                    : p.id === gameState.selectedId
                      ? 'bg-brand-500 text-white opacity-50'
                      : 'bg-slate-100 text-slate-400 opacity-30 dark:bg-slate-800'
                  : 'bg-slate-100 hover:bg-brand-500 hover:text-white active:scale-95 dark:bg-slate-800'
              }`}
            >
              {p.nom}
            </button>
          ))}
        </div>

        {/* Zone de résultat : hauteur réservée pour que la page ne « saute » pas */}
        <div className="flex h-11 shrink-0 items-center justify-center gap-3 sm:h-12">
          {revealMessage && <p role="status" aria-live="polite" className="min-w-0 flex-1 text-left text-[10px] font-black uppercase leading-tight tracking-widest text-slate-400 sm:text-xs">{revealMessage}</p>}
          {gameState.status === 'revealed' && (
            <button
              type="button"
              onClick={onNext}
              className="flex h-full shrink-0 items-center rounded-2xl bg-slate-900 px-5 text-sm font-black text-white shadow-lg transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-slate-900 sm:px-8 sm:text-base"
            >
              SUIVANT <ChevronRight className="ml-1" size={18} />
            </button>
          )}
        </div>
      </div>
    </Motion.div>
  );
};

export default PokemonGame;
