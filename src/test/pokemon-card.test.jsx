import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import PokemonCard from '../components/pokemon/PokemonCard';
import { TEST_POKEMONS } from './fixtures/pokemonFixtures';

describe('PokemonCard', () => {
  it('ouvre la fiche au clic sur la carte et via le clavier', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <PokemonCard
        pokemon={TEST_POKEMONS[0]}
        isCaught={false}
        isFavorite={false}
        isDarkMode={false}
        onClick={onClick}
        onCatch={vi.fn()}
        onToggleFavorite={vi.fn()}
      />
    );

    const card = screen.getByRole('button', { name: /Voir Bulbizarre/i });

    await user.click(card);
    await user.keyboard('{Enter}');

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("declenche les actions rapides sans ouvrir la fiche", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onCatch = vi.fn();
    const onToggleFavorite = vi.fn();

    render(
      <PokemonCard
        pokemon={TEST_POKEMONS[0]}
        isCaught={false}
        isFavorite={false}
        isDarkMode={false}
        onClick={onClick}
        onCatch={onCatch}
        onToggleFavorite={onToggleFavorite}
      />
    );

    await user.click(screen.getByRole('button', { name: /Ajouter Bulbizarre aux favoris/i }));
    await user.click(screen.getByRole('button', { name: /Ajouter Bulbizarre a l equipe/i }));

    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    expect(onCatch).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });
});
