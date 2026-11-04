import { useState, useCallback } from 'react';
import { shuffleArray } from '../../utils/gameLogic';

export function useCryQuiz({ pokemons }) {
  const [cryQuizState, setCryQuizState] = useState({
    target: null, choices: [], status: 'idle', score: 0, streak: 0,
    highscore: parseInt(localStorage.getItem('cryQuizHighscore') || '0')
  });

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

  return {
    cryQuizState, startCryQuiz, handleCryAnswer
  };
}
