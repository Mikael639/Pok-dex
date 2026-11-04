import { useEffect, useEffectEvent } from 'react';
import { useSilhouetteGame } from './games/useSilhouetteGame';
import { useTypeQuiz } from './games/useTypeQuiz';
import { useStatClash } from './games/useStatClash';
import { useEvolutionRush } from './games/useEvolutionRush';
import { useMemoryGame } from './games/useMemoryGame';
import { useBattle } from './games/useBattle';
import { usePokedle } from './games/usePokedle';
import { useCryQuiz } from './games/useCryQuiz';

/**
 * Compose les hooks de chaque jeu et prépare automatiquement le jeu de l'onglet actif.
 * La logique propre à chaque jeu vit dans `src/hooks/games/`.
 */
export function useGames({ pokemons, team, markDailyFlag, activeTab, setActiveTab, addLog }) {
  const silhouette = useSilhouetteGame({ pokemons });
  const typeQuiz = useTypeQuiz({ markDailyFlag });
  const statClash = useStatClash({ pokemons, markDailyFlag });
  const evolutionRush = useEvolutionRush({ pokemons, markDailyFlag });
  const memory = useMemoryGame({ pokemons, setActiveTab });
  const battle = useBattle({ pokemons, team, addLog });
  const pokedle = usePokedle({ pokemons });
  const cryQuiz = useCryQuiz({ pokemons });

  const { gameState, startNewGame } = silhouette;
  const { quizState, startNewQuiz } = typeQuiz;
  const { statClashState, startStatClashRound } = statClash;
  const { evolutionRushState, startEvolutionRushRound } = evolutionRush;
  const { memoryState, startMemoryGame } = memory;
  const { pokedleState, startPokedle } = pokedle;
  const { cryQuizState, startCryQuiz } = cryQuiz;

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
    ...silhouette,
    ...typeQuiz,
    ...statClash,
    ...evolutionRush,
    ...memory,
    ...battle,
    ...pokedle,
    ...cryQuiz
  };
}
