// src/components/games/BattleArena.jsx
import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, Users, Shuffle, ChevronLeft, Trophy, Search, X } from 'lucide-react';
import useAccessibleModal from '../../hooks/useAccessibleModal';
import { INITIAL_BATTLE_STATE } from '../../constants/gameMeta';

const MENU_MODES = [
  { id: 'ia', title: 'J1 vs IA', desc: 'Le defi classique', icon: Shield },
  { id: 'pvp', title: 'Local PvP', desc: 'Defiez un ami', icon: Users },
  { id: 'auto', title: 'Spectateur', desc: 'Combat auto', icon: Shuffle }
];

/** Illustration fixe du Pokémon (artwork officiel). */
const FighterSprite = ({ pokemon }) => (
  <img
    key={pokemon?.id}
    src={pokemon?.image}
    alt={pokemon?.nom}
    className="relative z-10 mx-auto h-32 w-auto max-w-full object-contain drop-shadow-[0_14px_16px_rgba(11,21,35,0.30)] sm:h-40 md:h-52 lg:h-64"
  />
);

const hpTone = (hp) => (hp > 50 ? 'bg-emerald-500' : hp > 20 ? 'bg-amber-400' : 'bg-brand-500');

/** Carte d'état d'un combattant : nom, barre de vie, Pokémon restants. */
const FighterPanel = ({ pokemon, team, activeIndex, title, isTurn }) => {
  const hp = Math.round(pokemon?.currentHP || 0);
  const remaining = team.filter((member) => member.currentHP > 0).length;

  return (
    <div className={`w-full max-w-sm rounded-2xl border-2 bg-white/90 p-3 shadow-lg backdrop-blur md:p-4 dark:bg-slate-900/90 ${isTurn ? 'border-brand-500' : 'border-white dark:border-slate-800'}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="truncate text-sm font-black uppercase tracking-tight md:text-lg">{pokemon?.nom}</span>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest md:text-[10px] ${isTurn ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
          {isTurn ? 'A jouer' : title}
        </span>
      </div>
      <div role="progressbar" aria-label={`Vie de ${pokemon?.nom ?? title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={hp} className="h-3 overflow-hidden rounded-full bg-slate-200 md:h-4 dark:bg-slate-800">
        <div style={{ width: `${hp}%` }} className={`h-full rounded-full transition-[width] duration-500 ${hpTone(hp)}`} />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-500 md:text-xs">{hp} / 100 PV</span>
        <div className="flex gap-1" aria-label={`${remaining} Pokemon restants sur ${team.length}`}>
          {team.map((member, index) => (
            <span
              key={`${member.id}-${index}`}
              className={`h-2 w-2 rounded-full md:h-2.5 md:w-2.5 ${member.currentHP <= 0 ? 'bg-slate-300 dark:bg-slate-700' : index === activeIndex ? 'bg-brand-500' : 'bg-sky-400'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/** Un Pokémon posé sur sa plateforme, avec sa carte d'état. */
const FighterSlot = ({ pokemon, team, activeIndex, title, isTurn }) => (
  <div className="flex w-full flex-col items-center gap-3 md:gap-5">
    <FighterPanel pokemon={pokemon} team={team} activeIndex={activeIndex} title={title} isTurn={isTurn} />
    <div className="relative flex w-full items-end justify-center pb-3 md:pb-5">
      <div aria-hidden="true" className="absolute bottom-0 left-1/2 h-5 w-3/5 max-w-[16rem] -translate-x-1/2 rounded-[50%] bg-slate-900/20 blur-[2px] md:h-7 dark:bg-black/50" />
      <FighterSprite pokemon={pokemon} />
    </div>
  </div>
);

const BattleArena = ({ state, onStart, teamLength, pokemons, onManualMove, setBattleState }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const winnerModalRef = React.useRef(null);

  const filteredSelection = pokemons.filter((pokemon) => pokemon.nom.toLowerCase().includes(searchTerm.toLowerCase()));
  const pActive = state.playerTeam[state.playerActive];
  const eActive = state.enemyTeam[state.enemyActive];
  const isPlayerTurn = state.currentTurn === 'player';
  const isPvp = state.mode === 'pvp';
  const showPlayerControls = (state.mode === 'ia' && isPlayerTurn) || (isPvp && isPlayerTurn);
  const showEnemyControls = isPvp && !isPlayerTurn;

  const resetBattle = () => {
    setSearchTerm('');
    setBattleState(INITIAL_BATTLE_STATE);
  };

  useAccessibleModal(winnerModalRef, resetBattle);

  if (state.mode === 'menu') {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center space-y-6 px-2 py-8 text-center animate-fade-in sm:px-4 md:space-y-12 md:py-20">
        <div className="relative">
          <div className="absolute inset-0 scale-110 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="relative rounded-[2rem] bg-brand-500 p-6 shadow-2xl ring-4 ring-brand-500/20 md:rounded-[3rem] md:p-10 md:ring-8">
            <Activity size={48} className="text-white md:h-20 md:w-20" />
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-3xl font-black uppercase leading-none tracking-tighter text-slate-900 dark:text-white md:mb-6 md:text-6xl">Arene Master</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 opacity-70 md:text-xl">Choisissez votre defi</p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 px-2 md:grid-cols-3 md:gap-6">
          {MENU_MODES.map((mode) => (
            <button
              type="button"
              aria-label={`${mode.title} : ${mode.desc}`}
              key={mode.id}
              onClick={() => onStart(mode.id)}
              disabled={teamLength < 6}
              className={`group relative overflow-hidden rounded-[1.5rem] border-4 bg-white p-5 shadow-xl transition-all md:rounded-[2.5rem] md:p-8 dark:bg-slate-900 ${teamLength < 6 ? 'cursor-not-allowed grayscale opacity-30' : 'border-slate-100 hover:scale-[1.03] hover:border-brand-500 active:scale-95 dark:border-slate-800'}`}
            >
              <div className="relative z-10 flex flex-col items-center">
                <mode.icon size={32} className="mb-3 text-brand-500 transition-transform group-hover:scale-110 md:mb-4 md:h-10 md:w-10" />
                <h3 className="mb-1 text-xs font-black uppercase tracking-tighter sm:text-sm md:mb-2 md:text-xl">{mode.title}</h3>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 transition-colors group-hover:text-brand-500 md:text-[10px]">{mode.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {teamLength < 6 && (
          <div className="mx-auto max-w-sm rounded-xl border-2 border-brand-500/20 bg-brand-500/10 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-brand-500 md:rounded-2xl md:px-10 md:py-5 md:text-sm">
            Veuillez selectionner 6 Pokemon dans votre equipe ({teamLength}/6)
          </div>
        )}
      </div>
    );
  }

  if (state.mode === 'selection') {
    return (
      <div className="relative mx-auto max-w-6xl space-y-5 px-2 pb-16 animate-fade-in sm:px-4 md:space-y-8 md:pb-20">
        <button type="button" onClick={resetBattle} className="group absolute -top-8 left-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-brand-500 md:left-0">
          <ChevronLeft size={16} /> Retour
        </button>

        <div className="pt-8 text-center">
          <h2 className="mb-2 text-2xl font-black uppercase italic text-brand-500 md:text-4xl">Joueur 2</h2>
          <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500 md:text-sm">Composez votre equipe ({state.enemyTeam.length}/6)</p>
        </div>

        <div className="relative mx-auto max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            aria-label="Rechercher un Pokemon pour l equipe adverse"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border-2 border-slate-100 bg-white py-3 pl-12 pr-4 text-xs font-bold shadow-xl ring-brand-500/20 focus:ring-4 md:rounded-[2rem] md:border-4 md:px-6 md:py-4 md:pl-14 md:text-sm dark:border-slate-800 dark:bg-slate-900"
          />
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2 sm:mb-8 md:grid-cols-6 md:gap-4">
          {state.enemyTeam.map((pokemon, index) => (
            <div key={`${pokemon.id}-${index}`} className="relative flex flex-col items-center overflow-hidden rounded-xl bg-brand-500 p-2 shadow-xl group md:rounded-3xl md:p-4">
              <button type="button" aria-label={`Retirer ${pokemon.nom} de l equipe adverse`} onClick={() => setBattleState((previousState) => ({ ...previousState, enemyTeam: previousState.enemyTeam.filter((_, currentIndex) => currentIndex !== index) }))} className="absolute right-1 top-1 rounded-full bg-white/20 p-1 text-white">
                <X size={10} />
              </button>
              <img src={pokemon.image} alt={pokemon.nom} className="h-10 w-10 object-contain md:h-16 md:w-16" />
            </div>
          ))}

          {Array.from({ length: 6 - state.enemyTeam.length }).map((_, index) => (
            <div key={`slot-${index}`} className="aspect-square rounded-xl border-2 border-dashed border-slate-200 bg-slate-100 dark:bg-slate-800 md:rounded-3xl" />
          ))}
        </div>

        {state.enemyTeam.length === 6 && (
          <button
            type="button"
            onClick={() => {
              setBattleState((previousState) => ({
                ...previousState,
                mode: 'pvp',
                isFighting: true,
                logs: ['QUE LE DUEL COMMENCE !'],
                currentTurn: 'player'
              }));
              setSearchTerm('');
            }}
            className="w-full rounded-xl bg-slate-900 py-4 font-black text-white shadow-2xl transition-all hover:bg-brand-500 hover:text-white md:rounded-[2rem] md:py-6 dark:bg-white dark:text-slate-900"
          >
            VALIDE & COMBAT
          </button>
        )}

        <div className="grid max-h-[45vh] grid-cols-2 gap-2 overflow-y-auto rounded-[2rem] bg-slate-50 p-3 custom-scrollbar sm:grid-cols-3 sm:p-4 md:max-h-[300px] md:grid-cols-6 md:gap-4 dark:bg-slate-950/20">
          {filteredSelection.map((pokemon) => {
            const isAlreadySelected = state.enemyTeam.some((teamPokemon) => teamPokemon.id === pokemon.id);

            return (
              <button
                type="button"
                aria-label={`Ajouter ${pokemon.nom} a l equipe adverse`}
                key={pokemon.id}
                disabled={state.enemyTeam.length >= 6 || isAlreadySelected}
                onClick={() => {
                  if (state.enemyTeam.length >= 6 || isAlreadySelected) return;
                  setBattleState((previousState) => ({
                    ...previousState,
                    enemyTeam: [...previousState.enemyTeam, { ...pokemon, currentHP: 100 }]
                  }));
                }}
                className={`flex flex-col items-center rounded-xl border-2 p-2 shadow-md transition-all md:rounded-2xl md:p-4 ${isAlreadySelected ? 'border-brand-500 bg-brand-500 text-white' : 'border-transparent bg-white hover:border-brand-500 dark:bg-slate-900'} disabled:cursor-not-allowed disabled:opacity-80`}
              >
                <img src={pokemon.image} alt={pokemon.nom} className="h-10 w-10 object-contain md:h-12 md:w-12" />
                <span className="mt-1 w-full truncate text-[8px] font-black uppercase md:text-[10px]">{pokemon.nom}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const controlsOwner = showPlayerControls ? 'Joueur 1' : showEnemyControls ? 'Joueur 2' : null;
  const waitingMessage = state.mode === 'auto' ? 'Combat automatique en cours...' : "L'adversaire prepare son attaque...";

  return (
    <div className="relative space-y-5 px-2 pb-16 text-slate-900 sm:px-4 md:space-y-8 md:pb-20 dark:text-white">
      {!state.winner && (
        <button type="button" onClick={resetBattle} className="absolute -top-8 left-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-500 md:left-0">
          <ChevronLeft size={16} /> Abandonner
        </button>
      )}

      <AnimatePresence>
        {state.winner && (
          <Motion.div role="alertdialog" aria-modal="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xl">
            <div ref={winnerModalRef} tabIndex={-1} className="relative rounded-[2rem] border-4 border-brand-500 bg-white p-6 text-center shadow-2xl sm:p-8 md:rounded-[4rem] md:border-8 md:p-16 dark:bg-slate-900">
              <Trophy size={48} className="mx-auto mb-4 text-amber-500 md:h-24 md:w-24" />
              <h2 className="mb-2 text-2xl font-black uppercase tracking-tighter sm:text-3xl md:text-7xl">WINNER !</h2>
              <div aria-live="assertive" className="mb-6 text-base font-black uppercase italic text-brand-500 sm:text-lg md:mb-12 md:text-4xl">{state.winner}</div>
              <button type="button" data-autofocus onClick={resetBattle} className="rounded-[2rem] bg-brand-500 px-8 py-3 text-base font-black text-white shadow-2xl sm:px-10 sm:py-4 sm:text-lg md:px-16 md:py-6 md:text-2xl">
                RETOUR AU MENU
              </button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Scène : ciel Sky Blue, sol et plateformes — les Pokémon sont le point focal */}
      <section aria-label="Terrain de combat" className="relative overflow-hidden rounded-[2rem] border-4 border-white bg-gradient-to-b from-sky-300 via-sky-100 to-slate-50 shadow-xl md:rounded-[3rem] dark:border-slate-800 dark:from-sky-950 dark:via-slate-900 dark:to-slate-950">
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-slate-200/80 to-transparent dark:from-black/40" />
        <div className="relative grid grid-cols-1 items-end gap-6 p-4 sm:p-6 md:p-10 lg:grid-cols-2 lg:gap-16 lg:p-12">
          <FighterSlot pokemon={pActive} team={state.playerTeam} activeIndex={state.playerActive} title="Joueur 1" isTurn={isPlayerTurn} />
          <FighterSlot pokemon={eActive} team={state.enemyTeam} activeIndex={state.enemyActive} title={isPvp ? 'Joueur 2' : 'Adversaire'} isTurn={!isPlayerTurn} />
        </div>
      </section>

      {/* Actions */}
      {!state.winner && (
        <div className="mx-auto w-full max-w-xl rounded-2xl border-2 border-sky-200 bg-white p-4 text-center shadow-lg md:rounded-3xl md:p-5 dark:border-sky-900/60 dark:bg-slate-900">
          {controlsOwner ? (
            <>
              <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400 md:text-xs">Tour de {controlsOwner}</p>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <button type="button" onClick={() => onManualMove('normal')} className="rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-xs font-black uppercase transition-colors hover:border-brand-500 hover:text-brand-500 md:rounded-2xl md:py-4 md:text-sm dark:border-slate-700 dark:bg-slate-800">
                  Attaque
                </button>
                <button type="button" onClick={() => onManualMove('special')} className="rounded-xl bg-brand-500 px-4 py-3 text-xs font-black uppercase text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600 md:rounded-2xl md:py-4 md:text-sm">
                  Special
                </button>
              </div>
            </>
          ) : (
            <p role="status" className="py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 md:text-xs">{waitingMessage}</p>
          )}
        </div>
      )}

      {/* Journal : le plus récent en haut */}
      <div className="rounded-[2rem] border-2 border-slate-100 bg-white p-5 shadow-lg md:rounded-[3rem] md:p-8 dark:border-slate-800 dark:bg-slate-900">
        <h4 className="mb-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 md:text-sm">
          <Activity size={18} className="text-brand-500" /> Journal de Combat
        </h4>
        <div role="log" aria-live="polite" aria-relevant="additions text" className="max-h-[32vh] space-y-2 overflow-y-auto pr-1 custom-scrollbar md:max-h-none md:space-y-3">
          {state.logs.map((log, index) => (
            <div key={`${log}-${index}`} className={`rounded-xl border-l-4 p-3 md:p-4 ${index === 0 ? 'border-brand-500 bg-brand-500/10 text-sm font-bold text-brand-600 md:text-base dark:text-brand-400' : 'border-slate-200 bg-slate-50 text-xs text-slate-500 md:text-sm dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400'}`}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleArena;
