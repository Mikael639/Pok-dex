import { useState, useCallback } from 'react';
import { TYPE_CHART } from '../../constants/pokemon';

export function useTypeQuiz({ markDailyFlag }) {
  const [quizState, setQuizState] = useState({
    typeA: '', typeB: '', options: [0, 0.5, 1, 2], status: 'idle', 
    score: 0, streak: 0, feedback: null, survivalMode: false, lives: 3,
    highscore: parseInt(localStorage.getItem('quizHighscore') || '0')
  });

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

  return {
    quizState, startNewQuiz, handleQuizAnswer
  };
}
