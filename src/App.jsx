import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Menu, X, Archive, Home, Activity, 
  Shuffle, Moon, Sun, Users, ChevronRight, ChevronLeft, 
  Trophy, Filter, Zap, Heart, Sparkles, Brain, Gamepad2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import des constantes
import { TYPE_COLORS, TYPE_CHART } from './constants/pokemon';

// Import des composants communs
import CustomDropdown from './components/common/CustomDropdown';
import { QuickCard, PokemonSkeleton } from './components/common/Cards';

// Import des composants Pokémon
import PokemonCard from './components/pokemon/PokemonCard';
import PokemonDetails from './components/pokemon/PokemonDetails';
import ComparisonModal from './components/pokemon/ComparisonModal';

// Import des composants Jeux
import BattleArena from './components/games/BattleArena';
import PokeMemory from './components/games/PokeMemory';
import PokemonGame from './components/games/PokemonGame';
import TypeMasterQuiz from './components/games/TypeMasterQuiz';

/**
 * Composant Principal de l'Application Pokédex.
 * Gère l'état global (Pokémon, équipe, favoris, thèmes) et la navigation.
 */
function App() {
  // --- ÉTATS GLOBAUX ---
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [comparedPokemon, setComparedPokemon] = useState(null);
  const [team, setTeam] = useState(() => JSON.parse(localStorage.getItem('pokedexTeam') || '[]'));
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('pokedexTheme') === 'dark');
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('pokedexFavorites') || '[]'));
  
  // --- ÉTATS DE NAVIGATION & RECHERCHE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('Tous');
  const [isFavoritesOnly, setIsFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState('id');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [shareMsg, setShareMsg] = useState('');
  const [activeTab, setActiveTab] = useState('accueil');
  const [page, setPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // --- ÉTATS DES JEUX ---
  const [battleStats, setBattleStats] = useState(() => JSON.parse(localStorage.getItem('pokedexBattleStats') || '{"wins": 0, "losses": 0}'));
  const [memoryState, setMemoryState] = useState({
    cards: [], flipped: [], solved: [], moves: 0, startTime: null, endTime: null
  });
  const [gameState, setGameState] = useState({
    target: null, choices: [], status: 'playing', score: 0, streak: 0, bestStreak: 0, 
    selectedId: null, timeLeft: 10, timerRunning: false,
    highscore: parseInt(localStorage.getItem('silhouetteHighscore') || '0')
  });
  const [battleState, setBattleState] = useState({
    playerTeam: [], enemyTeam: [], logs: [], turn: 0, winner: null, 
    isFighting: false, playerActive: 0, enemyActive: 0, attackAnim: null, 
    mode: 'menu', currentTurn: 'player'
  });
  const [quizState, setQuizState] = useState({
    typeA: '', typeB: '', options: [0, 0.5, 1, 2], status: 'idle', 
    score: 0, streak: 0, feedback: null, survivalMode: false, lives: 3,
    highscore: parseInt(localStorage.getItem('quizHighscore') || '0')
  });

  // --- PERSISTANCE DES DONNÉES (Effects) ---
  useEffect(() => {
    localStorage.setItem('pokedexBattleStats', JSON.stringify(battleStats));
  }, [battleStats]);

  useEffect(() => {
    localStorage.setItem('pokedexTeam', JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    localStorage.setItem('pokedexTheme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('pokedexFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Chargement initial des données depuis le fichier JSON local
  useEffect(() => {
    fetch('/pokedex.json')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.pokemons)) setPokemons(data.pokemons);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur de chargement des Pokémon:", err);
        setLoading(false);
      });
  }, []);

  // --- GESTIONNAIRES D'ACTIONS (Handlers) ---

  const toggleTeam = (p) => {
    if (team.find(pt => pt.id === p.id)) {
      setTeam(team.filter(pt => pt.id !== p.id));
    } else if (team.length < 6) {
      setTeam([...team, p]);
    }
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const getRandomPokemon = () => {
    if (pokemons.length > 0) {
      setSelectedPokemon(pokemons[Math.floor(Math.random() * pokemons.length)]);
    }
  };

  // --- LOGIQUE JEU : SILHOUETTE ---
  const startNewGame = () => {
    if (pokemons.length > 0) {
      const target = pokemons[Math.floor(Math.random() * pokemons.length)];
      const choices = [target];
      while (choices.length < 4) {
        const c = pokemons[Math.floor(Math.random() * pokemons.length)];
        if (!choices.find(p => p.id === c.id)) choices.push(c);
      }
      setGameState(prev => ({
        ...prev, target, choices: choices.sort(() => Math.random() - 0.5),
        status: 'playing', selectedId: null, timeLeft: 10, timerRunning: true
      }));
    }
  };

  const handleGuess = (id) => {
    const isCorrect = id === gameState.target.id;
    const newScore = isCorrect ? gameState.score + 10 + gameState.timeLeft : gameState.score;
    const newHigh = Math.max(newScore, gameState.highscore);
    localStorage.setItem('silhouetteHighscore', newHigh);
    setGameState(prev => ({
      ...prev, status: 'revealed', selectedId: id, timerRunning: false,
      score: newScore, highscore: newHigh
    }));
  };

  useEffect(() => {
    if (!gameState.timerRunning || gameState.status !== 'playing') return;
    if (gameState.timeLeft <= 0) { handleGuess(-1); return; }
    const t = setTimeout(() => setGameState(p => ({ ...p, timeLeft: p.timeLeft - 1 })), 1000);
    return () => clearTimeout(t);
  }, [gameState.timeLeft, gameState.timerRunning, gameState.status]);

  // --- LOGIQUE JEU : QUIZ ---
  const startNewQuiz = () => {
    const types = Object.keys(TYPE_CHART);
    const t1 = types[Math.floor(Math.random() * types.length)];
    const t2 = types[Math.floor(Math.random() * types.length)];
    setQuizState(prev => ({ ...prev, typeA: t1, typeB: t2, status: 'playing', feedback: null }));
  };

  const handleQuizAnswer = (multiplier) => {
    const actualMultiplier = (TYPE_CHART[quizState.typeA] && TYPE_CHART[quizState.typeA][quizState.typeB]) ?? 1;
    const isCorrect = multiplier === actualMultiplier;
    const newScore = isCorrect ? quizState.score + 15 : quizState.score;
    const newHigh = Math.max(newScore, quizState.highscore);
    localStorage.setItem('quizHighscore', newHigh);
    setQuizState(prev => ({
      ...prev, status: 'revealed',
      feedback: isCorrect ? 'Correct !' : `Faux, c'était x${actualMultiplier}`,
      score: newScore, lives: (!isCorrect && quizState.survivalMode) ? quizState.lives - 1 : quizState.lives,
      highscore: newHigh
    }));
  };

  // --- LOGIQUE JEU : MEMORY ---
  const startMemoryGame = () => {
    if (pokemons.length < 6) return;
    const shuffled = [...pokemons].sort(() => 0.5 - Math.random());
    const subset = shuffled.slice(0, 6);
    const cards = [];
    subset.forEach((p) => {
      cards.push({ ...p, uniqueId: `mem-${p.id}-a` });
      cards.push({ ...p, uniqueId: `mem-${p.id}-b` });
    });
    setMemoryState({
      cards: cards.sort(() => 0.5 - Math.random()),
      flipped: [], solved: [], moves: 0, startTime: Date.now(), endTime: null
    });
    setActiveTab('memory');
  };

  const handleMemoryClick = (index) => {
    if (memoryState.flipped.length === 2 || memoryState.solved.includes(index) || memoryState.flipped.includes(index)) return;
    const newFlipped = [...memoryState.flipped, index];
    setMemoryState(s => ({ ...s, flipped: newFlipped }));
    if (newFlipped.length === 2) {
      setMemoryState(s => ({ ...s, moves: s.moves + 1 }));
      const [i1, i2] = newFlipped;
      if (memoryState.cards[i1].id === memoryState.cards[i2].id) {
        const newSolved = [...memoryState.solved, i1, i2];
        setTimeout(() => {
          setMemoryState(s => ({ ...s, solved: newSolved, flipped: [] }));
          if (newSolved.length === memoryState.cards.length) setMemoryState(s => ({ ...s, endTime: Date.now() }));
        }, 600);
      } else {
        setTimeout(() => setMemoryState(s => ({ ...s, flipped: [] })), 1200);
      }
    }
  };

  // --- LOGIQUE JEU : ARÈNE DE COMBAT ---
  const startBattle = (mode = 'ia') => {
    if (team.length < 6) return;
    const playerTeam = team.map(p => ({ ...p, currentHP: 100 }));
    if (mode === 'ia' || mode === 'auto') {
      const enemyTeam = Array.from({ length: 6 }).map(() => ({
        ...pokemons[Math.floor(Math.random() * pokemons.length)], currentHP: 100
      }));
      setBattleState({
        playerTeam, enemyTeam, logs: ['Préparez-vous au combat !'], turn: 0, 
        winner: null, isFighting: true, playerActive: 0, enemyActive: 0,
        mode: mode, currentTurn: 'player'
      });
    } else if (mode === 'pvp') {
      setBattleState(s => ({ ...s, playerTeam, mode: 'selection', enemyTeam: [] }));
    }
  };

  const handleManualMove = (moveType) => {
    if (!battleState.isFighting || battleState.winner) return;
    const { playerTeam, enemyTeam, playerActive, enemyActive, currentTurn, logs, mode } = battleState;
    const isPlayerTurn = currentTurn === 'player';
    const attacker = isPlayerTurn ? playerTeam[playerActive] : enemyTeam[enemyActive];
    const defender = isPlayerTurn ? enemyTeam[enemyActive] : playerTeam[playerActive];
    const typeMult = (TYPE_CHART[attacker.types[0].nom] && TYPE_CHART[attacker.types[0].nom][defender.types[0].nom]) ?? 1;
    const damage = Math.floor((attacker.base.Attack / defender.base.Defense) * (moveType === 'special' ? 40 : 25) * typeMult);
    const newHP = Math.max(0, defender.currentHP - damage);
    const newLogs = [`${attacker.nom} utilise ${moveType.toUpperCase()} ! -${damage} HP`, ...logs.slice(0, 4)];
    
    if (isPlayerTurn) {
        const nextEnemyTeam = [...enemyTeam]; nextEnemyTeam[enemyActive].currentHP = newHP;
        if (newHP <= 0) {
            newLogs.unshift(`${defender.nom} est K.O. !`);
            if (enemyActive + 1 >= 6) {
                setBattleStats(p => ({ ...p, wins: p.wins+1 }));
                setBattleState(s => ({ ...s, enemyTeam: nextEnemyTeam, winner: 'Joueur 1', isFighting: false, logs: ['VICTOIRE !'] }));
            } else setBattleState(s => ({ ...s, enemyTeam: nextEnemyTeam, enemyActive: enemyActive+1, currentTurn: mode==='pvp'?'enemy':'ia_move', logs: newLogs }));
        } else setBattleState(s => ({ ...s, enemyTeam: nextEnemyTeam, currentTurn: mode==='pvp'?'enemy':'ia_move', logs: newLogs }));
    } else {
        const nextPlayerTeam = [...playerTeam]; nextPlayerTeam[playerActive].currentHP = newHP;
        if (newHP <= 0) {
            newLogs.unshift(`${defender.nom} est K.O. !`);
            if (playerActive + 1 >= 6) {
                setBattleStats(p => ({ ...p, losses: p.losses+1 }));
                setBattleState(s => ({ ...s, playerTeam: nextPlayerTeam, winner: mode==='pvp'?'Joueur 2':'Ordinateur', isFighting: false, logs: ['DÉFAITE...'] }));
            } else setBattleState(s => ({ ...s, playerTeam: nextPlayerTeam, playerActive: playerActive+1, currentTurn: 'player', logs: newLogs }));
        } else setBattleState(s => ({ ...s, playerTeam: nextPlayerTeam, currentTurn: 'player', logs: newLogs }));
    }
  };

  useEffect(() => {
    let timer;
    if (battleState.isFighting && !battleState.winner) {
      if (battleState.mode === 'auto') timer = setTimeout(() => handleManualMove('normal'), 1200);
      else if (battleState.mode === 'ia' && battleState.currentTurn === 'ia_move') timer = setTimeout(() => handleManualMove('normal'), 1000);
    }
    return () => clearTimeout(timer);
  }, [battleState]);

  useEffect(() => {
    if (pokemons.length > 0) {
      if (activeTab === 'jeu' && !gameState.target) startNewGame();
      if (activeTab === 'quiz' && !quizState.typeA) startNewQuiz();
      if (activeTab === 'memory' && memoryState.cards.length === 0) startMemoryGame();
    }
  }, [activeTab, pokemons.length]);

  // --- LOGIQUE FILTRAGE & TRI ---
  const filteredPokemons = useMemo(() => {
    let list = pokemons.filter(p =>
      (p.nom.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toString() === searchQuery) &&
      (typeFilter === 'Tous' || p.types.some(t => t.nom === typeFilter)) &&
      (!isFavoritesOnly || favorites.includes(p.id))
    );
    if (sortBy === 'nom') list = [...list].sort((a,b) => a.nom.localeCompare(b.nom));
    else if (sortBy === 'hp') list = [...list].sort((a,b) => (b.base?.HP || 0) - (a.base?.HP || 0));
    else if (sortBy === 'attack') list = [...list].sort((a,b) => (b.base?.Attack || 0) - (a.base?.Attack || 0));
    else if (sortBy === 'speed') list = [...list].sort((a,b) => (b.base?.Speed || 0) - (a.base?.Speed || 0));
    else list = [...list].sort((a,b) => a.id - b.id);
    return list;
  }, [pokemons, searchQuery, typeFilter, sortBy, isFavoritesOnly, favorites]);

  // Analyse des types de l'équipe pour les forces/faiblesses cumulées
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

  const totalPages = Math.ceil(filteredPokemons.length / 32);
  const paginatedPokemons = filteredPokemons.slice((page - 1) * 32, page * 32);

  return (
    <div className={`min-h-screen flex transition-all duration-500 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* SIDEBAR OVERLAY FOR MOBILE */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] lg:hidden" />
        )}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 left-0 z-[70] transition-all duration-700 transform border-r-[6px] flex flex-col ${isSidebarOpen ? 'w-80' : 'w-24'} ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 shadow-2xl text-slate-900'}`}>
        <div className="p-5 flex items-center justify-between lg:justify-start gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-rose-500 p-3 rounded-[1.5rem] shadow-xl shadow-rose-500/20 rotate-3"><Zap className="text-white h-8 w-8" /></div>
            {(isSidebarOpen || isMobileMenuOpen) && <span className="font-black text-3xl tracking-tighter uppercase">Poké-Master</span>}
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-rose-500"><X size={24} /></button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto custom-scrollbar">
            {[
              { id: 'accueil', icon: Home, label: 'Tableau de Bord' },
              { id: 'collection', icon: Archive, label: 'Archives 1025' },
              { id: 'equipe', icon: Users, label: 'Mon Équipe', count: team.length },
              { id: 'combat', icon: Activity, label: 'Arène Battle' },
              { id: 'memory', icon: Brain, label: 'Poké-Memory' },
              { id: 'quiz', icon: Trophy, label: 'Master Type' },
              { id: 'jeu', icon: Gamepad2, label: 'Silhouette' }
            ].map((item) => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-[1.5rem] font-black transition-all duration-300 relative group ${activeTab === item.id ? 'bg-rose-500 text-white shadow-2xl shadow-rose-500/40 scale-[1.02]' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
                <item.icon size={22} className={activeTab === item.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                {(isSidebarOpen || isMobileMenuOpen) && <span className="tracking-tight uppercase text-xs">{item.label}</span>}
                {item.count !== undefined && (isSidebarOpen || isMobileMenuOpen) && <span className={`ml-auto px-2 py-0.5 rounded-lg text-[10px] font-black ${activeTab === item.id ? 'bg-white text-rose-500' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>{item.count}/6</span>}
              </button>
            ))}
          </nav>

        <div className="mt-auto p-4 space-y-2">
           <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center gap-3">
              {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>} {(isSidebarOpen || isMobileMenuOpen) && <span className="text-sm font-bold">Thème</span>}
           </button>
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:flex w-full p-4 rounded-2xl bg-rose-100 dark:bg-slate-800 text-rose-500 items-center justify-center gap-3">
              {isSidebarOpen ? <ChevronLeft size={20}/> : <ChevronRight size={20}/>}
           </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-700 min-h-screen p-6 lg:p-12 ${isSidebarOpen ? 'lg:ml-80' : 'lg:ml-24'} ml-0`}>
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-16">
          <div className="flex items-center justify-between lg:block">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter">{activeTab === 'accueil' ? 'Bienvenue, Champion' : activeTab.toUpperCase()}</h2>
              <p className="text-slate-500 text-[10px] lg:text-xs font-bold uppercase tracking-widest mt-1 opacity-70">Gens 1 à 9 • {pokemons.length} espèces</p>
            </div>
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-2 border-slate-100 dark:border-slate-800"><Menu size={24} /></button>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {activeTab !== 'accueil' && (
              <>
                <CustomDropdown isDarkMode={isDarkMode} icon={Filter} label="Type" value={typeFilter} onChange={(v) => { setTypeFilter(v); setPage(1); }} typeColors={TYPE_COLORS} options={[{ value: 'Tous', label: 'Tous les Types' }, ...Object.keys(TYPE_COLORS).map(t => ({ value: t, label: t }))]} />
                <button onClick={() => setIsFavoritesOnly(!isFavoritesOnly)} className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-black transition-all shadow-xl border-2 ${isFavoritesOnly ? 'bg-rose-500 text-white border-rose-500' : 'bg-white dark:bg-slate-900 border-transparent text-slate-400'}`}><Heart size={18} fill={isFavoritesOnly ? "currentColor" : "none"} /><span className="uppercase tracking-widest hidden md:inline">Favoris</span></button>
                <CustomDropdown isDarkMode={isDarkMode} icon={Activity} label="Trier" value={sortBy} onChange={(v) => { setSortBy(v); setPage(1); }} options={[{ value: 'id', label: 'N° Pokédex' }, { value: 'nom', label: 'Nom (A-Z)' }, { value: 'hp', label: 'Points de Vie' }, { value: 'attack', label: 'Attaque' }, { value: 'speed', label: 'Vitesse' }]} />
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Rechercher..." onFocus={() => setShowSuggestions(true)} className="bg-white dark:bg-slate-900 border-none rounded-[2rem] pl-14 pr-12 py-3 text-sm font-bold shadow-xl w-48 lg:w-64 focus:ring-4 ring-rose-500/20" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); setShowSuggestions(true); }} />
                  <AnimatePresence>
                    {showSuggestions && searchQuery.length >= 2 && (
                      <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:10}} className={`absolute top-full right-0 mt-3 w-72 rounded-[2.5rem] shadow-2xl border-2 overflow-hidden z-50 backdrop-blur-2xl ${isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-100'}`}>
                         <div className="p-2 space-y-1">
                            {pokemons.filter(p => p.nom.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5).map(p => (
                               <button key={p.id} onClick={() => { setSelectedPokemon(p); setShowSuggestions(false); setSearchQuery(''); }} className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-50'}`}>
                                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl"><img src={p.image} className="w-8 h-8 object-contain" /></div>
                                  <div className="text-left"><div className="text-xs font-black uppercase tracking-tight">{p.nom}</div><div className="text-[8px] font-bold text-slate-500">#{p.id.toString().padStart(3, '0')}</div></div>
                               </button>
                            ))}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
            <button onClick={getRandomPokemon} className="p-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"><Shuffle size={20} /></button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'accueil' && (
            <motion.div key="h" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="space-y-12 pb-20">
               <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2 relative rounded-[2.5rem] lg:rounded-[4rem] overflow-hidden group shadow-2xl h-[300px] lg:h-[450px] bg-slate-900 border-4 border-white dark:border-slate-800">
                    <img src="/images/home_aesthetic.png" className="absolute inset-0 w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105" alt="Hero" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="relative h-full flex flex-col justify-end p-6 lg:p-12 space-y-4 lg:space-y-6">
                       <h1 className="text-3xl lg:text-6xl font-black text-white leading-none tracking-tighter uppercase font-inter italic">Écrivez votre <br/><span className="text-rose-500">Légende</span>.</h1>
                       <div className="flex gap-3 lg:gap-4">
                          <button onClick={() => setActiveTab('collection')} className="bg-white text-slate-950 px-5 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-sm shadow-2xl hover:bg-rose-500 hover:text-white transition-all uppercase tracking-widest">Voir Index</button>
                          <button onClick={() => setActiveTab('combat')} className="bg-slate-800/40 backdrop-blur-xl border border-white/20 text-white px-5 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-sm shadow-2xl hover:bg-white hover:text-slate-900 transition-all uppercase tracking-widest">Combat</button>
                       </div>
                    </div>
                  </div>
                  <div className="glass-card rounded-[2.5rem] lg:rounded-[4rem] p-6 lg:p-10 flex flex-col justify-between relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 lg:p-8 opacity-10 group-hover:rotate-12 transition-transform"><Zap size={80} className="lg:size-[120px] text-rose-500" /></div>
                     <div>
                        <span className="text-rose-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2 lg:mb-4 block">Profil Certifié</span>
                        <h2 className="text-2xl lg:text-4xl font-black tracking-tighter leading-none mb-1 lg:mb-2 uppercase">Maître <br/> Pokémon</h2>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest opacity-70">Ligue de Johto • Rang S</p>
                     </div>
                     <div className="space-y-6 relative z-10">
                        <div>
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2"><span>Collection</span><span>{Math.round((pokemons.length/1025)*100)}%</span></div>
                           <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <motion.div initial={{width: 0}} animate={{width: `${(pokemons.length/1025)*100}%`}} className="h-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-3xl text-center"><div className="text-xl font-black leading-none">{pokemons.length}</div><div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">Vus</div></div>
                           <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-3xl text-center"><div className="text-xl font-black leading-none">{team.length}</div><div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">Équipe</div></div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div onClick={getRandomPokemon} className="holographic glass-card rounded-[3.5rem] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-[1.02] transition-all group border-2 border-transparent hover:border-amber-400/30">
                     <Sparkles className="text-amber-400 mb-6 group-hover:animate-spin-slow" size={40} />
                     <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Découverte Royale</h3>
                     <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Un spécimen rare vous attend</p>
                     {pokemons.length > 0 && <div className="relative"><div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full scale-150 animate-pulse" /><img src={pokemons[Math.floor((new Date()).getDate() % pokemons.length)]?.image} className="w-32 h-32 object-contain drop-shadow-2xl relative z-10 group-hover:rotate-12 transition-transform duration-500" /></div>}
                     <div className="mt-8 text-amber-500 text-[10px] font-black uppercase tracking-widest translate-x-0 group-hover:translate-x-2 transition-transform">Voir la fiche complète →</div>
                  </div>
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-white dark:bg-slate-900 border-4 border-transparent hover:border-indigo-500/20 p-8 rounded-[3.5rem] shadow-xl transition-all relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-black uppercase tracking-tighter">Équipe de Choc</h3><span className="px-4 py-1 bg-indigo-500 text-white rounded-full text-[10px] font-black">{team.length}/6</span></div>
                        <div className="grid grid-cols-3 gap-3">
                           {team.length > 0 ? team.map(p => <div key={p.id} className="relative bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl text-center border-2 border-transparent hover:border-indigo-500 transition-all cursor-pointer" onClick={() => setSelectedPokemon(p)}><img src={p.image} className="w-12 h-12 mx-auto object-contain hover:scale-110 transition-transform" /></div>) : <div className="col-span-3 py-6 text-center opacity-30 italic font-black text-xs uppercase tracking-widest">Équipe vide...</div>}
                        </div>
                     </div>
                     <div className="grid grid-cols-1 gap-4">
                        <QuickCard icon={<Trophy size={24} className="text-amber-500" />} title="Master Type" text={`Record: ${quizState.highscore}`} onClick={() => setActiveTab('quiz')} />
                        <QuickCard icon={<Gamepad2 size={24} className="text-indigo-500" />} title="Silhouette" text={`Record: ${gameState.highscore}`} onClick={() => setActiveTab('jeu')} />
                        <QuickCard icon={<Activity size={24} className="text-emerald-500" />} title="Arène Battle" text="Défiez la ligue" onClick={() => setActiveTab('combat')} />
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {['collection', 'equipe'].includes(activeTab) && (
            <motion.div key="c" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              {activeTab === 'equipe' && teamAnalysis && (
                <div className="mb-12 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-3">
                   {Object.entries(teamAnalysis).map(([type, mult]) => (
                      <div key={type} className={`p-3 rounded-2xl text-center border-2 transition-all ${mult >= 2 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 border-transparent opacity-40'}`}>
                         <div className="text-[10px] font-black uppercase tracking-widest mb-1 truncate" style={{color: TYPE_COLORS[type]}}>{type}</div>
                         <div className={`text-lg font-black ${mult >= 2 ? 'text-emerald-600' : 'text-slate-400'}`}>x{mult}</div>
                      </div>
                   ))}
                </div>
              )}
              {activeTab === 'equipe' && team.length === 0 ? (
                <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-slate-800"><Users size={80} className="mx-auto text-slate-200 dark:text-slate-800 mb-6" /><h3 className="text-3xl font-black dark:text-white">Votre équipe est vide</h3><p className="text-slate-500 mt-2 font-bold">Explorez la collection pour sélectionner 6 champions.</p></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8">
                  {loading ? Array.from({ length: 8 }).map((_, i) => <PokemonSkeleton key={i} />) : paginatedPokemons.map((p, i) => (
                    <PokemonCard key={p.id} pokemon={p} index={i} isDarkMode={isDarkMode} isCaught={team.some(t => t.id === p.id)} isFavorite={favorites.includes(p.id)} onClick={() => setSelectedPokemon(p)} onCatch={() => toggleTeam(p)} onToggleFavorite={() => toggleFavorite(p.id)} />
                  ))}
                </div>
              )}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-8 pb-10">
                   <button disabled={page === 1} onClick={() => setPage(p => p-1)} className="p-5 rounded-3xl bg-white dark:bg-slate-900 shadow-xl disabled:opacity-20"><ChevronLeft/></button>
                   <span className="font-black text-2xl dark:text-white">{page} / {totalPages}</span>
                   <button disabled={page === totalPages} onClick={() => setPage(p => p+1)} className="p-5 rounded-3xl bg-white dark:bg-slate-900 shadow-xl disabled:opacity-20"><ChevronRight/></button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'combat' && <BattleArena state={battleState} onStart={startBattle} isDarkMode={isDarkMode} teamLength={team.length} pokemons={filteredPokemons} onManualMove={handleManualMove} setBattleState={setBattleState} />}
          {activeTab === 'memory' && <PokeMemory state={memoryState} onCardClick={handleMemoryClick} onRestart={startMemoryGame} isDarkMode={isDarkMode} />}
          {activeTab === 'quiz' && <TypeMasterQuiz state={quizState} onAnswer={handleQuizAnswer} onNext={startNewQuiz} isDarkMode={isDarkMode} />}
          {activeTab === 'jeu' && <PokemonGame gameState={gameState} onGuess={handleGuess} onNext={startNewGame} isDarkMode={isDarkMode} />}
        </AnimatePresence>

        <AnimatePresence>
          {selectedPokemon && <PokemonDetails pokemon={selectedPokemon} isDarkMode={isDarkMode} pokemons={pokemons} onClose={() => setSelectedPokemon(null)} onNavigate={(p) => setSelectedPokemon(p)} onCatch={() => toggleTeam(selectedPokemon)} isCaught={team.some(t => t.id === selectedPokemon.id)} isFavorite={favorites.includes(selectedPokemon.id)} onToggleFavorite={() => toggleFavorite(selectedPokemon.id)} onCompare={(p) => { setComparedPokemon(p); setSelectedPokemon(null); }} />}
          {comparedPokemon && <ComparisonModal p1={comparedPokemon} p2={pokemons[Math.floor(Math.random() * pokemons.length)]} isDarkMode={isDarkMode} onClose={() => setComparedPokemon(null)} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
