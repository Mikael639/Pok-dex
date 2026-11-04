import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Header from '../components/layout/Header';

const baseProps = {
  activeTab: 'collection',
  pokemonsLength: 6,
  setIsMobileMenuOpen: vi.fn(),
  showBrowseControls: true,
  searchQuery: '',
  setSearchQuery: vi.fn(),
  suggestionPokemons: [],
  setSelectedPokemon: vi.fn(),
  typeFilter: 'Tous',
  setTypeFilter: vi.fn(),
  sortBy: 'id',
  setSortBy: vi.fn(),
  isFavoritesOnly: false,
  setIsFavoritesOnly: vi.fn(),
  getRandomPokemon: vi.fn(),
  setPage: vi.fn(),
  isDarkMode: false,
  trainerStats: { trainerTitle: 'Novice', trainerScore: 0 },
  activeRegion: null,
  setActiveRegion: vi.fn()
};

describe('Header', () => {
  it('bascule le filtre favoris', async () => {
    const user = userEvent.setup();
    const setIsFavoritesOnly = vi.fn();
    render(<Header {...baseProps} setIsFavoritesOnly={setIsFavoritesOnly} />);

    await user.click(screen.getByRole('button', { name: /Afficher uniquement les favoris/i }));

    expect(setIsFavoritesOnly).toHaveBeenCalledWith(true);
  });

  it('declenche le Pokemon aleatoire', async () => {
    const user = userEvent.setup();
    const getRandomPokemon = vi.fn();
    render(<Header {...baseProps} getRandomPokemon={getRandomPokemon} />);

    await user.click(screen.getByRole('button', { name: /Pokemon aleatoire/i }));

    expect(getRandomPokemon).toHaveBeenCalledTimes(1);
  });
});
