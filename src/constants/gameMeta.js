import { 
  Activity, Brain, Gamepad2, GitBranch, Sparkles, Heart, Music
} from 'lucide-react';

export const INITIAL_BATTLE_STATE = {
  playerTeam: [],
  enemyTeam: [],
  logs: [],
  turn: 0,
  winner: null,
  isFighting: false,
  playerActive: 0,
  enemyActive: 0,
  winnerPokemon: null,
  mode: 'menu',
  currentTurn: 'player'
};

export const TAB_TITLES = {
  accueil: 'Bienvenue, Champion',
  collection: 'Archives 1025',
  equipe: 'Mon Equipe',
  combat: 'Arene Battle',
  'evolution-rush': 'Evolution Rush',
  memory: 'Poke-Memory',
  jeu: 'Silhouette',
  'cry-quiz': 'Qui est-ce ?'
};

export const EVOLUTION_RUSH_DIFFICULTIES = [
  { id: 'debutant', label: 'Debutant', helper: '2 etapes', minChainLength: 2, targetLength: 2 },
  { id: 'dresseur', label: 'Dresseur', helper: '3 etapes', minChainLength: 3, targetLength: 3 },
  { id: 'maitre', label: 'Maitre', helper: 'chaine complete', minChainLength: 3, targetLength: null }
];

export const TRACKED_EXPERIENCE_TABS = ['combat', 'memory', 'jeu', 'evolution-rush', 'cry-quiz'];

export const EXPERIENCE_META = {
  combat: {
    id: 'combat',
    label: 'Arène Battle',
    description: "Relance un duel et teste immédiatement ta team du moment.",
    cta: "Reprendre l'arène",
    icon: Activity
  },
  memory: {
    id: 'memory',
    label: 'Poké-Memory',
    description: 'Retrouve les paires et accélère ton temps de reconnaissance.',
    cta: 'Relancer le memory',
    icon: Brain
  },
  jeu: {
    id: 'jeu',
    label: 'Silhouette',
    description: "Devine le Pokémon caché avant que le chrono ne s'épuise.",
    cta: 'Rejouer à Silhouette',
    icon: Gamepad2
  },
  'evolution-rush': {
    id: 'evolution-rush',
    label: 'Evolution Rush',
    description: "Recompose une lignée d'évolution et garde ta série vivante.",
    cta: 'Continuer Evolution Rush',
    icon: GitBranch
  },
  'cry-quiz': {
    id: 'cry-quiz',
    label: 'Sound Quiz',
    description: 'Identifie le Pokémon par son cri emblématique.',
    cta: 'Lancer le quiz sonore',
    icon: Music
  }
};

export const POKEMON_GENERATIONS = [
  { gen: 1, start: 1, end: 151 },
  { gen: 2, start: 152, end: 251 },
  { gen: 3, start: 252, end: 386 },
  { gen: 4, start: 387, end: 493 },
  { gen: 5, start: 494, end: 649 },
  { gen: 6, start: 650, end: 721 },
  { gen: 7, start: 722, end: 809 },
  { gen: 8, start: 810, end: 905 },
  { gen: 9, start: 906, end: 1025 },
];

export const DAILY_CHALLENGE_ROTATION = [
  {
    id: 'spotlight-view',
    title: 'Observe le Pokemon du jour',
    reward: 'Badge Eclaireur',
    cta: 'Voir le Pokemon du jour',
    icon: Sparkles,
    accent: 'from-amber-500/20 via-brand-500/5 to-transparent',
    glow: 'bg-amber-400/20'
  },
  {
    id: 'spotlight-favorite',
    title: 'Ajoute la vedette a tes favoris',
    reward: 'Insigne Collection',
    cta: 'Ouvrir la fiche du jour',
    icon: Heart,
    accent: 'from-brand-500/20 via-white/5 to-transparent',
    glow: 'bg-brand-400/20'
  },
  {
    id: 'evolution-validate',
    title: 'Valide une lignee Evolution Rush',
    reward: 'Insigne Chronologie',
    cta: 'Ouvrir Evolution Rush',
    icon: GitBranch,
    accent: 'from-sky-500/20 via-sky-500/5 to-transparent',
    glow: 'bg-sky-400/20'
  }
];
