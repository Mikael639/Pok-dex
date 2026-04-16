// src/components/games/PokeMemory.jsx
import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Shuffle, Trophy } from 'lucide-react';

function MemoryPokeBall({ active }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.58),_transparent_32%),linear-gradient(180deg,_#ffffff_0%,_#eef2ff_52%,_#dbe4f0_100%)] sm:rounded-2xl md:rounded-3xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(248,113,113,0.14),_transparent_60%)]" />
      <div className="absolute inset-x-4 top-3 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      <Motion.div
        animate={{
          scale: active ? [1, 1.12, 1] : [1, 1.03, 1],
          opacity: active ? [0.24, 0.52, 0.22] : [0.18, 0.28, 0.18],
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute h-24 w-24 rounded-full bg-rose-500/24 blur-3xl sm:h-28 sm:w-28 md:h-32 md:w-32"
      />
      <Motion.div
        animate={active ? { rotate: [0, -16, 12, 0], y: [0, -5, 0] } : { rotate: [0, -4, 0], y: [0, -2, 0] }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="relative flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20 md:h-24 md:w-24"
      >
        <Motion.div
          animate={active ? { rotateX: -62, y: -13 } : { rotateX: 0, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ transformOrigin: 'center bottom' }}
          className="absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-full border-[5px] border-slate-950 bg-gradient-to-b from-rose-300 via-rose-500 to-rose-700 shadow-[0_12px_30px_rgba(244,63,94,0.28)] sm:border-[6px] md:border-[7px]"
        >
          <div className="absolute left-[14%] top-[14%] h-[26%] w-[42%] rotate-[-18deg] rounded-full bg-white/45 blur-[1px]" />
        </Motion.div>
        <Motion.div
          animate={active ? { opacity: [0.14, 0.72, 0.12], scale: [0.75, 1.32, 0.88] } : { opacity: [0.04, 0.12, 0.04], scale: [0.7, 0.9, 0.7] }}
          transition={{ duration: 0.8, ease: 'easeOut', repeat: Infinity }}
          className="absolute h-20 w-20 rounded-full bg-white/85 blur-xl sm:h-24 sm:w-24 md:h-28 md:w-28"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-full border-[5px] border-slate-950 bg-gradient-to-b from-white to-slate-100 shadow-[0_14px_30px_rgba(148,163,184,0.25)] sm:border-[6px] md:border-[7px]" />
        <div className="absolute inset-x-0 top-1/2 z-10 h-[5px] -translate-y-1/2 bg-slate-950 sm:h-[6px]" />
        <div className="absolute left-1/2 top-1/2 z-20 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[4px] border-slate-950 bg-white shadow-[0_0_18px_rgba(255,255,255,0.45)] sm:h-6 sm:w-6 md:h-7 md:w-7">
          <div className={`h-1.5 w-1.5 rounded-full shadow-inner sm:h-2 sm:w-2 ${active ? 'bg-rose-400' : 'bg-slate-300'}`} />
        </div>
      </Motion.div>
      <span className="absolute bottom-2 text-[8px] font-black uppercase tracking-[0.34em] text-slate-400 sm:bottom-3 sm:text-[9px]">
        {active ? 'Reveal' : 'Premier Ball'}
      </span>
    </div>
  );
}

/**
 * Jeu de Memory utilisant les sprites des Pokemon.
 * Gere les animations de retournement (flip) et la detection des paires.
 */
const PokeMemory = ({ state, onCardClick, onRestart }) => {
  const isWon = state.endTime !== null && state.cards.length > 0;

  return (
    <div className="mx-auto mt-2 max-w-4xl space-y-4 px-2 pb-6 sm:px-4 md:mt-4 md:space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white sm:text-3xl md:text-4xl">Poke-Memory</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tentez de trouver les 6 paires</p>
        </div>
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <div className="rounded-2xl border-4 border-slate-100 bg-white px-4 py-2 text-center shadow-md dark:border-slate-800 dark:bg-slate-900 md:px-6 md:py-4">
            <div className="mb-1 text-[8px] font-black uppercase text-slate-400 opacity-50">Essais</div>
            <div className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">{state.moves}</div>
          </div>
          <button type="button" aria-label="Relancer le Poke-Memory" onClick={onRestart} className="flex items-center justify-center rounded-2xl bg-rose-500 p-3 text-white shadow-md transition-all hover:rotate-6 md:p-4">
            <Shuffle size={20} />
          </button>
        </div>
      </div>

      {isWon && (
        <Motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-3 rounded-[2rem] border-4 border-emerald-500/20 bg-emerald-500/10 p-5 text-center sm:p-6">
          <Trophy size={48} className="mx-auto text-emerald-500" />
          <h3 className="text-2xl font-black uppercase text-emerald-500 sm:text-3xl">Incroyable !</h3>
          <p className="font-bold text-slate-500">Victoire en {state.moves} coups.</p>
          <button type="button" onClick={onRestart} className="rounded-2xl bg-emerald-500 px-10 py-4 font-black uppercase text-white shadow-xl transition-all hover:scale-105">
            Rejouer
          </button>
        </Motion.div>
      )}

      <div role="grid" aria-label="Grille du Poke-Memory" className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:grid-cols-4">
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
            <button
              type="button"
              role="gridcell"
              aria-label={cardLabel}
              aria-pressed={active}
              disabled={isWon || solved || flipped}
              key={card.uniqueId}
              className="relative aspect-square cursor-pointer"
              onClick={() => !isWon && onCardClick(index)}
            >
              <Motion.div
                animate={{ rotateY: active ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                className="relative h-full w-full"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 rounded-xl border-4 border-slate-300 p-1 shadow dark:border-slate-700 sm:rounded-2xl md:rounded-3xl" style={{ backfaceVisibility: 'hidden' }}>
                  <MemoryPokeBall active={flipped} />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border-4 border-rose-500 bg-white p-2 shadow dark:bg-slate-800 sm:rounded-2xl md:rounded-3xl" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                  <img src={card.image} alt={card.nom} className="mb-1 h-full w-full object-contain drop-shadow-2xl" />
                  <span className="mt-1 w-full truncate text-center text-[8px] font-black uppercase text-rose-500 sm:mt-2 sm:text-[10px]">
                    {card.nom}
                  </span>
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
