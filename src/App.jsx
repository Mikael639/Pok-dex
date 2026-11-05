import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

// Import des constantes
import { TRACKED_EXPERIENCE_TABS, EVOLUTION_RUSH_DIFFICULTIES, POKEMON_GENERATIONS } from './constants/gameMeta';

// Import des hooks
import { usePokedexData } from './hooks/usePokedexData';
import { useDailyActivity } from './hooks/useDailyActivity';
import { useGames } from './hooks/useGames';
import { useTrainerStats } from './hooks/useTrainerStats';
import { useActivityLog } from './hooks/useActivityLog';

// Import des composants de layout & home (gardés en statique pour le LCP)
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/home/Dashboard';
import SplashScreen from './components/common/SplashScreen';

// Import des vues Collection et Équipe
import PokemonBrowser from './components/pokemon/PokemonBrowser';
import TeamView from './components/team/TeamView';

// Composants Lazy-loadés
const PokemonDetails = lazy(() => import('./components/pokemon/PokemonDetails'));
const ComparisonModal = lazy(() => import('./components/pokemon/ComparisonModal'));
const BattleArena = lazy(() => import('./components/games/BattleArena'));
const EvolutionRush = lazy(() => import('./components/games/EvolutionRush'));
const PokeMemory = lazy(() => import('./components/games/PokeMemory'));
const PokemonGame = lazy(() => import('./components/games/PokemonGame'));
const CryQuiz = lazy(() => import('./components/games/CryQuiz'));

