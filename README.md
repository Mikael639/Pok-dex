# Pokemon-Master

Pokedex construit avec React, Vite, Framer Motion et Tailwind CSS.

## Apercu

L'application propose :

- un Pokedex local de 1025 Pokemon via `public/pokedex.json`
- une gestion d'equipe avec favoris
- une arene de combat
- un quiz sur les types
- un jeu de silhouette
- un memory Pokemon

## Demarrage

```bash
npm install
npm run dev
```

L'application tourne ensuite sur l'URL affichee par Vite, en general `http://localhost:5173`.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Structure utile

- `src/App.jsx` : orchestration principale
- `src/components/` : interface et mini-jeux
- `src/constants/pokemon.js` : couleurs et table des types
- `public/pokedex.json` : donnees Pokemon locales

## Notes

- Il n'y a pas de `server.js` a lancer dans cette version.
- Le projet lit les donnees directement depuis `public/pokedex.json`.
