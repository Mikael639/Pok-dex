import { 
  Activity, Brain, Trophy, Gamepad2, GitBranch, BarChart3, Sparkles, Heart 
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
  attackAnim: null,
  mode: 'menu',
  currentTurn: 'player'
};

export const STAT_CLASH_OPTIONS = [
  { id: 'HP', label: 'HP', keys: ['HP'] },
  { id: 'Attack', label: 'Attaque', keys: ['Attack'] },
  { id: 'Defense', label: 'Defense', keys: ['Defense'] },
  { id: 'SpAttack', label: 'Attaque Spe', keys: ['SpAttack', 'Sp. Attack'] },
  { id: 'SpDefense', label: 'Defense Spe', keys: ['SpDefense', 'Sp. Defense'] },
  { id: 'Speed', label: 'Vitesse', keys: ['Speed'] }
];

export const TAB_TITLES = {
  accueil: 'Bienvenue, Champion',
  collection: 'Archives 1025',
  equipe: 'Mon Equipe',
  combat: 'Arene Battle',
  'evolution-rush': 'Evolution Rush',
  memory: 'Poke-Memory',
  quiz: 'Master Type',
  jeu: 'Silhouette',
  'stat-clash': 'Stat Clash'
};

export const EVOLUTION_RUSH_DIFFICULTIES = [
  { id: 'debutant', label: 'Debutant', helper: '2 etapes', minChainLength: 2, targetLength: 2 },
  { id: 'dresseur', label: 'Dresseur', helper: '3 etapes', minChainLength: 3, targetLength: 3 },
  { id: 'maitre', label: 'Maitre', helper: 'chaine complete', minChainLength: 3, targetLength: null }
];

export const TRACKED_EXPERIENCE_TABS = ['combat', 'memory', 'quiz', 'jeu', 'evolution-rush', 'stat-clash'];

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
  quiz: {
    id: 'quiz',
    label: 'Master Type',
    description: 'Travaille les matchups de types avec un défi rapide.',
    cta: 'Relancer le quiz',
    icon: Trophy
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
  'stat-clash': {
    id: 'stat-clash',
    label: 'Stat Clash',
    description: 'Choisis le bon Pokémon en duel de stats et monte ton record.',
    cta: 'Continuer Stat Clash',
    icon: BarChart3
  }
};

export const DAILY_CHALLENGE_ROTATION = [
  {
    id: 'spotlight-view',
    title: 'Observe le Pokemon du jour',
    reward: 'Badge Eclaireur',
    cta: 'Voir le Pokemon du jour',
    icon: Sparkles,
    accent: 'from-amber-500/20 via-rose-500/5 to-transparent',
    glow: 'bg-amber-400/20'
  },
  {
    id: 'spotlight-favorite',
    title: 'Ajoute la vedette a tes favoris',
    reward: 'Insigne Collection',
    cta: 'Ouvrir la fiche du jour',
    icon: Heart,
    accent: 'from-rose-500/20 via-white/5 to-transparent',
    glow: 'bg-rose-400/20'
  },
  {
    id: 'quiz-answer',
    title: 'Reponds a une question Master Type',
    reward: 'Badge Strategiste',
    cta: 'Lancer le quiz',
    icon: Trophy,
    accent: 'from-amber-500/20 via-yellow-500/5 to-transparent',
    glow: 'bg-amber-400/20'
  },
  {
    id: 'stat-clash-reveal',
    title: 'Revele une manche de Stat Clash',
    reward: 'Badge Analyste',
    cta: 'Jouer a Stat Clash',
    icon: BarChart3,
    accent: 'from-cyan-500/20 via-sky-500/5 to-transparent',
    glow: 'bg-cyan-400/20'
  },
  {
    id: 'evolution-validate',
    title: 'Valide une lignee Evolution Rush',
    reward: 'Insigne Chronologie',
    cta: 'Ouvrir Evolution Rush',
    icon: GitBranch,
    accent: 'from-violet-500/20 via-fuchsia-500/5 to-transparent',
    glow: 'bg-violet-400/20'
  }
];
