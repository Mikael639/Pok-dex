import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ChevronRight, Shuffle } from 'lucide-react';

const StatClash = ({ state, onPick, onNext, onRestart, isDarkMode }) => {
  if (!state.left || !state.right) return null;

  const winner =
    state.correctId == null
      ? null
      : state.correctId === state.left.id
        ? state.left
        : state.right;

  const winnerValue =
    state.correctId == null
      ? null
      : state.correctId === state.left.id
        ? state.leftValue
        : state.rightValue;

  const revealMessage =
    state.status === 'revealed'
      ? state.correctId == null
        ? `Egalite parfaite sur ${state.statLabel.toLowerCase()}.`
        : state.selectedId === state.correctId
          ? `Bien vu ! ${winner.nom} mene avec ${winnerValue} en ${state.statLabel}.`
          : `Rate. ${winner.nom} prend l'avantage avec ${winnerValue} en ${state.statLabel}.`
      : null;

  const renderPokemonCard = (pokemon, value) => {
    const isCorrect = state.status === 'revealed' && pokemon.id === state.correctId;
    const isSelected = pokemon.id === state.selectedId;

    return (
      <button
        type="button"
        aria-label={`Choisir ${pokemon.nom}`}
        key={pokemon.id}
        disabled={state.status !== 'playing'}
        onClick={() => onPick(pokemon.id)}
        className={`group relative overflow-hidden rounded-[2rem] border-4 p-5 text-left shadow-2xl transition-all sm:p-6 md:rounded-[3rem] md:p-8 ${
          state.status === 'revealed'
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
              : isSelected
                ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                : isDarkMode
                  ? 'border-slate-800 bg-slate-900/60 text-slate-500 opacity-50'
                  : 'border-slate-100 bg-slate-50 text-slate-400 opacity-60'
            : isDarkMode
              ? 'border-slate-800 bg-slate-900 hover:-translate-y-1 hover:border-rose-500 hover:text-white'
              : 'border-slate-100 bg-white hover:-translate-y-1 hover:border-rose-500'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60" />
        <div className="relative flex flex-col items-center text-center">
          <img
            src={pokemon.image}
            alt={pokemon.nom}
            className="mb-5 h-28 w-28 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 sm:h-32 sm:w-32 md:h-40 md:w-40"
          />
          <h4 className="text-2xl font-black uppercase tracking-tighter sm:text-3xl">{pokemon.nom}</h4>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {pokemon.types.map((type) => (
              <span
                key={`${pokemon.id}-${type.nom}`}
                className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                  state.status === 'revealed' && (isCorrect || isSelected)
                    ? 'bg-white/15 text-current'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {type.nom}
              </span>
            ))}
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-slate-950 px-5 py-3 text-center text-white shadow-xl dark:bg-white dark:text-slate-900">
            <div className="text-[9px] font-black uppercase tracking-[0.25em] opacity-60">{state.statLabel}</div>
            <div className="mt-1 text-3xl font-black">{state.status === 'revealed' ? value : '?'}</div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-6xl space-y-6 px-2 pb-12 sm:px-0 md:space-y-8"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tighter sm:text-4xl">Stat Clash</h3>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
            Quelle equipe domine cette statistique ?
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-[1.5rem] bg-white px-5 py-3 text-center shadow-xl dark:bg-slate-900">
            <div className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Score</div>
            <div className="mt-1 text-2xl font-black">{state.score}</div>
          </div>
          <div className="rounded-[1.5rem] bg-white px-5 py-3 text-center shadow-xl dark:bg-slate-900">
            <div className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Serie</div>
            <div className="mt-1 text-2xl font-black text-rose-500">{state.streak}</div>
          </div>
          <div className="rounded-[1.5rem] bg-white px-5 py-3 text-center shadow-xl dark:bg-slate-900">
            <div className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Record</div>
            <div className="mt-1 text-2xl font-black text-emerald-500">{state.bestStreak}</div>
          </div>
          <button
            type="button"
            aria-label="Relancer Stat Clash"
            onClick={onRestart}
            className="flex items-center gap-2 rounded-[1.5rem] bg-slate-900 px-5 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 dark:bg-white dark:text-slate-900"
          >
            <Shuffle size={18} />
            Rejouer
          </button>
        </div>
      </div>

      <div
        className={`rounded-[2rem] border-4 p-5 shadow-2xl sm:rounded-[3rem] sm:p-6 md:p-10 ${
          isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'
        }`}
      >
        <div className="mb-6 text-center sm:mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Manche en cours</p>
          <div className="mt-3 inline-flex rounded-full bg-rose-500 px-5 py-2 text-sm font-black uppercase tracking-[0.25em] text-white shadow-xl sm:px-6 sm:text-base">
            Meilleure {state.statLabel}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {renderPokemonCard(state.left, state.leftValue)}
          {renderPokemonCard(state.right, state.rightValue)}
        </div>

        {revealMessage && (
          <div className="mt-6 text-center sm:mt-8">
            <p role="status" aria-live="polite" className="text-sm font-black uppercase tracking-widest text-slate-400 sm:text-base">
              {revealMessage}
            </p>
            <Motion.button
              type="button"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={onNext}
              className="mt-5 rounded-[1.5rem] bg-rose-500 px-8 py-4 text-lg font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:scale-105 active:scale-95 sm:mt-6"
            >
              Suivant <ChevronRight className="ml-2 inline" />
            </Motion.button>
          </div>
        )}
      </div>
    </Motion.div>
  );
};

export default StatClash;
