// Cache localStorage des données PokeAPI (évolutions, données techniques, attaques).
// Toutes les fonctions échouent silencieusement (stockage plein, indisponible, JSON invalide).

export const getCachedPokemonData = (pokemonId) => {
  try {
    const cachedData = localStorage.getItem(`pokemon_details_cache_${pokemonId}`);
    if (!cachedData) return null;
    return JSON.parse(cachedData);
  } catch {
    return null;
  }
};

export const setCachedPokemonData = (pokemonId, data) => {
  try {
    localStorage.setItem(`pokemon_details_cache_${pokemonId}`, JSON.stringify(data));
  } catch {
    // Silent fail
  }
};

export const getCachedMove = (moveUrl) => {
  try {
    const moveId = moveUrl.split('/').filter(Boolean).pop();
    const cachedData = localStorage.getItem(`move_cache_${moveId}`);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch {
    return null;
  }
};

export const setCachedMove = (moveUrl, data) => {
  try {
    const moveId = moveUrl.split('/').filter(Boolean).pop();
    localStorage.setItem(`move_cache_${moveId}`, JSON.stringify(data));
  } catch {
    // Fail silently if localStorage is full
  }
};

