// src/components/games/BattleArena.jsx
import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, Users, Shuffle, ChevronLeft, Trophy, Search, X } from 'lucide-react';
import useAccessibleModal from '../../hooks/useAccessibleModal';

const MENU_MODES = [
  { id: 'ia', title: 'J1 vs IA', desc: 'Le defi classique', icon: Shield },
  { id: 'pvp', title: 'Local PvP', desc: 'Defiez un ami', icon: Users },
  { id: 'auto', title: 'Spectateur', desc: 'Combat auto', icon: Shuffle }
];

const emptyBattleState = {
  playerTeam: [],
  enemyTeam: [],
  logs: [],
  turn: 0,
  winner: null,
  isFighting: false,
  playerActive: 0,
  enemyActive: 0,
  attackAnim: null,
  mode: 'menu',
  currentTurn: 'player'
};

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
    setBattleState(emptyBattleState);
  };

  useAccessibleModal(winnerModalRef, resetBattle);

  if (state.mode === 'menu') {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center space-y-6 px-2 py-8 text-center animate-fade-in sm:px-4 md:space-y-12 md:py-20">
        <div className="relative">
          <div className="absolute inset-0 scale-110 rounded-full bg-rose-500/20 blur-3xl animate-pulse" />
          <div className="relative rounded-[2rem] bg-rose-500 p-6 shadow-2xl ring-4 ring-rose-500/20 md:rounded-[3rem] md:p-10 md:ring-8">
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
              className={`group relative overflow-hidden rounded-[1.5rem] border-4 bg-white p-5 shadow-xl transition-all md:rounded-[2.5rem] md:p-8 dark:bg-slate-900 ${teamLength < 6 ? 'cursor-not-allowed grayscale opacity-30' : 'border-slate-100 hover:scale-[1.03] hover:border-rose-500 active:scale-95 dark:border-slate-800'}`}
            >
              <div className="relative z-10 flex flex-col items-center">
                <mode.icon size={32} className="mb-3 text-rose-500 transition-transform group-hover:scale-110 md:mb-4 md:h-10 md:w-10" />
                <h3 className="mb-1 text-xs font-black uppercase tracking-tighter sm:text-sm md:mb-2 md:text-xl">{mode.title}</h3>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 transition-colors group-hover:text-rose-500 md:text-[10px]">{mode.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {teamLength < 6 && (
          <div className="mx-auto max-w-sm rounded-xl border-2 border-rose-500/20 bg-rose-500/10 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-rose-500 animate-pulse md:rounded-2xl md:px-10 md:py-5 md:text-sm">
            Veuillez selectionner 6 Pokemon dans votre equipe ({teamLength}/6)
          </div>
        )}
      </div>
    );
  }

  if (state.mode === 'selection') {
    return (
      <div className="relative mx-auto max-w-6xl space-y-5 px-2 pb-16 animate-fade-in sm:px-4 md:space-y-8 md:pb-20">
        <button type="button" onClick={resetBattle} className="group absolute -top-8 left-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-rose-500 md:left-0">
          <ChevronLeft size={16} /> Retour
        </button>

        <div className="pt-8 text-center">
          <h2 className="mb-2 text-2xl font-black uppercase italic text-rose-500 md:text-4xl">Joueur 2</h2>
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
            className="w-full rounded-xl border-2 border-slate-100 bg-white py-3 pl-12 pr-4 text-xs font-bold shadow-xl ring-rose-500/20 focus:ring-4 md:rounded-[2rem] md:border-4 md:px-6 md:py-4 md:pl-14 md:text-sm dark:border-slate-800 dark:bg-slate-900"
          />
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2 sm:mb-8 md:grid-cols-6 md:gap-4">
          {state.enemyTeam.map((pokemon, index) => (
            <div key={`${pokemon.id}-${index}`} className="relative flex flex-col items-center overflow-hidden rounded-xl bg-rose-500 p-2 shadow-xl group md:rounded-3xl md:p-4">
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
            className="w-full rounded-xl bg-slate-900 py-4 font-black text-white shadow-2xl transition-all hover:bg-rose-500 hover:text-white md:rounded-[2rem] md:py-6 dark:bg-white dark:text-slate-900"
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
                className={`flex flex-col items-center rounded-xl border-2 p-2 shadow-md transition-all md:rounded-2xl md:p-4 ${isAlreadySelected ? 'border-rose-500 bg-rose-500 text-white' : 'border-transparent bg-white hover:border-rose-500 dark:bg-slate-900'} disabled:cursor-not-allowed disabled:opacity-80`}
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

  return (
    <div className="relative space-y-6 px-2 pb-16 text-slate-900 animate-fade-in sm:px-4 md:space-y-12 md:pb-20 dark:text-white">
      {!state.winner && (
        <button type="button" onClick={resetBattle} className="absolute -top-8 left-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 md:left-0">
          <ChevronLeft size={16} /> Abandonner
        </button>
      )}

      <AnimatePresence>
        {state.winner && (
          <Motion.div role="alertdialog" aria-modal="true" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xl">
            <div ref={winnerModalRef} tabIndex={-1} className="relative rounded-[2rem] border-4 border-rose-500 bg-white p-6 text-center shadow-2xl sm:p-8 md:rounded-[4rem] md:border-8 md:p-16 dark:bg-slate-900">
              <Trophy size={48} className="mx-auto mb-4 animate-bounce text-amber-500 md:h-24 md:w-24" />
              <h2 className="mb-2 text-2xl font-black uppercase tracking-tighter sm:text-3xl md:text-7xl">WINNER !</h2>
              <div aria-live="assertive" className="mb-6 text-base font-black uppercase italic text-rose-500 sm:text-lg md:mb-12 md:text-4xl">{state.winner}</div>
              <button type="button" data-autofocus onClick={resetBattle} className="rounded-[2rem] bg-rose-500 px-8 py-3 text-base font-black text-white shadow-2xl sm:px-10 sm:py-4 sm:text-lg md:px-16 md:py-6 md:text-2xl">
                RETOUR AU MENU
              </button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex min-h-[360px] flex-col items-center gap-4 rounded-[2rem] border-4 border-white bg-slate-900/5 p-4 shadow-inner sm:p-6 md:gap-12 md:rounded-[4rem] md:border-8 md:p-16 lg:grid lg:min-h-[500px] lg:grid-cols-2 dark:bg-slate-900/40">
        <div className={`w-full space-y-3 text-center transition-all duration-500 md:space-y-6 ${isPlayerTurn ? 'scale-[1.02] md:scale-110' : 'opacity-40 grayscale blur-[1px]'}`}>
          <div className="relative">
            <div className={`absolute inset-0 scale-150 rounded-full blur-3xl transition-all ${isPlayerTurn ? 'bg-blue-500/30' : 'bg-transparent'}`} />
            <Motion.img key={pActive?.id} initial={{ x: -50 }} animate={{ x: 0 }} src={pActive?.image} alt={pActive?.nom} className="relative mx-auto h-24 w-24 object-contain drop-shadow-2xl sm:h-32 sm:w-32 md:h-64 md:w-64 lg:w-80" />
          </div>
          <div role="progressbar" aria-label={`Vie de ${pActive?.nom ?? 'Joueur 1'}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pActive?.currentHP || 0)} className="relative mx-auto h-4 w-full max-w-sm overflow-hidden rounded-full border-2 border-white bg-slate-200 shadow-lg md:h-6 md:border-4 dark:bg-slate-800">
            <Motion.div animate={{ width: pActive ? `${pActive.currentHP}%` : '0%' }} className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" />
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black md:text-[10px]">{Math.round(pActive?.currentHP || 0)}%</span>
          </div>
          <div className="text-base font-black uppercase tracking-tighter sm:text-lg md:text-2xl">{pActive?.nom}</div>

          {showPlayerControls && (
            <div className="mt-3 grid w-full max-w-sm grid-cols-2 gap-2 md:mt-4 md:gap-4">
              <button type="button" onClick={() => onManualMove('normal')} className="rounded-xl border-2 border-slate-100 bg-white px-4 py-3 text-[11px] font-black uppercase shadow-xl transition-all hover:border-rose-500 md:rounded-2xl md:border-4 md:px-6 md:py-4 md:text-xs dark:bg-slate-800">
                Attaque
              </button>
              <button type="button" onClick={() => onManualMove('special')} className="rounded-xl bg-rose-500 px-4 py-3 text-[11px] font-black uppercase text-white shadow-xl transition-all hover:scale-105 md:rounded-2xl md:px-6 md:py-4 md:text-xs">
                Special
              </button>
            </div>
          )}
        </div>

        <div className="rounded-full border-4 border-white bg-rose-500 px-4 py-1 text-sm font-black italic text-white shadow-xl lg:hidden">
          VS
        </div>

        <div className="absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border-8 border-white bg-rose-500 p-6 text-3xl font-black italic text-white shadow-2xl animate-bounce lg:block">
          VS
        </div>

        <div className={`w-full space-y-3 text-center transition-all duration-500 md:space-y-6 ${!isPlayerTurn ? 'scale-[1.02] md:scale-110' : 'opacity-40 grayscale blur-[1px]'}`}>
          <div className="relative">
            <div className={`absolute inset-0 scale-150 rounded-full blur-3xl transition-all ${!isPlayerTurn ? 'bg-rose-500/30' : 'bg-transparent'}`} />
            <Motion.img key={eActive?.id} initial={{ x: 50 }} animate={{ x: 0 }} src={eActive?.image} alt={eActive?.nom} className="relative mx-auto h-24 w-24 object-contain drop-shadow-2xl sm:h-32 sm:w-32 md:h-64 md:w-64 lg:w-80" />
          </div>
          <div role="progressbar" aria-label={`Vie de ${eActive?.nom ?? 'Adversaire'}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(eActive?.currentHP || 0)} className="relative mx-auto h-4 w-full max-w-sm overflow-hidden rounded-full border-2 border-white bg-slate-200 shadow-lg md:h-6 md:border-4 dark:bg-slate-800">
            <Motion.div animate={{ width: eActive ? `${eActive.currentHP}%` : '0%' }} className="h-full bg-gradient-to-r from-rose-500 to-orange-400" />
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black md:text-[10px]">{Math.round(eActive?.currentHP || 0)}%</span>
          </div>
          <div className="text-base font-black uppercase tracking-tighter sm:text-lg md:text-2xl">{eActive?.nom}</div>

          {showEnemyControls && (
            <div className="mt-3 grid w-full max-w-sm grid-cols-2 gap-2 md:mt-4 md:gap-4">
              <button type="button" onClick={() => onManualMove('normal')} className="rounded-xl border-2 border-slate-100 bg-white px-4 py-3 text-[11px] font-black uppercase shadow-xl transition-all hover:border-rose-500 md:rounded-2xl md:border-4 md:px-6 md:py-4 md:text-xs dark:bg-slate-800">
                Attaque
              </button>
              <button type="button" onClick={() => onManualMove('special')} className="rounded-xl bg-rose-500 px-4 py-3 text-[11px] font-black uppercase text-white shadow-xl transition-all hover:scale-105 md:rounded-2xl md:px-6 md:py-4 md:text-xs">
                Special
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border-t-8 border-rose-500 bg-slate-900 p-6 text-white shadow-2xl md:rounded-[4rem] md:p-10">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:mb-10 md:flex-row md:items-center">
          <h4 className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 md:text-sm">
            <Activity size={18} className="text-rose-500" /> Journal de Combat
          </h4>
        </div>
        <div role="log" aria-live="polite" aria-relevant="additions text" className="max-h-[38vh] space-y-3 overflow-y-auto pr-1 custom-scrollbar md:max-h-none md:space-y-6">
          {[...state.logs].reverse().map((log, index) => (
            <Motion.div key={`${log}-${index}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`rounded-xl border-l-4 p-4 md:rounded-2xl ${index === 0 ? 'border-rose-500 bg-rose-500/10 text-base md:text-lg font-bold text-rose-500' : 'border-slate-800 bg-white/5 text-xs md:text-sm text-slate-400'}`}>
              {log}
            </Motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleArena;
