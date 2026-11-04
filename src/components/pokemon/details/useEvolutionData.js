import { useState, useEffect } from 'react';
import { getCachedPokemonData, setCachedPokemonData } from './detailsCache';

/**
 * Charge la chaîne d'évolution et les données techniques d'un Pokémon (cache local puis PokeAPI).
 */
export function useEvolutionData(pokemon, pokemons) {
  const [evoChain, setEvoChain] = useState(() => getCachedPokemonData(pokemon.id)?.chain ?? []);
  const [loadingEvo, setLoadingEvo] = useState(() => !getCachedPokemonData(pokemon.id));
  const [technicalData, setTechnicalData] = useState(() => getCachedPokemonData(pokemon.id)?.technicalData ?? null);

  useEffect(() => {
    const cached = getCachedPokemonData(pokemon.id);

    if (cached) {
      setEvoChain(cached.chain || []);
      setTechnicalData(cached.technicalData || null);
      setLoadingEvo(false);
      return;
    }

    setLoadingEvo(true);
    setEvoChain([]);

    const fetchEvo = async () => {
      try {
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`).then((r) => r.json());
        const evoRes = await fetch(speciesRes.evolution_chain.url).then((r) => r.json());

        const chain = [];
        let curr = evoRes.chain;

        const getTriggerLabel = (details) => {
          if (!details || !details[0]) return null;
          const d = details[0];
          if (d.trigger.name === 'level-up') {
            if (d.min_level) return `Niv. ${d.min_level}`;
            if (d.min_happiness) return 'Bonheur';
            if (d.known_move) return 'Capacite';
            return 'Niveau';
          }
          if (d.trigger.name === 'use-item') return d.item?.name.replace(/-/g, ' ').toUpperCase() || 'Objet';
          if (d.trigger.name === 'trade') return 'Echange';
          return d.trigger.name;
        };

        const processNode = async (node) => {
          const id = parseInt(node.species.url.split('/').filter(Boolean).pop(), 10);
          const localP = pokemons.find((p) => p.id === id);
          chain.push({
            id,
            nom: localP ? localP.nom : node.species.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            condition: getTriggerLabel(node.evolution_details),
          });
          if (node.evolves_to.length > 0) {
            await processNode(node.evolves_to[0]);
          }
        };

        await processNode(curr);

        const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`).then((r) => r.json());

        const techData = {
          eggGroups: speciesRes.egg_groups?.map(g => g.name) || [],
          genderRate: speciesRes.gender_rate,
          hatchCounter: speciesRes.hatch_counter,
          captureRate: speciesRes.capture_rate,
          baseHappiness: speciesRes.base_happiness,
          growthRate: speciesRes.growth_rate?.name.replace(/-/g, ' ') || 'Inconnu',
          genus: speciesRes.genera?.find(g => g.language.name === 'fr')?.genus || 'Inconnu',
          height: pokemonRes.height / 10,
          weight: pokemonRes.weight / 10,
        };

        setEvoChain(chain);
        setTechnicalData(techData);
        setCachedPokemonData(pokemon.id, { chain, technicalData: techData });
      } catch (err) {
        console.error("Erreur de recuperation des evolutions :", err);
      } finally {
        setLoadingEvo(false);
      }
    };

    fetchEvo();
  }, [pokemon.id, pokemons]);

  return { evoChain, loadingEvo, technicalData };
}
