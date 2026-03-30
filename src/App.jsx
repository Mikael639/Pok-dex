import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Search, Menu, X, Archive, Home, Disc, Music, Activity, 
  Shuffle, Moon, Sun, Users, ChevronRight, ChevronLeft, 
  Info, Circle, Gamepad2, Trophy, Filter, ChevronDown, 
  Zap, Heart, Shield, Sword, Flame, Waves, Leaf, Sparkles,
  Tornado, Mountain, Bug, Ghost, Star, Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG & CONSTANTS ---
const API_BASE = 'http://127.0.0.1:8080'; 

const TYPE_COLORS = {
  'Normal': '#A8A77A', 'Feu': '#EE8130', 'Eau': '#6390F0', 'Electrique': '#F7D02C',
  'Plante': '#7AC74C', 'Glace': '#96D9D6', 'Combat': '#C22E28', 'Poison': '#A33EA1',
  'Sol': '#E2BF65', 'Vol': '#A98FF3', 'Psy': '#F95587', 'Insecte': '#A6B91A',
  'Roche': '#B6A136', 'Spectre': '#735797', 'Dragon': '#6F35FC', 'Ténèbres': '#705746',
  'Acier': '#B7B7CE', 'Fée': '#D685AD'
};

const CustomDropdown = ({ options, value, onChange, icon: Icon, label, isDarkMode, typeColors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || label;

  return (
    <div className="relative z-20">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-black transition-all shadow-xl border-2 ${
          isOpen ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-transparent'
        } ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
      >
        <Icon size={18} className={isOpen ? 'text-rose-500' : 'text-slate-400'} />
        <span className="uppercase tracking-widest">{selectedLabel}</span>
        <ChevronDown size={16} className={`ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180 text-rose-500' : 'text-slate-400'}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 5, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`absolute top-full left-0 mt-2 w-64 rounded-[2rem] shadow-2xl border-2 overflow-hidden z-20 backdrop-blur-xl ${
                isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'
              }`}
            >
              <div className="max-h-80 overflow-y-auto p-2 custom-scrollbar">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                    className={`w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                      value === opt.value 
                        ? 'bg-rose-500 text-white shadow-lg' 
                        : isDarkMode ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {typeColors && typeColors[opt.value] && (
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: typeColors[opt.value] }} />
                    )}
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const TYPE_CHART = {
  'Normal': { 'Roche': 0.5, 'Spectre': 0, 'Acier': 0.5 },
  'Feu': { 'Feu': 0.5, 'Eau': 0.5, 'Plante': 2, 'Glace': 2, 'Insecte': 2, 'Roche': 0.5, 'Dragon': 0.5, 'Acier': 2 },
  'Eau': { 'Feu': 2, 'Eau': 0.5, 'Plante': 0.5, 'Sol': 2, 'Roche': 2, 'Dragon': 0.5 },
  'Electrique': { 'Eau': 2, 'Electrique': 0.5, 'Plante': 0.5, 'Sol': 0, 'Vol': 2, 'Dragon': 0.5 },
  'Plante': { 'Feu': 0.5, 'Eau': 2, 'Plante': 0.5, 'Poison': 0.5, 'Sol': 2, 'Vol': 0.5, 'Insecte': 0.5, 'Roche': 2, 'Dragon': 0.5, 'Acier': 0.5 },
  'Glace': { 'Feu': 0.5, 'Eau': 0.5, 'Plante': 2, 'Glace': 0.5, 'Sol': 2, 'Vol': 2, 'Dragon': 2, 'Acier': 0.5 },
  'Combat': { 'Normal': 2, 'Glace': 2, 'Poison': 0.5, 'Vol': 0.5, 'Psy': 0.5, 'Insecte': 0.5, 'Roche': 2, 'Spectre': 0, 'Ténèbres': 2, 'Acier': 2, 'Fée': 0.5 },
  'Poison': { 'Plante': 2, 'Poison': 0.5, 'Sol': 0.5, 'Roche': 0.5, 'Spectre': 0.5, 'Acier': 0, 'Fée': 2 },
  'Sol': { 'Feu': 2, 'Electrique': 2, 'Plante': 0.5, 'Poison': 2, 'Vol': 0, 'Insecte': 0.5, 'Roche': 2, 'Acier': 2 },
  'Vol': { 'Electrique': 0.5, 'Plante': 2, 'Combat': 2, 'Insecte': 2, 'Roche': 0.5, 'Acier': 0.5 },
  'Psy': { 'Combat': 2, 'Poison': 2, 'Psy': 0.5, 'Ténèbres': 0, 'Acier': 0.5 },
  'Insecte': { 'Feu': 0.5, 'Plante': 2, 'Combat': 0.5, 'Poison': 0.5, 'Vol': 0.5, 'Psy': 2, 'Spectre': 0.5, 'Ténèbres': 2, 'Acier': 0.5, 'Fée': 0.5 },
  'Roche': { 'Feu': 2, 'Glace': 2, 'Combat': 0.5, 'Sol': 0.5, 'Vol': 2, 'Insecte': 2, 'Acier': 0.5 },
  'Spectre': { 'Normal': 0, 'Psy': 2, 'Spectre': 2, 'Ténèbres': 0.5 },
  'Dragon': { 'Dragon': 2, 'Acier': 0.5, 'Fée': 0 },
  'Ténèbres': { 'Combat': 0.5, 'Psy': 2, 'Spectre': 2, 'Ténèbres': 0.5, 'Fée': 0.5 },
  'Acier': { 'Feu': 0.5, 'Eau': 0.5, 'Electrique': 0.5, 'Glace': 2, 'Roche': 2, 'Acier': 0.5, 'Fée': 2 },
  'Fée': { 'Feu': 0.5, 'Combat': 2, 'Poison': 0.5, 'Dragon': 2, 'Ténèbres': 2, 'Acier': 0.5 }
};

// --- MAIN APP COMPONENT ---
function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [comparedPokemon, setComparedPokemon] = useState(null);
  const [team, setTeam] = useState(() => JSON.parse(localStorage.getItem('pokedexTeam') || '[]'));
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('pokedexTheme') === 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('Tous');
  const [sortBy, setSortBy] = useState('id');
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('accueil');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio('/pokemon.mp3'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [shareMsg, setShareMsg] = useState('');

  // --- JEUX STATES ---
  const [gameState, setGameState] = useState({
    target: null, choices: [], status: 'playing', score: 0,
    streak: 0, bestStreak: 0, selectedId: null,
    timeLeft: 10, timerRunning: false,
    highscore: parseInt(localStorage.getItem('silhouetteHighscore') || '0')
  });

  const [battleState, setBattleState] = useState({
    playerTeam: [], enemyTeam: [], logs: [], turn: 0,
    winner: null, isFighting: false, playerActive: 0, enemyActive: 0,
    attackAnim: null
  });

  const [quizState, setQuizState] = useState({
    typeA: '', typeB: '', options: [0, 0.5, 1, 2],
    status: 'idle', score: 0, streak: 0, feedback: null,
    survivalMode: false, lives: 3,
    highscore: parseInt(localStorage.getItem('quizHighscore') || '0')
  });

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem('pokedexTeam', JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    localStorage.setItem('pokedexTheme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    console.log("Fetching from:", `${API_BASE}/pokemons`);
    axios.get(`${API_BASE}/pokemons`).then(res => {
      console.log("Data received:", res.data ? res.data.length : 'null');
      if (Array.isArray(res.data)) {
        setPokemons(res.data);
      } else {
        console.error("Data is not an array:", res.data);
      }
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching pokemons:", err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    audio.loop = true;
    return () => audio.pause();
  }, [audio]);

  // --- HANDLERS ---
  const toggleMusic = () => {
    if (isPlaying) audio.pause();
    else audio.play().catch(e => console.log("Autoplay blocked"));
    setIsPlaying(!isPlaying);
  };

  const toggleTeam = (p) => {
    if (team.find(pt => pt.id === p.id)) {
      setTeam(team.filter(pt => pt.id !== p.id));
    } else if (team.length < 6) {
      setTeam([...team, p]);
    }
  };

  const getRandomPokemon = () => {
    if (pokemons.length > 0) {
      setSelectedPokemon(pokemons[Math.floor(Math.random() * pokemons.length)]);
    }
  };

  // --- GAME LOGIC: SILHOUETTE ---
  const startNewGame = () => {
    if (pokemons.length === 0) return;
    const target = pokemons[Math.floor(Math.random() * pokemons.length)];
    const choices = [target];
    let attempts = 0;
    while (choices.length < 4 && attempts < 100) {
      attempts++;
      const c = pokemons[Math.floor(Math.random() * pokemons.length)];
      if (c && !choices.find(p => p.id === c.id)) choices.push(c);
    }
    setGameState(prev => ({
      ...prev, target, choices: choices.sort(() => Math.random() - 0.5),
      status: 'playing', selectedId: null, timeLeft: 10, timerRunning: true
    }));
  };

  const handleGuess = (id) => {
    const isCorrect = id === gameState.target.id;
    const newStreak = isCorrect ? gameState.streak + 1 : 0;
    const newBest = Math.max(newStreak, gameState.bestStreak);
    const newScore = isCorrect ? gameState.score + 10 + gameState.timeLeft : gameState.score;
    const newHigh = Math.max(newScore, gameState.highscore);
    localStorage.setItem('silhouetteHighscore', newHigh);
    setGameState(prev => ({
      ...prev, status: 'revealed', selectedId: id, timerRunning: false,
      score: newScore, streak: newStreak, bestStreak: newBest, highscore: newHigh
    }));
  };

  // Timer silhouette
  useEffect(() => {
    if (!gameState.timerRunning || gameState.status !== 'playing') return;
    if (gameState.timeLeft <= 0) { handleGuess(-1); return; }
    const t = setTimeout(() => setGameState(p => ({ ...p, timeLeft: p.timeLeft - 1 })), 1000);
    return () => clearTimeout(t);
  }, [gameState.timeLeft, gameState.timerRunning, gameState.status]);

  // --- GAME LOGIC: QUIZ ---
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
    const newLives = (!isCorrect && quizState.survivalMode) ? quizState.lives - 1 : quizState.lives;
    const newHigh = Math.max(newScore, quizState.highscore);
    localStorage.setItem('quizHighscore', newHigh);
    setQuizState(prev => ({
      ...prev, status: 'revealed',
      feedback: isCorrect ? 'Correct !' : `Faux, c'était x${actualMultiplier}`,
      score: newScore, streak: isCorrect ? prev.streak + 1 : 0,
      lives: newLives, highscore: newHigh
    }));
  };

  // --- TEAM SHARE ---
  const shareTeam = () => {
    if (team.length === 0) return;
    const txt = '🏆 Mon équipe Pokémon:\n' + team.map((p, i) => `${i+1}. ${p.nom} (${p.types.map(t=>t.nom).join('/')})`).join('\n');
    navigator.clipboard.writeText(txt).then(() => {
      setShareMsg('Copié !'); setTimeout(() => setShareMsg(''), 2000);
    });
  };

  // --- GAME LOGIC: BATTLE ---
  const startBattle = () => {
    if (team.length < 6) return;
    const playerTeam = team.map(p => ({ ...p, currentHP: 100 }));
    const enemyTeam = Array.from({ length: 6 }).map(() => ({
      ...pokemons[Math.floor(Math.random() * pokemons.length)], currentHP: 100
    }));
    setBattleState({
      playerTeam, enemyTeam, logs: ['Le combat commence !'], turn: 0, 
      winner: null, isFighting: true, playerActive: 0, enemyActive: 0
    });
  };

  const nextTurn = () => {
    const { playerTeam, enemyTeam, playerActive, enemyActive, logs, turn } = battleState;
    if (battleState.winner) return;

    const attacker = turn % 2 === 0 ? playerTeam[playerActive] : enemyTeam[enemyActive];
    const defender = turn % 2 === 0 ? enemyTeam[enemyActive] : playerTeam[playerActive];
    
    const attackerTypes = attacker.types.map(t => t.nom);
    const defenderTypes = defender.types.map(t => t.nom);
    
    // Simplification: on prend le premier type pour le multiplicateur de base
    const typeMult = (TYPE_CHART[attackerTypes[0]] && TYPE_CHART[attackerTypes[0]][defenderTypes[0]]) ?? 1;
    const damage = Math.floor((attacker.base.Attack / defender.base.Defense) * 25 * typeMult);
    
    const newDefenderHP = Math.max(0, defender.currentHP - damage);
    const newLogs = [`${attacker.nom} utilise une attaque ! -${damage} HP`, ...logs.slice(0, 4)];
    
    if (turn % 2 === 0) {
      const newEnemyTeam = [...enemyTeam];
      newEnemyTeam[enemyActive].currentHP = newDefenderHP;
      if (newDefenderHP <= 0) {
        newLogs.unshift(`${defender.nom} est K.O. !`);
        if (enemyActive + 1 >= 6) {
          setBattleState(s => ({ ...s, enemyTeam: newEnemyTeam, winner: 'player', isFighting: false, logs: ['VICTOIRE !', ...newLogs] }));
          return;
        }
        setBattleState(s => ({ ...s, enemyTeam: newEnemyTeam, enemyActive: s.enemyActive + 1, turn: s.turn + 1, logs: newLogs }));
      } else {
        setBattleState(s => ({ ...s, enemyTeam: newEnemyTeam, turn: s.turn + 1, logs: newLogs }));
      }
    } else {
      const newPlayerTeam = [...playerTeam];
      newPlayerTeam[playerActive].currentHP = newDefenderHP;
      if (newDefenderHP <= 0) {
        newLogs.unshift(`${defender.nom} est K.O. !`);
        if (playerActive + 1 >= 6) {
          setBattleState(s => ({ ...s, playerTeam: newPlayerTeam, winner: 'enemy', isFighting: false, logs: ['DÉFAITE...', ...newLogs] }));
          return;
        }
        setBattleState(s => ({ ...s, playerTeam: newPlayerTeam, playerActive: s.playerActive + 1, turn: s.turn + 1, logs: newLogs }));
      } else {
        setBattleState(s => ({ ...s, playerTeam: newPlayerTeam, turn: s.turn + 1, logs: newLogs }));
      }
    }
  };

  useEffect(() => {
    let timer;
    if (battleState.isFighting && !battleState.winner) {
      timer = setTimeout(nextTurn, 1200);
    }
    return () => clearTimeout(timer);
  }, [battleState]);

  useEffect(() => {
    if (pokemons.length > 0) {
      if (activeTab === 'jeu' && !gameState.target) startNewGame();
      if (activeTab === 'quiz' && !quizState.typeA) startNewQuiz();
    }
  }, [activeTab, pokemons.length]);

  // --- RENDER HELPERS ---
  const filteredPokemons = useMemo(() => {
    let list = pokemons.filter(p =>
      (p.nom.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toString() === searchQuery) &&
      (typeFilter === 'Tous' || p.types.some(t => t.nom === typeFilter))
    );
    if (sortBy === 'nom') list = [...list].sort((a, b) => a.nom.localeCompare(b.nom));
    else if (sortBy === 'hp') list = [...list].sort((a, b) => (b.base?.HP || 0) - (a.base?.HP || 0));
    else if (sortBy === 'attack') list = [...list].sort((a, b) => (b.base?.Attack || 0) - (a.base?.Attack || 0));
    else if (sortBy === 'speed') list = [...list].sort((a, b) => (b.base?.Speed || 0) - (a.base?.Speed || 0));
    else list = [...list].sort((a, b) => a.id - b.id);
    return list;
  }, [pokemons, searchQuery, typeFilter, sortBy]);

  // Analyse équipe : couverture types
  const teamAnalysis = useMemo(() => {
    if (team.length === 0) return null;
    const allTypes = Object.keys(TYPE_COLORS);
    const covered = {};
    allTypes.forEach(defType => {
      let best = 1;
      team.forEach(p => {
        p.types.forEach(atkType => {
          const mult = (TYPE_CHART[atkType.nom] && TYPE_CHART[atkType.nom][defType]) ?? 1;
          if (mult > best) best = mult;
        });
      });
      covered[defType] = best;
    });
    return covered;
  }, [team]);

  const totalPages = Math.ceil(filteredPokemons.length / 12);
  const paginatedPokemons = filteredPokemons.slice((page - 1) * 12, page * 12);

  return (
    <div className={`min-h-screen flex transition-all duration-500 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 transition-all duration-700 transform border-r-[6px] flex flex-col ${isSidebarOpen ? 'w-80' : 'w-24'} ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 shadow-2xl text-slate-900'}`}>
        <div className="p-5 flex items-center gap-4">
          <div className="bg-rose-500 p-3 rounded-[1.5rem] shadow-xl shadow-rose-500/20 rotate-3">
             <Zap className="text-white h-8 w-8" />
          </div>
          {isSidebarOpen && <span className="font-black text-3xl tracking-tighter uppercase">Poké-Master</span>}
        </div>

        <nav className="p-4 space-y-1">
            {[
              { id: 'accueil', icon: Home, label: 'Tableau de Bord' },
              { id: 'collection', icon: Archive, label: 'Archives 386' },
              { id: 'equipe', icon: Users, label: 'Mon Équipe', count: team.length },
              { id: 'combat', icon: Activity, label: 'Arène Battle' },
              { id: 'quiz', icon: Trophy, label: 'Master Type' },
              { id: 'jeu', icon: Gamepad2, label: 'Silhouette' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-[1.5rem] font-black transition-all duration-300 relative group ${
                  activeTab === item.id 
                    ? 'bg-rose-500 text-white shadow-2xl shadow-rose-500/40 scale-[1.02]' 
                    : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon size={22} className={activeTab === item.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                {isSidebarOpen && <span className="tracking-tight uppercase text-xs">{item.label}</span>}
                {item.count !== undefined && isSidebarOpen && (
                   <span className={`ml-auto px-2 py-0.5 rounded-lg text-[10px] font-black ${activeTab === item.id ? 'bg-white text-rose-500' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                      {item.count}/6
                   </span>
                )}
              </button>
            ))}
          </nav>

        <div className="mt-auto p-4 space-y-2">
           <button onClick={toggleMusic} className={`w-full p-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 ${isPlaying ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              <Music size={20} /> {isSidebarOpen && <span className="text-sm font-bold">{isPlaying ? 'On' : 'Musique'}</span>}
           </button>
           <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center gap-3">
              {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>} {isSidebarOpen && <span className="text-sm font-bold">Thème</span>}
           </button>
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full p-4 rounded-2xl bg-rose-100 dark:bg-slate-800 text-rose-500 flex items-center justify-center gap-3">
              {isSidebarOpen ? <ChevronLeft size={20}/> : <ChevronRight size={20}/>}
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 transition-all duration-700 min-h-screen p-12 ${isSidebarOpen ? 'ml-80' : 'ml-24'}`}>
        {/* HEADER */}
        <header className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter">
              {activeTab === 'accueil' ? 'Bienvenue, Champion' : activeTab.toUpperCase()}
            </h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1 opacity-70">Kanto, Johto & Hoenn • {pokemons.length} espèces</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {activeTab !== 'accueil' && (
              <>
                <CustomDropdown 
                  isDarkMode={isDarkMode}
                  icon={Filter}
                  label="Type"
                  value={typeFilter}
                  onChange={(v) => { setTypeFilter(v); setPage(1); }}
                  typeColors={TYPE_COLORS}
                  options={[
                    { value: 'Tous', label: 'Tous les Types' },
                    ...Object.keys(TYPE_COLORS).map(t => ({ value: t, label: t }))
                  ]}
                />

                <CustomDropdown 
                  isDarkMode={isDarkMode}
                  icon={Activity}
                  label="Trier"
                  value={sortBy}
                  onChange={(v) => { setSortBy(v); setPage(1); }}
                  options={[
                    { value: 'id', label: 'N° Pokédex' },
                    { value: 'nom', label: 'Nom (A-Z)' },
                    { value: 'hp', label: 'Points de Vie' },
                    { value: 'attack', label: 'Attaque' },
                    { value: 'speed', label: 'Vitesse' }
                  ]}
                />

                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" placeholder="Rechercher..." 
                    className="bg-white dark:bg-slate-900 border-none rounded-[2rem] pl-14 pr-8 py-3 text-sm font-bold shadow-xl w-48 lg:w-64 focus:ring-4 ring-rose-500/20"
                    value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  />
                </div>
              </>
            )}

            <button onClick={getRandomPokemon} className="p-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all">
              <Shuffle size={20} />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'accueil' && (
            <motion.div key="h" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="space-y-12 pb-20">
               {/* HERO SECTION */}
               <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2 relative rounded-[4rem] overflow-hidden group shadow-2xl h-[450px] bg-slate-900 border-4 border-white dark:border-slate-800">
                    <img src="/images/home_aesthetic.png" className="absolute inset-0 w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105" alt="Hero" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="relative h-full flex flex-col justify-end p-12 space-y-6">
                       <h1 className="text-6xl font-black text-white leading-none tracking-tighter">ÉCRIVEZ VOTRE <br/><span className="text-rose-500">LÉGENDE</span>.</h1>
                       <div className="flex gap-4">
                          <button onClick={() => setActiveTab('collection')} className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black text-sm shadow-2xl hover:bg-rose-500 hover:text-white transition-all uppercase tracking-widest">Voir Index</button>
                          <button onClick={() => setActiveTab('combat')} className="bg-slate-800/40 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-2xl hover:bg-white hover:text-slate-900 transition-all uppercase tracking-widest">Combat</button>
                       </div>
                    </div>
                  </div>

                  {/* TRAINER CARD */}
                  <div className="glass-card rounded-[4rem] p-10 flex flex-col justify-between relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                        <Zap size={120} className="text-rose-500" />
                     </div>
                     <div>
                        <span className="text-rose-500 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Profil Certifié</span>
                        <h2 className="text-4xl font-black tracking-tighter leading-none mb-2">Maître <br/> Pokémon</h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Ligue de Johto • Rang S</p>
                     </div>
                     
                     <div className="space-y-6 relative z-10">
                        <div>
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                              <span>Collection</span>
                              <span>{Math.round((pokemons.length/1025)*100)}%</span>
                           </div>
                           <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <motion.div initial={{width: 0}} animate={{width: `${(pokemons.length/1025)*100}%`}} className="h-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-3xl text-center">
                              <div className="text-xl font-black leading-none">{pokemons.length}</div>
                              <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">Vus</div>
                           </div>
                           <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-3xl text-center">
                              <div className="text-xl font-black leading-none">{team.length}</div>
                              <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">Équipe</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* DISCOVERY CARD (HOLOGRAPHIC) */}
                  <div 
                    onClick={getRandomPokemon}
                    className="holographic glass-card rounded-[3.5rem] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-[1.02] transition-all group border-2 border-transparent hover:border-amber-400/30"
                  >
                     <Sparkles className="text-amber-400 mb-6 group-hover:animate-spin-slow" size={40} />
                     <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Découverte Royale</h3>
                     <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Un spécimen rare vous attend</p>
                     
                     {pokemons.length > 0 && (
                        <div className="relative">
                           <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
                           <img 
                              src={pokemons[Math.floor((new Date()).getDate() % pokemons.length)]?.image} 
                              className="w-32 h-32 object-contain drop-shadow-2xl relative z-10 group-hover:rotate-12 transition-transform duration-500" 
                           />
                        </div>
                     )}
                     <div className="mt-8 text-amber-500 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">Voir la fiche complète →</div>
                  </div>

                  {/* QUICK STATS & ACTIONS */}
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-white dark:bg-slate-900 border-4 border-transparent hover:border-indigo-500/20 p-8 rounded-[3.5rem] shadow-xl transition-all relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="text-xl font-black uppercase tracking-tighter">Équipe de Choc</h3>
                           <span className="px-4 py-1 bg-indigo-500 text-white rounded-full text-[10px] font-black">{team.length}/6</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                           {team.length > 0 ? team.map(p => (
                              <div key={p.id} className="relative bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl text-center border-2 border-transparent hover:border-indigo-500 transition-all cursor-pointer" onClick={() => setSelectedPokemon(p)}>
                                 <img src={p.image} className="w-12 h-12 mx-auto object-contain hover:scale-110 transition-transform" />
                              </div>
                           )) : (
                              <div className="col-span-3 py-6 text-center opacity-30 italic font-black text-xs uppercase tracking-widest">Équipe vide...</div>
                           )}
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
              {activeTab === 'equipe' && (
                <div className="mb-12 flex justify-between items-center bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl">
                   <div>
                      <h3 className="text-2xl font-black mb-1">Analyse Tactique</h3>
                      <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Couverture offensive de l'équipe</p>
                   </div>
                   <div className="flex gap-4">
                      <button onClick={shareTeam} className="px-6 py-3 bg-indigo-500 text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 transition-all">
                        <Shuffle size={18} /> {shareMsg || 'PARTAGER'}
                      </button>
                   </div>
                </div>
              )}

              {activeTab === 'equipe' && teamAnalysis && (
                <div className="mb-12 grid grid-cols-2 md:grid-cols-6 lg:grid-cols-9 gap-3">
                   {Object.entries(teamAnalysis).map(([type, mult]) => (
                      <div key={type} className={`p-3 rounded-2xl text-center border-2 transition-all ${mult >= 2 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 border-transparent opacity-40'}`}>
                         <div className="text-[10px] font-black uppercase tracking-widest mb-1 truncate" style={{color: TYPE_COLORS[type]}}>{type}</div>
                         <div className={`text-lg font-black ${mult >= 2 ? 'text-emerald-600' : 'text-slate-400'}`}>x{mult}</div>
                      </div>
                   ))}
                </div>
              )}

              {activeTab === 'equipe' && team.length === 0 ? (
                <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
                   <Users size={80} className="mx-auto text-slate-200 dark:text-slate-800 mb-6" />
                   <h3 className="text-3xl font-black dark:text-white">Votre équipe est vide</h3>
                   <p className="text-slate-500 mt-2 font-bold">Explorez la collection pour sélectionner 6 champions.</p>
                </div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8"
                >
                   {(activeTab === 'equipe' ? team : paginatedPokemons).map((p, i) => (
                      <PokemonCard key={p.id} pokemon={p} isCaught={team.some(t => t.id === p.id)} isDarkMode={isDarkMode} onCatch={() => toggleTeam(p)} onClick={() => setSelectedPokemon(p)} index={i} />
                   ))}
                </motion.div>
              )}
              {activeTab === 'collection' && totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-8 pb-10">
                   <button disabled={page === 1} onClick={() => setPage(p => p-1)} className="p-5 rounded-3xl bg-white dark:bg-slate-900 shadow-xl disabled:opacity-20"><ChevronLeft/></button>
                   <span className="font-black text-2xl dark:text-white">{page} / {totalPages}</span>
                   <button disabled={page === totalPages} onClick={() => setPage(p => p+1)} className="p-5 rounded-3xl bg-white dark:bg-slate-900 shadow-xl disabled:opacity-20"><ChevronRight/></button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'combat' && <BattleArena state={battleState} onStart={startBattle} isDarkMode={isDarkMode} teamLength={team.length} />}
          {activeTab === 'quiz' && <TypeMasterQuiz state={quizState} onAnswer={handleQuizAnswer} onNext={startNewQuiz} isDarkMode={isDarkMode} />}
          {activeTab === 'jeu' && <PokemonGame gameState={gameState} onGuess={handleGuess} onNext={startNewGame} isDarkMode={isDarkMode} />}
        </AnimatePresence>

        <AnimatePresence>
          {selectedPokemon && (
            <PokemonDetails 
              pokemon={selectedPokemon} 
              isDarkMode={isDarkMode} 
              pokemons={pokemons}
              onClose={() => setSelectedPokemon(null)} 
              onNavigate={(p) => setSelectedPokemon(p)}
              onCatch={() => toggleTeam(selectedPokemon)} 
              isCaught={team.some(t => t.id === selectedPokemon.id)} 
              onCompare={(p) => { setComparedPokemon(p); setSelectedPokemon(null); }}
            />
          )}

          {comparedPokemon && (
            <ComparisonModal 
              p1={comparedPokemon} 
              p2={pokemons[Math.floor(Math.random() * pokemons.length)]} 
              isDarkMode={isDarkMode} 
              onClose={() => setComparedPokemon(null)} 
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function QuickCard({ icon, title, text, onClick }) {
  return (
    <div onClick={onClick} className="p-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border-4 border-transparent hover:border-rose-500 transition-all cursor-pointer group">
       <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl inline-block mb-6 group-hover:scale-110 transition-transform">{icon}</div>
       <h4 className="text-2xl font-black dark:text-white mb-2">{title}</h4>
       <p className="text-slate-500 font-bold text-sm tracking-tight">{text}</p>
    </div>
  );
}

function PokemonCard({ pokemon, isCaught, isDarkMode, onClick, onCatch, index = 0 }) {
  const color = (pokemon.types && pokemon.types[0] && TYPE_COLORS[pokemon.types[0].nom]) || '#94A3B8';
  return (
    <motion.div
      layout
      initial={{opacity:0, scale:0.85, y:20}}
      animate={{opacity:1, scale:1, y:0}}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.175, 0.885, 0.32, 1.275] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`card-shimmer relative p-8 rounded-[3rem] shadow-2xl border-4 transition-all cursor-pointer group ${isCaught ? 'card-caught' : ''} ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-white text-slate-900'}`}
      onClick={onClick}
    >
       <div className="absolute top-5 right-5 z-20 flex flex-col gap-2">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); onCatch(); }}
            className={`p-3 rounded-full transition-all shadow-md ${isCaught ? 'bg-rose-500 text-white' : 'bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
             <Heart size={22} fill={isCaught ? 'white' : 'none'} />
          </motion.button>
       </div>
       <div className="relative mb-8 mt-4 h-48 flex items-center justify-center">
          {/* Aura glow pulsing behind sprite */}
          <div
            className="pokemon-aura absolute inset-0 blur-3xl rounded-full"
            style={{ backgroundColor: color, opacity: 0.4 }}
          />
          {/* Floating Pokémon sprite */}
          <img
            src={pokemon.image}
            alt={pokemon.nom}
            className="pokemon-float-img w-48 h-48 object-contain relative z-10 drop-shadow-2xl mx-auto"
          />
       </div>
        <div className="mt-4">
           <h3 className="text-3xl font-black capitalize tracking-tighter mb-4">{pokemon.nom}</h3>
          <div className="flex gap-2">
             {pokemon.types.map(t => (
                <span key={t.nom} className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg" style={{backgroundColor: TYPE_COLORS[t.nom] || '#94A3B8'}}>{t.nom}</span>
             ))}
          </div>
       </div>
    </motion.div>
  );
}

function PokemonDetails({ pokemon, isDarkMode, pokemons, onClose, onNavigate, onCatch, isCaught, onCompare }) {
  const [isShiny, setIsShiny] = useState(false);
  const [evoChain, setEvoChain] = useState([]);
  const [loadingEvo, setLoadingEvo] = useState(false);
  const [playCry] = useState(() => new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemon.id}.ogg`));

  const imageUrl = isShiny 
    ? pokemon.image.replace('official-artwork', 'official-artwork/shiny')
    : pokemon.image;

  useEffect(() => {
    setLoadingEvo(true);
    const fetchEvo = async () => {
      try {
        const speciesRes = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`);
        const evoRes = await axios.get(speciesRes.data.evolution_chain.url);
        
        const chain = [];
        let curr = evoRes.data.chain;

        const getTriggerLabel = (details) => {
          if (!details) return null;
          const d = details[0];
          if (!d) return null;
          if (d.trigger.name === 'level-up') {
            if (d.min_level) return `Niv. ${d.min_level}`;
            if (d.min_happiness) return `Bonheur`;
            if (d.known_move) return `Capacité`;
            return `Niveau`;
          }
          if (d.trigger.name === 'use-item') return d.item.name.replace('-', ' ');
          if (d.trigger.name === 'trade') return `Échange`;
          return d.trigger.name;
        };

        const processNode = async (node) => {
          const id = parseInt(node.species.url.split('/').filter(Boolean).pop());
          // On cherche le nom français dans notre liste locale si possible
          const localP = pokemons.find(p => p.id === id);
          chain.push({
            id,
            nom: localP ? localP.nom : node.species.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            condition: getTriggerLabel(node.evolution_details)
          });
          if (node.evolves_to.length > 0) {
            await processNode(node.evolves_to[0]); // On prend la ligne principale
          }
        };

        await processNode(curr);
        setEvoChain(chain);
      } catch (err) {
        console.error("Evo fetch error:", err);
      } finally {
        setLoadingEvo(false);
      }
    };
    fetchEvo();
  }, [pokemon.id, pokemons]);

  const weaknesses = useMemo(() => {
    const list = {};
    Object.keys(TYPE_CHART).forEach(type => {
      let mult = 1;
      pokemon.types.forEach(pType => {
        mult *= (TYPE_CHART[type] && TYPE_CHART[type][pType.nom]) ?? 1;
      });
      if (mult !== 1) list[type] = mult;
    });
    return list;
  }, [pokemon]);

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
       <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl" onClick={onClose} />
       <motion.div initial={{scale:0.9, y:50}} animate={{scale:1, y:0}} exit={{scale:0.9, y:50}} className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
          {/* CLOSE Button - Smaller and properly positioned in the corner */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-50 p-2.5 bg-black/20 hover:bg-black/40 dark:bg-white/10 dark:hover:bg-white/20 rounded-full text-slate-800 dark:text-white backdrop-blur-xl transition-all hover:scale-110 active:scale-95 shadow-lg border border-transparent hover:border-white/20"
            aria-label="Fermer"
          >
            <X size={20} className="mix-blend-difference" />
          </button>
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center items-center relative overflow-hidden flex-shrink-0" style={{background: `linear-gradient(135deg, ${TYPE_COLORS[pokemon.types[0].nom]} 0%, #000 150%)`}}>
             <div className="absolute inset-0 bg-black/10 z-0" />
             <motion.img 
               key={imageUrl}
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               src={imageUrl} 
               className="w-36 h-36 md:w-48 md:h-48 object-contain z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform duration-700" 
               alt={pokemon.nom} 
             />
             <div className="mt-4 text-center text-white z-10 drop-shadow-xl">
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-1">{pokemon.nom}</h2>
                <div className="flex gap-2 justify-center mb-3">
                   {pokemon.types.map(t => <span key={t.nom} className="px-4 py-1 bg-white/20 backdrop-blur-xl rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-sm">{t.nom}</span>)}
                </div>
                <div className="flex gap-3 justify-center">
                   <button onClick={() => setIsShiny(!isShiny)} className={`p-2.5 rounded-xl backdrop-blur-xl transition-all shadow-md ${isShiny ? 'bg-amber-400 text-slate-900' : 'bg-white/10 hover:bg-white/20'}`}>
                      <Sparkles size={18} />
                   </button>
                   <button onClick={() => playCry.play().catch(e=>console.log(e))} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-xl transition-all shadow-md">
                      <Music size={18} />
                   </button>
                </div>
             </div>
          </div>
          <div className="md:w-1/2 p-5 pt-10 md:p-8 md:pt-12 lg:p-10 lg:pt-14 overflow-y-auto flex-1 custom-scrollbar">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-4">
                <h3 className="text-base lg:text-lg font-black uppercase tracking-widest">Statistiques</h3>
                <div className="flex gap-2">
                   <button onClick={() => onCompare(pokemon)} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all shadow-lg">
                      <Shuffle size={20} />
                   </button>
                   <button onClick={onCatch} className={`flex items-center gap-2 px-6 py-3 rounded-2xl md:rounded-3xl font-black transition-all shadow-lg ${isCaught ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                      <Heart size={20} fill={isCaught ? 'white' : 'none'} /> <span className="text-sm md:text-base">{isCaught ? 'LIBÉRER' : 'CAPTURER'}</span>
                   </button>
                </div>
             </div>
             <div className="space-y-3 lg:space-y-4">
                {Object.entries(pokemon.base).map(([key, val]) => (
                   <div key={key}>
                      <div className="flex justify-between mb-1">
                         <span className="font-black text-slate-400 uppercase text-[9px] md:text-[10px] tracking-widest">{key}</span>
                         <span className="font-black text-base md:text-lg">{val}</span>
                      </div>
                      <div className="h-2 md:h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                         <motion.div initial={{width:0}} animate={{width:`${Math.min(100, (val/150)*100)}%` || 0}} className="h-full rounded-full" style={{backgroundColor: TYPE_COLORS[pokemon.types[0].nom]}} />
                      </div>
                   </div>
                ))}
             </div>

             {/* EFFICACITÉ SUBIE */}
             <div className="mt-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Efficacité subie</h4>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(weaknesses).sort((a,b) => b[1] - a[1]).map(([t, m]) => (
                       <div key={t} className={`px-2 py-1 rounded-lg text-[9px] font-black flex items-center gap-1.5 shadow-sm ${m > 1 ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                          <span>{t}</span>
                          <span className="bg-white/50 dark:bg-black/20 px-1 py-0.5 rounded text-[8px]">x{m}</span>
                       </div>
                    ))}
                </div>
             </div>

             {/* LIGNÉE ÉVOLUTIVE */}
             <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Lignée Évolutive</h4>
                {loadingEvo ? (
                  <div className="flex gap-4 animate-pulse">
                    {[1,2,3].map(i => <div key={i} className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl" />)}
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-4">
                    {evoChain.map((evo, i) => (
                      <React.Fragment key={evo.id}>
                        {i > 0 && (
                          <div className="flex flex-col items-center">
                            <ChevronRight size={16} className="text-slate-300" />
                            {evo.condition && <span className="text-[7px] font-black uppercase text-rose-500 mt-1 whitespace-nowrap">{evo.condition}</span>}
                          </div>
                        )}
                        <div 
                          onClick={() => {
                            const p = pokemons.find(x => x.id === evo.id);
                            if (p) onNavigate(p);
                          }}
                          className={`relative group cursor-pointer p-2 rounded-2xl border-2 transition-all ${evo.id === pokemon.id ? 'border-rose-500 bg-rose-50' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                           <img src={evo.image} className="w-14 h-14 object-contain group-hover:scale-110 transition-transform" />
                           <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 text-white text-[6px] font-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {evo.nom}
                           </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                )}
             </div>
          </div>
       </motion.div>
    </motion.div>
  );
}

function ComparisonModal({ p1, p2, isDarkMode, onClose }) {
  if (!p1 || !p2) return null;
  const stats = Object.keys(p1.base);

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[150] flex items-center justify-center p-6">
       <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl" onClick={onClose} />
       <motion.div initial={{scale:0.9}} animate={{scale:1}} className={`relative w-full max-w-4xl p-12 rounded-[4rem] shadow-2xl border-4 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
          <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-rose-500 text-white rounded-full"><X size={24}/></button>
          <div className="flex justify-around items-center mb-16">
             <div className="text-center">
                <img src={p1.image} className="w-48 h-48 object-contain mb-4" />
                <h3 className="text-3xl font-black">{p1.nom}</h3>
             </div>
             <div className="text-5xl font-black italic text-rose-500">VS</div>
             <div className="text-center">
                <img src={p2.image} className="w-48 h-48 object-contain mb-4" />
                <h3 className="text-3xl font-black">{p2.nom}</h3>
             </div>
          </div>
          <div className="space-y-6">
             {stats.map(s => {
                const diff = p1.base[s] - p2.base[s];
                return (
                   <div key={s} className="grid grid-cols-3 items-center gap-8">
                      <div className={`text-right font-black text-2xl ${diff > 0 ? 'text-green-500' : 'text-slate-400'}`}>{p1.base[s]}</div>
                      <div className="text-center">
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s}</div>
                         <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 relative">
                            <div className={`absolute top-0 bottom-0 ${diff > 0 ? 'right-1/2 bg-green-500' : 'left-1/2 bg-rose-500'}`} style={{width: `${Math.min(50, (Math.abs(diff)/150)*50)}%`}} />
                         </div>
                      </div>
                      <div className={`text-left font-black text-2xl ${diff < 0 ? 'text-green-500' : 'text-slate-400'}`}>{p2.base[s]}</div>
                   </div>
                );
             })}
          </div>
       </motion.div>
    </motion.div>
  );
}

function BattleArena({ state, onStart, isDarkMode, teamLength }) {
  if (!state.isFighting && !state.winner) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center max-w-2xl mx-auto">
         <div className="p-10 bg-rose-500 rounded-[3rem] shadow-2xl mb-12 ring-8 ring-rose-500/20"><Activity size={80} className="text-white"/></div>
          <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter text-slate-900 dark:text-white">L'Arène du Champion</h2>
          <p className="text-slate-500 text-xl font-medium mb-10 leading-relaxed">
            Défiez un grand dresseur dans un combat acharné en 6 contre 6. 
            {teamLength < 6 && <span className="block mt-4 text-rose-500 font-bold animate-pulse uppercase text-sm tracking-widest">Attention : sélectionnez 6 Pokémon pour combattre ({teamLength}/6)</span>}
          </p>
          <button 
            onClick={onStart} 
            disabled={teamLength < 6}
            className={`px-16 py-6 rounded-[2rem] font-black text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-5 ${teamLength < 6 ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none' : 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-rose-500 hover:text-white'}`}
          >
             LANCER LE COMBAT <Sword size={28}/>
          </button>
      </div>
    );
  }

  const pActive = state.playerTeam[state.playerActive];
  const eActive = state.enemyTeam[state.enemyActive];

  return (
    <div className="space-y-12">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative min-h-[500px] items-center px-8 py-12 bg-slate-900/5 dark:bg-slate-900/40 rounded-[4rem] border-8 border-white dark:border-slate-800 shadow-inner overflow-hidden">
          {/* Player side */}
          <div className="text-center space-y-6 z-10">
             <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                <motion.img key={pActive?.id} initial={{x:-100,opacity:0}} animate={{x:0,opacity:1}} src={pActive?.image} className="w-64 h-64 md:w-80 md:h-80 object-contain relative mx-auto drop-shadow-2xl" />
             </div>
             <div className="w-full max-w-sm mx-auto bg-slate-200 dark:bg-slate-800 h-6 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg relative">
                <motion.div animate={{width:`${pActive?.currentHP}%` || 0}} className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white drop-shadow-md">{Math.round(pActive?.currentHP || 0)}%</span>
             </div>
             <div className="text-2xl font-black uppercase tracking-tighter">{pActive?.nom}</div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 p-6 bg-rose-500 rounded-full shadow-2xl text-white font-black text-3xl italic animate-bounce border-8 border-white dark:border-slate-900 hidden md:block">VS</div>
          
          {/* Enemy side */}
          <div className="text-center space-y-6 z-10">
            <div className="relative group">
                <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                <motion.img key={eActive?.id} initial={{x:100,opacity:0}} animate={{x:0,opacity:1}} src={eActive?.image} className="w-64 h-64 md:w-80 md:h-80 object-contain relative mx-auto drop-shadow-2xl" />
            </div>
            <div className="w-full max-w-sm mx-auto bg-slate-200 dark:bg-slate-800 h-6 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg relative">
               <motion.div animate={{width:`${eActive?.currentHP}%` || 0}} className="h-full bg-gradient-to-r from-rose-500 to-orange-400" />
               <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white drop-shadow-md">{Math.round(eActive?.currentHP || 0)}%</span>
            </div>
            <div className="text-2xl font-black uppercase tracking-tighter">{eActive?.nom}</div>
          </div>
       </div>

       <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl border-t-8 border-rose-500">
          <div className="flex justify-between items-center mb-6">
             <h4 className="font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Disc size={20} className="animate-spin text-rose-500" /> Journal de combat</h4>
             <span className="px-4 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">Live Updates</span>
          </div>
          <div className="space-y-4 font-bold text-lg max-h-60 overflow-y-auto pr-4 custom-scrollbar">
             {state.logs.map((log, i) => (
                <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className={i === 0 ? 'text-rose-400 text-2xl font-black italic' : 'text-slate-400'}>{log}</motion.div>
             ))}
          </div>
          {state.winner && (
            <button onClick={() => window.location.reload()} className="mt-8 px-10 py-4 bg-rose-500 text-white rounded-2xl font-black uppercase hover:scale-110 transition-all shadow-xl">Nouvelle Session</button>
          )}
       </div>
    </div>
  );
}

function PokemonGame({ gameState, onGuess, onNext, isDarkMode }) {
  if (!gameState.target) return null;
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="max-w-4xl mx-auto">
       <div className="flex justify-between items-end mb-8">
          <div className="text-left">
             <h3 className="text-3xl font-black mb-1">Qui est ce Pokémon ?</h3>
             <div className="flex gap-4">
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Score: {gameState.score}</p>
                <p className="text-rose-500 font-bold uppercase text-[10px] tracking-widest">Record: {gameState.highscore}</p>
             </div>
          </div>
          <div className="text-right">
             <div className={`text-4xl font-black ${gameState.timeLeft < 4 ? 'text-rose-500 animate-bounce' : 'text-slate-900 dark:text-white'}`}>{gameState.timeLeft}s</div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vite !</p>
          </div>
       </div>

       <div className={`p-12 rounded-[4rem] text-center shadow-2xl border-4 transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="relative mb-12 h-80 flex items-center justify-center overflow-hidden rounded-[3rem] bg-slate-50 dark:bg-slate-950 shadow-inner p-10">
             <motion.img 
               key={gameState.target.id} 
               initial={{scale:0.5, rotate:-20}} animate={{scale:1, rotate:0}}
               src={gameState.target.image} 
               className={`w-full h-full object-contain filter transition-all duration-1000 ${gameState.status === 'playing' ? 'brightness-0 contrast-200 blur-sm' : 'brightness-110 scale-105'}`} 
             />
          </div>
          <div className="grid grid-cols-2 gap-6 w-full">
             {gameState.choices.map(p => (
                <button
                  key={p.id}
                  disabled={gameState.status !== 'playing'}
                  onClick={() => onGuess(p.id)}
                  className={`py-6 rounded-[2rem] font-black text-xl transition-all shadow-lg ${
                    gameState.status === 'revealed'
                      ? p.id === gameState.target.id
                        ? 'bg-emerald-500 text-white scale-105 shadow-xl shadow-emerald-500/20'
                        : p.id === gameState.selectedId
                          ? 'bg-rose-500 text-white opacity-50'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-20'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white hover:scale-[1.02] active:scale-95'
                  }`}
                >
                   {p.nom}
                </button>
             ))}
          </div>

          {gameState.status === 'revealed' && (
             <motion.button 
               initial={{y:20, opacity:0}} animate={{y:0, opacity:1}}
               onClick={onNext} 
               className="mt-12 px-12 py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[2rem] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
             >
                SUIVANT <ChevronRight className="inline ml-2" />
             </motion.button>
          )}
       </div>
    </motion.div>
  );
}

function TypeMasterQuiz({ state, onAnswer, onNext, isDarkMode }) {
  const options = [0, 0.5, 1, 2];
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="max-w-2xl mx-auto">
       <div className="flex justify-between items-end mb-8">
          <div>
             <h3 className="text-3xl font-black mb-1">Affinités Élémentaires</h3>
             <div className="flex gap-4">
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Score: {state.score}</p>
                <p className="text-amber-500 font-bold uppercase text-[10px] tracking-widest">Record: {state.highscore}</p>
             </div>
          </div>
          <div className="flex gap-1">
             {Array.from({length:3}).map((_, i) => (
                <Heart key={i} size={24} fill={i < state.lives ? '#f43f5e' : 'none'} className={i < state.lives ? 'text-rose-500' : 'text-slate-300'} />
             ))}
          </div>
       </div>

       <div className={`p-12 rounded-[4rem] text-center shadow-2xl border-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center justify-center gap-8 mb-12">
             <div className="px-10 py-6 rounded-[2rem] shadow-2xl transition-transform hover:scale-110" style={{backgroundColor: TYPE_COLORS[state.typeA]}}>
                <span className="text-white font-black text-2xl uppercase tracking-tighter">{state.typeA}</span>
             </div>
             <ChevronRight size={32} className="text-slate-300 animate-pulse" />
             <div className="px-10 py-6 rounded-[2rem] shadow-2xl transition-transform hover:scale-110" style={{backgroundColor: TYPE_COLORS[state.typeB]}}>
                <span className="text-white font-black text-2xl uppercase tracking-tighter">{state.typeB}</span>
             </div>
          </div>

          <p className="text-slate-500 font-bold mb-10 text-xl tracking-tight uppercase tracking-widest">Efficacité de l'attaque ?</p>

          <div className="grid grid-cols-2 gap-6 w-full">
             {options.map(m => (
                <button
                  key={m}
                  disabled={state.status !== 'playing' || state.lives <= 0}
                  onClick={() => onAnswer(m)}
                  className={`py-6 rounded-[2rem] font-black text-2xl transition-all shadow-lg ${
                    state.status === 'revealed'
                      ? m === ((TYPE_CHART[state.typeA] && TYPE_CHART[state.typeA][state.typeB]) ?? 1)
                        ? 'bg-emerald-500 text-white scale-105 shadow-xl shadow-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-20'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white hover:scale-105 active:scale-95'
                  }`}
                >
                   x{m}
                </button>
             ))}
          </div>

          {state.status === 'revealed' && state.lives > 0 && (
             <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="mt-12">
                <p className={`font-black text-2xl mb-6 ${state.feedback.includes('Correct') ? 'text-emerald-500' : 'text-rose-500'}`}>{state.feedback}</p>
                <button onClick={onNext} className="px-12 py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[2rem] font-black text-xl hover:scale-110 shadow-2xl">
                   SUIVANT
                </button>
             </motion.div>
          )}

          {state.lives <= 0 && (
             <motion.div initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} className="mt-12 p-8 bg-rose-500/10 rounded-[3rem] border-4 border-rose-500/20">
                <h4 className="text-3xl font-black text-rose-500 mb-2 uppercase">GAME OVER</h4>
                <p className="font-bold text-slate-500 mb-6">Tu as épuisé toutes tes vies !</p>
                <button onClick={() => window.location.reload()} className="px-10 py-4 bg-rose-500 text-white rounded-2xl font-black uppercase hover:scale-105 shadow-xl">Recommencer</button>
             </motion.div>
          )}
       </div>
    </motion.div>
  );
}

// --- UTILS ---

function StatCard({ label, value, color, isDarkMode }) {
  return (
    <div className={`p-8 rounded-[2.5rem] flex flex-col items-center justify-center shadow-xl transition-all border-4 border-transparent hover:border-slate-100 dark:hover:border-slate-800 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
       <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
       <span className={`text-5xl font-black ${color} tracking-tighter`}>{value}</span>
    </div>
  );
}

function TypeBadge({ type }) {
  return (
    <div className="px-10 py-5 rounded-[2rem] text-center shadow-2xl scale-125 border-4 border-white/20" style={{backgroundColor: TYPE_COLORS[type] || '#ccc'}}>
       <span className="text-white font-black text-xl tracking-tighter">{type}</span>
    </div>
  );
}

export default App;
