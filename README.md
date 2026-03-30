# ⚡ Pokédex Premium - l'Aventure de Hoenn (Gens 1, 2 & 3)

Bienvenue dans le **Pokédex de l'Aventure Moderne**, une plateforme d'exploration Pokémon haut de gamme couvrant les **386 espèces** des trois premières générations (Kanto, Johto & Hoenn).

> [!NOTE]
> Ce projet propose une interface "Premium" avec un Tableau de Bord dynamique, des filtres personnalisés et une base de données étendue.

## ✨ Nouvelles Fonctionnalités (v2.0)

- **Archives 386** : Base de données complète incluant la Génération 3 (Hoenn), avec noms et types entièrement traduits en français.
- **Tableau de Bord "Maître Pokémon"** : Une vue d'accueil esthétique avec suivi de progression de collection, profil de dresseur et accès rapide.
- **Lignée Évolutive Interactive** : Visualisez l'histoire de chaque Pokémon avec ses **conditions d'évolution** (Niveaux, Objets, Bonheur, Échanges).
- **Filtres Dynamiques Animés** : Menus déroulants personnalisés avec indicateurs de types colorés et transitions fluides.
- **Modes de Jeux Étendus** :
    - **Arène Battle** : Combattez avec votre équipe de 6.
    - **Master Type** : Testez vos connaissances sur l'efficacité des types.
    - **Silhouette** : Le classique "Qui est ce Pokémon ?".
- **Design Glassmorphism** : Interface moderne utilisant des effets de flou, des halos de couleurs et des animations **Framer Motion**.

## 🛠️ Stack Technique

- **Frontend** : React 19, Vite, Tailwind CSS 4, Framer Motion, Axios (PokeAPI Integration).
- **Backend** : Node.js, Express, Morgan (Logging).
- **Données** : Système hybride (Base locale de 386 Pokémon + Fetching dynamique PokeAPI pour les évolutions).

## 🚀 Installation & Lancement

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Lancer l'application (Client + Serveur)** :
   ```bash
   npm run dev
   ```
   - L'interface sera disponible sur **[http://localhost:3201](http://localhost:3201)**.
   - L'API backend tourne sur le port `8080`.

## 📂 Structure du Projet
```text
POKEDEX/
├── public/          # Assets statiques (Vidéos, Audio, Images)
├── src/             # Code source React (Composants & Logique)
│   ├── App.jsx      # Application principale & Composants
│   ├── App.css      # Design & Keyframes (Glassmorphism, Holo)
│   └── main.jsx     # Point d'entrée React
├── pokedex.json     # Base de données (386 Pokémon)
├── server.js        # Serveur API (Express)
└── package.json     # Configuration & Scripts
```

---
*Écrit avec passion par Antigravity pour la communauté des dresseurs.*
