import { EVOLUTION_RUSH_DIFFICULTIES } from '../constants/gameMeta';

export const getTodayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const createDailyActivityState = (date = getTodayKey()) => ({
  date,
  viewedPokemonIds: [],
  evolutionValidated: false,
  completedChallengeIds: []
});

export const getInitialDailyActivity = () => {
  const fallback = createDailyActivityState();
  try {
    const storedValue = localStorage.getItem('pokedexDailyActivity');
    if (!storedValue) return fallback;
    const parsedValue = JSON.parse(storedValue);
    if (!parsedValue || parsedValue.date !== fallback.date) return fallback;
    return {
      ...fallback,
      ...parsedValue,
      viewedPokemonIds: Array.isArray(parsedValue.viewedPokemonIds) ? parsedValue.viewedPokemonIds : [],
      completedChallengeIds: Array.isArray(parsedValue.completedChallengeIds) ? parsedValue.completedChallengeIds : []
    };
  } catch (error) {
    console.error('Impossible de lire le defi du jour:', error);
    return fallback;
  }
};

export const shuffleArray = (items) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
};

export const getSpeciesIdFromUrl = (url) => Number(url.split('/').filter(Boolean).pop());

export const getEvolutionRushDifficulty = (difficultyId) =>
  EVOLUTION_RUSH_DIFFICULTIES.find((difficulty) => difficulty.id === difficultyId) ?? EVOLUTION_RUSH_DIFFICULTIES[1];

export const getInitialEvolutionRushBestStreaks = () => {
  const defaults = Object.fromEntries(EVOLUTION_RUSH_DIFFICULTIES.map((difficulty) => [difficulty.id, 0]));
  try {
    const stored = JSON.parse(localStorage.getItem('evolutionRushBestStreaks') || '{}');
    return { ...defaults, ...stored };
  } catch {
    return defaults;
  }
};

export const getEvolutionRushChain = async (pokemonId, pokemonList) => {
  const cacheKey = `evolutionRushChain_${pokemonId}`;
  const cachedIds = localStorage.getItem(cacheKey);
  if (cachedIds) {
    const ids = JSON.parse(cachedIds);
    return ids.map((id) => pokemonList.find((pokemon) => pokemon.id === id)).filter(Boolean);
  }
  const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`).then((r) => r.json());
  const evolutionRes = await fetch(speciesRes.evolution_chain.url).then((r) => r.json());
  const ids = [];
  let currentNode = evolutionRes.chain;
  while (currentNode) {
    ids.push(getSpeciesIdFromUrl(currentNode.species.url));
    currentNode = currentNode.evolves_to?.[0] ?? null;
  }
  localStorage.setItem(cacheKey, JSON.stringify(ids));
  return ids.map((id) => pokemonList.find((pokemon) => pokemon.id === id)).filter(Boolean);
};

export const buildEvolutionRushChainForDifficulty = (chain, difficultyId) => {
  const difficulty = getEvolutionRushDifficulty(difficultyId);
  if (chain.length < difficulty.minChainLength) {
    return null;
  }
  return difficulty.targetLength ? chain.slice(0, difficulty.targetLength) : chain;
};
