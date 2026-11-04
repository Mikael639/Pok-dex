import { useState, useEffect, useCallback, useEffectEvent } from 'react';

export function useSilhouetteGame({ pokemons }) {
  const [gameState, setGameState] = useState({
    target: null, choices: [], status: 'playing', score: 0, streak: 0, bestStreak: 0, 
    selectedId: null, timeLeft: 10, timerRunning: false,
    highscore: parseInt(localStorage.getItem('silhouetteHighscore') || '0')
  });

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

  return {
    gameState, startNewGame, handleGuess
  };
}
