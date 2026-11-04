import { describe, expect, it } from 'vitest';
import { computeDamage, resolveMove } from '../utils/battleLogic';
import { INITIAL_BATTLE_STATE } from '../constants/gameMeta';
import { TEST_POKEMONS } from './fixtures/pokemonFixtures';

const team = (hp = 100) => TEST_POKEMONS.map((pokemon) => ({ ...pokemon, currentHP: hp }));

const fighting = (overrides = {}) => ({
  ...INITIAL_BATTLE_STATE,
  playerTeam: team(),
  enemyTeam: team(),
  isFighting: true,
  mode: 'ia',
  currentTurn: 'player',
  logs: ['Preparez-vous au combat !'],
  ...overrides
});

// Gèle récursivement l'état : toute mutation lèverait une erreur (mode strict des modules ES).
const deepFreeze = (value) => {
  Object.values(value).forEach((child) => {
    if (child && typeof child === 'object') deepFreeze(child);
  });
  return Object.freeze(value);
};

describe('resolveMove', () => {
  it("applique les degats sans modifier l'etat recu", () => {
    const state = deepFreeze(fighting());
    const next = resolveMove(state, 'normal');
    const { damage } = computeDamage(state.playerTeam[0], state.enemyTeam[0], 'normal');

    expect(next.enemyTeam[0].currentHP).toBe(100 - damage);
    expect(state.enemyTeam[0].currentHP).toBe(100);
    expect(next.currentTurn).toBe('ia_move');
    expect(next.logs[0]).toMatch(/Bulbizarre utilise ATTAQUE/);
  });

  it("donne la main au joueur 2 en PvP puis revient au joueur 1", () => {
    const afterP1 = resolveMove(fighting({ mode: 'pvp' }), 'normal');
    expect(afterP1.currentTurn).toBe('enemy');
    expect(resolveMove(afterP1, 'normal').currentTurn).toBe('player');
  });

  it("passe au Pokemon suivant sur un K.O.", () => {
    const next = resolveMove(fighting({ enemyTeam: team(1) }), 'normal');

    expect(next.enemyTeam[0].currentHP).toBe(0);
    expect(next.enemyActive).toBe(1);
    expect(next.winner).toBeNull();
    expect(next.logs[0]).toMatch(/est K\.O\./);
  });

  it("declare la victoire quand le dernier Pokemon adverse tombe", () => {
    const enemyTeam = team(0).map((pokemon, index) => (index === 5 ? { ...pokemon, currentHP: 1 } : pokemon));
    const next = resolveMove(fighting({ enemyTeam, enemyActive: 5 }), 'normal');

    expect(next.winner).toBe('Joueur 1');
    expect(next.winnerPokemon).toMatchObject({ nom: 'Bulbizarre' });
    expect(next.isFighting).toBe(false);
  });

  it("declare la defaite du joueur face a l'ordinateur", () => {
    const playerTeam = team(0).map((pokemon, index) => (index === 5 ? { ...pokemon, currentHP: 1 } : pokemon));
    const next = resolveMove(fighting({ playerTeam, playerActive: 5, currentTurn: 'ia_move' }), 'normal');

    expect(next.winner).toBe('Ordinateur');
  });

  it('ignore un coup quand le combat est termine', () => {
    const state = fighting({ winner: 'Joueur 1', isFighting: false });
    expect(resolveMove(state, 'normal')).toBe(state);
  });
});
