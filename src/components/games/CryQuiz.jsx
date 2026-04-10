import React, { useState, useRef, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Volume2, Play, Check, X, RefreshCw, Trophy } from 'lucide-react';

export default function CryQuiz({ state, onAnswer, onNext, isDarkMode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const cryUrl = state.target
    ? `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${state.target.id}.ogg`
    : null;

  const playCry = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (state.status === 'playing') {
      // Auto-play on start? Maybe better to let user click play
    }
  }, [state.status]);

  return (
    <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-12">
      <audio ref={audioRef} src={cryUrl} onEnded={() => setIsPlaying(false)} />
      
      <div className="flex flex-col items-center justify-center space-y-10 py-8">
        <div className="text-center space-y-3">
          <h2 className="text-5xl font-black uppercase tracking-tight italic drop-shadow-sm">Qui est ce cri ?</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] opacity-70">Écoute bien et identifie le Pokémon correspondant</p>
        </div>

        <div className="relative mt-8">
          <Motion.div
            animate={isPlaying ? { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute -inset-8 bg-rose-500/20 rounded-full blur-3xl"
          />
          <button
            onClick={playCry}
            disabled={!cryUrl || state.status !== 'playing'}
            className="relative z-10 w-32 h-32 bg-rose-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            {isPlaying ? <Volume2 size={48} className="animate-pulse" /> : <Play size={48} className="ml-2" />}
          </button>
        </div>

        <div className="flex items-center gap-10 pt-6">
           <div className="text-center px-4">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-2">Score actuel</div>
              <div className="text-4xl font-black tabular-nums">{state.score}</div>
           </div>
           <div className="w-px h-12 bg-slate-100 dark:bg-slate-800" />
           <div className="text-center px-4">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-2">Milleur record</div>
              <div className="text-4xl font-black text-rose-500 tabular-nums">{state.highscore}</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
        {state.choices.map((p) => {
          const isSelected = state.selectedId === p.id;
          const isCorrect = state.target.id === p.id;
          const reveal = state.status === 'revealed';

          return (
            <button
              key={p.id}
              disabled={reveal}
              onClick={() => onAnswer(p.id)}
              className={`group relative aspect-square bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl transition-all border border-slate-100 dark:border-slate-800 overflow-hidden ${
                reveal 
                  ? (isCorrect ? 'border-emerald-500 ring-8 ring-emerald-500/10 scale-105 shadow-emerald-500/20' : (isSelected ? 'border-rose-500 grayscale' : 'border-transparent opacity-30 scale-95'))
                  : 'border-transparent hover:border-rose-400 hover:-translate-y-3 hover:shadow-rose-500/10'
              }`}
            >
              <div className="relative z-10 h-full flex flex-col items-center justify-center">
                <img
                  src={p.image}
                  alt=""
                  className={`w-full h-full object-contain drop-shadow-2xl transition-all duration-1000 ${
                    reveal ? 'brightness-100' : 'brightness-0 opacity-40 group-hover:opacity-100'
                  }`}
                />
                
                {reveal && (
                  <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-x-0 -bottom-2 text-center">
                     <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                        {p.nom}
                     </span>
                  </Motion.div>
                )}
              </div>
              
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity ${isCorrect ? 'from-emerald-500' : 'from-rose-500'}`} />
            </button>
          );
        })}
      </div>

      {state.status === 'revealed' && (
        <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
          <button
            onClick={onNext}
            className="flex items-center gap-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            {state.selectedId === state.target.id ? 'Manche suivante' : 'Réessayer'}
            <RefreshCw size={20} />
          </button>
        </Motion.div>
      )}
    </Motion.div>
  );
}
