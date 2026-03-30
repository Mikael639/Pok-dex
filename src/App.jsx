import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Menu, 
  X, 
  Archive, 
  Home, 
  Disc, 
  Music, 
  Activity, 
  Shuffle, 
  Moon, 
  Sun,
  Users,
  ChevronRight,
  ChevronLeft,
  Info,
  Circle,
  Gamepad2,
  Trophy,
  Filter,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = ''; // Proxy will handle it

function App() {
  const [activeTab, setActiveTab] = useState('accueil');
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [page, setPage] = useState(1);
  const [team, setTeam] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Game state
  const [gameState, setGameState] = useState({
    target: null,
    choices: [],
    status: 'idle', // idle, playing, revealed
    selectedId: null,
    score: 0,
    streak: 0,
    bestStreak: 0
  });

  // Load initial data
  useEffect(() => {
    fetchPokemons();
    fetchTypes();
    const savedTeam = localStorage.getItem('pokedex_team_react');
    if (savedTeam) setTeam(JSON.parse(savedTeam));
    
    const savedBest = localStorage.getItem('pokedex_best_streak');
    if (savedBest) setGameState(prev => ({ ...prev, bestStreak: parseInt(savedBest) }));

    // Theme initialization
    const savedTheme = localStorage.getItem('pokedex_theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pokedex_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pokedex_theme', 'light');
    }
  }, [isDarkMode]);

  const fetchPokemons = async () => {
    try {
      const res = await axios.get('/pokemons');
      setPokemons(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await axios.get('/types');
      setTypes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const saveTeam = (newTeam) => {
    setTeam(newTeam);
    localStorage.setItem('pokedex_team_react', JSON.stringify(newTeam));
  };

  const toggleTeam = (pokemon) => {
    const isCaught = team.some(p => p.id === pokemon.id);
    if (isCaught) {
      saveTeam(team.filter(p => p.id !== pokemon.id));
    } else {
      if (team.length >= 6) {
        alert("Équipe pleine !");
        return;
      }
      saveTeam([...team, pokemon]);
    }
  };

  const toggleMusic = () => {
    if (!isPlaying) {
      const newAudio = new Audio('/play');
      newAudio.loop = true;
      newAudio.play().catch(err => {
        console.error("Audio playback error:", err);
        alert("Cliquez n'importe où sur la page pour autoriser la lecture audio.");
      });
      setAudio(newAudio);
      setIsPlaying(true);
    } else {
      if (audio) {
        audio.pause();
      }
      setAudio(null);
      setIsPlaying(false);
    }
  };

  const getRandomPokemon = () => {
    const random = pokemons[Math.floor(Math.random() * pokemons.length)];
    setSelectedPokemon(random);
  };

  const filteredPokemons = pokemons.filter(p => {
    const matchesSearch = p.nom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || p.types.some(t => t.nom === selectedType);
    return matchesSearch && matchesType;
  });

  const ITEMS_PER_PAGE = 12;
  const paginatedPokemons = filteredPokemons.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredPokemons.length / ITEMS_PER_PAGE);

  const initGame = () => {
    if (pokemons.length < 4) return;
    const shuffled = [...pokemons].sort(() => 0.5 - Math.random());
    const target = shuffled[0];
    const choices = shuffled.slice(0, 4).sort(() => 0.5 - Math.random());
    setGameState(prev => ({
      ...prev,
      target,
      choices,
      status: 'playing',
      selectedId: null
    }));
  };

  const handleGuess = (id) => {
    if (gameState.status !== 'playing') return;
    const isCorrect = id === gameState.target.id;
    const newStreak = isCorrect ? gameState.streak + 1 : 0;
    const newBest = Math.max(newStreak, gameState.bestStreak);
    
    if (newBest > gameState.bestStreak) {
      localStorage.setItem('pokedex_best_streak', newBest.toString());
    }

    setGameState(prev => ({
      ...prev,
      status: 'revealed',
      selectedId: id,
      score: isCorrect ? prev.score + 10 : prev.score,
      streak: newStreak,
      bestStreak: newBest
    }));
  };

  return (
    <div className={`min-h-screen flex transition-all duration-500 ${isDarkMode ? 'dark bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 transition-all duration-500 transform border-r flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'} ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
        <div className="p-6 flex items-center gap-4">
          <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-500/20">
            <Circle className="text-white h-6 w-6" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">POKEDEX</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem 
            icon={<Home size={20} />} 
            label="Accueil" 
            isActive={activeTab === 'accueil'} 
            isOpen={isSidebarOpen} 
            onClick={() => setActiveTab('accueil')} 
          />
          <NavItem 
            icon={<Archive size={20} />} 
            label="Pokémons" 
            isActive={activeTab === 'pokemons'} 
            isOpen={isSidebarOpen} 
            onClick={() => setActiveTab('pokemons')} 
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Mon Équipe" 
            isActive={activeTab === 'team'} 
            isOpen={isSidebarOpen} 
            count={team.length}
            onClick={() => setActiveTab('team')} 
          />
          <NavItem 
            icon={<Gamepad2 size={20} />} 
            label="Mini-Jeu" 
            isActive={activeTab === 'game'} 
            isOpen={isSidebarOpen} 
            onClick={() => { setActiveTab('game'); if (gameState.status === 'idle') initGame(); }} 
          />
        </nav>

        <div className="p-4 space-y-4 mb-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-full flex items-center justify-center gap-3 p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            {isSidebarOpen && <span>Thème {isDarkMode ? 'Clair' : 'Sombre'}</span>}
          </button>
          
          <button 
            onClick={toggleMusic}
            className={`w-full flex items-center justify-center gap-3 p-3 rounded-xl transition-all duration-500 ${isPlaying ? (isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600') : (isDarkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-600')}`}
          >
            {isPlaying ? (
              <>
                <Activity size={20} className="animate-pulse" />
                {isSidebarOpen && <span>En lecture</span>}
              </>
            ) : (
              <>
                <Music size={20} />
                {isSidebarOpen && <span>Jouer Musique</span>}
              </>
            )}
          </button>
        </div>
        
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className={`absolute -right-3 top-20 border rounded-full p-1.5 shadow-md hover:scale-110 transition-transform ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
        >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-500 min-h-screen ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className={`sticky top-0 z-40 backdrop-blur-xl border-b px-8 py-4 flex items-center justify-between transition-all duration-500 ${isDarkMode ? 'bg-gray-950/70 border-gray-800 text-white' : 'bg-white/70 border-gray-200 text-gray-900'}`}>
          <h2 className="text-2xl font-bold capitalize">
            {activeTab === 'accueil' ? 'Bienvenue Dresseur !' : activeTab === 'team' ? 'Mon Équipe de Choc' : activeTab === 'game' ? 'Qui est ce Pokémon ?' : 'Index des Pokémons'}
          </h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={getRandomPokemon}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/30"
            >
              <Shuffle size={18} />
              <span>Hasard</span>
            </button>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'accueil' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="relative rounded-3xl overflow-hidden h-[500px] mb-8 group">
                  <img 
                    src="/images/home_aesthetic.png" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    alt="Pokemon Landscape"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent flex flex-col justify-end p-12">
                    <h1 className="text-5xl font-extrabold text-white mb-4">Le Nouveau Pokédex</h1>
                    <p className="text-gray-200 text-xl max-w-2xl">Découvrez, collectionnez et constituez la meilleure équipe de Pokémon pour devenir le Maître de la Ligue.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <HomeCard 
                      icon={<Archive className="text-blue-500" />} 
                      title="Exploration" 
                      text="Accédez à l'intégralité des 151 Pokémon de la première génération."
                      onClick={() => setActiveTab('pokemons')}
                   />
                   <HomeCard 
                      icon={<Users className="text-amber-500" />} 
                      title="Gestion d'Équipe" 
                      text="Sélectionnez vos meilleurs alliés pour votre prochaine aventure." 
                      onClick={() => setActiveTab('team')}
                   />
                   <HomeCard 
                      icon={<Info className="text-red-500" />} 
                      title="Stats Détaillées" 
                      text="Consultez les PV, l'Attaque et bien plus avec des graphiques modernes." 
                      onClick={() => setActiveTab('pokemons')}
                   />
                </div>
              </motion.div>
            )}

            {(activeTab === 'pokemons' || activeTab === 'team') && (
              <motion.div 
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {activeTab === 'pokemons' && (
                  <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="search" 
                        placeholder="Rechercher un Pokémon..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-gray-900 border-none ring-1 ring-gray-200 dark:ring-gray-800 focus:ring-2 focus:ring-red-500 outline-none transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => {setSearchQuery(e.target.value); setPage(1)}}
                      />
                    </div>
                    <div className="relative">
                       <button 
                         onClick={() => setIsFilterOpen(!isFilterOpen)}
                         className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold border transition-all hover:scale-[1.02] active:scale-[0.98] min-w-[200px] shadow-sm ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-900'}`}
                       >
                         <Filter size={18} className="text-red-500" />
                         <span className="flex-1 text-left line-clamp-1">{selectedType === 'all' ? 'Tous les Types' : selectedType}</span>
                         <ChevronDown size={18} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                       </button>

                       <AnimatePresence>
                         {isFilterOpen && (
                           <>
                             <div 
                               className="fixed inset-0 z-40 bg-transparent" 
                               onClick={() => setIsFilterOpen(false)} 
                             />
                             <motion.div 
                               initial={{ opacity: 0, y: 10, scale: 0.95 }}
                               animate={{ opacity: 1, y: 0, scale: 1 }}
                               exit={{ opacity: 0, y: 10, scale: 0.95 }}
                               className={`absolute right-0 top-full mt-2 w-64 z-[50] rounded-[1.5rem] border overflow-hidden shadow-2xl max-h-[400px] overflow-y-auto hide-scrollbar ${isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'}`}
                             >
                                <div className="p-3 grid grid-cols-1 gap-1">
                                   <button 
                                     onClick={() => {setSelectedType('all'); setPage(1); setIsFilterOpen(false)}}
                                     className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${selectedType === 'all' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 font-bold' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}
                                   >
                                     <div className={`w-3 h-3 rounded-full border-2 ${selectedType === 'all' ? 'bg-red-500 border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
                                     Tous les Types
                                   </button>
                                   {types.map(t => (
                                     <button 
                                       key={t.nom}
                                       onClick={() => {setSelectedType(t.nom); setPage(1); setIsFilterOpen(false)}}
                                       className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${selectedType === t.nom ? 'bg-red-50 dark:bg-red-900/20 text-red-600 font-bold' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 font-medium'}`}
                                     >
                                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: getTypeColor(t.nom) }} />
                                        {t.nom}
                                     </button>
                                   ))}
                                </div>
                             </motion.div>
                           </>
                         )}
                       </AnimatePresence>
                    </div>
                  </div>
                )}

                {activeTab === 'team' && team.length === 0 ? (
                  <div className="text-center py-20">
                     <div className="inline-block p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-6 text-gray-400">
                        <Users size={64} />
                     </div>
                     <h3 className="text-2xl font-bold mb-2">Votre PC est vide !</h3>
                     <p className="text-gray-500">Allez dans le Pokédex pour capturer vos premiers Pokémon.</p>
                     <button 
                        onClick={() => setActiveTab('pokemons')}
                        className="mt-6 px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                     >
                        Explorer
                     </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {(activeTab === 'team' ? team : paginatedPokemons).map(pokemon => (
                        <PokemonCard 
                          key={pokemon.id} 
                          pokemon={pokemon} 
                          isCaught={team.some(p => p.id === pokemon.id)}
                          isDarkMode={isDarkMode}
                          onClick={() => setSelectedPokemon(pokemon)}
                          onCatch={() => toggleTeam(pokemon)}
                        />
                      ))}
                    </div>
                    
                    {activeTab === 'pokemons' && totalPages > 1 && (
                      <div className="flex justify-center items-center gap-4 mt-12">
                        <button 
                          disabled={page === 1}
                          onClick={() => setPage(page-1)}
                          className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                        >
                          <ChevronLeft />
                        </button>
                        <span className="font-bold text-lg">Page {page} / {totalPages}</span>
                        <button 
                          disabled={page === totalPages}
                          onClick={() => setPage(page+1)}
                          className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                        >
                          <ChevronRight />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
            {activeTab === 'game' && (
              <motion.div 
                key="game"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-4xl mx-auto"
              >
                <PokemonGame 
                  gameState={gameState} 
                  onGuess={handleGuess} 
                  onNext={initGame}
                  isDarkMode={isDarkMode}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modal Detail */}
      <AnimatePresence>
        {selectedPokemon && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPokemon(null)}
              className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div 
                className={`h-48 flex items-end justify-between p-8 text-white relative`}
                style={{ backgroundColor: getTypeColor(selectedPokemon.types[0].nom) }}
              >
                 <div className="relative z-10">
                    <span className="text-white/60 font-mono text-xl mb-2 block">#{String(selectedPokemon.id).padStart(3, '0')}</span>
                    <h2 className="text-4xl font-black">{selectedPokemon.nom}</h2>
                 </div>
                 <button 
                    onClick={() => setSelectedPokemon(null)}
                    className="absolute top-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white/40 transition-all z-50 hover:scale-110 active:scale-90"
                 >
                    <X size={24} />
                 </button>
                 <div className="absolute -bottom-16 -right-16 opacity-20 transform -rotate-12">
                   <Disc size={300} strokeWidth={1} />
                 </div>
              </div>

              <div className="p-10 pt-20 relative">
                <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-56 h-56 pointer-events-none">
                   <motion.img 
                      initial={{ y: 10, scale: 0.9 }}
                      animate={{ y: -10, scale: 1 }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
                      src={selectedPokemon.image} 
                      className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]"
                   />
                </div>
                
                <div className="flex justify-center gap-3 mb-10">
                   {selectedPokemon.types.map(t => (
                     <span 
                        key={t.nom} 
                        className="px-6 py-2 rounded-full font-bold text-white shadow-lg shadow-black/10 transition-transform hover:scale-105 capitalize"
                        style={{ backgroundColor: getTypeColor(t.nom) }}
                     >
                       {t.nom}
                     </span>
                   ))}
                </div>

                <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-3xl mb-10 italic text-center text-lg">
                  "{selectedPokemon.description}"
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-6 px-4">
                  {Object.entries(selectedPokemon.base).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm font-bold mb-2 uppercase tracking-widest text-gray-500">
                        <span>{getStatLabel(key)}</span>
                        <span>{val}</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(val / 160) * 100}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: getStatColor(val) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => toggleTeam(selectedPokemon)}
                  className={`w-full mt-10 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl ${team.some(p => p.id === selectedPokemon.id) ? 'bg-red-50 text-red-600 dark:bg-red-950/40' : 'bg-red-600 text-white shadow-red-500/20'}`}
                >
                  <Archive size={24} />
                  {team.some(p => p.id === selectedPokemon.id) ? 'Libérer du PC' : 'Capturer le Pokémon'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, isActive, isOpen, count, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`relative w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-red-50 dark:bg-red-900/20 text-red-600 font-bold' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}
    >
      <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      {isOpen && <span className="flex-1 text-left">{label}</span>}
      {isOpen && count > 0 && (
        <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full ring-2 ring-white dark:ring-gray-900">
          {count}
        </span>
      )}
      {!isOpen && count > 0 && (
        <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
      )}
      {isActive && (
        <motion.div 
          layoutId="activeNav"
          className="absolute left-0 w-1 h-8 bg-red-600 rounded-r-lg"
        />
      )}
    </button>
  );
}

function HomeCard({ icon, title, text, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="p-8 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-left hover:scale-[1.05] transition-all group shadow-sm hover:shadow-xl"
    >
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-850 rounded-2xl inline-block group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { size: 32 })}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{text}</p>
    </button>
  );
}

function PokemonGame({ gameState, onGuess, onNext, isDarkMode }) {
  if (!gameState.target) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-between gap-6 mb-8">
        <div className={`flex-1 p-6 rounded-3xl border flex flex-col items-center justify-center transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Score Total</span>
          <span className="text-3xl font-black text-red-600">{gameState.score}</span>
        </div>
        <div className={`flex-1 p-6 rounded-3xl border flex flex-col items-center justify-center transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Série Actuelle</span>
          <span className={`text-3xl font-black ${gameState.streak > 0 ? 'text-amber-500' : 'text-gray-400'}`}>{gameState.streak} 🔥</span>
        </div>
        <div className={`flex-1 p-6 rounded-3xl border flex flex-col items-center justify-center transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Record</span>
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-amber-500" />
            <span className="text-3xl font-black">{gameState.bestStreak}</span>
          </div>
        </div>
      </div>

      <div className={`w-full max-w-2xl p-12 rounded-[3rem] border mb-10 relative overflow-hidden transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl'}`}>
        {/* Background circle decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col items-center">
          <div className="w-64 h-64 mb-10 transition-all duration-1000">
            <motion.img 
              key={gameState.target.id}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              src={gameState.target.image} 
              className={`w-full h-full object-contain filter transition-all duration-700 drop-shadow-2xl ${gameState.status === 'playing' ? 'brightness-0 grayscale contrast-200' : 'brightness-100'}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            {gameState.choices.map(choice => {
              const isSelected = gameState.selectedId === choice.id;
              const isCorrect = choice.id === gameState.target.id;
              const reveal = gameState.status === 'revealed';
              
              let btnClass = isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-50 border-gray-100 hover:bg-gray-100';
              if (reveal) {
                if (isCorrect) btnClass = 'bg-green-500 border-green-400 text-white shadow-lg shadow-green-500/20';
                else if (isSelected) btnClass = 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20';
                else btnClass = 'opacity-50 grayscale bg-gray-100 dark:bg-gray-800';
              }

              return (
                <button
                  key={choice.id}
                  disabled={reveal}
                  onClick={() => onGuess(choice.id)}
                  className={`py-4 px-6 rounded-2xl border font-bold text-lg transition-all capitalize ${btnClass} ${!reveal && 'hover:scale-[1.02] active:scale-95'}`}
                >
                  {choice.nom}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {gameState.status === 'revealed' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex flex-col items-center"
              >
                <p className={`text-2xl font-black mb-4 ${gameState.selectedId === gameState.target.id ? 'text-green-500' : 'text-red-500'}`}>
                  {gameState.selectedId === gameState.target.id ? 'C\'est gagné !' : `Hé non, c'était ${gameState.target.nom} !`}
                </p>
                <button
                  onClick={onNext}
                  className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-red-500/20 hover:scale-110 active:scale-90 transition-all flex items-center gap-3"
                >
                  <span>Pokémon suivant</span>
                  <ChevronRight size={24} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function PokemonCard({ pokemon, isCaught, isDarkMode, onClick, onCatch }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group relative rounded-[2rem] p-6 shadow-sm border transition-all cursor-pointer overflow-hidden pokemon-card-hover ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-900'}`}
      onClick={onClick}
    >
      
      <div className="relative z-10">
        <div className="w-32 h-32 mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform">
          <img src={pokemon.image} alt={pokemon.nom} className="w-full h-full object-contain filter drop-shadow-lg" />
        </div>
        
        <h3 className="text-2xl font-bold mb-4 capitalize">{pokemon.nom}</h3>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {pokemon.types.map(t => (
            <span 
              key={t.nom} 
              className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase text-white shadow-sm"
              style={{ backgroundColor: getTypeColor(t.nom) }}
            >
              {t.nom}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); onCatch(); }}
            className={`flex-1 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 ${isCaught ? (isDarkMode ? 'bg-amber-900/30 text-amber-500 ring-1 ring-amber-800/50' : 'bg-amber-100 text-amber-600 ring-1 ring-amber-200') : (isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}`}
          >
            <Archive size={18} />
            {isCaught ? 'Capturé' : 'Capturer'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Helpers
const getTypeColor = (type) => {
  const colors = {
    'Plante': '#78C850',
    'Poison': '#A040A0',
    'Feu': '#F08030',
    'Eau': '#6890F0',
    'Insecte': '#A8B820',
    'Normal': '#A8A878',
    'Electrique': '#F8D030',
    'Sol': '#E0C068',
    'Fée': '#EE99AC',
    'Combat': '#C03028',
    'Psy': '#F85888',
    'Roche': '#B8A038',
    'Acier': '#B8B8D0',
    'Glace': '#98D8D8',
    'Spectre': '#705898',
    'Dragon': '#7038F8',
    'Vol': '#A890F0',
    'Ténèbres': '#705848',
  };
  return colors[type] || '#94A3B8';
};

const getStatLabel = (key) => {
  const labels = {
    'HP': 'PV',
    'Attack': 'Attaque',
    'Defense': 'Défense',
    'SpAttack': 'Att. Spé.',
    'SpDefense': 'Déf. Spé.',
    'Speed': 'Vitesse'
  };
  return labels[key] || key;
};

const getStatColor = (val) => {
  if (val > 100) return '#22C55E';
  if (val > 75) return '#84CC16';
  if (val > 50) return '#EAB308';
  return '#EF4444';
};

export default App;
