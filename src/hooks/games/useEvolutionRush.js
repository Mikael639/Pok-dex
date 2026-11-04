import { useState, useCallback } from 'react';
import {
  getEvolutionRushDifficulty,
  getInitialEvolutionRushBestStreaks,
  shuffleArray,
  getEvolutionRushChain,
  buildEvolutionRushChainForDifficulty
} from '../../utils/gameLogic';

export function useEvolutionRush({ pokemons, markDailyFlag }) {
  const [evolutionRushState, setEvolutionRushState] = useState({
    difficulty: localStorage.getItem('evolutionRushDifficulty') || 'dresseur',
    bestStreaks: getInitialEvolutionRushBestStreaks(),
    chain: [], choices: [], selectedOrder: [], status: 'idle', feedback: null, score: 0, streak: 0
  });

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

  return {
    evolutionRushState, startEvolutionRushRound, handleEvolutionRushDifficultyChange, handleEvolutionRushSelect, handleEvolutionRushRemove, clearEvolutionRushSelection, validateEvolutionRushOrder
  };
}
