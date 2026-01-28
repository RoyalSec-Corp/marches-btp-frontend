# Marchés BTP - Frontend

Interface React pour la marketplace Marchés BTP connectant freelances/artisans et entreprises du BTP.

## Stack Technique

- **React** 18.2 avec React Router 6
- **Tailwind CSS** 3.4 pour le styling
- **Axios** pour les appels API
- **Leaflet** pour les cartes
- **Recharts** pour les graphiques
- **React Toastify** pour les notifications

## Installation

```bash
npm install
```

## Configuration

Copier `.env.example` vers `.env` et configurer :

```env
REACT_APP_API_URL=http://localhost:3002/api
REACT_APP_CONTRACTS_API=http://localhost:3002
```

## Développement

```bash
npm start
```

L'application sera disponible sur http://localhost:3000

## Build Production

```bash
npm run build
```

## Structure du Projet

```
src/
├── components/       # Composants réutilisables
├── context/          # Contextes React (Auth, etc.)
├── hooks/            # Hooks personnalisés
├── layouts/          # Layouts de page
├── pages/            # Pages de l'application
│   ├── Accueil/
│   ├── Connexion/
│   ├── Inscription/
│   ├── DashboardFreelance/
│   ├── DashboardEntreprise/
│   ├── DashboardAdmin/
│   ├── Contrats/
│   └── ...
├── services/         # Services API
├── utils/            # Utilitaires
├── App.jsx           # Composant principal
└── index.js          # Point d'entrée
```

## Pages Principales

- `/` - Page d'accueil
- `/connexion` - Connexion
- `/inscription` - Inscription
- `/inscription-freelance` - Inscription freelance
- `/inscription-entreprise` - Inscription entreprise
- `/dashboard-freelance` - Dashboard freelance
- `/dashboard-entreprise` - Dashboard entreprise
- `/dashboard-admin` - Dashboard admin
- `/creation-contrat` - Création de contrat
- `/appel-offre` - Création d'appel d'offres

## Backend

Ce frontend se connecte au backend `marches-btp-backend` :
https://github.com/RoyalSec-Corp/marches-btp-backend
