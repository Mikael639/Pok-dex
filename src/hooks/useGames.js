import { useEffect, useEffectEvent } from 'react';
import { useSilhouetteGame } from './games/useSilhouetteGame';
import { useEvolutionRush } from './games/useEvolutionRush';
import { useMemoryGame } from './games/useMemoryGame';
import { useBattle } from './games/useBattle';
import { useCryQuiz } from './games/useCryQuiz';

/**
 * Compose les hooks de chaque jeu et prépare automatiquement le jeu de l'onglet actif.
 * La logique propre à chaque jeu vit dans `src/hooks/games/`.
 */
export function useGames({ pokemons, team, markDailyFlag, activeTab, setActiveTab, addLog }) {
  const silhouette = useSilhouetteGame({ pokemons });
  const evolutionRush = useEvolutionRush({ pokemons, markDailyFlag });
  const memory = useMemoryGame({ pokemons, setActiveTab });
  const battle = useBattle({ pokemons, team, addLog });
  const cryQuiz = useCryQuiz({ pokemons });

  const { gameState, startNewGame } = silhouette;
  const { evolutionRushState, startEvolutionRushRound } = evolutionRush;
  const { memoryState, startMemoryGame } = memory;
  const { cryQuizState, startCryQuiz } = cryQuiz;

  // --- GARANTIR L'ÉTAT ACTIF ---
  const ensureActiveExperienceReady = useEffectEvent(() => {
    if (pokemons.length === 0) return;
    if (activeTab === 'jeu' && !gameState.target) startNewGame();
    if (activeTab === 'evolution-rush' && evolutionRushState.status === 'idle') startEvolutionRushRound();
    if (activeTab === 'memory' && memoryState.cards.length === 0) startMemoryGame();
    if (activeTab === 'cry-quiz' && !cryQuizState.target) startCryQuiz();
  });

  useEffect(() => {
    ensureActiveExperienceReady();
  }, [activeTab, evolutionRushState.status, gameState.target, memoryState.cards.length, pokemons.length, ensureActiveExperienceReady]);

  return {
    ...silhouette,
    ...evolutionRush,
    ...memory,
    ...battle,
    ...cryQuiz
  };
}
