/**
 * Lit une valeur JSON dans le localStorage sans jamais lever d'exception.
 * Retourne `fallback` si la clé est absente, si le JSON est invalide ou si le
 * stockage est indisponible (navigation privée, quota, etc.).
 */
export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}
