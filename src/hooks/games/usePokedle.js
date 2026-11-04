import { useState, useEffect, useCallback } from 'react';
import { getGeneration } from '../../constants/gameMeta';
import { readJSON } from '../../lib/storage';
import { getTodayKey } from '../../utils/gameLogic';

export function usePokedle({ pokemons }) {
  const [todayKey] = useState(() => getTodayKey());

  const [pokedleState, setPokedleState] = useState(() => {
    const saved = readJSON(`pokedleState_${getTodayKey()}`, { target: null, guesses: [], status: 'playing' });
    return saved;
  });

  useEffect(() => { localStorage.setItem(`pokedleState_${todayKey}`, JSON.stringify(pokedleState)); }, [pokedleState, todayKey]);

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

  return {
    pokedleState, submitPokedleGuess, startPokedle
  };
}
