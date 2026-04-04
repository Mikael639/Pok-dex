// src/components/games/TypeMasterQuiz.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';
import { TYPE_COLORS } from '../../constants/pokemon';

/**
 * Quiz sur les forces et faiblesses des types (Type Matchups).
 * Pose une question aléatoire sur une relation offensive entre deux types.
 */
const TypeMasterQuiz = ({ state, onAnswer, onNext, isDarkMode }) => {
  const options = [0, 0.5, 1, 2];
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
       <div className="flex justify-between items-end mb-8">
          <div>
             <h3 className="text-3xl font-black mb-1">Affinités Élémentaires</h3>
             <div className="flex gap-4">
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Score: {state.score}</p>
                <p className="text-amber-500 font-bold uppercase text-[10px] tracking-widest">Record: {state.highscore}</p>
             </div>
          </div>
          <div className="flex gap-1">
             {/* Cœurs de vie pour le mode survie */}
             {Array.from({ length: 3 }).map((_, i) => (
                <Heart key={i} size={24} fill={i < state.lives ? '#f43f5e' : 'none'} className={i < state.lives ? 'text-rose-500' : 'text-slate-300'} />
             ))}
          </div>
       </div>

       <div className={`p-12 rounded-[4rem] text-center shadow-2xl border-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center justify-center gap-8 mb-12">
             {/* Type Attaquant */}
             <div className="px-10 py-6 rounded-[2rem] shadow-2xl transition-transform hover:scale-110" style={{ backgroundColor: TYPE_COLORS[state.typeA] }}>
                <span className="text-white font-black text-2xl uppercase tracking-tighter">{state.typeA}</span>
             </div>
             <span className="text-4xl font-black italic text-rose-500">SUR</span>
             {/* Type Défenseur */}
             <div className="px-10 py-6 rounded-[2rem] shadow-2xl transition-transform hover:scale-110" style={{ backgroundColor: TYPE_COLORS[state.typeB] }}>
                <span className="text-white font-black text-2xl uppercase tracking-tighter">{state.typeB}</span>
             </div>
          </div>

          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-8">Quel est le multiplicateur de dégâts ?</p>
          
          <div className="grid grid-cols-4 gap-4">
             {options.map(m => (
                <button
                  key={m}
                  disabled={state.status !== 'playing'}
                  onClick={() => onAnswer(m)}
                  className={`py-8 rounded-[2rem] font-black text-2xl md:text-3xl transition-all shadow-xl ${
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
             <div className="mt-12 space-y-6">
                <div className={`text-2xl font-black uppercase tracking-tighter ${state.feedback === 'Correct !' ? 'text-emerald-500' : 'text-rose-500'}`}>{state.feedback}</div>
                <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={onNext} className="px-12 py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[2rem] font-black text-xl hover:scale-105 shadow-2xl">
                   SUIVANT <ChevronRight className="inline ml-2" />
                </motion.button>
             </div>
          )}
       </div>
    </motion.div>
  );
};

export default TypeMasterQuiz;
