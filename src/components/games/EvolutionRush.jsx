import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ChevronRight, RotateCcw, Shuffle, Sparkles } from 'lucide-react';

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

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-6xl space-y-6 px-2 pb-12 sm:px-0 md:space-y-8"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tighter sm:text-4xl">Evolution Rush</h3>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
            Reconstituez la lignee dans le bon ordre
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
            <div className="mt-1 text-2xl font-black text-emerald-500">{currentBestStreak}</div>
          </div>
          <button
            type="button"
            aria-label="Relancer Evolution Rush"
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
        <div className="mb-8 space-y-4">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Niveau</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {difficultyOptions.map((difficulty) => {
                const isActive = difficulty.id === state.difficulty;

                return (
                  <button
                    type="button"
                    key={difficulty.id}
                    aria-pressed={isActive}
                    aria-label={`Passer en ${difficulty.label}`}
                    onClick={() => onChangeDifficulty(difficulty.id)}
                    className={`rounded-full px-5 py-3 text-sm font-black uppercase tracking-widest transition-all ${
                      isActive
                        ? 'bg-rose-500 text-white shadow-2xl'
                        : isDarkMode
                          ? 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {difficulty.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              Mode actuel : {currentDifficulty.label} - {currentDifficulty.helper}
            </p>
          </div>
        </div>

        {state.status === 'loading' && (
          <div className="space-y-6 py-10 text-center sm:py-16">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-500 text-white shadow-2xl">
              <Sparkles size={34} className="animate-pulse" />
            </div>
            <div>
              <h4 className="text-2xl font-black uppercase tracking-tighter">Analyse de la lignee</h4>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.25em] text-slate-400">
                Recuperation d une chaine d evolution...
              </p>
            </div>
          </div>
        )}

        {state.status === 'error' && (
          <div className="space-y-5 py-10 text-center sm:py-16">
            <h4 className="text-2xl font-black uppercase tracking-tighter text-rose-500">Impossible de lancer la manche</h4>
            <p role="status" className="text-sm font-black uppercase tracking-widest text-slate-400">
              {state.feedback}
            </p>
            <button
              type="button"
              onClick={onRestart}
              className="rounded-[1.5rem] bg-rose-500 px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              Reessayer
            </button>
          </div>
        )}

        {(state.status === 'playing' || state.status === 'revealed') && (
          <div className="space-y-8">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Mission</p>
              <h4 className="mt-3 text-2xl font-black uppercase tracking-tighter sm:text-3xl">
                Remettez {state.chain.length} Pokemon dans le bon ordre
              </h4>
              <p className="mt-2 text-xs font-black uppercase tracking-widest text-slate-400">
                Cliquez sur les cartes ci-dessous pour composer la lignee
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {state.chain.map((_, index) => {
                const pokemon = selectedPokemons[index];

                return (
                  <button
                    type="button"
                    key={`slot-${index + 1}`}
                    aria-label={pokemon ? `Retirer ${pokemon.nom} de la position ${index + 1}` : `Emplacement ${index + 1}`}
                    disabled={!pokemon || state.status !== 'playing'}
                    onClick={() => pokemon && onRemove(pokemon.id)}
                    className={`min-h-32 rounded-[1.5rem] border-2 border-dashed p-4 text-center shadow-inner transition-all sm:min-h-36 ${
                      pokemon
                        ? 'border-rose-500 bg-rose-500/10'
                        : isDarkMode
                          ? 'border-slate-700 bg-slate-950/70'
                          : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                      Etape {index + 1}
                    </div>
                    {pokemon ? (
                      <div className="flex flex-col items-center justify-center">
                        <img src={pokemon.image} alt={pokemon.nom} className="h-16 w-16 object-contain drop-shadow-xl sm:h-20 sm:w-20" />
                        <span className="mt-3 text-sm font-black uppercase tracking-widest">{pokemon.nom}</span>
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-black uppercase tracking-widest text-slate-400">
                        Ajoutez un Pokemon
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Cartes melangees</p>
                {state.status === 'playing' && (
                  <button
                    type="button"
                    onClick={onClear}
                    disabled={state.selectedOrder.length === 0}
                    className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800"
                  >
                    <RotateCcw size={14} />
                    Effacer
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {remainingChoices.map((pokemon) => (
                  <button
                    type="button"
                    key={pokemon.id}
                    aria-label={`Ajouter ${pokemon.nom}`}
                    disabled={state.status !== 'playing'}
                    onClick={() => onSelect(pokemon.id)}
                    className={`rounded-[1.5rem] border-2 p-4 text-left shadow-lg transition-all ${
                      isDarkMode
                        ? 'border-slate-800 bg-slate-950 hover:-translate-y-1 hover:border-rose-500'
                        : 'border-slate-100 bg-slate-50 hover:-translate-y-1 hover:border-rose-500'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img src={pokemon.image} alt={pokemon.nom} className="h-14 w-14 object-contain drop-shadow-xl" />
                      <div>
                        <div className="text-sm font-black uppercase tracking-widest">{pokemon.nom}</div>
                        <div className="mt-1 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                          Cliquez pour placer
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {state.status === 'playing' && (
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={onValidate}
                  disabled={state.selectedOrder.length !== state.chain.length}
                  className="rounded-[1.5rem] bg-rose-500 px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Valider l ordre
                </button>
              </div>
            )}

            {state.status === 'revealed' && (
              <div className="space-y-5 text-center">
                <p role="status" aria-live="polite" className="text-sm font-black uppercase tracking-widest text-slate-400 sm:text-base">
                  {state.feedback}
                </p>
                <div className="rounded-[1.5rem] bg-slate-950 px-5 py-4 text-white shadow-2xl dark:bg-slate-800">
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Bonne reponse</div>
                  <div className="mt-2 text-sm font-black uppercase tracking-widest sm:text-base">{expectedOrder}</div>
                </div>
                <Motion.button
                  type="button"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  onClick={onNext}
                  className="rounded-[1.5rem] bg-emerald-500 px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
                >
                  Suivant <ChevronRight className="ml-2 inline" />
                </Motion.button>
              </div>
            )}
          </div>
        )}
      </div>
    </Motion.div>
  );
};

export default EvolutionRush;
