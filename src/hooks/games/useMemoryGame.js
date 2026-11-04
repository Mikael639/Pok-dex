import { useState, useCallback } from 'react';

export function useMemoryGame({ pokemons, setActiveTab }) {
  const [memoryState, setMemoryState] = useState({ cards: [], flipped: [], solved: [], moves: 0, startTime: null, endTime: null });

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

  return {
    memoryState, startMemoryGame, handleMemoryClick
  };
}
