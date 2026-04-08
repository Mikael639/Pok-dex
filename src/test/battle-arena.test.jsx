import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import BattleArena from '../components/games/BattleArena';
import { TEST_POKEMONS } from './fixtures/pokemonFixtures';

const baseSelectionState = {
  playerTeam: TEST_POKEMONS.map((pokemon) => ({ ...pokemon, currentHP: 100 })),
  enemyTeam: [],
  logs: [],
  turn: 0,
  winner: null,
  isFighting: false,
  playerActive: 0,
  enemyActive: 0,
  attackAnim: null,
  mode: 'selection',
  currentTurn: 'player'
};

describe('BattleArena', () => {
  it("compose l'equipe adverse, empeche les doublons et permet un retrait", () => {
    const setBattleState = vi.fn();
    const { rerender } = render(
      <BattleArena
        state={baseSelectionState}
        onStart={vi.fn()}
        teamLength={6}
        pokemons={TEST_POKEMONS}
        onManualMove={vi.fn()}
        setBattleState={setBattleState}
      />
    );

    fireEvent.change(screen.getByRole('textbox', { name: /Rechercher un Pokemon pour l equipe adverse/i }), {
      target: { value: 'Sala' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Ajouter Salameche a l equipe adverse/i }));

    expect(setBattleState).toHaveBeenCalledTimes(1);

    const addEnemyUpdater = setBattleState.mock.calls[0][0];
    const nextState = addEnemyUpdater(baseSelectionState);

    expect(nextState.enemyTeam).toHaveLength(1);
    expect(nextState.enemyTeam[0]).toMatchObject({ id: 4, nom: 'Salameche', currentHP: 100 });

    setBattleState.mockClear();

    rerender(
      <BattleArena
        state={nextState}
        onStart={vi.fn()}
        teamLength={6}
        pokemons={TEST_POKEMONS}
        onManualMove={vi.fn()}
        setBattleState={setBattleState}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Ajouter Salameche a l equipe adverse/i }));

    expect(setBattleState).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Retirer Salameche de l equipe adverse/i }));

    expect(setBattleState).toHaveBeenCalledTimes(1);

    const removeEnemyUpdater = setBattleState.mock.calls[0][0];
    const resetState = removeEnemyUpdater(nextState);

    expect(resetState.enemyTeam).toHaveLength(0);
  });
});
