import React, { useMemo } from 'react';
import { motion as Motion } from 'framer-motion';
import { Zap, Activity, Gamepad2, GitBranch, Sparkles, Star, Shield, Flame, Crown, Music, Brain, Trophy } from 'lucide-react';
import { TYPE_COLORS, TYPE_CHART } from '../../constants/pokemon';
import { EXPERIENCE_META } from '../../constants/gameMeta';

const LOG_STYLES = {
  favorite: { Icon: Star, tone: 'text-amber-500 bg-amber-500/10' },
  team_add: { Icon: Shield, tone: 'text-sky-500 bg-sky-500/10' },
  team_remove: { Icon: Shield, tone: 'text-slate-400 bg-slate-100 dark:bg-slate-800' },
  win: { Icon: Trophy, tone: 'text-emerald-500 bg-emerald-500/10' }
};

/**
 * Tableau de bord : tient dans un seul écran (aucun défilement).
 * Mobile : héros + défi du jour + raccourcis + équipe. Grand écran : trois colonnes + journal résumé.
 */
export default function Dashboard({
  setActiveTab,
  lastPlayedTab,
  favorites,
  team,
  battleStats,
  pokemons,
  evolutionRushState,
  gameState,
  setSelectedPokemon,
  cryQuizState,
  dailyChallenge,
  handleDailyChallengeAction,
  isDailyChallengeComplete,
  logs
}) {
  const continueMode = EXPERIENCE_META?.[lastPlayedTab] || EXPERIENCE_META?.['evolution-rush'] || { label: 'Aventure', cta: 'Lancer', icon: Zap };
  const collectionProgress = Math.round(((pokemons?.length || 0) / 1025) * 100);
  const overallEvolutionRushBestStreak = Math.max(0, ...Object.values(evolutionRushState?.bestStreaks || {}));
  const bestRecord = Math.max(gameState?.highscore || 0, overallEvolutionRushBestStreak, cryQuizState?.highscore || 0);

  const teamCoverageCount = useMemo(() => {
    if (!team || team.length === 0) return 0;
    return Object.keys(TYPE_COLORS).filter((defType) =>
      team.some((p) => p?.types?.some((atk) => (TYPE_CHART?.[atk.nom]?.[defType] ?? 1) >= 2))
    ).length;
  }, [team]);

  const heroStats = [
    { label: 'Favoris', value: favorites?.length || 0, Icon: Star },
    { label: 'Equipe', value: `${team?.length || 0}/6`, Icon: Shield },
    { label: 'Victoires', value: battleStats?.wins || 0, Icon: Flame },
    { label: 'Record', value: bestRecord, Icon: Crown }
  ];

  const gameShortcuts = [
    { id: 'combat', Icon: Activity, title: 'Arène', text: `${battleStats?.wins || 0} vict.`, tone: 'text-emerald-500' },
    { id: 'memory', Icon: Brain, title: 'Memory', text: '6 paires', tone: 'text-brand-500' },
    { id: 'jeu', Icon: Gamepad2, title: 'Silhouette', text: `Record ${gameState?.highscore || 0}`, tone: 'text-sky-500' },
    { id: 'evolution-rush', Icon: GitBranch, title: 'Evolution', text: `Best ${overallEvolutionRushBestStreak}`, tone: 'text-amber-500' },
    { id: 'cry-quiz', Icon: Music, title: 'Qui est-ce', text: `Record ${cryQuizState?.highscore || 0}`, tone: 'text-brand-500' }
  ];

  const DailyChallengeIcon = dailyChallenge.icon || Sparkles;
  const dailyChallengeStatusLabel = isDailyChallengeComplete ? 'Defi termine' : 'Objectif disponible';
  const recentLogs = (logs || []).slice(0, 3);

  return (
    <Motion.div key="h" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="flex h-full min-h-[30rem] flex-col gap-2 sm:gap-3 lg:gap-4">
      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_auto_auto] gap-2 sm:gap-3 lg:grid-cols-[1.35fr_1fr_1fr] lg:grid-rows-1 lg:gap-4">
        {/* Héros */}
        <div className="relative flex min-h-0 flex-col justify-between overflow-hidden rounded-[1.5rem] border-2 border-white bg-slate-900 p-4 shadow-xl dark:border-slate-800 sm:rounded-[2rem] sm:p-6 lg:p-8">
          <img src="/images/home_aesthetic.webp" alt="" aria-hidden="true" className="absolute inset-0 hidden h-full w-full object-cover opacity-70 sm:block" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/70 to-slate-950/30" />
          <div className="relative">
            <h1 className="font-['Outfit'] text-2xl font-black uppercase italic leading-[1.05] tracking-tight text-white drop-shadow-2xl sm:text-4xl lg:text-5xl xl:text-6xl">
              Écrivez votre <span className="text-brand-500">Légende</span>.
            </h1>
            <p className="mt-2 hidden max-w-md text-sm font-medium leading-relaxed text-white/60 sm:block">
              Pilotez votre progression, relancez votre dernier defi et gardez un oeil sur votre equipe.
            </p>
          </div>

          <div className="relative mt-3 flex flex-wrap gap-2 sm:gap-3">
            <button type="button" onClick={() => setActiveTab('collection')} className="rounded-xl bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-lg transition-all hover:scale-[1.03] active:scale-95 sm:px-6 sm:py-3">
              Explorer la collection
            </button>
            <button type="button" aria-label={continueMode.cta} onClick={() => setActiveTab(continueMode.id)} className="rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur transition-all hover:bg-white/20 active:scale-95 sm:px-6 sm:py-3">
              {continueMode.cta}
            </button>
          </div>

          <div className="relative mt-3 grid grid-cols-4 gap-2 sm:gap-3">
            {heroStats.map(({ label, value, Icon }) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/10 px-2 py-2 backdrop-blur sm:rounded-2xl sm:px-4 sm:py-3">
                <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-white/50 sm:text-[10px]">
                  <Icon size={11} className="hidden sm:block" /> {label}
                </div>
                <div className="text-lg font-black leading-tight text-white sm:text-2xl">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Défi du jour : bandeau compact sur mobile, grande carte sur grand écran */}
        <button type="button" aria-label={dailyChallenge?.cta} onClick={handleDailyChallengeAction} className="group relative flex min-h-0 flex-col overflow-hidden rounded-2xl border-2 border-amber-200 bg-white p-3 text-left shadow-lg transition-all hover:border-amber-400 dark:border-amber-500/30 dark:bg-slate-900 lg:rounded-[2rem] lg:border-slate-100 lg:p-6 lg:shadow-xl lg:dark:border-slate-800">
          <div className={`absolute inset-0 hidden bg-gradient-to-br lg:block ${dailyChallenge?.accent}`} />
          <div className="relative flex items-center justify-between gap-3 lg:items-start">
            <div className="flex min-w-0 items-center gap-3 lg:block">
              <div className="shrink-0 rounded-xl bg-amber-500/10 p-2.5 text-amber-500 lg:hidden"><DailyChallengeIcon size={22} /></div>
              <div className="min-w-0">
                <div className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-500 lg:text-[10px] lg:tracking-[0.3em]">Defi du jour</div>
                <h3 className="truncate text-xs font-black uppercase leading-tight tracking-tight dark:text-white sm:text-sm lg:mt-1 lg:whitespace-normal lg:text-lg xl:text-xl">{dailyChallenge?.title}</h3>
                <p className="mt-2 hidden text-[10px] font-bold uppercase leading-snug tracking-widest text-slate-400 lg:block">{dailyChallenge?.description}</p>
              </div>
            </div>
            <span className={`shrink-0 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest lg:hidden ${isDailyChallengeComplete ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
              {isDailyChallengeComplete ? 'OK' : 'A faire'}
            </span>
            <div className="hidden shrink-0 rounded-2xl bg-slate-50 p-3 text-amber-500 dark:bg-slate-800 lg:block">
              <DailyChallengeIcon size={26} />
            </div>
          </div>
          <div className="relative hidden min-h-0 flex-1 items-center justify-center py-2 lg:flex">
            {dailyChallenge?.visualPokemon ? (
              <img src={dailyChallenge.visualPokemon.image} alt={dailyChallenge.visualPokemon.nom} loading="lazy" className="h-full max-h-56 w-full object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.2)] transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className={`flex h-24 w-24 items-center justify-center rounded-full ${isDailyChallengeComplete ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300 dark:bg-slate-800'}`}>
                <DailyChallengeIcon size={40} />
              </div>
            )}
          </div>
          <div className="relative hidden items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/30 lg:flex">
            <div className="min-w-0">
              <div className="truncate text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{dailyChallenge?.reward}</div>
              <div className={`text-xs font-black uppercase tracking-widest ${isDailyChallengeComplete ? 'text-emerald-500' : 'text-slate-400'}`}>{dailyChallengeStatusLabel}</div>
            </div>
            <span className={`shrink-0 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${isDailyChallengeComplete ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 dark:bg-slate-900'}`}>
              {isDailyChallengeComplete ? 'OK' : 'A faire'}
            </span>
          </div>
        </button>

        {/* Équipe + collection (colonne droite sur grand écran, bandeau compact sur mobile) */}
        <div className="flex min-h-0 flex-col gap-2 rounded-[1.5rem] border-2 border-slate-100 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:gap-3 sm:rounded-[2rem] sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500">Equipe active</div>
              <div className="text-xs font-bold text-slate-500">{team.length}/6 Pokemon{teamCoverageCount > 0 ? ` • ${teamCoverageCount} points forts` : ''}</div>
            </div>
            <button type="button" onClick={() => setActiveTab('equipe')} className="rounded-xl bg-sky-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-sky-600 transition-all hover:bg-sky-600 hover:text-white dark:bg-sky-500/10">
              Gerer
            </button>
          </div>

          <div className="grid grid-cols-6 gap-1.5 sm:gap-2 lg:min-h-0 lg:flex-1 lg:grid-cols-3 lg:grid-rows-2 lg:gap-3">
            {Array.from({ length: 6 }).map((_, index) => {
              const p = team[index];
              return p ? (
                <button type="button" key={p.id} aria-label={`Voir ${p.nom}`} onClick={() => setSelectedPokemon(p)} className="flex aspect-square min-h-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-1 lg:aspect-auto lg:p-2 transition-all hover:bg-white hover:shadow-lg dark:border-slate-800 dark:bg-slate-800/50">
                  <img src={p.image} alt="" className="h-full w-full object-contain" />
                </button>
              ) : (
                <div key={`empty-${index}`} className="aspect-square rounded-xl border-2 border-dashed border-slate-200 lg:aspect-auto dark:border-slate-700" />
              );
            })}
          </div>

          <div>
            <div className="mb-1 flex justify-between text-[10px] font-black uppercase tracking-widest"><span>Collection</span><span>{collectionProgress}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <Motion.div initial={{ width: 0 }} animate={{ width: `${collectionProgress}%` }} className="h-full bg-brand-500" />
            </div>
            <div className="mt-1 hidden text-[11px] font-bold text-slate-500 lg:block">{pokemons.length} Pokemon indexes sur 1025.</div>
          </div>
        </div>
      </div>

      {/* Raccourcis jeux + journal résumé */}
      <div className="grid shrink-0 grid-cols-1 gap-2 sm:gap-3 xl:grid-cols-[1.6fr_1fr] xl:gap-4">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
          {gameShortcuts.map(({ id, Icon, title, text, tone }) => (
            <button type="button" key={id} aria-label={`${title} : ${text}`} onClick={() => setActiveTab(id)} className="group flex min-w-0 flex-col items-center gap-0.5 rounded-xl border-2 border-slate-100 bg-white px-1 py-2 text-center shadow-md transition-all hover:border-brand-500/50 active:scale-95 dark:border-slate-800 dark:bg-slate-900 sm:rounded-2xl sm:p-3">
              <Icon size={22} className={`${tone} transition-transform group-hover:scale-110`} />
              <span className="w-full truncate text-[8px] font-black uppercase tracking-tight dark:text-white min-[400px]:text-[9px] sm:text-xs">{title}</span>
              <span className="hidden w-full truncate text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:block">{text}</span>
            </button>
          ))}
        </div>

        <div className="hidden rounded-2xl border-2 border-slate-100 bg-white p-3 shadow-md dark:border-slate-800 dark:bg-slate-900 xl:block">
          <div className="mb-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-brand-500">Journal de Bord</div>
          {recentLogs.length > 0 ? (
            <ul className="space-y-1">
              {recentLogs.map((log) => {
                const { Icon, tone } = LOG_STYLES[log.type] || { Icon: Activity, tone: 'text-slate-500 bg-slate-100 dark:bg-slate-800' };
                return (
                  <li key={log.id} className="flex items-center gap-2">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${tone}`}><Icon size={12} /></span>
                    <span className="min-w-0 flex-1 truncate text-xs font-bold text-slate-700 dark:text-slate-200">{log.message}</span>
                    <span className="shrink-0 text-[10px] font-black text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Aucun evenement recent.</p>
          )}
        </div>
      </div>
    </Motion.div>
  );
}
