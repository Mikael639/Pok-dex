import React, { useMemo } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Brain, Trophy, Gamepad2, GitBranch, BarChart3, Sparkles, Star, Shield, Flame, Crown } from 'lucide-react';
import { TYPE_COLORS, TYPE_CHART } from '../../constants/pokemon';
import { EXPERIENCE_META } from '../../constants/gameMeta';
import { QuickCard } from '../common/Cards';

export default function Dashboard({
  setActiveTab,
  lastPlayedTab,
  favorites,
  team,
  battleStats,
  pokemons,
  evolutionRushState,
  statClashState,
  gameState,
  quizState,
  dailyChallenge,
  handleDailyChallengeAction,
  isDailyChallengeComplete,
  todayKey,
  setSelectedPokemon
}) {
  const continueMode = EXPERIENCE_META[lastPlayedTab] ?? EXPERIENCE_META['evolution-rush'];
  const ContinueModeIcon = continueMode.icon;
  const collectionProgress = Math.round((pokemons.length / 1025) * 100);
  const overallEvolutionRushBestStreak = Math.max(0, ...Object.values(evolutionRushState.bestStreaks || {}));

  const teamAnalysis = useMemo(() => {
    if (team.length === 0) return null;
    const covered = {};
    Object.keys(TYPE_COLORS).forEach(defType => {
      let best = 1;
      team.forEach(p => p.types.forEach(atk => {
        const mult = (TYPE_CHART[atk.nom] && TYPE_CHART[atk.nom][defType]) ?? 1;
        if (mult > best) best = mult;
      }));
      covered[defType] = best;
    });
    return covered;
  }, [team]);

  const teamCoverageCount = teamAnalysis ? Object.values(teamAnalysis).filter((multiplier) => multiplier >= 2).length : 0;

  const dashboardProgressStats = [
    { label: 'Favoris', value: favorites.length, helper: 'Pokemon suivis', tone: 'text-rose-500', Icon: Star },
    { label: 'Equipe', value: `${team.length}/6`, helper: 'Champions actifs', tone: 'text-indigo-500', Icon: Shield },
    { label: 'Victoires', value: battleStats.wins, helper: 'Arene Battle', tone: 'text-emerald-500', Icon: Flame },
    { label: 'Record', value: Math.max(gameState.highscore, quizState.highscore, overallEvolutionRushBestStreak, statClashState.bestStreak), helper: 'Tous defis', tone: 'text-amber-500', Icon: Crown }
  ];

  const dashboardGameCards = [
    { id: 'quiz', icon: <Trophy size={24} className="text-amber-500" />, title: 'Master Type', text: `Record: ${quizState.highscore}` },
    { id: 'jeu', icon: <Gamepad2 size={24} className="text-indigo-500" />, title: 'Silhouette', text: `Record: ${gameState.highscore}` },
    { id: 'evolution-rush', icon: <GitBranch size={24} className="text-violet-500" />, title: 'Evolution Rush', text: `Meilleur: ${overallEvolutionRushBestStreak}` },
    { id: 'stat-clash', icon: <BarChart3 size={24} className="text-cyan-500" />, title: 'Stat Clash', text: `Serie max: ${statClashState.bestStreak}` },
    { id: 'combat', icon: <Activity size={24} className="text-emerald-500" />, title: 'Arène Battle', text: `${battleStats.wins} victoire${battleStats.wins > 1 ? 's' : ''}` }
  ];

  const DailyChallengeIcon = dailyChallenge.icon || Sparkles;
  const dailyChallengeStatusLabel = isDailyChallengeComplete ? 'Defi termine' : 'Objectif disponible';

  return (
    <Motion.div key="h" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="space-y-12 pb-20">
       <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.45fr_0.95fr]">
          <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-white bg-slate-900 shadow-2xl dark:border-slate-800 lg:rounded-[4rem]">
            <img src="/images/home_aesthetic.png" className="absolute inset-0 h-full w-full object-contain transition-transform duration-1000 hover:scale-105" alt="Hero" />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/55 to-rose-950/30" />
            <div className="relative flex min-h-[320px] flex-col justify-between p-6 lg:min-h-[450px] lg:p-12">
               <h1 className="text-3xl lg:text-6xl font-black text-white leading-none tracking-tighter uppercase font-['Outfit'] italic">Écrivez votre <br/><span className="text-rose-500">Légende</span>.</h1>
               <div className="flex flex-wrap gap-3">
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white backdrop-blur-xl">Dashboard joueur</span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/80 backdrop-blur-xl">Dernier defi : {continueMode.label}</span>
               </div>
               <p className="max-w-2xl text-sm font-bold text-white/75 lg:text-base">Pilotez votre progression, relancez votre dernier defi et gardez un oeil sur votre equipe sans quitter l accueil.</p>
                <div className="flex flex-wrap gap-3 lg:gap-4">
                   <button type="button" onClick={() => setActiveTab('collection')} className="rounded-xl bg-white px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-2xl transition-all hover:bg-rose-500 hover:text-white lg:rounded-2xl lg:px-8 lg:py-4 lg:text-sm">Explorer la collection</button>
                   <button type="button" aria-label={continueMode.cta} onClick={() => setActiveTab(continueMode.id)} className="rounded-xl border border-white/20 bg-slate-800/40 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl backdrop-blur-xl transition-all hover:bg-white hover:text-slate-900 lg:rounded-2xl lg:px-8 lg:py-4 lg:text-sm">{continueMode.cta}</button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                   <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 p-4 backdrop-blur-xl group">
                      <div className="relative z-10">
                         <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">Favoris</div>
                         <div className="mt-2 text-2xl font-black text-white">{favorites.length}</div>
                      </div>
                      <Star size={72} strokeWidth={1} className="absolute -bottom-4 -right-4 text-white opacity-10 transition-all duration-500 group-hover:-rotate-12 group-hover:scale-110 group-hover:opacity-30" />
                   </div>
                   <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 p-4 backdrop-blur-xl group">
                      <div className="relative z-10">
                         <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">Equipe</div>
                         <div className="mt-2 text-2xl font-black text-white">{team.length}/6</div>
                      </div>
                      <Shield size={72} strokeWidth={1} className="absolute -bottom-4 -right-4 text-white opacity-10 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 group-hover:opacity-30" />
                   </div>
                   <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 p-4 backdrop-blur-xl group">
                      <div className="relative z-10">
                         <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">Victoires</div>
                         <div className="mt-2 text-2xl font-black text-white">{battleStats.wins}</div>
                      </div>
                      <Trophy size={72} strokeWidth={1} className="absolute -bottom-4 -right-4 text-white opacity-10 transition-all duration-500 group-hover:-rotate-12 group-hover:scale-110 group-hover:opacity-30" />
                   </div>
                </div>
            </div>
          </div>
          <div className="glass-card relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] p-6 lg:rounded-[4rem] lg:p-10">
             <div className="absolute top-0 right-0 p-4 opacity-10 lg:p-8"><Zap size={80} className="text-rose-500 lg:size-[120px]" /></div>
             <div className="relative z-10">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 lg:mb-4">Progression reelle</span>
                <h2 className="mb-2 text-2xl font-black uppercase leading-none tracking-tighter lg:text-4xl">Tableau de bord<br />du dresseur</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 opacity-80">Collection, records et impulsion du moment</p>
             </div>
             <div className="relative z-10 mt-8 space-y-6">
                <div>
                   <div className="mb-2 flex justify-between text-[10px] font-black uppercase tracking-widest"><span>Collection</span><span>{collectionProgress}%</span></div>
                   <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <Motion.div initial={{width: 0}} animate={{width: `${collectionProgress}%`}} className="h-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                   </div>
                   <div className="mt-2 text-xs font-bold text-slate-500">{pokemons.length} Pokemon deja indexes sur 1025.</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                   {dashboardProgressStats.map((stat) => {
                      const IconComponent = stat.Icon;
                      return (
                      <div key={stat.label} className="relative overflow-hidden rounded-[1.75rem] bg-slate-100 p-4 dark:bg-slate-800/50 group hover:shadow-lg transition-shadow">
                         <div className="relative z-10">
                            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">{stat.label}</div>
                            <div className={`mt-2 text-2xl font-black leading-none ${stat.tone}`}>{stat.value}</div>
                            <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.helper}</div>
                         </div>
                         <IconComponent size={80} strokeWidth={1} className={`absolute -bottom-4 -right-4 opacity-5 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110 group-hover:opacity-20 ${stat.tone}`} />
                      </div>
                   )})}
                </div>
                <div className="rounded-[2rem] border border-slate-200/80 bg-white/70 p-5 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70">
                   <div className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Records a surveiller</div>
                   <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800/70">
                         <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Evolution Rush</div>
                         <div className="mt-1 text-xl font-black text-violet-500">{overallEvolutionRushBestStreak}</div>
                      </div>
                      <div className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800/70">
                         <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stat Clash</div>
                         <div className="mt-1 text-xl font-black text-cyan-500">{statClashState.bestStreak}</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.15fr_0.95fr_1fr]">
          <button type="button" onClick={() => setActiveTab(continueMode.id)} aria-label={continueMode.cta} className="group relative overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-8 text-left shadow-xl transition-all hover:-translate-y-1 hover:border-rose-400/40 dark:border-slate-800 dark:bg-slate-900">
             <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-amber-400/10 opacity-80" />
             <div className="relative flex h-full flex-col justify-between gap-8">
                <div className="flex items-start justify-between gap-6">
                   <div>
                      <div className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Continuer l aventure</div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">{continueMode.label}</h3>
                      <p className="mt-3 max-w-md text-sm font-bold text-slate-500">{continueMode.description}</p>
                   </div>
                   <div className="rounded-[1.75rem] bg-slate-100 p-4 text-rose-500 transition-transform group-hover:scale-110 dark:bg-slate-800">
                      <ContinueModeIcon size={34} />
                   </div>
                </div>
                <div className="flex flex-wrap gap-3">
                   <span className="rounded-full bg-rose-500 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white">{continueMode.cta}</span>
                   <span className="rounded-full bg-slate-100 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">Dernier mode joue</span>
                </div>
             </div>
          </button>
          
          <button type="button" aria-label={dailyChallenge?.cta} onClick={handleDailyChallengeAction} className="group relative overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-8 text-left shadow-xl transition-all hover:-translate-y-1 hover:border-amber-400/30 dark:border-slate-800 dark:bg-slate-900">
             <div className={`absolute inset-0 bg-gradient-to-br ${dailyChallenge?.accent}`} />
             <div className="relative flex h-full flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                   <div>
                      <div className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Defi du jour</div>
                      <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white">{dailyChallenge?.title}</h3>
                      <p className="mt-3 text-sm font-bold text-slate-500">{dailyChallenge?.description}</p>
                   </div>
                   <div className="rounded-[1.75rem] bg-slate-100 p-4 text-amber-500 transition-transform group-hover:scale-110 dark:bg-slate-800">
                      <DailyChallengeIcon size={32} />
                   </div>
                </div>
                <div className="flex items-center justify-center">
                   {dailyChallenge?.visualPokemon ? (
                      <div className="relative">
                         <div className={`absolute inset-0 scale-150 rounded-full blur-3xl ${dailyChallenge?.glow}`} />
                         <img src={dailyChallenge.visualPokemon.image} alt={dailyChallenge.visualPokemon.nom} className="relative z-10 h-28 w-28 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:rotate-6" />
                      </div>
                   ) : (
                      <div className={`relative flex h-28 w-28 items-center justify-center rounded-full ${isDailyChallengeComplete ? 'bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.35)]' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-200'}`}>
                         <DailyChallengeIcon size={42} />
                         {isDailyChallengeComplete && <Sparkles size={18} className="absolute -right-1 -top-1 text-amber-200" />}
                      </div>
                   )}
                </div>
                <div className="rounded-[2rem] border border-slate-200/80 bg-white/75 p-5 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70">
                   <div className="flex items-center justify-between gap-3">
                      <div>
                         <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{dailyChallenge?.reward}</div>
                         <div className={`mt-2 text-sm font-black uppercase tracking-[0.2em] ${isDailyChallengeComplete ? 'text-emerald-500' : 'text-slate-500'}`}>{dailyChallengeStatusLabel}</div>
                      </div>
                      <span className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.3em] ${isDailyChallengeComplete ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'}`}>{isDailyChallengeComplete ? '1 / 1' : '0 / 1'}</span>
                   </div>
                   <div className="mt-3 text-xs font-bold text-slate-500">{dailyChallenge?.helper} • cycle {todayKey}</div>
                   <AnimatePresence>
                      {isDailyChallengeComplete && (
                         <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mt-4 rounded-[1.5rem] bg-emerald-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-300">
                            Badge du jour debloque
                         </Motion.div>
                      )}
                   </AnimatePresence>
                </div>
                <div className="flex flex-wrap gap-3">
                   <span className="rounded-full bg-amber-500 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white">{dailyChallenge?.cta}</span>
                   <span className="rounded-full bg-slate-100 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">Recompense visuelle</span>
                </div>
             </div>
          </button>
          
          <div className="rounded-[3rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
             <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                   <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Equipe active</div>
                   <h3 className="mt-2 text-xl font-black uppercase tracking-tighter dark:text-white">Prete pour la ligue</h3>
                </div>
                <button type="button" onClick={() => setActiveTab('equipe')} className="rounded-full bg-indigo-500 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white">Voir l equipe</button>
             </div>
             <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.75rem] bg-slate-100 p-4 dark:bg-slate-800/70">
                   <div className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Slots</div>
                   <div className="mt-2 text-2xl font-black text-indigo-500">{team.length}/6</div>
                   <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Pokemon equipes</div>
                </div>
                <div className="rounded-[1.75rem] bg-slate-100 p-4 dark:bg-slate-800/70">
                   <div className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Couverture</div>
                   <div className="mt-2 text-2xl font-black text-emerald-500">{teamCoverageCount}</div>
                   <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Types bien geres</div>
                </div>
             </div>
             <div className="mt-5 grid grid-cols-3 gap-3">
                {team.length > 0 ? team.slice(0, 6).map((p) => <button type="button" key={p.id} aria-label={`Voir ${p.nom}`} className="rounded-2xl border border-transparent bg-slate-50 p-3 text-center transition-all hover:border-indigo-500 dark:bg-slate-950" onClick={() => setSelectedPokemon(p)}><img src={p.image} alt={p.nom} className="mx-auto h-12 w-12 object-contain transition-transform hover:scale-110" /></button>) : <div role="status" className="col-span-3 rounded-[1.75rem] border border-dashed border-slate-200 px-4 py-8 text-center text-xs font-black uppercase tracking-widest text-slate-400 dark:border-slate-700">Compose ton equipe pour debloquer un resume strategique ici.</div>}
             </div>
          </div>
       </div>

       <section className="space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
             <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Jeux et defis</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Tous les records a portee de clic</h3>
             </div>
             <p className="max-w-2xl text-sm font-bold text-slate-500">Sélectionne un mode d'entraînement pour tester tes connaissances, améliorer tes stratégies et inscrire ton nom dans la légende.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
             {dashboardGameCards.map((card) => (
                <QuickCard key={card.id} icon={card.icon} title={card.title} text={card.text} onClick={() => setActiveTab(card.id)} />
             ))}
          </div>
       </section>
    </Motion.div>
  );
}
