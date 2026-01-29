# Instructions de synchronisation finale

La structure de base du frontend a ete migree. Il reste a copier les pages depuis le repo `ss`.

## Fichiers deja migres

- Configuration: package.json, tailwind.config.js, .gitignore, .env.example
- Core: src/index.js, src/index.css, src/App.jsx
- Context: src/context/AuthContext.jsx
- Hooks: src/hooks/useAuth.js
- Layouts: src/layouts/DashboardLayout.jsx
- Components: CandidatureManager, ChartComponent, FreelanceProfileModal, NotificationBell, ProtectedRoute, RechercheGeoConnectee
- Services: api.js, authService.js, contractService.js, contractsApi.js, http.js, notificationsApi.js, adminApi.js, freelancesApi.js, messagesApi.js, userApi.js, callsForTendersApi.js, referralsApi.js
- Utils: contractCalculations.js, geoUtils.js
- Public: index.html, manifest.json

## Fichiers a copier manuellement depuis le repo `ss`

Depuis votre clone local du repo `ss`, copier les dossiers de pages vers ce repo:

```bash
# Cloner ce repo
git clone https://github.com/RoyalSec-Corp/marches-btp-frontend.git
cd marches-btp-frontend

# Copier les pages depuis le repo ss (adapter le chemin)
cp -r ../ss/src/pages ./src/

# Ne pas copier les fichiers backend qui pourraient etre dans src/
# Supprimer si presents:
rm -f ./src/server.js ./src/db.js ./src/package.json 2>/dev/null

# Committer et pousser
git add .
git commit -m "Add all pages from ss repo"
git push
```

## Pages a migrer

- src/pages/Accueil/
- src/pages/AppelOffre/
- src/pages/Appels/
- src/pages/AppelsDashbord/
- src/pages/Connexion/
- src/pages/ConnexionAdmin/
- src/pages/Contrats/
- src/pages/DashboardAdmin/
- src/pages/DashboardEntreprise/
- src/pages/DashboardFreelance/
- src/pages/Entreprise/
- src/pages/Freelance/
- src/pages/Inscription/
- src/pages/Parrainage/
- src/pages/InscriptionAppelOffre.jsx

## Apres la copie

1. Installer les dependances: `npm install`
2. Configurer l'environnement: `cp .env.example .env`
3. Modifier `.env` avec vos URLs d'API
4. Demarrer: `npm start`
