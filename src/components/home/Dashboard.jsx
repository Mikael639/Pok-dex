import React, { useMemo } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Brain, Trophy, Gamepad2, GitBranch, BarChart3, Sparkles, Star, Shield, Flame, Crown, LayoutGrid, Music } from 'lucide-react';
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
  todayKey,
  setSelectedPokemon,
  pokedleState,
  cryQuizState,
  dailyChallenge,
  handleDailyChallengeAction,
  isDailyChallengeComplete,
  logs
}) {
  const continueMode = (EXPERIENCE_META && EXPERIENCE_META[lastPlayedTab]) || (EXPERIENCE_META && EXPERIENCE_META['evolution-rush']) || { label: 'Aventure', cta: 'Lancer', icon: Zap };
  const ContinueModeIcon = continueMode.icon || Zap;
  const collectionProgress = Math.round(((pokemons?.length || 0) / 1025) * 100);
  const overallEvolutionRushBestStreak = Math.max(0, ...Object.values(evolutionRushState?.bestStreaks || {}));

  const teamAnalysis = useMemo(() => {
    if (!team || team.length === 0) return null;
    const covered = {};
    Object.keys(TYPE_COLORS || {}).forEach(defType => {
      let best = 1;
      team.forEach(p => p?.types?.forEach(atk => {
        const mult = (TYPE_CHART && TYPE_CHART[atk.nom] && TYPE_CHART[atk.nom][defType]) ?? 1;
        if (mult > best) best = mult;
      }));
      covered[defType] = best;
    });
    return covered;
  }, [team]);

  const teamCoverageCount = teamAnalysis ? Object.values(teamAnalysis).filter((multiplier) => multiplier >= 2).length : 0;

  const dashboardProgressStats = [
    { label: 'Favoris', value: favorites?.length || 0, helper: 'Pokemon suivis', tone: 'text-rose-500', Icon: Star },
    { label: 'Equipe', value: `${team?.length || 0}/6`, helper: 'Champions actifs', tone: 'text-indigo-500', Icon: Shield },
    { label: 'Victoires', value: battleStats?.wins || 0, helper: 'Arene Battle', tone: 'text-emerald-500', Icon: Flame },
    { label: 'Record', value: Math.max(gameState?.highscore || 0, quizState?.highscore || 0, overallEvolutionRushBestStreak, statClashState?.bestStreak || 0, cryQuizState?.highscore || 0), helper: 'Tous defis', tone: 'text-amber-500', Icon: Crown }
  ];

  const dashboardGameCards = [
    { id: 'quiz', icon: <Trophy size={24} className="text-amber-500" />, title: 'Master Type', text: `Record: ${quizState?.highscore || 0}` },
    { id: 'jeu', icon: <Gamepad2 size={24} className="text-indigo-500" />, title: 'Silhouette', text: `Record: ${gameState?.highscore || 0}` },
    { id: 'evolution-rush', icon: <GitBranch size={24} className="text-violet-500" />, title: 'Evolution Rush', text: `Meilleur: ${overallEvolutionRushBestStreak}` },
    { id: 'stat-clash', icon: <BarChart3 size={24} className="text-cyan-500" />, title: 'Stat Clash', text: `Serie max: ${statClashState?.bestStreak || 0}` },
    { id: 'pokedle', icon: <LayoutGrid size={24} className="text-emerald-500" />, title: 'Pokédle Daily', text: pokedleState?.status === 'won' ? '🎯 Défi Réussi !' : '🧩 Devinette active' },
    { id: 'cry-quiz', icon: <Music size={24} className="text-rose-500" />, title: 'Qui est-ce ?', text: `Record: ${cryQuizState?.highscore || 0}` },
    { id: 'combat', icon: <Activity size={24} className="text-emerald-500" />, title: 'Arène Battle', text: `${battleStats?.wins || 0} victoire${(battleStats?.wins || 0) > 1 ? 's' : ''}` }
  ];

  const DailyChallengeIcon = dailyChallenge.icon || Sparkles;
  const dailyChallengeStatusLabel = isDailyChallengeComplete ? 'Defi termine' : 'Objectif disponible';

  return (
    <Motion.div key="h" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="space-y-12 pb-20">
       <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.45fr_0.95fr]">
          <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-white bg-slate-900 shadow-2xl dark:border-slate-800 lg:rounded-[4rem]">
            <img src="/images/home_aesthetic.png" loading="lazy" className="absolute inset-0 h-full w-full object-contain transition-transform duration-1000 hover:scale-105" alt="Hero" />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/55 to-rose-950/30" />
            <div className="relative flex min-h-[320px] flex-col justify-between p-6 lg:min-h-[450px] lg:p-12">
               <h1 className="text-4xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight uppercase font-['Outfit'] italic drop-shadow-2xl">Écrivez votre <br/><span className="text-rose-500">Légende</span>.</h1>
               <div className="flex flex-wrap gap-4 mt-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.4em] text-white/90 backdrop-blur-2xl">Dashboard joueur</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.4em] text-white/70 backdrop-blur-2xl">Dernier defi : {continueMode.label}</span>
               </div>
               <p className="max-w-xl text-sm font-medium text-white/60 lg:text-base leading-relaxed">Pilotez votre progression, relancez votre dernier defi et gardez un oeil sur votre equipe sans quitter l accueil.</p>
                <div className="flex flex-wrap gap-5 lg:gap-6">
                   <button type="button" onClick={() => setActiveTab('collection')} className="rounded-2xl bg-white px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-[0_20px_40px_rgba(255,255,255,0.15)] transition-all hover:scale-105 active:scale-95 lg:px-10 lg:py-5 lg:text-xs">Explorer la collection</button>
                   <button type="button" aria-label={continueMode.cta} onClick={() => setActiveTab(continueMode.id)} className="rounded-2xl border border-white/20 bg-slate-800/20 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl backdrop-blur-2xl transition-all hover:bg-white/10 lg:px-10 lg:py-5 lg:text-xs">{continueMode.cta}</button>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                   <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/5 p-6 backdrop-blur-3xl group transition-all hover:bg-white/10">
                      <div className="relative z-10">
                         <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Favoris</div>
                         <div className="mt-2 text-3xl font-black text-white">{favorites.length}</div>
                      </div>
                      <Star size={72} strokeWidth={1} className="absolute -bottom-4 -right-4 text-white opacity-5 transition-all duration-700 group-hover:-rotate-12 group-hover:scale-110 group-hover:opacity-20" />
                   </div>
                   <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/5 p-6 backdrop-blur-3xl group transition-all hover:bg-white/10">
                      <div className="relative z-10">
                         <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Equipe</div>
                         <div className="mt-2 text-3xl font-black text-white">{team.length}/6</div>
                      </div>
                      <Shield size={72} strokeWidth={1} className="absolute -bottom-4 -right-4 text-white opacity-5 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 group-hover:opacity-20" />
                   </div>
                   <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/5 p-6 backdrop-blur-3xl group transition-all hover:bg-white/10">
                      <div className="relative z-10">
                         <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Victoires</div>
                         <div className="mt-2 text-3xl font-black text-white">{battleStats.wins}</div>
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
                <div className="grid gap-4 sm:grid-cols-2">
                    {dashboardProgressStats.map((stat) => {
                       const IconComponent = stat.Icon;
                       return (
                       <div key={stat.label} className="relative overflow-hidden rounded-3xl bg-slate-100 p-6 dark:bg-slate-800/50 group hover:shadow-2xl hover:shadow-rose-500/5 transition-all duration-500 border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                          <div className="relative z-10">
                             <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{stat.label}</div>
                             <div className={`mt-3 text-3xl font-black leading-none ${stat.tone}`}>{stat.value}</div>
                             <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 opacity-60">{stat.helper}</div>
                          </div>
                          <IconComponent size={100} strokeWidth={1} className={`absolute -bottom-6 -right-6 opacity-5 transition-all duration-700 group-hover:-translate-y-4 group-hover:scale-125 group-hover:opacity-15 ${stat.tone}`} />
                       </div>
                    )})}
                 </div>
                 <div className="rounded-[2.5rem] border border-slate-100 bg-white/40 p-8 backdrop-blur-3xl dark:border-slate-800 dark:bg-slate-900/40 shadow-sm">
                    <div className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Records a surveiller</div>
                    <div className="grid gap-4 sm:grid-cols-2">
                       <div className="rounded-2xl bg-slate-50 px-5 py-4 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Evolution Rush</div>
                          <div className="mt-1 text-2xl font-black text-violet-500">{overallEvolutionRushBestStreak}</div>
                       </div>
                       <div className="rounded-2xl bg-slate-50 px-5 py-4 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stat Clash</div>
                          <div className="mt-1 text-2xl font-black text-cyan-500">{statClashState.bestStreak}</div>
                       </div>
                    </div>
                 </div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 gap-12 xl:grid-cols-[1.15fr_0.95fr_1fr]">
           <button type="button" onClick={() => setActiveTab(continueMode.id)} aria-label={continueMode.cta} className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-10 text-left shadow-2xl shadow-rose-500/5 transition-all hover:-translate-y-2 hover:border-rose-300 dark:border-slate-800 dark:bg-slate-900 duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-amber-400/5 opacity-80" />
              <div className="relative flex h-full flex-col justify-between gap-10">
                 <div className="flex items-start justify-between gap-8">
                    <div>
                       <div className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-rose-500">Continuer l aventure</div>
                       <h3 className="text-3xl font-black uppercase tracking-tight dark:text-white leading-tight">Prochain<br/>Objectif</h3>
                       <p className="mt-4 max-w-md text-sm font-bold text-slate-400 leading-relaxed uppercase tracking-tighter italic">{continueMode.label}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5 text-rose-500 transition-all duration-700 group-hover:scale-110 group-hover:bg-rose-50 dark:bg-slate-800 outline outline-0 group-hover:outline-8 outline-rose-500/10">
                       <ContinueModeIcon size={38} />
                    </div>
                 </div>
                 <div className="flex flex-wrap gap-4">
                    <span className="rounded-xl bg-slate-900 px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-white dark:bg-white dark:text-slate-900 group-hover:bg-rose-500 transition-colors shadow-lg">{continueMode.cta}</span>
                    <span className="rounded-xl bg-slate-50 px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:bg-slate-800 dark:text-slate-500">Reprise automatique</span>
                 </div>
              </div>
           </button>
           
           <button type="button" aria-label={dailyChallenge?.cta} onClick={handleDailyChallengeAction} className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-10 text-left shadow-2xl shadow-amber-500/5 transition-all hover:-translate-y-2 hover:border-amber-300 dark:border-slate-800 dark:bg-slate-900 duration-500">
              <div className={`absolute inset-0 bg-gradient-to-br ${dailyChallenge?.accent}`} />
              <div className="relative flex h-full flex-col gap-8">
                 <div className="flex items-start justify-between gap-4">
                    <div>
                       <div className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Defi du jour</div>
                       <h3 className="text-2xl font-black uppercase tracking-tight dark:text-white leading-tight">{dailyChallenge?.title}</h3>
                       <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-60 leading-snug">{dailyChallenge?.description}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5 text-amber-500 transition-all duration-700 group-hover:scale-110 group-hover:bg-amber-50 dark:bg-slate-800 outline outline-0 group-hover:outline-8 outline-amber-500/10">
                       <DailyChallengeIcon size={34} />
                    </div>
                 </div>
                 <div className="flex items-center justify-center py-4">
                    {dailyChallenge?.visualPokemon ? (
                       <div className="relative">
                          <div className={`absolute inset-0 scale-150 rounded-full blur-3xl ${dailyChallenge?.glow} opacity-20`} />
                          <img src={dailyChallenge.visualPokemon.image} alt={dailyChallenge.visualPokemon.nom} loading="lazy" className="relative z-10 h-32 w-32 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-700 group-hover:scale-110 group-hover:rotate-6" />
                       </div>
                    ) : (
                       <div className={`relative flex h-32 w-32 items-center justify-center rounded-full ${isDailyChallengeComplete ? 'bg-emerald-500 text-white shadow-[0_20px_40px_rgba(16,185,129,0.3)]' : 'bg-slate-50 text-slate-300 dark:bg-slate-800 dark:text-slate-600 border border-slate-100 dark:border-slate-700'}`}>
                          <DailyChallengeIcon size={48} />
                          {isDailyChallengeComplete && <Sparkles size={20} className="absolute -right-1 -top-1 text-amber-200" />}
                       </div>
                    )}
                 </div>
                 <div className="rounded-[2rem] border border-slate-100 bg-slate-50/50 p-6 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-800/30">
                    <div className="flex items-center justify-between gap-4">
                       <div>
                          <div className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">{dailyChallenge?.reward}</div>
                          <div className={`mt-2 text-xs font-black uppercase tracking-[0.2em] ${isDailyChallengeComplete ? 'text-emerald-500' : 'text-slate-400'}`}>{dailyChallengeStatusLabel}</div>
                       </div>
                       <span className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] ${isDailyChallengeComplete ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-slate-300 dark:bg-slate-900 dark:text-slate-600 border border-slate-100 dark:border-slate-700'}`}>{isDailyChallengeComplete ? '1 / 1' : '0 / 1'}</span>
                    </div>
                 </div>
              </div>
           </button>
           
           <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-2xl shadow-indigo-500/5 dark:border-slate-800 dark:bg-slate-900 duration-500">
              <div className="mb-8 flex items-center justify-between gap-6">
                 <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Equipe active</div>
                    <h3 className="mt-3 text-2xl font-black uppercase tracking-tight dark:text-white leading-tight">Prete pour<br />la ligue</h3>
                 </div>
                 <button type="button" onClick={() => setActiveTab('equipe')} className="rounded-xl bg-indigo-50 px-5 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm shadow-indigo-500/10">Explorer</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                 <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Slots</div>
                    <div className="mt-2 text-3xl font-black text-indigo-500">{team.length}/6</div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-300">Pokemon equipes</div>
                 </div>
                 <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Typage</div>
                    <div className="mt-2 text-3xl font-black text-emerald-500">{teamCoverageCount}</div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-300">Points forts</div>
                 </div>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4">
                 {team.length > 0 ? team.slice(0, 6).map((p) => <button type="button" key={p.id} aria-label={`Voir ${p.nom}`} className="rounded-2xl border border-slate-50 bg-slate-50/50 p-4 text-center transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 dark:bg-slate-950 dark:border-slate-900" onClick={() => setSelectedPokemon(p)}><img src={p.image} alt={p.nom} loading="lazy" className="mx-auto h-14 w-14 object-contain transition-transform hover:scale-110 drop-shadow-md" /></button>) : <div role="status" className="col-span-3 rounded-2xl border-2 border-dashed border-slate-100 px-6 py-10 text-center text-xs font-black uppercase tracking-[0.2em] text-slate-300 dark:border-slate-800">Compose ton equipe pour debloquer un resume strategique ici.</div>}
              </div>
            </div>
         </div>

        {/* --- TIMELINE EPIQUE --- */}
        <section className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-rose-500/10 p-3 text-rose-500">
                 <Crown size={24} />
              </div>
              <div>
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Journal de Bord</div>
                 <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Timeline Epique</h3>
              </div>
           </div>
           
           <div className="relative rounded-[2.5rem] border border-slate-100 bg-white p-6 md:p-10 shadow-2xl shadow-rose-500/5 dark:border-slate-800 dark:bg-slate-900">
              {logs && logs.length > 0 ? (
                 <div className="max-h-[300px] overflow-y-auto pr-4 custom-scrollbar space-y-6">
                    {logs.slice(0, 15).map((log, index) => {
                       let Icon = Activity;
                       let color = 'text-slate-500';
                       let bg = 'bg-slate-100 dark:bg-slate-800';
                       
                       if(log.type === 'favorite') { Icon = Star; color = 'text-amber-500'; bg = 'bg-amber-500/10 border-amber-500/20'; }
                       else if(log.type === 'team_add') { Icon = Shield; color = 'text-indigo-500'; bg = 'bg-indigo-500/10 border-indigo-500/20'; }
                       else if(log.type === 'team_remove') { Icon = Shield; color = 'text-slate-400'; bg = 'bg-slate-100 dark:bg-slate-800'; }
                       else if(log.type === 'win') { Icon = Trophy; color = 'text-emerald-500'; bg = 'bg-emerald-500/10 border-emerald-500/20'; }

                       return (
                          <Motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay: index * 0.05}} key={log.id} className="relative flex gap-6">
                             <div className={`${bg} ${color} relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border shadow-sm`}>
                                <Icon size={20} />
                             </div>
                             <div className="flex-1 pb-6 relative">
                                {index !== Math.min(logs.length, 15) - 1 && <div className="absolute top-14 bottom-0 left-[-38px] w-px bg-slate-200 dark:bg-slate-800" />}
                                <h4 className="text-sm md:text-base font-black uppercase tracking-tight text-slate-900 dark:text-wrap dark:text-slate-100">{log.message}</h4>
                                <div className="mt-1 flex items-center gap-3">
                                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                             </div>
                             {log.metadata && log.metadata.image && (
                               <img src={log.metadata.image} alt="Sprite" className="h-12 w-12 object-contain bg-slate-50 dark:bg-slate-950 rounded-xl p-1 border border-slate-100 dark:border-slate-800" />
                             )}
                          </Motion.div>
                       );
                    })}
                 </div>
              ) : (
                 <div className="text-center py-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Aucun evenement recent.</p>
                 </div>
              )}
           </div>
        </section>

       <section className="space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
             <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Jeux et defis</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Tous les records a portee de clic</h3>
             </div>
             <p className="max-w-2xl text-sm font-bold text-slate-500">Sélectionne un mode d'entraînement pour tester tes connaissances, améliorer tes stratégies et inscrire ton nom dans la légende.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
             {dashboardGameCards.map((card) => (
                <QuickCard key={card.id} icon={card.icon} title={card.title} text={card.text} onClick={() => setActiveTab(card.id)} />
             ))}
          </div>
       </section>
    </Motion.div>
  );
}
