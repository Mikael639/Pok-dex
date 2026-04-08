import { vi } from 'vitest';
import { EVOLUTION_CHAINS, TEST_POKEMONS } from './fixtures/pokemonFixtures';

const buildSpeciesResponse = (id) => ({
  evolution_chain: {
    url: `https://pokeapi.co/api/v2/evolution-chain/${id}/`
  }
});

const createFetchResponse = (payload) => ({
  ok: true,
  json: async () => payload
});

export function installPokemonFetchMock() {
  return vi.stubGlobal(
    'fetch',
    vi.fn(async (input) => {
      const url = typeof input === 'string' ? input : input.url;

      if (url.endsWith('/pokedex.json')) {
        return createFetchResponse({ pokemons: TEST_POKEMONS });
      }

      const speciesMatch = url.match(/pokemon-species\/(\d+)/);
      if (speciesMatch) {
        const id = Number(speciesMatch[1]);
        return createFetchResponse(buildSpeciesResponse(id));
      }

      const evolutionMatch = url.match(/evolution-chain\/(\d+)/);
      if (evolutionMatch) {
        const id = Number(evolutionMatch[1]);
        return createFetchResponse(
          EVOLUTION_CHAINS[id] ?? {
            chain: {
              species: { url: `https://pokeapi.co/api/v2/pokemon-species/${id}/` },
              evolution_details: [],
              evolves_to: []
            }
          }
        );
      }

      throw new Error(`Unhandled fetch call: ${url}`);
    })
  );
}
