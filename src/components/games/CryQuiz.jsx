import React, { useState, useRef } from 'react';
import { motion as Motion } from 'framer-motion';
import { Volume2, Play, RefreshCw } from 'lucide-react';

export default function CryQuiz({ state, onAnswer, onNext }) {
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

  return (
    <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto flex h-full min-h-[28rem] w-full max-w-4xl flex-col gap-2 sm:gap-4">
      <audio ref={audioRef} src={cryUrl} onEnded={() => setIsPlaying(false)} />

      <div className="shrink-0 text-center">
        <h2 className="text-xl font-black uppercase italic tracking-tight sm:text-4xl">Qui est ce cri ?</h2>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:text-[10px]">Ecoute bien et identifie le Pokemon correspondant</p>
      </div>

      {/* Lecteur + scores : occupe l'espace libre */}
      <div className="flex min-h-[8rem] flex-1 items-center justify-center gap-5 sm:gap-12">
        <div className="text-center">
          <div className="mb-1 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Score</div>
          <div className="text-3xl font-black tabular-nums sm:text-4xl">{state.score}</div>
        </div>
        <div className="relative">
          <Motion.div
            animate={isPlaying ? { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute -inset-5 rounded-full bg-brand-500/20 blur-2xl"
          />
          <button
            type="button"
            aria-label="Ecouter le cri"
            onClick={playCry}
            disabled={!cryUrl || state.status !== 'playing'}
            className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-brand-500 text-white shadow-2xl transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 sm:h-28 sm:w-28"
          >
            {isPlaying ? <Volume2 size={36} className="animate-pulse" /> : <Play size={36} className="ml-1" />}
          </button>
        </div>
        <div className="text-center">
          <div className="mb-1 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Record</div>
          <div className="text-3xl font-black tabular-nums text-brand-500 sm:text-4xl">{state.highscore}</div>
        </div>
      </div>

      {/* 4 choix : la taille des cartes suit l'espace disponible */}
      <div className="grid h-[34%] min-h-[7rem] shrink-0 grid-cols-4 gap-2 sm:gap-4">
        {state.choices.map((p) => {
          const isSelected = state.selectedId === p.id;
          const isCorrect = state.target.id === p.id;
          const reveal = state.status === 'revealed';

          return (
            <button
              type="button"
              key={p.id}
              aria-label={reveal ? p.nom : 'Choisir ce Pokemon'}
              disabled={reveal}
              onClick={() => onAnswer(p.id)}
              className={`group relative min-h-0 min-w-0 overflow-hidden rounded-2xl border-2 bg-white p-2 shadow-lg transition-all dark:bg-slate-900 sm:rounded-[2rem] sm:p-4 ${
                reveal
                  ? (isCorrect ? 'border-emerald-500 ring-4 ring-emerald-500/10' : (isSelected ? 'border-brand-500 grayscale' : 'border-transparent opacity-30'))
                  : 'border-slate-100 hover:border-brand-400 dark:border-slate-800'
              }`}
            >
              <img
                src={p.image}
                alt=""
                className={`h-full w-full object-contain drop-shadow-xl transition-all duration-700 ${
                  reveal ? 'brightness-100' : 'brightness-0 opacity-40 group-hover:opacity-100'
                }`}
              />
              {reveal && (
                <span className={`absolute inset-x-1 bottom-1 truncate rounded-md px-1 py-0.5 text-center text-[8px] font-black uppercase tracking-wider text-white shadow sm:text-[10px] ${isCorrect ? 'bg-emerald-500' : 'bg-brand-500'}`}>
                  {p.nom}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Zone d'action à hauteur réservée : la page ne « saute » pas à la révélation */}
      <div className="flex h-12 shrink-0 items-center justify-center">
        {state.status === 'revealed' && (
          <button
            type="button"
            onClick={onNext}
            className="flex h-full items-center gap-3 rounded-2xl bg-slate-900 px-8 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-slate-900"
          >
            {state.selectedId === state.target.id ? 'Manche suivante' : 'Réessayer'}
            <RefreshCw size={18} />
          </button>
        )}
      </div>
    </Motion.div>
  );
}
