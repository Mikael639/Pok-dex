// src/components/games/TypeMasterQuiz.jsx
import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';
import { TYPE_COLORS } from '../../constants/pokemon';

/**
 * Quiz sur les forces et faiblesses des types (Type Matchups).
 * Pose une question aléatoire sur une relation offensive entre deux types.
 */
const TypeMasterQuiz = ({ state, onAnswer, onNext, isDarkMode }) => {
  const options = [0, 0.5, 1, 2];
  
  return (
    <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-2xl px-2 sm:px-0">
       <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
             <h3 className="mb-1 text-2xl font-black sm:text-3xl">Affinités Élémentaires</h3>
             <div className="flex flex-wrap gap-3 sm:gap-4">
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Score: {state.score}</p>
                <p className="text-amber-500 font-bold uppercase text-[10px] tracking-widest">Record: {state.highscore}</p>
             </div>
          </div>
          <div role="img" aria-label={`${state.lives} vies restantes sur 3`} className="flex gap-1">
             {/* Cœurs de vie pour le mode survie */}
             {Array.from({ length: 3 }).map((_, i) => (
                <Heart key={i} size={24} fill={i < state.lives ? '#f43f5e' : 'none'} className={i < state.lives ? 'text-rose-500' : 'text-slate-300'} />
             ))}
          </div>
       </div>

       <div className={`rounded-[2rem] border-4 p-4 text-center shadow-2xl sm:rounded-[3rem] sm:p-6 md:rounded-[4rem] md:p-12 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:mb-12 sm:flex-row sm:gap-8">
             {/* Type Attaquant */}
             <div className="rounded-[1.5rem] px-6 py-4 shadow-2xl transition-transform hover:scale-105 sm:rounded-[2rem] sm:px-10 sm:py-6" style={{ backgroundColor: TYPE_COLORS[state.typeA] }}>
                <span className="text-xl font-black uppercase tracking-tighter text-white sm:text-2xl">{state.typeA}</span>
             </div>
             <span className="text-3xl font-black italic text-rose-500 sm:text-4xl">SUR</span>
             {/* Type Défenseur */}
             <div className="rounded-[1.5rem] px-6 py-4 shadow-2xl transition-transform hover:scale-105 sm:rounded-[2rem] sm:px-10 sm:py-6" style={{ backgroundColor: TYPE_COLORS[state.typeB] }}>
                <span className="text-xl font-black uppercase tracking-tighter text-white sm:text-2xl">{state.typeB}</span>
             </div>
          </div>

          <p className="mb-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:mb-8">Quel est le multiplicateur de dégâts ?</p>
          
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
             {options.map(m => (
                <button
                  type="button"
                  aria-label={`Repondre x${m}`}
                  key={m}
                  disabled={state.status !== 'playing'}
                  onClick={() => onAnswer(m)}
                  className={`rounded-[1.5rem] py-5 font-black text-xl transition-all shadow-xl sm:rounded-[2rem] sm:py-8 sm:text-2xl md:text-3xl ${
                    state.status === 'revealed'
                      ? state.feedback?.includes(m.toString()) || (m === 1 && state.feedback?.includes('x1'))
                        ? 'bg-emerald-500 text-white scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-20'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white hover:scale-[1.03] active:scale-95'
                  }`}
                >
                   x{m}
                </button>
             ))}
          </div>

          {state.status === 'revealed' && (
             <div className="mt-8 space-y-4 sm:mt-12 sm:space-y-6">
                <div role="status" aria-live="polite" className={`text-xl font-black uppercase tracking-tighter sm:text-2xl ${state.feedback === 'Correct !' ? 'text-emerald-500' : 'text-rose-500'}`}>{state.feedback}</div>
                <Motion.button type="button" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={onNext} className="rounded-[1.5rem] bg-slate-900 px-8 py-4 text-lg font-black text-white shadow-2xl hover:scale-105 dark:bg-white dark:text-slate-900 sm:rounded-[2rem] sm:px-12 sm:py-5 sm:text-xl">
                   SUIVANT <ChevronRight className="inline ml-2" />
                </Motion.button>
             </div>
          )}
       </div>
    </Motion.div>
  );
};

export default TypeMasterQuiz;
