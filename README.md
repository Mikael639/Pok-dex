# ⚡ Pokédex Modernisé - React 19 & Node.js

Bienvenue dans le **Pokédex de l'Aventure Moderne**, une application web haute performance permettant d'explorer les 251 premiers Pokémon (Générations 1 & 2).

> [!NOTE]
> Ce projet a été entièrement restructuré pour être "GitHub Ready" : une architecture simplifiée, unifiée et extrêmement rapide.

## ✨ Fonctionnalités
- **Générations 1 & 2** : Les 251 Pokémon avec noms, types et descriptions en français.
- **UI Premium** : Design moderne avec **Tailwind CSS 4** et animations fluides via **Framer Motion**.
- **Mini-Jeu "Qui est-ce ?"** : Teste tes connaissances avec un système de score et de records.
- **Mode Sombre** : Interface s'adaptant à tes préférences (persistante via localStorage).
- **Filtrage Avancé** : Menu déroulant élégant pour filtrer par type et barre de recherche instantanée.
- **Audio Immersif** : Thème musical officiel intégré.

## 🛠️ Stack Technique
- **Frontend** : React 19, Vite, Tailwind CSS 4, Framer Motion, Lucide React.
- **Backend** : Node.js, Express, Morgan (Logging).
- **Données** : JSON local pour une portabilité maximale.

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
├── public/          # Assets statiques (Vidéos, Audio, Favicon)
├── src/             # Code source React (Interface)
├── pokedex.json     # Base de données Pokémon
├── server.js        # Serveur API (Express)
├── package.json     # Configuration unique du projet
└── vite.config.js   # Configuration Vite
```

---
*Développé avec passion pour la communauté Pokémon.*
