// src/constants/pokemon.js

/**
 * Couleurs associées aux différents types de Pokémon
 * Utilisées pour les badges, les auras et les arrière-plans.
 */
export const TYPE_COLORS = {
  'Normal': '#A8A77A', 'Feu': '#EE8130', 'Eau': '#6390F0', 'Electrique': '#F7D02C',
  'Plante': '#7AC74C', 'Glace': '#96D9D6', 'Combat': '#C22E28', 'Poison': '#A33EA1',
  'Sol': '#E2BF65', 'Vol': '#A98FF3', 'Psy': '#F95587', 'Insecte': '#A6B91A',
  'Roche': '#B6A136', 'Spectre': '#735797', 'Dragon': '#6F35FC', 'Ténèbres': '#705746',
  'Acier': '#B7B7CE', 'Fée': '#D685AD'
};

/**
 * Tableau de correspondance des affinités de types (Type Chart)
 * Structure : [Attaquant][Défenseur] = multiplicateur de dégâts.
 */
export const TYPE_CHART = {
  'Normal': { 'Roche': 0.5, 'Spectre': 0, 'Acier': 0.5 },
  'Feu': { 'Feu': 0.5, 'Eau': 0.5, 'Plante': 2, 'Glace': 2, 'Insecte': 2, 'Roche': 0.5, 'Dragon': 0.5, 'Acier': 2 },
  'Eau': { 'Feu': 2, 'Eau': 0.5, 'Plante': 0.5, 'Sol': 2, 'Roche': 2, 'Dragon': 0.5 },
  'Electrique': { 'Eau': 2, 'Electrique': 0.5, 'Plante': 0.5, 'Sol': 0, 'Vol': 2, 'Dragon': 0.5 },
  'Plante': { 'Feu': 0.5, 'Eau': 2, 'Plante': 0.5, 'Poison': 0.5, 'Sol': 2, 'Vol': 0.5, 'Insecte': 0.5, 'Roche': 2, 'Dragon': 0.5, 'Acier': 0.5 },
  'Glace': { 'Feu': 0.5, 'Eau': 0.5, 'Plante': 2, 'Glace': 0.5, 'Sol': 2, 'Vol': 2, 'Dragon': 2, 'Acier': 0.5 },
  'Combat': { 'Normal': 2, 'Glace': 2, 'Poison': 0.5, 'Vol': 0.5, 'Psy': 0.5, 'Insecte': 0.5, 'Roche': 2, 'Spectre': 0, 'Ténèbres': 2, 'Acier': 2, 'Fée': 0.5 },
  'Poison': { 'Plante': 2, 'Poison': 0.5, 'Sol': 0.5, 'Roche': 0.5, 'Spectre': 0.5, 'Acier': 0, 'Fée': 2 },
  'Sol': { 'Feu': 2, 'Electrique': 2, 'Plante': 0.5, 'Poison': 2, 'Vol': 0, 'Insecte': 0.5, 'Roche': 2, 'Acier': 2 },
  'Vol': { 'Electrique': 0.5, 'Plante': 2, 'Combat': 2, 'Insecte': 2, 'Roche': 0.5, 'Acier': 0.5 },
  'Psy': { 'Combat': 2, 'Poison': 2, 'Psy': 0.5, 'Ténèbres': 0, 'Acier': 0.5 },
  'Insecte': { 'Feu': 0.5, 'Plante': 2, 'Combat': 0.5, 'Poison': 0.5, 'Vol': 0.5, 'Psy': 2, 'Spectre': 0.5, 'Ténèbres': 2, 'Acier': 0.5, 'Fée': 0.5 },
  'Roche': { 'Feu': 2, 'Glace': 2, 'Combat': 0.5, 'Sol': 0.5, 'Vol': 2, 'Insecte': 2, 'Acier': 0.5 },
  'Spectre': { 'Normal': 0, 'Psy': 2, 'Spectre': 2, 'Ténèbres': 0.5 },
  'Dragon': { 'Dragon': 2, 'Acier': 0.5, 'Fée': 0 },
  'Ténèbres': { 'Combat': 0.5, 'Psy': 2, 'Spectre': 2, 'Ténèbres': 0.5, 'Fée': 0.5 },
  'Acier': { 'Feu': 0.5, 'Eau': 0.5, 'Electrique': 0.5, 'Glace': 2, 'Roche': 2, 'Acier': 0.5, 'Fée': 2 },
  'Fée': { 'Feu': 0.5, 'Combat': 2, 'Poison': 0.5, 'Dragon': 2, 'Ténèbres': 2, 'Acier': 0.5 }
};
