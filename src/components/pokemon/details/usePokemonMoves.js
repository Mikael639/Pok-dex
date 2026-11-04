import { useState, useEffect, useMemo } from 'react';
import { getCachedMove, setCachedMove } from './detailsCache';

const createEmptyMoves = () => ({ 'level-up': [], 'machine': [], 'egg': [], 'tutor': [] });

/**
 * Charge et catégorise les attaques d'un Pokémon (par méthode d'apprentissage),
 * puis charge les détails de la méthode active uniquement. `enabled` évite tout appel réseau
 * tant que l'onglet des attaques n'est pas affiché.
 */
export function usePokemonMoves(pokemonId, enabled) {
  const [activeMoveFilter, setActiveMoveFilter] = useState('all'); // 'all' | 'physical' | 'special' | 'status'
  const [activeLearnMethod, setActiveLearnMethod] = useState('level-up'); // 'level-up' | 'machine' | 'egg' | 'tutor'
  const [movesByMethod, setMovesByMethod] = useState(createEmptyMoves);
  const [isCategorized, setIsCategorized] = useState(false);
  const [loadingMoves, setLoadingMoves] = useState(false);
  const [trackedPokemonId, setTrackedPokemonId] = useState(pokemonId);

  // Changement de Pokémon (navigation entre évolutions) : on repart d'un état vierge.
  if (trackedPokemonId !== pokemonId) {
    setTrackedPokemonId(pokemonId);
    setMovesByMethod(createEmptyMoves());
    setIsCategorized(false);
    setActiveMoveFilter('all');
    setActiveLearnMethod('level-up');
  }

  // --- FETCH MOVES ---
  useEffect(() => {
    if (!enabled) return;

    const fetchMoves = async () => {
      // Si on a déjà les détails pour cette méthode, on ne refait rien
      const currentMethodMoves = movesByMethod[activeLearnMethod] || [];
      if (isCategorized && (currentMethodMoves.length === 0 || currentMethodMoves.every(m => m.detailsLoaded))) return;

      setLoadingMoves(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).then(r => r.json());
        
        // Catégoriser toutes les attaques si pas encore fait
        let grouped = { ...movesByMethod };
        if (!isCategorized) {
          res.moves.forEach(m => {
            const detail = m.version_group_details.find(d => d.version_group.name === 'scarlet-violet') || m.version_group_details[0];
            const method = detail.move_learn_method.name;
            if (grouped[method]) {
              grouped[method].push({
                name: m.move.name,
                url: m.move.url,
                level: detail.level_learned_at,
                detailsLoaded: false
              });
            }
          });
          // Trier
          grouped['level-up'].sort((a, b) => a.level - b.level);
          grouped['machine'].sort((a, b) => a.name.localeCompare(b.name));
          setIsCategorized(true);
        }

        // Fetch les détails UNIQUEMENT pour la méthode active
        const movesToLoad = grouped[activeLearnMethod];
        if (movesToLoad.length > 0) {
          const detailedMoves = await Promise.all(
            movesToLoad.map(async (m) => {
              if (m.detailsLoaded) return m;

              const cached = getCachedMove(m.url);
              if (cached) return { ...m, ...cached, detailsLoaded: true };

              try {
                const mData = await fetch(m.url).then(r => r.json());
                const frenchName = mData.names.find(n => n.language.name === 'fr')?.name || m.name.replace(/-/g, ' ');
                
                const moveData = {
                  displayName: frenchName,
                  type: mData.type.name,
                  power: mData.power,
                  accuracy: mData.accuracy,
                  category: mData.damage_class.name,
                  pp: mData.pp,
                  detailsLoaded: true
                };

                setCachedMove(m.url, moveData);
                return { ...m, ...moveData };
              } catch {
                return { ...m, displayName: m.name.replace(/-/g, ' '), detailsLoaded: true };
              }
            })
          );
          grouped[activeLearnMethod] = detailedMoves;
        }

        setMovesByMethod(grouped);
      } catch (err) {
        console.error("Erreur moves:", err);
      } finally {
        setLoadingMoves(false);
      }
    };

    fetchMoves();
  // movesByMethod est volontairement exclu : l'effet le met à jour lui-même (boucle infinie sinon).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, activeLearnMethod, pokemonId, isCategorized]);

  const filteredMoves = useMemo(() => {
    const currentMoves = movesByMethod[activeLearnMethod] || [];
    if (activeMoveFilter === 'all') return currentMoves;
    return currentMoves.filter(m => m.category === activeMoveFilter);
  }, [movesByMethod, activeLearnMethod, activeMoveFilter]);

  return {
    movesByMethod,
    filteredMoves,
    loadingMoves,
    activeMoveFilter,
    setActiveMoveFilter,
    activeLearnMethod,
    setActiveLearnMethod
  };
}
