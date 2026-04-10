import React, { useState, useEffect } from 'react';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

// Import des constantes
import { TRACKED_EXPERIENCE_TABS, EVOLUTION_RUSH_DIFFICULTIES } from './constants/gameMeta';

// Import des hooks
import { usePokedexData } from './hooks/usePokedexData';
import { useDailyActivity } from './hooks/useDailyActivity';
import { useGames } from './hooks/useGames';

// Import des composants de layout & home
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/home/Dashboard';

// Import des composants communs et Pokémon
import { PokemonSkeleton } from './components/common/Cards';
import PokemonCard from './components/pokemon/PokemonCard';
import PokemonDetails from './components/pokemon/PokemonDetails';
import ComparisonModal from './components/pokemon/ComparisonModal';

// Import des jeux
import BattleArena from './components/games/BattleArena';
import EvolutionRush from './components/games/EvolutionRush';
import PokeMemory from './components/games/PokeMemory';
import PokemonGame from './components/games/PokemonGame';
import StatClash from './components/games/StatClash';
import TypeMasterQuiz from './components/games/TypeMasterQuiz';
import { TYPE_COLORS } from './constants/pokemon';

function App() {
  // --- ÉTATS UI & LAYOUT ---
  const [activeTab, setActiveTab] = useState('accueil');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('pokedexTheme') === 'dark');
  const [isDesktopViewport, setIsDesktopViewport] = useState(() => typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastPlayedTab, setLastPlayedTab] = useState(() => {
    const storedTab = localStorage.getItem('pokedexLastPlayedTab');
    return TRACKED_EXPERIENCE_TABS.includes(storedTab) ? storedTab : 'evolution-rush';
  });

  const isSidebarVisible = isDesktopViewport || isMobileMenuOpen;

  // --- HOOKS GLOBAUX ---
  const {
    pokemons, loading, 
    selectedPokemon, setSelectedPokemon, 
    comparedPokemon, setComparedPokemon,
    team, toggleTeam, teamAnalysis,
    favorites, toggleFavorite,
    searchQuery, setSearchQuery, typeFilter, setTypeFilter, 
    isFavoritesOnly, setIsFavoritesOnly, sortBy, setSortBy, page, setPage,
    filteredPokemons, suggestionPokemons, getRandomPokemon
  } = usePokedexData();

  const {
    todayKey, dailyActivity, markDailyFlag, dailyFeaturedPokemon, dailyChallenge, isDailyChallengeComplete
  } = useDailyActivity(pokemons, selectedPokemon, favorites);

  const {
    gameState, startNewGame, handleGuess,
    quizState, startNewQuiz, handleQuizAnswer,
    statClashState, startStatClashRound, handleStatClashPick,
    evolutionRushState, startEvolutionRushRound, handleEvolutionRushDifficultyChange, handleEvolutionRushSelect, handleEvolutionRushRemove, clearEvolutionRushSelection, validateEvolutionRushOrder,
    memoryState, startMemoryGame, handleMemoryClick,
    battleState, setBattleState, battleStats, startBattle, handleManualMove
  } = useGames({ pokemons, team, markDailyFlag, activeTab, setActiveTab: (tab) => setActiveTab(tab) });

  // --- EFFETS GLOBAUX UI ---
  useEffect(() => {
    localStorage.setItem('pokedexTheme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    if (!TRACKED_EXPERIENCE_TABS.includes(activeTab)) return;
    setLastPlayedTab(activeTab);
    localStorage.setItem('pokedexLastPlayedTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleViewportChange = (event) => {
      setIsDesktopViewport(event.matches);
      if (event.matches) setIsMobileMenuOpen(false);
    };
    setIsDesktopViewport(mediaQuery.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleViewportChange);
      return () => mediaQuery.removeEventListener('change', handleViewportChange);
    }
    mediaQuery.addListener(handleViewportChange);
    return () => mediaQuery.removeListener(handleViewportChange);
  }, []);

  const handleDailyChallengeAction = () => {
    switch (dailyChallenge.id) {
      case 'spotlight-view':
      case 'spotlight-favorite':
        if (dailyFeaturedPokemon) setSelectedPokemon(dailyFeaturedPokemon);
        else getRandomPokemon();
        break;
      case 'quiz-answer': setActiveTab('quiz'); break;
      case 'stat-clash-reveal': setActiveTab('stat-clash'); break;
      case 'evolution-validate': setActiveTab('evolution-rush'); break;
      default:
        if (dailyFeaturedPokemon) setSelectedPokemon(dailyFeaturedPokemon);
        else getRandomPokemon();
    }
  };

  const isCollectionView = activeTab === 'collection';
  const isTeamView = activeTab === 'equipe';
  const showBrowseControls = isCollectionView;

  const totalPages = Math.max(1, Math.ceil(filteredPokemons.length / 32));
  const currentPage = Math.min(page, totalPages);
  const paginatedPokemons = filteredPokemons.slice((currentPage - 1) * 32, currentPage * 32);
  const displayedPokemons = isTeamView ? team : paginatedPokemons;

  return (
    <div className={`min-h-screen flex transition-all duration-500 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} aria-hidden="true" className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] lg:hidden" />
        )}
      </AnimatePresence>

      <Sidebar 
        isSidebarVisible={isSidebarVisible}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        teamCount={team.length}
      />

      <main id="main-content" className={`flex-1 transition-all duration-700 min-h-screen p-4 sm:p-6 lg:p-12 ${isSidebarOpen ? 'lg:ml-80' : 'lg:ml-24'} ml-0`}>
        <Header 
          activeTab={activeTab}
          pokemonsLength={pokemons.length}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          showBrowseControls={showBrowseControls}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          suggestionPokemons={suggestionPokemons}
          setSelectedPokemon={setSelectedPokemon}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          isFavoritesOnly={isFavoritesOnly}
          setIsFavoritesOnly={setIsFavoritesOnly}
          getRandomPokemon={getRandomPokemon}
          setPage={setPage}
          isDarkMode={isDarkMode}
        />

        <AnimatePresence mode="wait">
          {activeTab === 'accueil' && (
            <Dashboard 
              setActiveTab={setActiveTab}
              lastPlayedTab={lastPlayedTab}
              favorites={favorites}
              team={team}
              battleStats={battleStats}
              pokemons={pokemons}
              evolutionRushState={evolutionRushState}
              statClashState={statClashState}
              gameState={gameState}
              quizState={quizState}
              dailyChallenge={dailyChallenge}
              handleDailyChallengeAction={handleDailyChallengeAction}
              isDailyChallengeComplete={isDailyChallengeComplete}
              todayKey={todayKey}
              setSelectedPokemon={setSelectedPokemon}
            />
          )}

          {(isCollectionView || isTeamView) && (
            <Motion.div key="c" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              {isTeamView && teamAnalysis && (
                <div className="mb-12 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-3">
                   {Object.entries(teamAnalysis).map(([type, mult]) => (
                      <div key={type} className={`p-3 rounded-2xl text-center border-2 transition-all ${mult >= 2 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 border-transparent opacity-40'}`}>
                         <div className="text-[10px] font-black uppercase tracking-widest mb-1 truncate" style={{color: TYPE_COLORS[type]}}>{type}</div>
                         <div className={`text-lg font-black ${mult >= 2 ? 'text-emerald-600' : 'text-slate-400'}`}>x{mult}</div>
                      </div>
                   ))}
                </div>
              )}
              {isTeamView && team.length === 0 ? (
                <div role="status" className="text-center py-32 bg-white dark:bg-slate-900 rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-slate-800"><Users size={80} className="mx-auto text-slate-200 dark:text-slate-800 mb-6" /><h3 className="text-3xl font-black dark:text-white">Votre équipe est vide</h3><p className="text-slate-500 mt-2 font-bold">Explorez la collection pour sélectionner 6 champions.</p></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8">
                  {loading && isCollectionView ? Array.from({ length: 8 }).map((_, i) => <PokemonSkeleton key={i} />) : displayedPokemons.map((p, i) => (
                    <PokemonCard key={p.id} pokemon={p} index={i} isDarkMode={isDarkMode} isCaught={team.some(t => t.id === p.id)} isFavorite={favorites.includes(p.id)} onClick={() => setSelectedPokemon(p)} onCatch={() => toggleTeam(p)} onToggleFavorite={() => toggleFavorite(p.id)} />
                  ))}
                </div>
              )}
              {isCollectionView && totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-8 pb-10">
                   <button type="button" aria-label="Page precedente" disabled={currentPage === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="p-5 rounded-3xl bg-white dark:bg-slate-900 shadow-xl disabled:opacity-20"><ChevronLeft/></button>
                   <span className="font-black text-2xl dark:text-white">{currentPage} / {totalPages}</span>
                   <button type="button" aria-label="Page suivante" disabled={currentPage === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="p-5 rounded-3xl bg-white dark:bg-slate-900 shadow-xl disabled:opacity-20"><ChevronRight/></button>
                </div>
              )}
            </Motion.div>
          )}

          {activeTab === 'combat' && <BattleArena state={battleState} onStart={startBattle} teamLength={team.length} pokemons={pokemons} onManualMove={handleManualMove} setBattleState={setBattleState} />}
          {activeTab === 'evolution-rush' && <EvolutionRush state={evolutionRushState} difficultyOptions={EVOLUTION_RUSH_DIFFICULTIES} currentBestStreak={evolutionRushState.bestStreaks?.[evolutionRushState.difficulty] ?? 0} onChangeDifficulty={handleEvolutionRushDifficultyChange} onSelect={handleEvolutionRushSelect} onRemove={handleEvolutionRushRemove} onClear={clearEvolutionRushSelection} onValidate={validateEvolutionRushOrder} onNext={() => startEvolutionRushRound()} onRestart={() => startEvolutionRushRound({ resetProgress: true })} isDarkMode={isDarkMode} />}
          {activeTab === 'memory' && <PokeMemory state={memoryState} onCardClick={handleMemoryClick} onRestart={startMemoryGame} />}
          {activeTab === 'quiz' && <TypeMasterQuiz state={quizState} onAnswer={handleQuizAnswer} onNext={startNewQuiz} isDarkMode={isDarkMode} />}
          {activeTab === 'jeu' && <PokemonGame gameState={gameState} onGuess={handleGuess} onNext={startNewGame} isDarkMode={isDarkMode} />}
          {activeTab === 'stat-clash' && <StatClash state={statClashState} onPick={handleStatClashPick} onNext={() => startStatClashRound()} onRestart={() => startStatClashRound(true)} isDarkMode={isDarkMode} />}
        </AnimatePresence>

        <AnimatePresence>
          {selectedPokemon && <PokemonDetails pokemon={selectedPokemon} isDarkMode={isDarkMode} pokemons={pokemons} onClose={() => setSelectedPokemon(null)} onNavigate={(p) => setSelectedPokemon(p)} onCatch={() => toggleTeam(selectedPokemon)} isCaught={team.some(t => t.id === selectedPokemon.id)} isFavorite={favorites.includes(selectedPokemon.id)} onToggleFavorite={() => toggleFavorite(selectedPokemon.id)} onCompare={() => { setComparedPokemon(selectedPokemon); setSelectedPokemon(null); }} />}
          {comparedPokemon && <ComparisonModal p1={comparedPokemon} pokemons={pokemons} isDarkMode={isDarkMode} onClose={() => setComparedPokemon(null)} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
