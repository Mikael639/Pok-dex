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

const hpTone = (hp) => (hp > 50 ? 'bg-emerald-500' : hp > 20 ? 'bg-amber-400' : 'bg-brand-500');

/** Carte d'état d'un combattant : nom, barre de vie, Pokémon restants. */
const FighterPanel = ({ pokemon, team, activeIndex, title, isTurn }) => {
  const hp = Math.round(pokemon?.currentHP || 0);
  const remaining = team.filter((member) => member.currentHP > 0).length;

  return (
    <div className={`w-full max-w-sm shrink-0 rounded-xl border-2 bg-white/90 p-2 shadow-lg backdrop-blur sm:rounded-2xl sm:p-3 dark:bg-slate-900/90 ${isTurn ? 'border-brand-500' : 'border-white dark:border-slate-800'}`}>
      <div className="mb-1 flex items-center justify-between gap-1 sm:mb-2 sm:gap-2">
        <span className="truncate text-xs font-black uppercase tracking-tight sm:text-base">{pokemon?.nom}</span>
        <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wider sm:px-2 sm:text-[10px] ${isTurn ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
          {isTurn ? 'A jouer' : title}
        </span>
      </div>
      <div role="progressbar" aria-label={`Vie de ${pokemon?.nom ?? title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={hp} className="h-2 overflow-hidden rounded-full bg-slate-200 sm:h-3 dark:bg-slate-800">
        <div style={{ width: `${hp}%` }} className={`h-full rounded-full transition-[width] duration-500 ${hpTone(hp)}`} />
      </div>
      <div className="mt-1 flex items-center justify-between sm:mt-2">
        <span className="text-[9px] font-black text-slate-500 sm:text-xs">{hp} / 100 PV</span>
        <div className="flex gap-0.5 sm:gap-1" aria-label={`${remaining} Pokemon restants sur ${team.length}`}>
          {team.map((member, index) => (
            <span
              key={`${member.id}-${index}`}
              className={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${member.currentHP <= 0 ? 'bg-slate-300 dark:bg-slate-700' : index === activeIndex ? 'bg-brand-500' : 'bg-sky-400'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/** Un Pokémon posé sur sa plateforme, avec sa carte d'état. L'illustration prend la hauteur restante. */
const FighterSlot = ({ pokemon, team, activeIndex, title, isTurn }) => (
  <div className="flex min-h-0 min-w-0 flex-col items-center gap-2 lg:justify-center lg:gap-6">
    <FighterPanel pokemon={pokemon} team={team} activeIndex={activeIndex} title={title} isTurn={isTurn} />
    <div className="relative flex min-h-0 w-full flex-1 items-end justify-center pb-3 sm:pb-5 lg:h-[62%] lg:max-h-[26rem] lg:flex-none">
      <div aria-hidden="true" className="absolute bottom-0 left-1/2 h-3 w-3/5 max-w-[16rem] -translate-x-1/2 rounded-[50%] bg-slate-900/20 blur-[2px] sm:h-6 dark:bg-black/50" />
      <img
        key={pokemon?.id}
        src={pokemon?.image}
        alt={pokemon?.nom}
        className="relative z-10 h-full w-full object-contain drop-shadow-[0_14px_16px_rgba(11,21,35,0.30)]"
      />
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

  /* ───────────── Menu ───────────── */
  if (state.mode === 'menu') {
    return (
      <div className="mx-auto flex h-full min-h-[24rem] max-w-4xl flex-col items-center justify-center gap-4 text-center sm:gap-8">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-brand-500 p-3 shadow-xl ring-4 ring-brand-500/20 sm:rounded-[2rem] sm:p-6 sm:ring-8">
            <Activity className="h-8 w-8 text-white sm:h-14 sm:w-14" />
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-black uppercase leading-none tracking-tighter text-slate-900 dark:text-white sm:text-5xl">Arene Master</h2>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 sm:text-base">Choisissez votre defi</p>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-2 sm:gap-4 md:grid-cols-3">
          {MENU_MODES.map((mode) => (
            <button
              type="button"
              aria-label={`${mode.title} : ${mode.desc}`}
              key={mode.id}
              onClick={() => onStart(mode.id)}
              disabled={teamLength < 6}
              className={`group flex items-center gap-4 rounded-2xl border-2 bg-white p-3 text-left shadow-lg transition-all sm:rounded-3xl sm:p-6 md:flex-col md:text-center dark:bg-slate-900 ${teamLength < 6 ? 'cursor-not-allowed opacity-30 grayscale' : 'border-slate-100 hover:border-brand-500 active:scale-[0.98] dark:border-slate-800'}`}
            >
              <mode.icon className="h-8 w-8 shrink-0 text-brand-500 transition-transform group-hover:scale-110 sm:h-10 sm:w-10" />
              <div>
                <h3 className="text-sm font-black uppercase tracking-tighter sm:text-xl">{mode.title}</h3>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 transition-colors group-hover:text-brand-500 sm:text-[10px]">{mode.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {teamLength < 6 && (
          <div className="mx-auto max-w-sm rounded-xl border-2 border-brand-500/20 bg-brand-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brand-500 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-sm">
            Veuillez selectionner 6 Pokemon dans votre equipe ({teamLength}/6)
          </div>
        )}
      </div>
    );
  }

  /* ───────────── Sélection de l'équipe adverse (PvP) ───────────── */
  if (state.mode === 'selection') {
    return (
      <div className="mx-auto flex h-full min-h-[26rem] max-w-5xl flex-col gap-2 sm:gap-3">
        <div className="flex shrink-0 items-center justify-between gap-3">
          <button type="button" onClick={resetBattle} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-brand-500">
            <ChevronLeft size={16} /> Retour
          </button>
          <div className="text-right">
            <h2 className="text-lg font-black uppercase italic leading-tight text-brand-500 sm:text-3xl">Joueur 2</h2>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 sm:text-xs">Composez votre equipe ({state.enemyTeam.length}/6)</p>
          </div>
        </div>

        <div className="relative shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            aria-label="Rechercher un Pokemon pour l equipe adverse"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-11 w-full rounded-2xl border-2 border-slate-100 bg-white pl-11 pr-4 text-sm font-bold shadow-lg ring-brand-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-900"
          />
        </div>

        <div className="grid shrink-0 grid-cols-6 gap-1.5 sm:gap-3">
          {state.enemyTeam.map((pokemon, index) => (
            <div key={`${pokemon.id}-${index}`} className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-brand-500 p-1.5 shadow-lg sm:rounded-2xl sm:p-2">
              <button type="button" aria-label={`Retirer ${pokemon.nom} de l equipe adverse`} onClick={() => setBattleState((previousState) => ({ ...previousState, enemyTeam: previousState.enemyTeam.filter((_, currentIndex) => currentIndex !== index) }))} className="absolute right-0.5 top-0.5 z-10 rounded-full bg-white/30 p-0.5 text-white">
                <X size={10} />
              </button>
              <img src={pokemon.image} alt={pokemon.nom} className="h-full w-full object-contain" />
            </div>
          ))}

          {Array.from({ length: 6 - state.enemyTeam.length }).map((_, index) => (
            <div key={`slot-${index}`} className="aspect-square rounded-xl border-2 border-dashed border-slate-200 bg-slate-100 sm:rounded-2xl dark:border-slate-700 dark:bg-slate-800" />
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
            className="h-12 w-full shrink-0 rounded-2xl bg-slate-900 font-black text-white shadow-xl transition-all hover:bg-brand-500 dark:bg-white dark:text-slate-900 dark:hover:bg-brand-500 dark:hover:text-white"
          >
            VALIDE & COMBAT
          </button>
        )}

        {/* Liste des Pokémon : seule zone qui défile (1025 entrées) */}
        <div className="grid min-h-0 flex-1 auto-rows-min grid-cols-3 gap-2 overflow-y-auto rounded-2xl bg-slate-50 p-2 custom-scrollbar sm:grid-cols-4 sm:p-3 md:grid-cols-6 md:gap-3 dark:bg-slate-950/30">
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
                className={`flex flex-col items-center rounded-xl border-2 p-1.5 shadow-md transition-all sm:p-2 ${isAlreadySelected ? 'border-brand-500 bg-brand-500 text-white' : 'border-transparent bg-white hover:border-brand-500 dark:bg-slate-900'} disabled:cursor-not-allowed disabled:opacity-80`}
              >
                <img src={pokemon.image} alt={pokemon.nom} loading="lazy" className="h-10 w-10 object-contain sm:h-12 sm:w-12" />
                <span className="mt-1 w-full truncate text-[8px] font-black uppercase sm:text-[10px]">{pokemon.nom}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ───────────── Combat : tout tient dans l'écran ───────────── */
  const controlsOwner = showPlayerControls ? 'Joueur 1' : showEnemyControls ? 'Joueur 2' : null;
  const waitingMessage = state.mode === 'auto' ? 'Combat automatique en cours...' : "L'adversaire prepare son attaque...";

  return (
    <div className="flex h-full min-h-[28rem] flex-col gap-2 text-slate-900 sm:gap-3 lg:flex-row lg:gap-4 dark:text-white">
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

      {/* Scène : ciel Sky Blue, plateformes — les Pokémon sont le point focal */}
      <section aria-label="Terrain de combat" className="relative min-h-0 flex-1 overflow-hidden rounded-[1.5rem] border-2 border-white bg-gradient-to-b from-sky-300 via-sky-100 to-slate-50 shadow-xl sm:rounded-[2rem] sm:border-4 dark:border-slate-800 dark:from-sky-950 dark:via-slate-900 dark:to-slate-950">
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-slate-200/80 to-transparent dark:from-black/40" />
        <div className="relative grid h-full grid-cols-2 gap-2 p-2 sm:gap-6 sm:p-5 lg:gap-12 lg:p-8">
          <FighterSlot pokemon={pActive} team={state.playerTeam} activeIndex={state.playerActive} title="Joueur 1" isTurn={isPlayerTurn} />
          <FighterSlot pokemon={eActive} team={state.enemyTeam} activeIndex={state.enemyActive} title={isPvp ? 'Joueur 2' : 'Adversaire'} isTurn={!isPlayerTurn} />
        </div>
      </section>

      {/* Colonne de droite (desktop) / bandeau du bas (mobile) : actions puis journal */}
      <div className="flex shrink-0 flex-col gap-2 sm:gap-3 lg:min-h-0 lg:w-80 xl:w-96">
        {!state.winner && (
          <div className="rounded-2xl border-2 border-sky-200 bg-white p-2.5 text-center shadow-lg sm:p-4 dark:border-sky-900/60 dark:bg-slate-900">
            {controlsOwner ? (
              <>
                <p className="mb-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 sm:mb-2 sm:text-xs">Tour de {controlsOwner}</p>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button type="button" onClick={() => onManualMove('normal')} className="rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-black uppercase transition-colors hover:border-brand-500 hover:text-brand-500 sm:py-3.5 sm:text-sm dark:border-slate-700 dark:bg-slate-800">
                    Attaque
                  </button>
                  <button type="button" onClick={() => onManualMove('special')} className="rounded-xl bg-brand-500 px-3 py-2.5 text-xs font-black uppercase text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600 sm:py-3.5 sm:text-sm">
                    Special
                  </button>
                </div>
              </>
            ) : (
              <p role="status" className="py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 sm:py-3 sm:text-xs">{waitingMessage}</p>
            )}
          </div>
        )}

        {/* Journal : le plus récent en haut, défilement interne */}
        <div className="flex h-28 flex-col rounded-2xl border-2 border-slate-100 bg-white p-3 shadow-lg sm:h-32 sm:p-4 lg:h-auto lg:min-h-0 lg:flex-1 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 sm:text-xs">
              <Activity size={14} className="text-brand-500" /> Journal de Combat
            </h4>
            {!state.winner && (
              <button type="button" onClick={resetBattle} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-brand-500">
                <ChevronLeft size={14} /> Abandonner
              </button>
            )}
          </div>
          <div role="log" aria-live="polite" aria-relevant="additions text" className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
            {state.logs.map((log, index) => (
              <div key={`${log}-${index}`} className={`rounded-lg border-l-4 px-3 py-1.5 ${index === 0 ? 'border-brand-500 bg-brand-500/10 text-xs font-bold text-brand-600 sm:text-sm dark:text-brand-400' : 'border-slate-200 bg-slate-50 text-[11px] text-slate-500 sm:text-xs dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400'}`}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleArena;
