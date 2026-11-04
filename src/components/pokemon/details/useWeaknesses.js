import { useMemo } from 'react';
import { TYPE_CHART } from '../../../constants/pokemon';

/**
 * Multiplicateurs de dégâts subis par un Pokémon, par type attaquant (hors x1).
 */
export function useWeaknesses(pokemon) {
  return useMemo(() => {
    const list = {};
    Object.keys(TYPE_CHART).forEach((type) => {
      let mult = 1;
      pokemon.types.forEach((pType) => {
        mult *= (TYPE_CHART[type] && TYPE_CHART[type][pType.nom]) ?? 1;
      });
      if (mult !== 1) list[type] = mult;
    });
    return list;
  }, [pokemon]);
}
