import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ChevronRight, RotateCcw, Sparkles } from 'lucide-react';

const StatPill = ({ label, value, tone = '' }) => (
  <div className="rounded-2xl bg-white px-3 py-1 text-center shadow-md dark:bg-slate-900 sm:px-5 sm:py-2">
    <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</div>
    <div className={`text-lg font-black leading-tight sm:text-2xl ${tone}`}>{value}</div>
  </div>
);

const EvolutionRush = ({
  state,
  difficultyOptions,
  currentBestStreak,
  onChangeDifficulty,
  onSelect,
  onRemove,
  onClear,
  onValidate,
  onNext,
  onRestart,
  isDarkMode
}) => {
  const selectedPokemons = state.selectedOrder
    .map((id) => state.chain.find((pokemon) => pokemon.id === id))
    .filter(Boolean);

  const remainingChoices = state.choices.filter((pokemon) => !state.selectedOrder.includes(pokemon.id));
  const expectedOrder = state.chain.map((pokemon) => pokemon.nom).join(' > ');
  const currentDifficulty = difficultyOptions.find((difficulty) => difficulty.id === state.difficulty) ?? difficultyOptions[0];
  const columns = { gridTemplateColumns: `repeat(${Math.max(1, state.chain.length)}, minmax(0, 1fr))` };
  const isPlayable = state.status === 'playing' || state.status === 'revealed';

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto flex h-full min-h-[28rem] w-full max-w-5xl flex-col gap-2 sm:gap-3"
    >
      {/* Scores, niveau et relance */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <StatPill label="Score" value={state.score} />
          <StatPill label="Serie" value={state.streak} tone="text-brand-500" />
          <StatPill label="Record" value={currentBestStreak} tone="text-emerald-500" />
        </div>
        <button
          type="button"
          aria-label="Relancer Evolution Rush"
          onClick={onRestart}
          className="flex h-11 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 dark:bg-white dark:text-slate-900"
        >
          <RotateCcw size={16} />
          <span className="hidden sm:inline">Rejouer</span>
        </button>
        <div className="flex w-full items-center justify-center gap-2 sm:w-auto" role="group" aria-label={`Niveau : ${currentDifficulty.label}, ${currentDifficulty.helper}`}>
          {difficultyOptions.map((difficulty) => {
            const isActive = difficulty.id === state.difficulty;

            return (
              <button
                type="button"
                key={difficulty.id}
                aria-pressed={isActive}
                aria-label={`Passer en ${difficulty.label}`}
                onClick={() => onChangeDifficulty(difficulty.id)}
                className={`flex-1 rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest transition-all sm:flex-none ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-lg'
                    : isDarkMode
                      ? 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-100'
                }`}
              >
                {difficulty.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`flex min-h-0 flex-1 flex-col gap-2 rounded-[1.5rem] border-2 p-3 shadow-xl sm:gap-3 sm:rounded-[2rem] sm:border-4 sm:p-5 ${
          isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'
        }`}
      >
        {state.status === 'loading' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-white shadow-2xl">
              <Sparkles size={30} className="animate-pulse" />
            </div>
            <div>
              <h4 className="text-xl font-black uppercase tracking-tighter">Analyse de la lignee</h4>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                Recuperation d une chaine d evolution...
              </p>
            </div>
          </div>
        )}

        {state.status === 'error' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <h4 className="text-xl font-black uppercase tracking-tighter text-brand-500">Impossible de lancer la manche</h4>
            <p role="status" className="text-xs font-black uppercase tracking-widest text-slate-400">
              {state.feedback}
            </p>
            <button
              type="button"
              onClick={onRestart}
              className="rounded-2xl bg-brand-500 px-8 py-3 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Reessayer
            </button>
          </div>
        )}

        {isPlayable && (
          <>
            <div className="shrink-0 text-center">
              <h4 className="text-sm font-black uppercase tracking-tight sm:text-xl">
                Remettez {state.chain.length} Pokemon dans le bon ordre
              </h4>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 sm:text-[10px]">
                Cliquez sur les cartes pour composer la lignee
              </p>
            </div>

            {/* Emplacements (étapes) */}
            <div className="grid min-h-0 flex-1 gap-2 sm:gap-3" style={columns}>
              {state.chain.map((_, index) => {
                const pokemon = selectedPokemons[index];

                return (
                  <button
                    type="button"
                    key={`slot-${index + 1}`}
                    aria-label={pokemon ? `Retirer ${pokemon.nom} de la position ${index + 1}` : `Emplacement ${index + 1}`}
                    disabled={!pokemon || state.status !== 'playing'}
                    onClick={() => pokemon && onRemove(pokemon.id)}
                    className={`flex min-h-0 min-w-0 flex-col items-center rounded-2xl border-2 border-dashed p-2 text-center shadow-inner transition-all sm:p-3 ${
                      pokemon
                        ? 'border-brand-500 bg-brand-500/10'
                        : isDarkMode
                          ? 'border-slate-700 bg-slate-950/70'
                          : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="shrink-0 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 sm:text-[10px]">
                      Etape {index + 1}
                    </div>
                    {pokemon ? (
                      <>
                        <img src={pokemon.image} alt={pokemon.nom} className="min-h-0 w-full flex-1 object-contain drop-shadow-xl" />
                        <span className="mt-1 w-full shrink-0 truncate text-[10px] font-black uppercase tracking-wider sm:text-sm">{pokemon.nom}</span>
                      </>
                    ) : (
                      <div className="flex flex-1 items-center justify-center text-[10px] font-black uppercase leading-tight tracking-widest text-slate-400">
                        Ajoutez un Pokemon
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Cartes mélangées */}
            <div className="flex shrink-0 items-center justify-between gap-3">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 sm:text-[10px]">Cartes melangees</p>
              {state.status === 'playing' && (
                <button
                  type="button"
                  onClick={onClear}
                  disabled={state.selectedOrder.length === 0}
                  className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all hover:text-brand-500 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800"
                >
                  <RotateCcw size={12} />
                  Effacer
                </button>
              )}
            </div>
            <div className="grid min-h-0 flex-1 gap-2 sm:gap-3" style={columns}>
              {remainingChoices.map((pokemon) => (
                <button
                  type="button"
                  key={pokemon.id}
                  aria-label={`Ajouter ${pokemon.nom}`}
                  disabled={state.status !== 'playing'}
                  onClick={() => onSelect(pokemon.id)}
                  className={`flex min-h-0 min-w-0 flex-col items-center rounded-2xl border-2 p-2 shadow-md transition-all sm:p-3 ${
                    isDarkMode
                      ? 'border-slate-800 bg-slate-950 hover:border-brand-500'
                      : 'border-slate-100 bg-slate-50 hover:border-brand-500'
                  }`}
                >
                  <img src={pokemon.image} alt={pokemon.nom} className="min-h-0 w-full flex-1 object-contain drop-shadow-xl" />
                  <span className="mt-1 w-full shrink-0 truncate text-[10px] font-black uppercase tracking-wider sm:text-sm">{pokemon.nom}</span>
                </button>
              ))}
            </div>

            {/* Actions / résultat */}
            {state.status === 'playing' && (
              <div className="flex shrink-0 justify-center">
                <button
                  type="button"
                  onClick={onValidate}
                  disabled={state.selectedOrder.length !== state.chain.length}
                  className="w-full rounded-2xl bg-brand-500 px-8 py-3 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >
                  Valider l ordre
                </button>
              </div>
            )}

            {state.status === 'revealed' && (
              <div className="flex shrink-0 flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
                <div className="min-w-0">
                  <p role="status" aria-live="polite" className="text-xs font-black uppercase tracking-widest text-slate-500 sm:text-sm">
                    {state.feedback}
                  </p>
                  <p className="truncate text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Bonne reponse : <span className="text-slate-700 dark:text-slate-200">{expectedOrder}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onNext}
                  className="flex w-full shrink-0 items-center justify-center rounded-2xl bg-emerald-500 px-8 py-3 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 sm:w-auto"
                >
                  Suivant <ChevronRight className="ml-1" size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Motion.div>
  );
};

export default EvolutionRush;
