import { useState, useEffect, useCallback, useEffectEvent } from 'react';
import { INITIAL_BATTLE_STATE, getGeneration } from '../constants/gameMeta';
import { TYPE_CHART } from '../constants/pokemon';
import { 
  getEvolutionRushDifficulty, 
  getInitialEvolutionRushBestStreaks, 
  createStatClashRound, 
  shuffleArray, 
  getEvolutionRushChain, 
  buildEvolutionRushChainForDifficulty,
  getTodayKey
} from '../utils/gameLogic';

export function useGames({ pokemons, team, markDailyFlag, activeTab, setActiveTab, addLog }) {
  const [todayKey] = useState(() => getTodayKey());

  // --- ÉTATS ---
  const [battleStats, setBattleStats] = useState(() => JSON.parse(localStorage.getItem('pokedexBattleStats') || '{"wins": 0, "losses": 0}'));
  const [memoryState, setMemoryState] = useState({ cards: [], flipped: [], solved: [], moves: 0, startTime: null, endTime: null });
  const [gameState, setGameState] = useState({
    target: null, choices: [], status: 'playing', score: 0, streak: 0, bestStreak: 0, 
    selectedId: null, timeLeft: 10, timerRunning: false,
    highscore: parseInt(localStorage.getItem('silhouetteHighscore') || '0')
  });
  const [battleState, setBattleState] = useState(INITIAL_BATTLE_STATE);
  const [quizState, setQuizState] = useState({
    typeA: '', typeB: '', options: [0, 0.5, 1, 2], status: 'idle', 
    score: 0, streak: 0, feedback: null, survivalMode: false, lives: 3,
    highscore: parseInt(localStorage.getItem('quizHighscore') || '0')
  });
  const [statClashState, setStatClashState] = useState({
    left: null, right: null, statId: '', statLabel: '', leftValue: 0, rightValue: 0,
    correctId: null, status: 'idle', selectedId: null, score: 0, streak: 0,
    bestStreak: parseInt(localStorage.getItem('statClashBestStreak') || '0')
  });
  const [evolutionRushState, setEvolutionRushState] = useState({
    difficulty: localStorage.getItem('evolutionRushDifficulty') || 'dresseur',
    bestStreaks: getInitialEvolutionRushBestStreaks(),
    chain: [], choices: [], selectedOrder: [], status: 'idle', feedback: null, score: 0, streak: 0
  });

  const [pokedleState, setPokedleState] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(`pokedleState_${getTodayKey()}`) || '{"target": null, "guesses": [], "status": "playing"}');
    return saved;
  });

  const [cryQuizState, setCryQuizState] = useState({
    target: null, choices: [], status: 'idle', score: 0, streak: 0,
    highscore: parseInt(localStorage.getItem('cryQuizHighscore') || '0')
  });


  // --- PERSISTANCE ---
  useEffect(() => { localStorage.setItem('pokedexBattleStats', JSON.stringify(battleStats)); }, [battleStats]);
  useEffect(() => { localStorage.setItem(`pokedleState_${todayKey}`, JSON.stringify(pokedleState)); }, [pokedleState, todayKey]);

  // --- SILHOUETTE ---
  const startNewGame = useCallback(() => {
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
  }, [pokemons]);

  const handleGuess = useCallback((id) => {
    setGameState(prev => {
      const isCorrect = id === prev.target.id;
      const newScore = isCorrect ? prev.score + 10 + prev.timeLeft : prev.score;
      const newHigh = Math.max(newScore, prev.highscore);
      localStorage.setItem('silhouetteHighscore', newHigh);
      return { ...prev, status: 'revealed', selectedId: id, timerRunning: false, score: newScore, highscore: newHigh };
    });
  }, []);

  const revealTimedOutGuess = useEffectEvent(() => {
    setGameState(prev => ({ ...prev, status: 'revealed', selectedId: -1, timerRunning: false }));
  });

  useEffect(() => {
    if (!gameState.timerRunning || gameState.status !== 'playing') return;
    if (gameState.timeLeft <= 0) { revealTimedOutGuess(); return; }
    const t = setTimeout(() => setGameState(p => ({ ...p, timeLeft: p.timeLeft - 1 })), 1000);
    return () => clearTimeout(t);
  }, [gameState.timeLeft, gameState.timerRunning, gameState.status, revealTimedOutGuess]);

  // --- QUIZ ---
  const startNewQuiz = useCallback(() => {
    const types = Object.keys(TYPE_CHART);
    const t1 = types[Math.floor(Math.random() * types.length)];
    const t2 = types[Math.floor(Math.random() * types.length)];
    setQuizState(prev => ({ ...prev, typeA: t1, typeB: t2, status: 'playing', feedback: null }));
  }, []);

  const handleQuizAnswer = useCallback((multiplier) => {
    if (markDailyFlag) markDailyFlag('quizAnswered');
    setQuizState(prev => {
      const actualMultiplier = (TYPE_CHART[prev.typeA] && TYPE_CHART[prev.typeA][prev.typeB]) ?? 1;
      const isCorrect = multiplier === actualMultiplier;
      const newScore = isCorrect ? prev.score + 15 : prev.score;
      const newHigh = Math.max(newScore, prev.highscore);
      localStorage.setItem('quizHighscore', newHigh);
      return {
        ...prev, status: 'revealed', feedback: isCorrect ? 'Correct !' : `Faux, c'était x${actualMultiplier}`,
        score: newScore, lives: (!isCorrect && prev.survivalMode) ? prev.lives - 1 : prev.lives, highscore: newHigh
      };
    });
  }, [markDailyFlag]);

  // --- STAT CLASH ---
  const startStatClashRound = useCallback((resetProgress = false) => {
    const round = createStatClashRound(pokemons);
    if (!round) return;
    setStatClashState((prev) => ({ ...prev, ...round, status: 'playing', selectedId: null, ...(resetProgress ? { score: 0, streak: 0 } : {}) }));
  }, [pokemons]);

  const handleStatClashPick = useCallback((pokemonId) => {
    setStatClashState((prev) => {
      if (prev.status === 'playing' && markDailyFlag) markDailyFlag('statClashRevealed');
      if (prev.status !== 'playing') return prev;
      const isCorrect = prev.correctId === pokemonId;
      const nextStreak = isCorrect ? prev.streak + 1 : 0;
      const nextScore = isCorrect ? prev.score + 1 : prev.score;
      const nextBestStreak = Math.max(prev.bestStreak, nextStreak);
      if (nextBestStreak !== prev.bestStreak) localStorage.setItem('statClashBestStreak', String(nextBestStreak));
      return { ...prev, status: 'revealed', selectedId: pokemonId, score: nextScore, streak: nextStreak, bestStreak: nextBestStreak };
    });
  }, [markDailyFlag]);

  // --- EVOLUTION RUSH ---
  const startEvolutionRushRound = useCallback(async ({ resetProgress = false, difficultyId } = {}) => {
    if (pokemons.length === 0) return;
    const nextDifficultyId = difficultyId ?? evolutionRushState.difficulty;
    const difficulty = getEvolutionRushDifficulty(nextDifficultyId);
    setEvolutionRushState(p => ({ ...p, difficulty: nextDifficultyId, status: 'loading', feedback: null, chain: [], choices: [], selectedOrder: [], ...(resetProgress ? { score: 0, streak: 0 } : {}) }));
    try {
      const candidates = shuffleArray(pokemons);
      let nextChain = null;
      for (const candidate of candidates) {
        const chain = await getEvolutionRushChain(candidate.id, pokemons);
        const uniqueChain = chain.filter((p, i, l) => l.findIndex(e => e.id === p.id) === i);
        const chainForDifficulty = buildEvolutionRushChainForDifficulty(uniqueChain, nextDifficultyId);
        if (chainForDifficulty) { nextChain = chainForDifficulty; break; }
      }
      if (!nextChain) {
        setEvolutionRushState(p => ({ ...p, status: 'error', feedback: `Aucune lignee compatible avec le niveau ${difficulty.label} n'a ete trouvee.` }));
        return;
      }
      setEvolutionRushState(p => ({ ...p, difficulty: nextDifficultyId, chain: nextChain, choices: shuffleArray(nextChain), selectedOrder: [], status: 'playing', feedback: null }));
    } catch (error) {
      console.error(error);
      setEvolutionRushState(p => ({ ...p, difficulty: nextDifficultyId, status: 'error', feedback: 'Impossible de recuperer une lignee.' }));
    }
  }, [pokemons, evolutionRushState.difficulty]);

  const handleEvolutionRushDifficultyChange = useCallback((difficultyId) => {
    const nextDifficulty = getEvolutionRushDifficulty(difficultyId);
    localStorage.setItem('evolutionRushDifficulty', nextDifficulty.id);
    void startEvolutionRushRound({ resetProgress: true, difficultyId: nextDifficulty.id });
  }, [startEvolutionRushRound]);

  const handleEvolutionRushSelect = useCallback((pokemonId) => {
    setEvolutionRushState(p => {
      if (p.status !== 'playing' || p.selectedOrder.includes(pokemonId) || p.selectedOrder.length >= p.chain.length) return p;
      return { ...p, selectedOrder: [...p.selectedOrder, pokemonId] };
    });
  }, []);

  const handleEvolutionRushRemove = useCallback((pokemonId) => {
    setEvolutionRushState(p => p.status !== 'playing' ? p : { ...p, selectedOrder: p.selectedOrder.filter(id => id !== pokemonId) });
  }, []);

  const clearEvolutionRushSelection = useCallback(() => {
    setEvolutionRushState(p => ({ ...p, selectedOrder: [] }));
  }, []);

  const validateEvolutionRushOrder = useCallback(() => {
    setEvolutionRushState(p => {
      if (p.status !== 'playing' || p.selectedOrder.length !== p.chain.length) return p;
      if (markDailyFlag) markDailyFlag('evolutionValidated');
      const expectedOrder = p.chain.map(pok => pok.id);
      const isCorrect = expectedOrder.every((id, idx) => id === p.selectedOrder[idx]);
      const nextStreak = isCorrect ? p.streak + 1 : 0;
      const nextScore = isCorrect ? p.score + p.chain.length : p.score;
      const currentBestStreak = p.bestStreaks[p.difficulty] ?? 0;
      const nextBestStreak = Math.max(currentBestStreak, nextStreak);
      const nextBestStreaks = nextBestStreak !== currentBestStreak ? { ...p.bestStreaks, [p.difficulty]: nextBestStreak } : p.bestStreaks;
      if (nextBestStreaks !== p.bestStreaks) localStorage.setItem('evolutionRushBestStreaks', JSON.stringify(nextBestStreaks));
      return { ...p, status: 'revealed', feedback: isCorrect ? 'Parfait ! Lignée correcte.' : 'Raté. Lignée incorrecte.', score: nextScore, streak: nextStreak, bestStreaks: nextBestStreaks };
    });
  }, [markDailyFlag]);

  // --- MEMORY ---
  const startMemoryGame = useCallback(() => {
    if (pokemons.length < 6) return;
    const shuffled = [...pokemons].sort(() => 0.5 - Math.random());
    const subset = shuffled.slice(0, 6);
    const cards = [];
    subset.forEach(p => { cards.push({ ...p, uniqueId: `mem-${p.id}-a` }); cards.push({ ...p, uniqueId: `mem-${p.id}-b` }); });
    setMemoryState({ cards: cards.sort(() => 0.5 - Math.random()), flipped: [], solved: [], moves: 0, startTime: Date.now(), endTime: null });
    if (setActiveTab) setActiveTab('memory');
  }, [pokemons, setActiveTab]);

  const handleMemoryClick = useCallback((index) => {
    setMemoryState(s => {
      if (s.flipped.length === 2 || s.solved.includes(index) || s.flipped.includes(index)) return s;
      const newFlipped = [...s.flipped, index];
      if (newFlipped.length === 2) {
        const [i1, i2] = newFlipped;
        if (s.cards[i1].id === s.cards[i2].id) {
          const newSolved = [...s.solved, i1, i2];
          setTimeout(() => {
            setMemoryState(prev => {
              const updated = { ...prev, solved: newSolved, flipped: [] };
              if (newSolved.length === prev.cards.length) updated.endTime = Date.now();
              return updated;
            });
          }, 600);
        } else {
          setTimeout(() => setMemoryState(prev => ({ ...prev, flipped: [] })), 1200);
        }
        return { ...s, flipped: newFlipped, moves: s.moves + 1 };
      }
      return { ...s, flipped: newFlipped };
    });
  }, []);

  // --- BATTLE ---
  const startBattle = useCallback((mode = 'ia') => {
    if (team.length < 6 || pokemons.length === 0) return;
    const playerTeam = team.map(p => ({ ...p, currentHP: 100 }));
    if (mode === 'ia' || mode === 'auto') {
      const enemyTeam = Array.from({ length: 6 }).map(() => ({ ...pokemons[Math.floor(Math.random() * pokemons.length)], currentHP: 100 }));
      setBattleState({ ...INITIAL_BATTLE_STATE, playerTeam, enemyTeam, logs: ['Preparez-vous au combat !'], isFighting: true, mode, currentTurn: 'player' });
      return;
    }
    if (mode === 'pvp') {
      setBattleState({ ...INITIAL_BATTLE_STATE, playerTeam, enemyTeam: [], logs: [], winner: null, isFighting: false, playerActive: 0, enemyActive: 0, mode: 'selection', currentTurn: 'player' });
    }
  }, [team, pokemons]);

  const handleManualMove = useCallback((moveType) => {
    setBattleState(s => {
      if (!s.isFighting || s.winner) return s;
      const { playerTeam, enemyTeam, playerActive, enemyActive, currentTurn, logs, mode } = s;
      const isPlayerTurn = currentTurn === 'player';
      const attacker = isPlayerTurn ? playerTeam[playerActive] : enemyTeam[enemyActive];
      const defender = isPlayerTurn ? enemyTeam[enemyActive] : playerTeam[playerActive];
      const typeMult = (TYPE_CHART[attacker.types[0].nom] && TYPE_CHART[attacker.types[0].nom][defender.types[0].nom]) ?? 1;
      const damage = Math.floor((attacker.base.Attack / defender.base.Defense) * (moveType === 'special' ? 40 : 25) * typeMult);
      const newHP = Math.max(0, defender.currentHP - damage);
      const newLogs = [`${attacker.nom} utilise ${moveType.toUpperCase()} ! -${damage} HP`, ...logs.slice(0, 4)];
      
      const animData = { target: isPlayerTurn ? 'enemy' : 'player', damage, isSuper: typeMult > 1, isResisted: typeMult < 1, id: Date.now() };

      if (isPlayerTurn) {
        const nextEnemyTeam = [...enemyTeam]; nextEnemyTeam[enemyActive].currentHP = newHP;
        if (newHP <= 0) {
          newLogs.unshift(`${defender.nom} est K.O. !`);
          if (enemyActive + 1 >= 6) {
            setBattleStats(p => ({ ...p, wins: p.wins+1 }));
            if (addLog) addLog('win', `Ligue vaincue avec ${attacker.nom} !`, { image: attacker.image });
            return { ...s, enemyTeam: nextEnemyTeam, winner: 'Joueur 1', isFighting: false, logs: ['VICTOIRE !'], attackAnim: animData };
          } else return { ...s, enemyTeam: nextEnemyTeam, enemyActive: enemyActive+1, currentTurn: mode==='pvp'?'enemy':'ia_move', logs: newLogs, attackAnim: animData };
        } else return { ...s, enemyTeam: nextEnemyTeam, currentTurn: mode==='pvp'?'enemy':'ia_move', logs: newLogs, attackAnim: animData };
      } else {
        const nextPlayerTeam = [...playerTeam]; nextPlayerTeam[playerActive].currentHP = newHP;
        if (newHP <= 0) {
          newLogs.unshift(`${defender.nom} est K.O. !`);
          if (playerActive + 1 >= 6) {
            setBattleStats(p => ({ ...p, losses: p.losses+1 }));
            return { ...s, playerTeam: nextPlayerTeam, winner: mode==='pvp'?'Joueur 2':'Ordinateur', isFighting: false, logs: ['DÉFAITE...'], attackAnim: animData };
          } else return { ...s, playerTeam: nextPlayerTeam, playerActive: playerActive+1, currentTurn: 'player', logs: newLogs, attackAnim: animData };
        } else return { ...s, playerTeam: nextPlayerTeam, currentTurn: 'player', logs: newLogs, attackAnim: animData };
      }
    });
  }, []);

  const runAutomatedBattleTurn = useEffectEvent(() => {
    handleManualMove('normal');
  });

  useEffect(() => {
    let timer;
    if (battleState.isFighting && !battleState.winner) {
      if (battleState.mode === 'auto') timer = setTimeout(() => runAutomatedBattleTurn(), 1200);
      else if (battleState.mode === 'ia' && battleState.currentTurn === 'ia_move') timer = setTimeout(() => runAutomatedBattleTurn(), 1000);
    }
    return () => clearTimeout(timer);
  }, [battleState, runAutomatedBattleTurn]);

  // --- POKEDLE ---
  const startPokedle = useCallback(() => {
    if (pokemons.length === 0) return;
    // Utiliser la date comme graine pour le choix quotidien
    const dateInt = parseInt(todayKey.replace(/-/g, ''));
    const target = pokemons[dateInt % pokemons.length];
    setPokedleState(prev => {
      if (prev.target?.id === target.id) return prev;
      return { target, guesses: [], status: 'playing' };
    });
  }, [pokemons, todayKey]);

  const submitPokedleGuess = useCallback((guess) => {
    setPokedleState(prev => {
      if (prev.status !== 'playing' || !prev.target) return prev;
      
      const target = prev.target;
      const compare = (gVal, tVal) => gVal === tVal ? 'correct' : (gVal < tVal ? 'up' : 'down');
      
      const typeResult = (gt) => {
        if (target.types.some(t => t.nom === gt.nom)) {
          return target.types[0].nom === gt.nom ? 'correct' : 'pos';
        }
        return 'fail';
      };

      const result = {
        id: compare(guess.id, target.id),
        gen: compare(getGeneration(guess.id), getGeneration(target.id)),
        types: guess.types.map(t => typeResult(t))
      };

      const isWin = guess.id === target.id;
      const newGuesses = [...prev.guesses, { pokemon: guess, result }];
      const newStatus = isWin ? 'won' : (newGuesses.length >= 6 ? 'lost' : 'playing');

      return { ...prev, guesses: newGuesses, status: newStatus };
    });
  }, []);

  // --- CRY QUIZ ---
  const startCryQuiz = useCallback(() => {
    if (pokemons.length < 4) return;
    const choices = shuffleArray(pokemons).slice(0, 4);
    const target = choices[Math.floor(Math.random() * choices.length)];
    setCryQuizState(prev => ({ ...prev, target, choices, status: 'playing' }));
  }, [pokemons]);

  const handleCryAnswer = useCallback((id) => {
    setCryQuizState(prev => {
      if (prev.status !== 'playing') return prev;
      const isCorrect = id === prev.target.id;
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const newHigh = Math.max(newStreak, prev.highscore);
      if (newHigh !== prev.highscore) localStorage.setItem('cryQuizHighscore', String(newHigh));
      return { ...prev, status: 'revealed', selectedId: id, streak: newStreak, score: isCorrect ? prev.score + 1 : prev.score, highscore: newHigh };
    });
  }, []);


  // --- GARANTIR L'ÉTAT ACTIF ---
  const ensureActiveExperienceReady = useEffectEvent(() => {
    if (pokemons.length === 0) return;
    if (activeTab === 'jeu' && !gameState.target) startNewGame();
    if (activeTab === 'quiz' && !quizState.typeA) startNewQuiz();
    if (activeTab === 'evolution-rush' && evolutionRushState.status === 'idle') startEvolutionRushRound();
    if (activeTab === 'memory' && memoryState.cards.length === 0) startMemoryGame();
    if (activeTab === 'stat-clash' && !statClashState.left) startStatClashRound();
    if (activeTab === 'pokedle' && !pokedleState.target) startPokedle();
    if (activeTab === 'cry-quiz' && !cryQuizState.target) startCryQuiz();
  });

  useEffect(() => {
    ensureActiveExperienceReady();
  }, [activeTab, evolutionRushState.status, gameState.target, memoryState.cards.length, pokemons.length, quizState.typeA, statClashState.left, ensureActiveExperienceReady]);

  return {
    gameState, startNewGame, handleGuess,
    quizState, startNewQuiz, handleQuizAnswer,
    statClashState, startStatClashRound, handleStatClashPick,
    evolutionRushState, startEvolutionRushRound, handleEvolutionRushDifficultyChange, handleEvolutionRushSelect, handleEvolutionRushRemove, clearEvolutionRushSelection, validateEvolutionRushOrder,
    memoryState, startMemoryGame, handleMemoryClick,
    battleState, setBattleState, battleStats, startBattle, handleManualMove,
    pokedleState, submitPokedleGuess, startPokedle,
    cryQuizState, startCryQuiz, handleCryAnswer
  };
}
