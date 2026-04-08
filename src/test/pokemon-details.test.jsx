import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PokemonDetails from '../components/pokemon/PokemonDetails';
import { TEST_POKEMONS } from './fixtures/pokemonFixtures';
import { installPokemonFetchMock } from './utils';

describe('PokemonDetails', () => {
  it("charge la chaine d'evolution et permet de naviguer vers une evolution", async () => {
    const onNavigate = vi.fn();
    installPokemonFetchMock();

    render(
      <PokemonDetails
        pokemon={TEST_POKEMONS[0]}
        isDarkMode={false}
        pokemons={TEST_POKEMONS}
        onClose={vi.fn()}
        onNavigate={onNavigate}
        onCatch={vi.fn()}
        isCaught={false}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        onCompare={vi.fn()}
      />
    );

    expect(await screen.findByText(/Niv. 16/i)).toBeInTheDocument();
    expect(screen.getByAltText('Herbizarre')).toBeInTheDocument();
    expect(screen.getByAltText('Florizarre')).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByAltText('Herbizarre'));

    expect(onNavigate).toHaveBeenCalledWith(TEST_POKEMONS[1]);
  });

  it("utilise le cache local des evolutions pour eviter un nouvel appel reseau", async () => {
    localStorage.setItem(
      'evo_cache_1',
      JSON.stringify([
        { id: 1, nom: 'Bulbizarre', image: 'https://img.test/1.png', condition: null },
        { id: 2, nom: 'Herbizarre', image: 'https://img.test/2.png', condition: 'Niv. 16' }
      ])
    );

    installPokemonFetchMock();

    render(
      <PokemonDetails
        pokemon={TEST_POKEMONS[0]}
        isDarkMode={false}
        pokemons={TEST_POKEMONS}
        onClose={vi.fn()}
        onNavigate={vi.fn()}
        onCatch={vi.fn()}
        isCaught={false}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        onCompare={vi.fn()}
      />
    );

    expect(await screen.findByText(/Niv. 16/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(globalThis.fetch).not.toHaveBeenCalled();
    });
  });

  it('verrouille le scroll de fond et garde des actions focusables', async () => {
    installPokemonFetchMock();

    render(
      <PokemonDetails
        pokemon={TEST_POKEMONS[0]}
        isDarkMode={false}
        pokemons={TEST_POKEMONS}
        onClose={vi.fn()}
        onNavigate={vi.fn()}
        onCatch={vi.fn()}
        isCaught={false}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        onCompare={vi.fn()}
      />
    );

    const closeButton = screen.getByRole('button', { name: /Fermer la fiche Pokemon/i });

    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    closeButton.focus();
    expect(closeButton).toHaveFocus();
  });
});