function App() {
  // --- ÉTATS UI & LAYOUT ---
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('pokedexActiveTab') || 'accueil');
  const [activeRegion, setActiveRegion] = useState(null); // null for none, 1-9 for gens
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('pokedexTheme') === 'dark');
  const [isDesktopViewport, setIsDesktopViewport] = useState(() => typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastPlayedTab, setLastPlayedTab] = useState(() => {
    const storedTab = localStorage.getItem('pokedexLastPlayedTab');
    return TRACKED_EXPERIENCE_TABS.includes(storedTab) ? storedTab : 'evolution-rush';
  });

  const isSidebarVisible = isDesktopViewport || isMobileMenuOpen;

  // --- LOG ACTIVITY ---
  const { logs, addLog } = useActivityLog();

  // --- HOOKS GLOBAUX ---
  const {
    pokemons, loading, 
    selectedPokemon, setSelectedPokemon, 
    comparedPokemon, setComparedPokemon,
    team, toggleTeam,
    favorites, toggleFavorite,
    searchQuery, setSearchQuery, typeFilter, setTypeFilter, 
    isFavoritesOnly, setIsFavoritesOnly, sortBy, setSortBy, page, setPage,
    filteredPokemons, suggestionPokemons, getRandomPokemon
  } = usePokedexData({ addLog });

  const {
    markDailyFlag, dailyFeaturedPokemon, dailyChallenge, isDailyChallengeComplete
  } = useDailyActivity(pokemons, selectedPokemon, favorites);

  const {
    gameState, startNewGame, handleGuess,
    evolutionRushState, startEvolutionRushRound, handleEvolutionRushDifficultyChange, handleEvolutionRushSelect, handleEvolutionRushRemove, clearEvolutionRushSelection, validateEvolutionRushOrder,
    memoryState, startMemoryGame, handleMemoryClick,
    battleState, setBattleState, battleStats, startBattle, handleManualMove,
    cryQuizState, startCryQuiz, handleCryAnswer
  } = useGames({ pokemons, team, markDailyFlag, activeTab, setActiveTab: (tab) => setActiveTab(tab), addLog });

  const trainerStats = useTrainerStats({ 
    team: team || [], 
    favorites: favorites || [], 
    battleStats: battleStats || {}, 
    gameState: gameState || {}, 
    cryQuizState: cryQuizState || {} 
  });

  // --- EFFETS GLOBAUX UI ---
  useEffect(() => {
    localStorage.setItem('pokedexTheme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('pokedexActiveTab', activeTab);
    if (!TRACKED_EXPERIENCE_TABS.includes(activeTab)) return;
    setLastPlayedTab(activeTab);
    localStorage.setItem('pokedexLastPlayedTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (!isDesktopViewport) {
      setIsMobileMenuOpen(false);
    }
  }, [activeTab, isDesktopViewport]);

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
      case 'evolution-validate': setActiveTab('evolution-rush'); break;
      default:
        if (dailyFeaturedPokemon) setSelectedPokemon(dailyFeaturedPokemon);
        else getRandomPokemon();
    }
  };

  const isCollectionView = activeTab === 'collection';
  const isTeamView = activeTab === 'equipe';
  const showBrowseControls = isCollectionView;

  const regionalFilteredPokemons = useMemo(() => {
    const list = filteredPokemons || [];
    if (!activeRegion) return list;
    const gen = (POKEMON_GENERATIONS || []).find(g => g.gen === activeRegion);
    if (!gen) return list;
    return list.filter(p => p.id >= gen.start && p.id <= gen.end);
  }, [filteredPokemons, activeRegion]);


  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </AnimatePresence>
      <div className={`min-h-screen flex transition-all duration-500 app-backdrop ${isDarkMode ? 'dark text-slate-100' : 'text-slate-900'}`}>
      
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
        teamCount={team?.length || 0}
      />

      <main id="main-content" className={`flex h-dvh min-w-0 flex-1 flex-col overflow-hidden p-3 transition-all duration-700 sm:p-5 lg:px-10 lg:py-6 ${isSidebarOpen ? 'lg:ml-80' : 'lg:ml-24'} ml-0`}>
        <Header 
          activeTab={activeTab}
          pokemonsLength={pokemons?.length || 0}
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
          trainerStats={trainerStats}
          activeRegion={activeRegion}
          setActiveRegion={setActiveRegion}
        />

        {/* Zone de contenu : chaque page remplit la hauteur restante (défilement interne uniquement en secours) */}
        <div id="page-content" className="relative min-h-0 flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          <Suspense fallback={<div className="flex h-full min-h-[40vh] w-full items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" /></div>}>
            {activeTab === 'accueil' && (
              <Dashboard 
                setActiveTab={setActiveTab}
                lastPlayedTab={lastPlayedTab}
                favorites={favorites}
                team={team}
                battleStats={battleStats}
                pokemons={pokemons}
                evolutionRushState={evolutionRushState}
                gameState={gameState}
                dailyChallenge={dailyChallenge}
                handleDailyChallengeAction={handleDailyChallengeAction}
                isDailyChallengeComplete={isDailyChallengeComplete}
                setSelectedPokemon={setSelectedPokemon}
                cryQuizState={cryQuizState}
                logs={logs}
              />
            )}

            {isCollectionView && (
              <Motion.div key="collection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <PokemonBrowser
                  pokemons={regionalFilteredPokemons}
                  loading={loading}
                  page={page}
                  setPage={setPage}
                  team={team || []}
                  favorites={favorites || []}
                  isDarkMode={isDarkMode}
                  onSelect={setSelectedPokemon}
                  onCatch={toggleTeam}
                  onToggleFavorite={toggleFavorite}
                />
              </Motion.div>
            )}

            {isTeamView && (
              <Motion.div key="team" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TeamView
                  team={team || []}
                  favorites={favorites || []}
                  isDarkMode={isDarkMode}
                  onSelect={setSelectedPokemon}
                  onCatch={toggleTeam}
                  onToggleFavorite={toggleFavorite}
                />
              </Motion.div>
            )}

            {activeTab === 'combat' && <BattleArena state={battleState} onStart={startBattle} teamLength={team.length} pokemons={pokemons} onManualMove={handleManualMove} setBattleState={setBattleState} />}
            {activeTab === 'evolution-rush' && <EvolutionRush state={evolutionRushState} difficultyOptions={EVOLUTION_RUSH_DIFFICULTIES} currentBestStreak={evolutionRushState.bestStreaks?.[evolutionRushState.difficulty] ?? 0} onChangeDifficulty={handleEvolutionRushDifficultyChange} onSelect={handleEvolutionRushSelect} onRemove={handleEvolutionRushRemove} onClear={clearEvolutionRushSelection} onValidate={validateEvolutionRushOrder} onNext={() => startEvolutionRushRound()} onRestart={() => startEvolutionRushRound({ resetProgress: true })} isDarkMode={isDarkMode} />}
            {activeTab === 'memory' && <PokeMemory state={memoryState} onCardClick={handleMemoryClick} onRestart={startMemoryGame} />}
            {activeTab === 'jeu' && <PokemonGame gameState={gameState} onGuess={handleGuess} onNext={startNewGame} isDarkMode={isDarkMode} />}
            {activeTab === 'cry-quiz' && <CryQuiz state={cryQuizState} onAnswer={handleCryAnswer} onNext={startCryQuiz} />}
          </Suspense>
        </AnimatePresence>
        </div>

        <AnimatePresence>
          <Suspense fallback={null}>
            {selectedPokemon && <PokemonDetails pokemon={selectedPokemon} isDarkMode={isDarkMode} pokemons={pokemons || []} onClose={() => setSelectedPokemon(null)} onNavigate={(p) => setSelectedPokemon(p)} onCatch={() => toggleTeam(selectedPokemon)} isCaught={(team || []).some(t => t.id === selectedPokemon.id)} isFavorite={(favorites || []).includes(selectedPokemon.id)} onToggleFavorite={() => toggleFavorite(selectedPokemon.id)} onCompare={() => { setComparedPokemon(selectedPokemon); setSelectedPokemon(null); }} />}
            {comparedPokemon && <ComparisonModal p1={comparedPokemon} pokemons={pokemons || []} isDarkMode={isDarkMode} onClose={() => setComparedPokemon(null)} />}
          </Suspense>
        </AnimatePresence>
      </main>
    </div>
    </>
  );
}

export default App;
