# Plan d'Action - CoTiTra

Ce plan suit une approche **incrémentale et fonctionnelle**. Chaque étape livre une version complète, testée, déployable et utilisable de l'application.

## Principe

À chaque étape :

- ✅ L'application est **fonctionnelle** (pas de code incomplet)
- 🧪 Les fonctionnalités sont **testées**
- 🚀 L'application peut être **déployée** sur Render.com
- 👤 L'application est **utilisable** par un utilisateur final

---

## Sommaire

- [📦 Étape 0 : Application Minimale Déployable](#-étape-0--application-minimale-déployable)
- [🎨 Étape 1 : Liste Statique de Tickets](#-étape-1--liste-statique-de-tickets)
- [🤖 Étape 2 : CI/CD avec GitHub Actions](#-étape-2--cicd-avec-github-actions)
- [🤖 Étape 2b : Workflows GitHub avec Claude](#-étape-2b--workflows-github-avec-claude)
- [🔄 Étape 2c : Renovate pour la Gestion Automatique des Dépendances](#-étape-2c--renovate-pour-la-gestion-automatique-des-dépendances)
- [🗄️ Étape 3 : Tickets depuis MongoDB](#️-étape-3--tickets-depuis-mongodb)
- [➕ Étape 4 : Créer un Nouveau Ticket](#-étape-4--créer-un-nouveau-ticket)
- [📄 Étape 5 : Voir le Détail d'un Ticket](#-étape-5--voir-le-détail-dun-ticket)
- [🔄 Étape 6 : Changer le Statut et Assigner un Ticket](#-étape-6--changer-le-statut-et-assigner-un-ticket)
- [💬 Étape 7 : Ajouter des Commentaires](#-étape-7--ajouter-des-commentaires)
- [✏️ Étape 8 : Modifier un Ticket](#️-étape-8--modifier-un-ticket)
- [📦 Étape 9 : Archiver un Ticket](#-étape-9--archiver-un-ticket)
- [🎯 Étape 10 : Filtrer par Statut](#-étape-10--filtrer-par-statut)
- [🔍 Étape 11 : Recherche de Tickets](#-étape-11--recherche-de-tickets)
- [📊 Étape 12 : Dashboard avec Statistiques](#-étape-12--dashboard-avec-statistiques)
- [🎨 Étape 13 : Polish UX/UI](#-étape-13--polish-uxui)
- [🚀 Étapes Futures (Optionnelles)](#-étapes-futures-optionnelles)
- [📝 Notes Importantes](#-notes-importantes)

---

## 📦 Étape 0 : Application Minimale Déployable

**Objectif** : Avoir une application Next.js qui tourne et qui est déployée sur Render.com

### Ce qu'on livre

- Une page d'accueil avec le titre "CoTiTra"
- Build réussi
- Déploiement fonctionnel sur Render.com

### Tâches

- [x] Initialiser Next.js 16 avec TypeScript et Tailwind
- [x] Créer une page d'accueil minimaliste
- [x] Vérifier que `npm run build` fonctionne
- [x] Créer un repository GitHub
- [x] Déployer sur Render.com
- [x] Vérifier que l'application est accessible en ligne (https://copro-tickets-tracker.onrender.com/)

### Validation

- ✅ L'URL Render.com affiche "CoTiTra"
- ✅ Le build passe sans erreur

---

## 🎨 Étape 1 : Liste Statique de Tickets

**Objectif** : Afficher une liste de tickets en dur dans l'interface

### Ce qu'on livre

- Une page qui affiche 3 tickets codés en dur
- Chaque ticket montre : titre, statut, date
- Interface stylée avec Tailwind
- Infrastructure de test (Vitest + React Testing Library)
- Tests des composants

### Tâches

- [x] **Mettre en place l'infrastructure de test**
  - [x] Installer Vitest, @testing-library/react, jsdom, @vitejs/plugin-react
  - [x] Créer vitest.config.ts et vitest.setup.ts
  - [x] Ajouter les scripts test dans package.json
  - [x] Valider que npm test fonctionne
- [x] Créer le type TypeScript `Ticket` (id, titre, description, statut, dates)
- [x] Créer le composant `TicketCard` avec tests
- [x] Créer le composant `TicketList` avec tests
- [x] Afficher 3 tickets statiques dans la page d'accueil
- [x] Styler l'interface (responsive, couleurs par statut)
- [ ] Déployer

### Validation

- ✅ On voit 3 tickets affichés joliment
- ✅ Les tests passent (`npm test`) - 13 tests passants
- ⏳ Déployé et accessible en ligne (en attente du push git)

---

## 🤖 Étape 2 : CI/CD avec GitHub Actions

**Objectif** : Automatiser la vérification des Pull Requests et l'exécution des tests

### Ce qu'on livre

- Workflow GitHub Actions configuré
- Tests automatiques sur chaque PR
- Vérification du build TypeScript
- Protection de la branche main
- Badge de statut dans le README (optionnel)

### Tâches

- [x] Créer le répertoire `.github/workflows/`
- [x] Créer le fichier `ci.yml` avec workflow GitHub Actions (Node.js 20)
- [x] Configurer l'exécution des tests (`npm test`)
- [x] Configurer la vérification du build (`npm run build`)
- [x] Configurer le linting TypeScript (`npm run type-check`)
- [x] Tester le workflow en créant une PR de test
- [x] Configurer les règles de protection de branche sur main
  - [x] Exiger que les vérifications de statut passent avant de merger
  - [x] Exiger que les branches soient à jour avant de merger
  - [x] Activer la vérification "CI" comme obligatoire
- [x] Ajouter un badge CI dans README.md (optionnel)

### Validation

- ✅ Les tests s'exécutent automatiquement sur chaque PR
- ✅ Le build est vérifié automatiquement
- ✅ Les checks doivent passer avant de pouvoir merger
- ✅ Le statut CI est visible dans les PRs

### Notes techniques

**Workflow GitHub Actions** (`.github/workflows/ci.yml`) :

- Déclenchement : push et pull_request vers main
- Job nommé "CI" (pour la protection de branche)
- Node.js 20.x (LTS actuel)
- Étapes : checkout → setup node → npm ci → npm test → npm run build → npm run type-check

**Protection de branche** :

1. Paramètres → Branches → Ajouter une règle
2. Modèle de nom de branche : `main`
3. Exiger que les vérifications de statut passent avant de merger
4. Exiger que les branches soient à jour avant de merger
5. Activer la vérification "CI" comme obligatoire

**Workflow de développement** :
Voir le workflow Git complet dans [README.md](./README.md) (section "🛡️ Protection Git").

---

## 🤖 Étape 2b : Workflows GitHub avec Claude

**Objectif** : Ajouter des workflows GitHub pour l'assistance automatique de Claude sur les PRs et issues

### Ce qu'on livre

- Workflow de revue de code automatique par Claude sur chaque PR
- Workflow d'assistance Claude via mentions @claude dans les issues et PRs
- Configuration du token OAuth pour l'authentification de Claude

### Tâches

- [x] Créer le fichier `.github/workflows/claude-code-review.yml`
- [x] Créer le fichier `.github/workflows/claude.yml`
- [x] Configurer le secret `CLAUDE_CODE_OAUTH_TOKEN` dans les paramètres GitHub
  - Settings → Secrets and variables → Actions → New repository secret
- [x] Tester le workflow de revue sur une PR de test
- [x] Tester le workflow d'assistance avec @claude dans une issue

### Validation

- ✅ Claude commente automatiquement les PRs avec une revue de code
- ✅ On peut mentionner @claude dans les issues/PRs pour obtenir de l'aide
- ✅ Les workflows s'exécutent sans erreur

### Notes techniques

**Workflow Claude Code Review** (`.github/workflows/claude-code-review.yml`) :

- Déclenchement : ouverture ou synchronisation de PR
- Revue automatique du code avec feedback sur :
  - Qualité du code et bonnes pratiques
  - Bugs potentiels
  - Performance et sécurité
  - Couverture de tests
- Utilise les conventions du projet définies dans CLAUDE.md

**Workflow Claude Assistant** (`.github/workflows/claude.yml`) :

- Déclenchement : mention @claude dans :
  - Commentaires d'issues
  - Commentaires de PR
  - Revues de PR
  - Corps d'issues
- Claude exécute les instructions fournies dans le commentaire
- Permissions : lecture du code, PRs, issues, et résultats CI

**Configuration du token** :

1. Générer un token OAuth Claude depuis [claude.ai](https://claude.ai)
2. GitHub Settings → Secrets and variables → Actions
3. Ajouter `CLAUDE_CODE_OAUTH_TOKEN` avec la valeur du token

---

## 🔄 Étape 2c : Renovate pour la Gestion Automatique des Dépendances

**Objectif** : Automatiser la mise à jour des dépendances npm avec Renovate Bot via GitHub Actions (self-hosted)

### Ce qu'on livre

- Renovate Bot configuré en self-hosted via GitHub Actions
- Mise à jour automatique des dépendances via Pull Requests
- Configuration personnalisée pour le projet (regroupement, scheduling, automerge)
- Aucun compte externe requis (tout dans GitHub)

### Tâches

- [x] Créer le fichier de workflow `.github/workflows/renovate.yml`
  - [x] Configurer le déclenchement (schedule + workflow_dispatch)
  - [x] Utiliser l'image Docker officielle de Renovate
  - [x] Configurer le token GitHub pour créer les PRs
- [x] Créer le fichier de configuration `renovate.json` à la racine du projet
  - [x] Étendre la configuration recommandée (`config:recommended`)
  - [x] Configurer le timezone (Europe/Paris)
  - [x] Configurer le regroupement des dépendances (mineures/patch ensemble)
  - [x] Créer un groupe spécial pour Next.js et React
  - [x] Limiter le nombre de PRs ouvertes simultanément (5 max)
  - [x] Ajouter des labels (`dependencies`, `renovate`)
  - [x] Configurer l'automerge pour les mises à jour patch
- [ ] Tester le workflow manuellement via "Run workflow" dans GitHub Actions
- [ ] Valider qu'une PR de Renovate est créée et passe les checks CI

### Validation

- ✅ Le workflow Renovate s'exécute automatiquement selon le schedule
- ✅ Le fichier `renovate.json` est présent et valide
- ✅ Renovate crée automatiquement des PRs pour les mises à jour de dépendances
- ✅ Les PRs de Renovate déclenchent les workflows CI/CD
- ✅ Les tests passent sur les PRs de Renovate
- ✅ Pas besoin de compte externe (tout dans GitHub)

---

## 🗄️ Étape 3 : Tickets depuis MongoDB

**Objectif** : Remplacer les données statiques par des vraies données venant de MongoDB

### Ce qu'on livre

- Connexion à MongoDB local en développement
- Connexion à MongoDB Atlas en production
- Les tickets sont stockés et récupérés depuis la base
- Configuration des variables d'environnement

### Tâches

- [x] Installer MongoDB localement (brew/apt/windows)
- [x] Démarrer MongoDB en local
- [x] Installer mongoose
- [x] Créer le schéma Mongoose pour Ticket
- [x] Créer la connexion MongoDB dans `lib/mongodb.ts`
- [x] Créer l'API route `GET /api/tickets`
- [x] Connecter la page d'accueil à l'API
- [x] Créer un script seed pour ajouter des tickets de test
- [x] Désactiver le cache Next.js pour recharger les données à chaque requête
- [x] Tester en local
- [ ] Créer un compte MongoDB Atlas (gratuit)
- [ ] Créer un cluster et une database sur Atlas
- [ ] Configurer MONGODB_URI dans les variables d'environnement Render.com
- [ ] Tester en production

### Validation

- ✅ Les tickets affichés viennent de MongoDB local
- ✅ Les données sont rechargées à chaque rafraîchissement de la page (cache désactivé)
- ⏳ Si on modifie un ticket dans MongoDB, il change dans l'app (à tester)
- ⏳ Fonctionne en local (MongoDB local) ET en production (MongoDB Atlas) (production en attente)

### Notes techniques

**Désactivation du cache Next.js** :

- Par défaut, Next.js 15 met en cache les Server Components pour optimiser les performances
- Pour forcer le rechargement des données à chaque requête, on utilise `export const dynamic = 'force-dynamic'` dans la page
- Cela garantit que les modifications dans MongoDB sont immédiatement visibles dans l'application

---

## ➕ Étape 4 : Créer un Nouveau Ticket

**Objectif** : Permettre de créer des tickets via l'interface

### Ce qu'on livre

- Un formulaire de création de ticket
- Validation des champs (titre et description requis)
- Le nouveau ticket apparaît immédiatement dans la liste

### Tâches

- [ ] Créer l'API route `POST /api/tickets`
- [ ] Créer le composant `CreateTicketForm` avec tests
- [ ] Valider les champs côté client et serveur
- [ ] Rafraîchir la liste après création
- [ ] Afficher un message de succès/erreur
- [ ] Déployer

### Validation

- ✅ On peut créer un ticket avec titre + description
- ✅ Le formulaire valide les champs vides
- ✅ Le nouveau ticket apparaît dans la liste
- ✅ Fonctionne en production

---

## 📄 Étape 5 : Voir le Détail d'un Ticket

**Objectif** : Cliquer sur un ticket pour voir tous ses détails

### Ce qu'on livre

- Page de détail d'un ticket (`/tickets/[id]`)
- Affiche titre, description complète, statut, dates
- Bouton retour vers la liste

### Tâches

- [ ] Créer l'API route `GET /api/tickets/[id]`
- [ ] Créer la page `/tickets/[id]/page.tsx`
- [ ] Créer le composant `TicketDetail` avec tests
- [ ] Rendre les tickets cliquables dans la liste
- [ ] Gérer le cas "ticket non trouvé"
- [ ] Déployer

### Validation

- ✅ Cliquer sur un ticket ouvre sa page de détail
- ✅ Toutes les infos sont affichées
- ✅ Le bouton retour fonctionne
- ✅ URL avec mauvais ID affiche une erreur propre

---

## 🔄 Étape 6 : Changer le Statut et Assigner un Ticket

**Objectif** : Modifier le statut d'un ticket (NEW → IN_PROGRESS → RESOLVED → CLOSED) avec assignation obligatoire de la personne en charge

### Ce qu'on livre

- Un formulaire pour changer le statut dans la page de détail
- Un champ obligatoire pour saisir le nom de la personne assignée
- Validation : impossible de changer le statut sans nom
- Les changements de statut et d'assignation sont sauvegardés
- Le statut et la personne assignée se reflètent dans la liste

### Tâches

- [ ] Ajouter le champ `assignedTo` (string, obligatoire) dans le type Ticket
- [ ] Mettre à jour le schéma Mongoose avec le champ `assignedTo` (required)
- [ ] Créer l'API route `PATCH /api/tickets/[id]` (pour statut + assignation)
- [ ] Valider côté serveur : statut + assignedTo obligatoires
- [ ] Créer le composant `UpdateTicketStatusForm` avec tests
- [ ] Le formulaire contient : sélecteur de statut + champ texte pour le nom
- [ ] Validation côté client : le nom est requis
- [ ] Afficher les statuts avec des couleurs différentes
- [ ] Afficher la personne assignée dans la carte ticket et le détail
- [ ] Mettre à jour le statut et l'assignation via l'API
- [ ] Revalider les données Next.js pour refresh
- [ ] Déployer

### Validation

- ✅ On ne peut pas changer le statut sans saisir un nom
- ✅ Le formulaire affiche une erreur si le nom est vide
- ✅ On peut changer le statut ET saisir le nom en même temps
- ✅ Les changements sont sauvegardés dans MongoDB
- ✅ Le nouveau statut et la personne assignée apparaissent dans la liste et le détail
- ✅ Les couleurs changent selon le statut

---

## 💬 Étape 7 : Ajouter des Commentaires

**Objectif** : Permettre de commenter les tickets

### Ce qu'on livre

- Liste des commentaires sous le détail du ticket
- Formulaire pour ajouter un commentaire
- Les commentaires sont horodatés

### Tâches

- [ ] Créer le type TypeScript `Comment`
- [ ] Créer le schéma Mongoose pour Comment
- [ ] Créer l'API route `GET /api/tickets/[id]/comments`
- [ ] Créer l'API route `POST /api/tickets/[id]/comments`
- [ ] Créer le composant `CommentList` avec tests
- [ ] Créer le composant `AddCommentForm` avec tests
- [ ] Afficher les commentaires dans la page de détail
- [ ] Déployer

### Validation

- ✅ On voit tous les commentaires d'un ticket
- ✅ On peut ajouter un nouveau commentaire
- ✅ Le commentaire apparaît immédiatement
- ✅ Les dates sont affichées correctement

---

## ✏️ Étape 8 : Modifier un Ticket

**Objectif** : Permettre de modifier le titre et la description d'un ticket

### Ce qu'on livre

- Bouton "Modifier" dans la page de détail
- Formulaire de modification pré-rempli
- Sauvegarde des modifications

### Tâches

- [ ] Créer l'API route `PUT /api/tickets/[id]`
- [ ] Créer le composant `EditTicketForm` avec tests
- [ ] Ajouter un mode "édition" dans la page de détail
- [ ] Valider les modifications
- [ ] Afficher un message de confirmation
- [ ] Déployer

### Validation

- ✅ Le bouton "Modifier" affiche le formulaire
- ✅ Les champs sont pré-remplis
- ✅ Les modifications sont sauvegardées
- ✅ On peut annuler l'édition

---

## 📦 Étape 9 : Archiver un Ticket

**Objectif** : Permettre d'archiver un ticket (les tickets ne sont jamais supprimés)

### Ce qu'on livre

- Bouton "Archiver" dans la page de détail
- Confirmation avant archivage
- Les tickets archivés disparaissent de la liste principale
- Possibilité de voir les tickets archivés (liste séparée ou toggle)
- Les commentaires restent attachés au ticket archivé

### Tâches

- [ ] Ajouter le champ `archived` (boolean, default: false) dans le type Ticket
- [ ] Mettre à jour le schéma Mongoose avec le champ `archived`
- [ ] Créer l'API route `PATCH /api/tickets/[id]/archive`
- [ ] Modifier l'API `GET /api/tickets` pour exclure les tickets archivés par défaut
- [ ] Créer un composant de confirmation d'archivage
- [ ] Implémenter le bouton "Archiver"
- [ ] Rediriger vers la liste après archivage
- [ ] Ajouter un indicateur visuel "ARCHIVÉ" dans le détail si le ticket est archivé
- [ ] Optionnel : ajouter un toggle "Voir les archives" dans la liste
- [ ] Déployer

### Validation

- ✅ Le bouton "Archiver" demande confirmation
- ✅ L'archivage marque le ticket comme archived dans MongoDB
- ✅ Les tickets archivés n'apparaissent plus dans la liste principale
- ✅ Les commentaires du ticket restent accessibles
- ✅ On peut toujours consulter un ticket archivé via son URL directe
- ✅ Redirection vers la liste après archivage

---

## 🎯 Étape 10 : Filtrer par Statut

**Objectif** : Permettre de filtrer la liste des tickets par statut

### Ce qu'on livre

- Boutons de filtre en haut de la liste
- Filtre "Tous" / "Nouveau" / "En cours" / "Résolu" / "Fermé"
- Le filtre persiste dans l'URL (query param)

### Tâches

- [ ] Modifier l'API `GET /api/tickets` pour accepter un paramètre `status`
- [ ] Créer le composant `StatusFilter` avec tests
- [ ] Utiliser les query params Next.js
- [ ] Mettre à jour la liste selon le filtre
- [ ] Indiquer visuellement le filtre actif
- [ ] Déployer

### Validation

- ✅ Les boutons de filtre fonctionnent
- ✅ L'URL change (ex: `/?status=IN_PROGRESS`)
- ✅ Le filtre actif est mis en évidence
- ✅ Le lien peut être partagé avec le filtre

---

## 🔍 Étape 11 : Recherche de Tickets

**Objectif** : Rechercher des tickets par mots-clés dans le titre ou la description

### Ce qu'on livre

- Barre de recherche en haut de la liste
- Recherche en temps réel (debounced)
- Combinable avec le filtre par statut

### Tâches

- [ ] Modifier l'API `GET /api/tickets` pour accepter un paramètre `search`
- [ ] Implémenter la recherche texte dans MongoDB
- [ ] Créer le composant `SearchBar` avec tests
- [ ] Implémenter le debouncing (300ms)
- [ ] Combiner recherche et filtre de statut
- [ ] Déployer

### Validation

- ✅ La recherche filtre les tickets en temps réel
- ✅ La recherche cherche dans titre ET description
- ✅ On peut combiner recherche + filtre de statut
- ✅ La recherche est performante

---

## 📊 Étape 12 : Dashboard avec Statistiques

**Objectif** : Afficher un résumé des tickets sur la page d'accueil

### Ce qu'on livre

- Compteurs : total, par statut
- Graphique simple (barres ou camembert)
- Carte cliquable pour filtrer

### Tâches

- [ ] Créer l'API route `GET /api/tickets/stats`
- [ ] Créer le composant `TicketStats` avec tests
- [ ] Afficher les compteurs en haut de page
- [ ] Rendre les compteurs cliquables (filtre le statut)
- [ ] Optionnel : ajouter un graphique avec une lib (recharts)
- [ ] Déployer

### Validation

- ✅ Les statistiques sont affichées
- ✅ Les chiffres sont corrects
- ✅ Cliquer sur un compteur filtre la liste
- ✅ Mise à jour en temps réel

---

## 🎨 Étape 13 : Polish UX/UI

**Objectif** : Améliorer l'expérience utilisateur

### Ce qu'on livre

- Indicateurs de chargement (spinners)
- Messages de succès/erreur (toasts)
- Animations douces
- Mode responsive parfait (mobile/tablet/desktop)
- Gestion des états vides ("Aucun ticket")

### Tâches

- [ ] Ajouter une librairie de toasts (sonner ou react-hot-toast)
- [ ] Ajouter les states de loading partout
- [ ] Ajouter les états vides avec illustrations
- [ ] Optimiser pour mobile
- [ ] Ajouter des transitions CSS
- [ ] Tester sur différents devices
- [ ] Déployer

### Validation

- ✅ L'app est fluide et agréable à utiliser
- ✅ Les feedbacks utilisateur sont clairs
- ✅ Parfaitement responsive
- ✅ Pas de "flash" de chargement

---

## 🚀 Étapes Futures (Optionnelles)

Une fois le MVP complet, voici des évolutions possibles :

### Fonctionnalités Métier

- [ ] **Catégories de tickets** (Plomberie, Électricité, Ascenseur, etc.)
- [ ] **Niveaux de priorité** (Basse, Normale, Haute, Urgente)
- [ ] **Assignation** (attribuer un ticket à une personne)
- [ ] **Dates d'échéance** et rappels
- [ ] **Pièces jointes** (photos de problèmes)
- [ ] **Historique des modifications** (qui a changé quoi et quand)

### Fonctionnalités Techniques

- [ ] **Authentification** (NextAuth.js ou Clerk)
- [ ] **Rôles utilisateurs** (admin, copropriétaire, syndic)
- [ ] **Pagination** (liste longue de tickets)
- [ ] **Tri** (par date, priorité, statut)
- [ ] **Export** (PDF ou CSV)
- [ ] **Notifications email** (nouveau ticket, changement de statut)
- [ ] **Mode hors-ligne** (PWA)
- [ ] **Websockets** (temps réel multi-utilisateurs)

### Qualité et Performance

- [ ] **Tests E2E** (Playwright ou Cypress)
- [ ] **Monitoring** (Sentry pour les erreurs)
- [ ] **Analytics** (Google Analytics ou Plausible)
- [ ] **SEO** (meta tags, sitemap)
- [ ] **Performance** (images optimisées, lazy loading)
- [ ] **Cache** (Redis pour la scalabilité)

---

## 📝 Notes Importantes

### Principes à Respecter

- **Commit après chaque étape** : gardez l'historique propre
- **Déployer après chaque étape** : validez en production
- **Écrire les tests en même temps** : pas après coup
- **Garder l'architecture hexagonale** : même dans l'incrémental

### Architecture Progressive

Au départ, vous pouvez :

- Mettre la logique directement dans les API routes
- Garder les types dans un seul fichier

Puis, au fur et à mesure :

- Extraire les use cases
- Créer les repositories
- Structurer en couches hexagonales

L'important est que **chaque étape livre de la valeur**.

### Tests

- Tests unitaires pour les composants React
- Tests d'intégration pour les API routes
- Tests E2E à partir de l'étape 12

### Commandes Utiles

```bash
npm run dev          # Développement local
npm test            # Lancer les tests
npm run build       # Build de production
git add . && git commit -m "Étape X: ..."
git push            # Déclenche le déploiement Render
```
