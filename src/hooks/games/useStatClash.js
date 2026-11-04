import { useState, useCallback } from 'react';
import { createStatClashRound } from '../../utils/gameLogic';

export function useStatClash({ pokemons, markDailyFlag }) {
  const [statClashState, setStatClashState] = useState({
    left: null, right: null, statId: '', statLabel: '', leftValue: 0, rightValue: 0,
    correctId: null, status: 'idle', selectedId: null, score: 0, streak: 0,
    bestStreak: parseInt(localStorage.getItem('statClashBestStreak') || '0')
  });

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

  return {
    statClashState, startStatClashRound, handleStatClashPick
  };
}
