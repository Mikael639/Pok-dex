import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { TEST_POKEMONS } from './fixtures/pokemonFixtures';
import { installPokemonFetchMock } from './utils';

afterEach(() => {
  vi.useRealTimers();
});

async function renderApp({ team = [], width = 1280, waitForNavigation = true } = {}) {
  installPokemonFetchMock();
  localStorage.setItem('pokedexTeam', JSON.stringify(team));
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width
  });

  render(<App />);

  if (waitForNavigation) {
    await screen.findByRole('button', { name: /Archives 1025/i });
  }
}

async function openCollection(user) {
  await user.click(screen.getByRole('button', { name: /Archives 1025/i }));
  await screen.findByText('Bulbizarre');
}

async function openPokemonDetails(user, pokemonName) {
  await openCollection(user);
  await user.click(screen.getByText(pokemonName));
  await screen.findByRole('dialog', { name: new RegExp(`Fiche de ${pokemonName}`, 'i') });
}

async function openBattleTab(user) {
  const navigation = screen.getByRole('navigation');
  await user.click(within(navigation).getByRole('button', { name: /Ar.ne Battle/i }));
  await screen.findByRole('heading', { name: /Arene Master/i });
}

async function openStatClashTab(user) {
  const navigation = screen.getByRole('navigation');
  await user.click(within(navigation).getByRole('button', { name: /Stat Clash/i }));
  await screen.findByText(/Quelle equipe domine cette statistique/i);
}

async function openEvolutionRushTab(user) {
  const navigation = screen.getByRole('navigation');
  await user.click(within(navigation).getByRole('button', { name: /Evolution Rush/i }));
  await screen.findByRole('button', { name: /Relancer Evolution Rush/i });
}

describe('App integration', () => {
  it("capture un Pokemon puis affiche uniquement l'equipe dans l'onglet dedie", async () => {
    const user = userEvent.setup();

    await renderApp();
    await openPokemonDetails(user, 'Bulbizarre');

    await user.click(screen.getByRole('button', { name: /CAPTURER/i }));
    await user.click(screen.getByRole('button', { name: /Fermer la fiche Pokemon/i }));
    await user.click(screen.getByRole('button', { name: /Mon .*quipe/i }));

    await screen.findByText('Bulbizarre');

    expect(screen.queryByPlaceholderText('Rechercher...')).not.toBeInTheDocument();
    expect(screen.queryByText('Salameche')).not.toBeInTheDocument();
    expect(screen.getAllByText(/x2/i).length).toBeGreaterThan(0);
  });

  it('ouvre la comparaison depuis la fiche Pokemon et affiche les stats comparees', async () => {
    const user = userEvent.setup();

    await renderApp();
    await openPokemonDetails(user, 'Bulbizarre');

    await user.click(screen.getByRole('button', { name: /COMPARER/i }));

    const dialog = await screen.findByRole('dialog', { name: /Comparaison de Bulbizarre/i });
    const comparisonScope = within(dialog);

    expect(comparisonScope.getByRole('textbox', { name: /Rechercher un Pokemon a comparer/i })).toBeInTheDocument();
    expect(comparisonScope.getByRole('button', { name: /Herbizarre/i })).toBeInTheDocument();
    expect(comparisonScope.getByRole('button', { name: /Salameche/i })).toBeInTheDocument();
    expect(comparisonScope.getByText(/Base stat total: 318/i)).toBeInTheDocument();
    expect(comparisonScope.getByText(/Base stat total: 405/i)).toBeInTheDocument();
  });

  it('masque la navigation hors ecran sur mobile tant que le menu est ferme', async () => {
    const user = userEvent.setup();

    await renderApp({ width: 390, waitForNavigation: false });
    await screen.findByRole('button', { name: /Ouvrir le menu/i });

    const sidebar = screen.getByLabelText(/Navigation principale/i, { hidden: true });

    expect(sidebar).toHaveAttribute('aria-hidden', 'true');

    await user.click(screen.getByRole('button', { name: /Ouvrir le menu/i }));

    expect(sidebar).toHaveAttribute('aria-hidden', 'false');
  });

  it("verrouille l'arene avec moins de 6 Pokemon", async () => {
    const user = userEvent.setup();

    await renderApp({ team: [TEST_POKEMONS[0]] });
    await openBattleTab(user);

    expect(screen.getByText(/Veuillez selectionner 6 Pokemon dans votre equipe \(1\/6\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /J1 vs IA/i })).toBeDisabled();
  });

  it('demarre un combat IA avec une equipe complete', async () => {
    const user = userEvent.setup();
    
    await renderApp({ team: TEST_POKEMONS });
    await openBattleTab(user);
    await user.click(screen.getByRole('button', { name: /J1 vs IA/i }));

    expect(await screen.findByText(/Journal de Combat/i)).toBeInTheDocument();
    expect(screen.getByText(/Preparez-vous au combat !/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Attaque/i })).toBeInTheDocument();
  });

  it('ouvre Stat Clash et revele une manche apres un choix', async () => {
    const user = userEvent.setup();

    await renderApp();
    await openStatClashTab(user);

    const choices = screen.getAllByRole('button', { name: /Choisir /i });
    expect(choices).toHaveLength(2);

    await user.click(choices[0]);

    expect(await screen.findByRole('button', { name: /Suivant/i })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/Bien vu|Rate|Egalite/i);
  });

  it('ouvre Evolution Rush et valide une manche', async () => {
    const user = userEvent.setup();

    await renderApp();
    await openEvolutionRushTab(user);

    const initialChoices = await screen.findAllByRole('button', { name: /Ajouter /i });
    expect(initialChoices.length).toBeGreaterThanOrEqual(2);

    for (let index = 0; index < initialChoices.length; index += 1) {
      await user.click(screen.getAllByRole('button', { name: /Ajouter /i })[0]);
    }

    await user.click(screen.getByRole('button', { name: /Valider l ordre/i }));

    expect(await screen.findByRole('button', { name: /Suivant/i })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/Parfait|Rate/i);
  });

  it('change la difficulte Evolution Rush en debutant', async () => {
    const user = userEvent.setup();

    await renderApp();
    await openEvolutionRushTab(user);

    await user.click(screen.getByRole('button', { name: /Passer en Debutant/i }));

    expect(await screen.findByText(/Remettez 2 Pokemon dans le bon ordre/i)).toBeInTheDocument();
    expect(screen.getByText(/Mode actuel : Debutant - 2 etapes/i)).toBeInTheDocument();
  });

  it("affiche le defi du jour sur l'accueil et ouvre son action principale", async () => {
    localStorage.removeItem('pokedexDailyActivity');

    const user = userEvent.setup();

    await renderApp();

    expect(screen.getByText(/Defi du jour/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Voir le Pokemon du jour/i }));

    expect(await screen.findByRole('dialog', { name: /Fiche de/ })).toBeInTheDocument();
  });
});
