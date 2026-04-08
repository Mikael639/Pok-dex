import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ComparisonModal from '../components/pokemon/ComparisonModal';
import { TEST_POKEMONS } from './fixtures/pokemonFixtures';

describe('ComparisonModal', () => {
  it('affiche les candidats disponibles sans proposer le Pokemon deja selectionne', () => {
    render(
      <ComparisonModal
        p1={TEST_POKEMONS[0]}
        pokemons={TEST_POKEMONS}
        isDarkMode={false}
        onClose={vi.fn()}
      />
    );

    const dialog = screen.getByRole('dialog', { name: /Comparaison de Bulbizarre/i });
    const scope = within(dialog);
    const searchInput = scope.getByRole('textbox', { name: /Rechercher un Pokemon a comparer/i });

    expect(scope.getByText(/Base stat total: 318/i)).toBeInTheDocument();
    expect(scope.getByText(/Base stat total: 405/i)).toBeInTheDocument();

    expect(searchInput).toBeInTheDocument();
    expect(scope.queryByRole('button', { name: /Comparer avec Bulbizarre/i })).not.toBeInTheDocument();
    expect(scope.getByRole('button', { name: /Comparer avec Herbizarre/i })).toBeInTheDocument();
    expect(scope.getByRole('button', { name: /Comparer avec Salameche/i })).toBeInTheDocument();
  });

  it('ferme la modal via le bouton de fermeture', () => {
    const onClose = vi.fn();

    render(
      <ComparisonModal
        p1={TEST_POKEMONS[0]}
        pokemons={TEST_POKEMONS}
        isDarkMode={false}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Fermer la comparaison/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('place le focus dans la recherche et boucle au clavier dans la modale', async () => {
    const user = userEvent.setup();

    render(
      <ComparisonModal
        p1={TEST_POKEMONS[0]}
        pokemons={TEST_POKEMONS}
        isDarkMode={false}
        onClose={vi.fn()}
      />
    );

    const searchInput = screen.getByRole('textbox', { name: /Rechercher un Pokemon a comparer/i });
    const closeButton = screen.getByRole('button', { name: /Fermer la comparaison/i });
    const lastCandidate = screen.getByRole('button', { name: /Comparer avec Dracaufeu/i });

    expect(searchInput).toHaveFocus();

    closeButton.focus();
    await user.tab({ shift: true });

    expect(lastCandidate).toHaveFocus();
  });
});
