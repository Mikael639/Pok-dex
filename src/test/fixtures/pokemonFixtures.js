export const TEST_POKEMONS = [
  {
    id: 1,
    nom: 'Bulbizarre',
    image: 'https://img.test/1.png',
    types: [{ nom: 'Plante' }, { nom: 'Poison' }],
    base: { HP: 45, Attack: 49, Defense: 49, 'Sp. Attack': 65, 'Sp. Defense': 65, Speed: 45 }
  },
  {
    id: 2,
    nom: 'Herbizarre',
    image: 'https://img.test/2.png',
    types: [{ nom: 'Plante' }, { nom: 'Poison' }],
    base: { HP: 60, Attack: 62, Defense: 63, 'Sp. Attack': 80, 'Sp. Defense': 80, Speed: 60 }
  },
  {
    id: 3,
    nom: 'Florizarre',
    image: 'https://img.test/3.png',
    types: [{ nom: 'Plante' }, { nom: 'Poison' }],
    base: { HP: 80, Attack: 82, Defense: 83, 'Sp. Attack': 100, 'Sp. Defense': 100, Speed: 80 }
  },
  {
    id: 4,
    nom: 'Salameche',
    image: 'https://img.test/4.png',
    types: [{ nom: 'Feu' }],
    base: { HP: 39, Attack: 52, Defense: 43, 'Sp. Attack': 60, 'Sp. Defense': 50, Speed: 65 }
  },
  {
    id: 5,
    nom: 'Reptincel',
    image: 'https://img.test/5.png',
    types: [{ nom: 'Feu' }],
    base: { HP: 58, Attack: 64, Defense: 58, 'Sp. Attack': 80, 'Sp. Defense': 65, Speed: 80 }
  },
  {
    id: 6,
    nom: 'Dracaufeu',
    image: 'https://img.test/6.png',
    types: [{ nom: 'Feu' }, { nom: 'Vol' }],
    base: { HP: 78, Attack: 84, Defense: 78, 'Sp. Attack': 109, 'Sp. Defense': 85, Speed: 100 }
  }
];

export const EVOLUTION_CHAINS = {
  1: {
    chain: {
      species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
      evolution_details: [],
      evolves_to: [
        {
          species: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
          evolution_details: [{ trigger: { name: 'level-up' }, min_level: 16 }],
          evolves_to: [
            {
              species: { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon-species/3/' },
              evolution_details: [{ trigger: { name: 'level-up' }, min_level: 32 }],
              evolves_to: []
            }
          ]
        }
      ]
    }
  },
  4: {
    chain: {
      species: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon-species/4/' },
      evolution_details: [],
      evolves_to: [
        {
          species: { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon-species/5/' },
          evolution_details: [{ trigger: { name: 'level-up' }, min_level: 16 }],
          evolves_to: [
            {
              species: { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon-species/6/' },
              evolution_details: [{ trigger: { name: 'level-up' }, min_level: 36 }],
              evolves_to: []
            }
          ]
        }
      ]
    }
  }
};
