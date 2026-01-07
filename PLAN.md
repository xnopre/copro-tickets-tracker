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
- [🚫 Étape 0b : Bloquer le Référencement par les Moteurs de Recherche](#-étape-0b--bloquer-le-référencement-par-les-moteurs-de-recherche)
- [🧪 Étape 0c : Tests E2E et Vérification des Headers HTTP](#-étape-0c--tests-e2e-et-vérification-des-headers-http)
- [🎨 Étape 1 : Liste Statique de Tickets](#-étape-1--liste-statique-de-tickets)
- [🤖 Étape 2 : CI/CD avec GitHub Actions](#-étape-2--cicd-avec-github-actions)
- [🤖 Étape 2b : Workflows GitHub avec Claude](#-étape-2b--workflows-github-avec-claude)
- [🔄 Étape 2c : Renovate pour la Gestion Automatique des Dépendances](#-étape-2c--renovate-pour-la-gestion-automatique-des-dépendances)
- [🗄️ Étape 3 : Tickets depuis MongoDB](#️-étape-3--tickets-depuis-mongodb)
- [➕ Étape 4 : Créer un Nouveau Ticket](#-étape-4--créer-un-nouveau-ticket)
- [🏗️ Architecture Hexagonale](#️-architecture-hexagonale)
- [📄 Étape 5 : Voir le Détail d'un Ticket](#-étape-5--voir-le-détail-dun-ticket)
- [🔄 Étape 6 : Changer le Statut et Assigner un Ticket](#-étape-6--changer-le-statut-et-assigner-un-ticket)
- [💬 Étape 7 : Ajouter des Commentaires](#-étape-7--ajouter-des-commentaires)
- [✏️ Étape 8 : Modifier un Ticket](#️-étape-8--modifier-un-ticket)
- [📦 Étape 9 : Archiver un Ticket](#-étape-9--archiver-un-ticket)
- [👥 Étape 10 : Liste des Utilisateurs](#-étape-10--liste-des-utilisateurs)
- [📧 Étape 11 : Notifier les Utilisateurs par Mail](#-étape-11--notifier-les-utilisateurs-par-mail)
- [📧 Étape 11b : Service d'Envoi d'Emails Gmail](#-étape-11b--service-denvoi-demails-gmail)
- [🔐 Étape 12a : Ajout des Mots de Passe](#-étape-12a--ajout-des-mots-de-passe)
- [🔐 Étape 12b : Ajout Authentification](#-étape-12b--ajout-authentification)
- [👤 Étape 12c : Afficher l'Utilisateur Connecté](#-étape-12c--afficher-lutilisateur-connecté)
- [💬 Étape 12d : Utiliser l'Utilisateur Connecté pour les Commentaires](#-étape-12d--utiliser-lutilisateur-connecté-pour-les-commentaires)
- [👤 Étape 12e : Ajouter l'Utilisateur Courant comme Créateur d'un Ticket](#-étape-12e--ajouter-lutilisateur-courant-comme-créateur-dun-ticket)
- [🎯 Étape 13 : Filtrer par Statut](#-étape-13--filtrer-par-statut)
- [🔍 Étape 14 : Recherche de Tickets](#-étape-14--recherche-de-tickets)
- [📊 Étape 15 : Dashboard avec Statistiques](#-étape-15--dashboard-avec-statistiques)
- [🎨 Étape 16 : Polish UX/UI](#-étape-16--polish-uxui)
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

## 🚫 Étape 0b : Bloquer le Référencement par les Moteurs de Recherche

**Objectif** : Empêcher l'application déployée d'être référencée par les moteurs de recherche (Google, Bing, etc.)

### Ce qu'on livre

- Fichier robots.txt qui bloque tous les robots d'indexation
- Meta tag noindex dans les métadonnées de l'application
- Header HTTP X-Robots-Tag: noindex
- L'application reste accessible par URL directe mais ne sera pas indexée

### Tâches

- [x] Créer le fichier `app/robots.ts` avec une fonction qui retourne la configuration robots.txt
- [x] Ajouter la meta tag `robots: noindex, nofollow` dans `app/layout.tsx` (metadata)
- [x] Configurer le header `X-Robots-Tag: noindex, nofollow` dans `next.config.ts`
- [x] Tester en local que robots.txt est accessible (`http://localhost:3000/robots.txt`)
- [x] Vérifier les headers HTTP en local (Outils dev → Network)
- [ ] Déployer sur Render.com
- [ ] Vérifier que robots.txt est accessible en production (`https://copro-tickets-tracker.onrender.com/robots.txt`)
- [ ] Vérifier les headers HTTP en production

### Validation

- ✅ `/robots.txt` affiche `User-agent: * Disallow: /`
- ✅ Le HTML contient `<meta name="robots" content="noindex, nofollow">`
- ✅ Les réponses HTTP contiennent le header `X-Robots-Tag: noindex, nofollow`
- ✅ L'application reste accessible et fonctionnelle
- ⏳ Déployé en production (en attente du push git)

### Notes techniques

**robots.txt via Next.js** :

Next.js 15 permet de générer robots.txt dynamiquement via un fichier `app/robots.ts` :

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}
```

**Meta tag robots** :

Dans `app/layout.tsx`, ajouter dans les métadonnées :

```typescript
export const metadata: Metadata = {
  // ... autres métadonnées
  robots: {
    index: false,
    follow: false,
  },
};
```

**Header HTTP X-Robots-Tag** :

Dans `next.config.ts`, ajouter :

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
};
```

**Pourquoi trois méthodes ?**

- **robots.txt** : Standard universel, tous les robots le respectent
- **Meta tag** : Backup pour les pages HTML, lu par les robots qui analysent le contenu
- **Header HTTP** : Protège même les ressources non-HTML (API, images, etc.)

Cette triple protection garantit qu'aucun moteur de recherche n'indexera l'application.

---

## 🧪 Étape 0c : Tests E2E et Vérification des Headers HTTP

**Objectif** : Valider automatiquement que les headers HTTP et robots.txt fonctionnent correctement

### Ce qu'on livre

- Infrastructure de tests End-to-End avec Playwright
- Tests automatisés des headers `X-Robots-Tag`
- Tests du fichier `robots.txt`
- Intégration dans la CI/CD GitHub Actions

### Tâches

- [x] Installer Playwright (`@playwright/test`)
- [x] Créer `playwright.config.ts`
- [x] Créer `tests/e2e/headers.spec.ts` (tests headers HTTP + meta tags)
- [x] Créer `tests/e2e/robots.spec.ts` (tests robots.txt)
- [x] Créer `tests/e2e/smoke.spec.ts` (tests de fumée)
- [x] Ajouter scripts npm (`test:e2e`, `test:e2e:ui`, `test:e2e:debug`)
- [x] Mettre à jour `.gitignore` pour Playwright
- [x] Intégrer dans `.github/workflows/ci.yml`
- [x] Tester en local (`npm run test:e2e`)
- [ ] Tester sur une PR

### Validation

- ✅ Les tests e2e passent en local (11/11 tests)
- ✅ Header `X-Robots-Tag: noindex, nofollow` vérifié sur toutes les routes
- ✅ `/robots.txt` accessible et contient `Disallow: /`
- ✅ Meta tags `noindex, nofollow` présents dans le HTML
- ⏳ Tests e2e passent dans GitHub Actions (à tester sur PR)

### Notes techniques

**Commandes Playwright** :

```bash
npm run test:e2e           # Lancer les tests e2e
npm run test:e2e:ui        # Mode UI (interface graphique)
npm run test:e2e:debug     # Mode debug
```

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
- Authentification avec Personal Access Token pour créer les PRs

### Tâches

- [x] Créer le fichier de workflow `.github/workflows/renovate.yml`
  - [x] Configurer le déclenchement (schedule + workflow_dispatch)
  - [x] Utiliser l'image Docker officielle de Renovate
  - [x] Configurer le repository courant
  - [x] Configurer le token GitHub pour créer les PRs
- [x] Créer le fichier de configuration `renovate.json` à la racine du projet
  - [x] Étendre la configuration recommandée (`config:recommended`)
  - [x] Configurer le timezone (Europe/Paris)
  - [x] Configurer le regroupement des dépendances (mineures/patch ensemble) (avec matchPackageNames)
  - [x] Créer un groupe spécial pour Next.js et React
  - [x] Limiter le nombre de PRs ouvertes simultanément (5 max)
  - [x] Ajouter des labels (`dependencies`, `renovate`)
  - [x] Configurer l'automerge pour les mises à jour patch
  - [x] Créer un Personal Access Token (PAT) GitHub avec les permissions requises
  - [x] Configurer le secret `RENOVATE_TOKEN` dans les paramètres GitHub
  - [ ] Tester le workflow manuellement via "Run workflow" dans GitHub Actions
  - [ ] Valider qu'une PR de Renovate est créée et passe les checks CI

### Validation

- ✅ Le workflow Renovate s'exécute automatiquement selon le schedule
- ✅ Le fichier `renovate.json` est présent et valide
- ✅ Workflow mis à jour pour utiliser un PAT
- ⏳ PAT créé et configuré (en attente de configuration manuelle)
- ⏳ Renovate crée automatiquement des PRs pour les mises à jour de dépendances (à tester après config PAT)
- ⏳ Les PRs de Renovate déclenchent les workflows CI/CD (à tester après config PAT)
- ⏳ Les tests passent sur les PRs de Renovate (à tester après config PAT)

### Notes techniques

**Problème identifié** :

Le `GITHUB_TOKEN` par défaut fourni par GitHub Actions a des limitations de permissions qui empêchent Renovate de créer des Pull Requests. Les logs montrent :

```
POST https://api.github.com/repos/xnopre/copro-tickets-tracker/pulls = statusCode=403
GitHub failure: Resource not accessible by integration
```

Renovate crée bien les branches (`renovate/all-patch`, `renovate/all-minor-dev`, `renovate/major-github-actions`) mais ne peut pas créer les PRs associées.

**Solution : Personal Access Token (PAT)** :

1. **Créer un PAT** (GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens) :
   - **Name** : `Renovate Bot`
   - **Expiration** : 1 an (ou No expiration)
   - **Repository access** : `Only select repositories` → `copro-tickets-tracker`
   - **Permissions (Repository)** :
     - ✅ **Contents** : Read and write
     - ✅ **Pull requests** : Read and write
     - ✅ **Issues** : Read and write
     - ✅ **Metadata** : Read-only (automatique)
     - ✅ **Workflows** : Read and write (optionnel, pour déclencher les workflows CI)

2. **Ajouter le secret** :
   - Repository → Settings → Secrets and variables → Actions
   - New repository secret : `RENOVATE_TOKEN`
   - Coller le token généré

3. **Workflow mis à jour** :
   - Utilise maintenant `token: ${{ secrets.RENOVATE_TOKEN }}` au lieu de `${{ secrets.GITHUB_TOKEN }}`

**Test** :

Après configuration du PAT, lancer manuellement le workflow via Actions → Renovate → Run workflow. Les PRs devraient être créées automatiquement pour les branches existantes.

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

- [x] Créer l'API route `POST /api/tickets`
- [x] Créer le composant `CreateTicketForm` avec tests
- [x] Valider les champs côté client et serveur
- [x] Rafraîchir la liste après création
- [x] Afficher un message de succès/erreur
- [ ] Déployer

### Validation

- ✅ On peut créer un ticket avec titre + description
- ✅ Le formulaire valide les champs vides
- ✅ Le nouveau ticket apparaît dans la liste
- ⏳ Fonctionne en production (en attente du déploiement)

### Notes techniques

**Architecture** :

- Formulaire de création dans une page dédiée `/tickets/new`
- Bouton "+ Créer un ticket" sur la page d'accueil
- Redirection automatique vers la page d'accueil après création (délai de 1 seconde pour afficher le message de succès)

**Gestion des routes** :

- Next.js `typedRoutes` activé (validation automatique des routes)
- Routes validées à la compilation via TypeScript
- Autocomplete IDE pour toutes les routes existantes
- Zero dépendance - fonctionnalité native de Next.js
- Types générés automatiquement dans `.next/types/link.d.ts`

---

## 🏗️ Architecture Hexagonale

**Objectif** : Refactoriser le code pour respecter une architecture hexagonale (ports & adapters)

### Structure finale

```
src/
├── domain/                    # Cœur métier (ne dépend de rien)
│   ├── entities/
│   │   └── Ticket.ts         # Entité métier pure
│   ├── value-objects/
│   │   └── TicketStatus.ts   # Enum des statuts
│   ├── repositories/
│   │   └── ITicketRepository.ts  # Interface (port)
│   └── use-cases/            # Logique métier
│       ├── CreateTicket.ts
│       └── GetTickets.ts
├── application/              # Orchestration
│   └── services/
│       ├── ServiceFactory.ts # Factory pour DI
│       └── TicketService.ts  # Service applicatif
├── infrastructure/           # Adapters techniques
│   ├── database/
│   │   ├── mongodb.ts        # Connexion MongoDB
│   │   └── schemas/
│   │       └── TicketSchema.ts  # Schéma Mongoose
│   └── repositories/
│       └── MongoTicketRepository.ts  # Implémentation
└── presentation/             # UI
    └── components/           # Composants React
        ├── TicketCard.tsx
        ├── TicketList.tsx
        └── CreateTicketForm.tsx

app/                          # Next.js (convention)
├── api/tickets/route.ts      # API routes
├── page.tsx                  # Page d'accueil
└── tickets/new/page.tsx      # Page création
```

### Principes respectés

1. **Domain** ne dépend de rien (code métier pur, pas de Mongoose, pas de MongoDB)
2. **Application** dépend uniquement du Domain
3. **Infrastructure** implémente les interfaces du Domain
4. **Presentation** utilise Application et Infrastructure
5. Les dépendances pointent vers l'intérieur (Domain au centre)

### Tâches

- [x] Créer la structure de dossiers src/
- [x] Créer la couche Domain (entities, value objects, repository interface)
- [x] Créer les use cases dans le Domain
- [x] Créer l'Infrastructure (database, schemas, repository implementation)
- [x] Créer la couche Application (services d'orchestration)
- [x] Migrer les API routes pour utiliser ServiceFactory
- [x] Migrer les composants React vers Presentation
- [x] Migrer les pages Next.js pour utiliser la nouvelle architecture
- [x] Mettre à jour tous les tests
- [x] Supprimer l'ancien code (lib/, types/, components/)
- [x] Vérifier que tous les tests passent (21 tests)

### Validation

- ✅ Architecture hexagonale complète
- ✅ Domain ne dépend de rien (aucun import de Mongoose)
- ✅ Tous les tests passent (21 tests)
- ✅ Build TypeScript réussi
- ✅ Code inutilisé supprimé (YAGNI)

---

## 📄 Étape 5 : Voir le Détail d'un Ticket

**Objectif** : Cliquer sur un ticket pour voir tous ses détails

### Ce qu'on livre

- Page de détail d'un ticket (`/tickets/[id]`)
- Affiche titre, description complète, statut, dates
- Bouton retour vers la liste

### Tâches

- [x] Créer l'API route `GET /api/tickets/[id]`
- [x] Créer la page `/tickets/[id]/page.tsx`
- [x] Créer le composant `TicketDetail` avec tests
- [x] Rendre les tickets cliquables dans la liste
- [x] Gérer le cas "ticket non trouvé"
- [x] Ajouter la méthode `findById` dans l'architecture hexagonale
  - [x] Interface ITicketRepository
  - [x] Implémentation MongoTicketRepository
  - [x] Use case GetTicketById
  - [x] TicketService.getTicketById
- [x] Tests unitaires (80 tests au total)
- [x] Build Next.js réussi
- [ ] Déployer

### Validation

- ✅ Cliquer sur un ticket ouvre sa page de détail
- ✅ Toutes les infos sont affichées
- ✅ Le bouton retour fonctionne
- ✅ URL avec mauvais ID affiche une erreur propre (page not-found)
- ✅ Architecture hexagonale respectée
- ✅ Tous les tests passent (80 tests)
- ⏳ Déployé en production (en attente du push git)

---

## 🔧 Refactorisation : Éliminer la duplication de code

**Objectif** : Supprimer le code dupliqué entre TicketCard et TicketDetail

### Ce qu'on livre

- Constantes partagées pour les couleurs et labels de statut
- Fonctions de formatage de date réutilisables
- Tests unitaires pour les utilitaires
- Composants refactorisés sans duplication

### Tâches

- [x] Créer `src/presentation/constants/ticketDisplay.ts`
  - [x] Exporter `statusColors` (mapping couleurs Tailwind par statut)
  - [x] Exporter `statusLabels` (mapping labels français par statut)
- [x] Créer `src/presentation/utils/ticketFormatters.ts`
  - [x] Fonction `formatTicketDate` (date seule pour les listes)
  - [x] Fonction `formatTicketDateTime` (date + heure pour les détails)
- [x] Créer les tests `src/presentation/utils/ticketFormatters.test.ts`
- [x] Refactoriser `TicketCard.tsx`
  - [x] Supprimer constantes dupliquées
  - [x] Importer et utiliser les utilitaires partagés
- [x] Refactoriser `TicketDetail.tsx`
  - [x] Supprimer constantes dupliquées
  - [x] Importer et utiliser les utilitaires partagés
- [x] Valider avec les tests
- [x] Valider avec TypeScript compilation
- [x] Build Next.js réussi

### Validation

- ✅ Tous les tests passent (85 tests, +6 nouveaux tests)
- ✅ TypeScript compile sans erreur
- ✅ Build Next.js réussi
- ✅ Aucun code dupliqué entre TicketCard et TicketDetail
- ✅ L'affichage des tickets reste identique
- ✅ Principe YAGNI respecté (extraction minimale nécessaire)

### Notes techniques

**Structure créée** :

- `src/presentation/constants/` - Constantes d'affichage
- `src/presentation/utils/` - Fonctions utilitaires

**Avantages** :

- DRY (Don't Repeat Yourself) - une seule source de vérité
- Facilite les modifications futures (changement de couleurs, formats, etc.)
- Tests unitaires indépendants pour les utilitaires
- Cohérence garantie entre les composants

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

- [x] Ajouter le champ `assignedTo` (string | null) dans le type Ticket
- [x] Mettre à jour le schéma Mongoose avec le champ `assignedTo` (default: null)
- [x] Créer l'API route `PATCH /api/tickets/[id]` (pour statut + assignation)
- [x] Valider côté serveur : statut + assignedTo obligatoires
- [x] Créer le composant `UpdateTicketStatusForm` avec tests (12 tests)
- [x] Le formulaire contient : sélecteur de statut + champ texte pour le nom
- [x] Validation côté client : le nom est requis
- [x] Afficher les statuts avec des couleurs différentes
- [x] Afficher la personne assignée dans la carte ticket et le détail
- [x] Mettre à jour le statut et l'assignation via l'API
- [x] Revalider les données Next.js pour refresh (router.refresh())
- [x] Mettre à jour les tests existants (145 tests passants)
- [x] Créer tests unitaires pour le use case UpdateTicket (4 tests)
- [ ] Déployer

### Validation

- ✅ On ne peut pas changer le statut sans saisir un nom
- ✅ Le formulaire affiche une erreur si le nom est vide
- ✅ On peut changer le statut ET saisir le nom en même temps
- ✅ Les changements sont sauvegardés dans MongoDB
- ✅ Le nouveau statut et la personne assignée apparaissent dans la liste et le détail
- ✅ Les couleurs changent selon le statut
- ✅ L'architecture hexagonale est respectée
- ✅ Tous les tests passent (145/145)
- ✅ Le build TypeScript et Next.js fonctionnent
- ⏳ Déployé en production (en attente)

### Notes techniques

**Architecture hexagonale** :

- Entité `Ticket` mise à jour avec `assignedTo: string | null`
- Interface `UpdateTicketData` ajoutée avec `status` et `assignedTo`
- Use case `UpdateTicket` créé
- Méthode `update()` ajoutée dans `ITicketRepository` et `MongoTicketRepository`
- Méthode `updateTicket()` ajoutée dans `TicketService`

**API Route PATCH /api/tickets/[id]** :

- Validation serveur : vérifie que `status` et `assignedTo` sont présents
- Trim automatique du champ `assignedTo`
- Gestion des erreurs : ID invalide, ticket non trouvé, erreur serveur

**Composant UpdateTicketStatusForm** :

- Affichage d'un sélecteur pour tous les statuts (NEW, IN_PROGRESS, RESOLVED, CLOSED)
- Champ texte obligatoire pour la personne assignée
- Pré-rempli avec les valeurs actuelles du ticket
- Validation côté client : empêche la soumission si `assignedTo` est vide
- Messages de succès/erreur avec ARIA
- Appel à `router.refresh()` pour mettre à jour l'affichage après succès
- 12 tests couvrant : rendu, validation, soumission, erreurs, accessibilité

**Affichage** :

- `TicketCard` affiche "Assigné à : [nom]" si le ticket est assigné
- `TicketDetail` affiche la personne assignée dans le footer et inclut le formulaire de mise à jour
- Les couleurs des statuts sont déjà gérées par les constantes existantes

**Tests** :

- Tous les mocks de tests mis à jour avec le champ `assignedTo`
- 145 tests passants au total (après amélioration de MongoTicketRepository)
- Script seed mis à jour avec des assignations exemple
- Tests unitaires dédiés pour le use case `UpdateTicket` (4 tests)
  - Test de mise à jour avec données valides
  - Test retour null quand ticket non trouvé
  - Test mise à jour vers RESOLVED
  - Test mise à jour vers CLOSED

**Optimisation MongoTicketRepository** :

- Ajout de `runValidators: true` dans `findByIdAndUpdate` pour garantir l'exécution des validateurs Mongoose lors de la mise à jour
- Option `{ new: true, runValidators: true }` assure la cohérence des données et la validation automatique

---

## 💬 Étape 7 : Ajouter des Commentaires

**Objectif** : Permettre de commenter les tickets

### Ce qu'on livre

- Liste des commentaires sous le détail du ticket
- Formulaire pour ajouter un commentaire
- Les commentaires sont horodatés
- Architecture hexagonale complète
- Tests unitaires et d'intégration

### Tâches

- [x] Créer l'entité Comment dans le domain
  - [x] Interface Comment avec ticketId, content, author, createdAt
  - [x] Interface CreateCommentData
- [x] Créer le schéma Mongoose pour Comment
  - [x] Index sur ticketId pour optimiser les recherches
  - [x] Timestamps avec createdAt uniquement
- [x] Créer l'architecture hexagonale
  - [x] Interface ICommentRepository (findByTicketId, create)
  - [x] MongoCommentRepository
  - [x] Use cases GetComments et AddComment
  - [x] CommentService
  - [x] ServiceFactory.getCommentService()
- [x] Créer l'API route `GET /api/tickets/[id]/comments`
- [x] Créer l'API route `POST /api/tickets/[id]/comments`
- [x] Créer les composants avec tests
  - [x] CommentCard (affichage d'un commentaire)
  - [x] CommentList (liste des commentaires)
  - [x] AddCommentForm (formulaire d'ajout)
  - [x] TicketComments (composant client orchestrateur)
- [x] Afficher les commentaires dans la page de détail
- [x] Tests unitaires (202 tests au total, +27 nouveaux tests)
  - [x] Tests use cases AddComment et GetComments (9 tests)
  - [x] Tests composants CommentCard, CommentList, AddCommentForm (22 tests)
  - [x] Tests API routes (10 tests)
- [x] Build TypeScript et Next.js réussis
- [ ] Déployer

### Validation

- ✅ On voit tous les commentaires d'un ticket
- ✅ On peut ajouter un nouveau commentaire
- ✅ Le commentaire apparaît immédiatement
- ✅ Les dates sont affichées correctement
- ✅ Architecture hexagonale respectée
- ✅ Tous les tests passent (202/202)
- ✅ Build TypeScript et Next.js réussis
- ⏳ Déployé en production (en attente)

### Notes techniques

**Architecture hexagonale** :

- Entité `Comment` dans le domain (code métier pur)
- Use cases `GetComments` et `AddComment` avec validation
- Repository `MongoCommentRepository` implémente `ICommentRepository`
- `CommentService` orchestre les use cases

**Composants** :

- `CommentCard` : affiche un commentaire individuel avec auteur, contenu et date
- `CommentList` : affiche la liste des commentaires avec état vide
- `AddCommentForm` : formulaire avec validation client et serveur
- `TicketComments` : composant client qui gère le state et le refresh

**Validation** :

- Content : requis, max 2000 caractères
- Author : requis, max 100 caractères
- TicketId : validé côté serveur (format MongoDB ObjectId)

**Accessibilité** :

- Éléments sémantiques (article, header, time)
- Attributs ARIA (role="list", aria-label, aria-live)
- Formulaire accessible avec labels et messages d'erreur

---

## ✏️ Étape 8 : Modifier un Ticket

**Objectif** : Permettre de modifier le titre et la description d'un ticket

### Ce qu'on livre

- Bouton "Modifier" dans la page de détail
- Formulaire de modification pré-rempli
- Sauvegarde des modifications
- Architecture hexagonale respectée
- Tests unitaires complets (310 tests au total)

### Tâches

- [x] Modifier l'interface `UpdateTicketData` (rendre tous les champs optionnels)
- [x] Étendre la route API `PATCH /api/tickets/[id]` pour accepter title/description
- [x] Enrichir le use case `UpdateTicket` avec validation
- [x] Créer le composant `EditTicketForm` avec tests (19 tests)
- [x] Ajouter un mode "édition" dans la page de détail (toggle view ⇄ edit)
- [x] Valider les modifications (client + serveur)
- [x] Afficher un message de confirmation
- [x] Tests complets (310 tests passants)
- [x] Type-check et build réussis
- [ ] Déployer

### Validation

- ✅ Le bouton "Modifier" affiche le formulaire
- ✅ Les champs sont pré-remplis
- ✅ Les modifications sont sauvegardées
- ✅ On peut annuler l'édition
- ✅ Validation title : requis, max 200 caractères
- ✅ Validation description : requise, max 5000 caractères
- ✅ Architecture hexagonale respectée
- ✅ Tous les tests passent (310/310)
- ✅ Type-check sans erreur
- ✅ Build Next.js réussi
- ⏳ Déployé en production (en attente)

### Notes techniques

**Architecture hexagonale** :

- Interface `UpdateTicketData` étendue avec champs optionnels (title, description, status, assignedTo)
- Use case `UpdateTicket` enrichi avec validation (même logique que CreateTicket)
- Route API `PATCH /api/tickets/[id]` étendue pour partial updates
- Composants : `EditTicketForm`, `TicketDetailsWithUpdate` avec mode toggle

**Nouveaux fichiers créés** :

- `src/presentation/components/EditTicketForm.tsx` (formulaire d'édition)
- `src/presentation/components/EditTicketForm.test.tsx` (19 tests)

**Fichiers modifiés** :

- `src/domain/entities/Ticket.ts` (UpdateTicketData)
- `src/domain/use-cases/UpdateTicket.ts` (validation)
- `src/domain/use-cases/UpdateTicket.test.ts` (13 tests)
- `app/api/tickets/[id]/route.ts` (PATCH étendu)
- `app/api/tickets/[id]/route.test.ts` (16 tests pour PATCH)
- `src/presentation/components/TicketDetail.tsx` (bouton Modifier)
- `src/presentation/components/TicketDetail.test.tsx` (+4 tests pour bouton Modifier)
- `src/presentation/components/TicketDetailsWithUpdate.tsx` (mode toggle)
- `src/presentation/components/TicketDetailsWithUpdate.test.tsx` (+5 tests pour mode toggle)

**Tests** : +57 nouveaux tests (de 253 à 310)

---

## 📦 Étape 9 : Archiver un Ticket

**Objectif** : Permettre d'archiver un ticket (les tickets ne sont jamais supprimés)

### Ce qu'on livre

- Bouton "Archiver" dans la page de détail
- Confirmation avant archivage via une modale
- Toggle "Voir les archives" pour afficher/masquer les tickets archivés
- Les tickets archivés sont affichés en fin de liste (tri automatique)
- Badge "Archivé" visible dans les cartes de la liste et dans le détail
- Style visuel distinct pour les tickets archivés (opacité 70%, bordure grise)
- Les boutons "Modifier" et "Archiver" sont masqués pour les tickets archivés
- Protection API : interdiction de modifier un ticket archivé
- Architecture hexagonale complète avec use case ArchiveTicket
- Tests unitaires complets (342 tests passants)

### Tâches

- [x] Ajouter le champ `archived` (boolean, default: false) dans le type Ticket
- [x] Mettre à jour le schéma Mongoose avec le champ `archived`
- [x] Créer l'API route `PATCH /api/tickets/[id]/archive`
- [x] Créer l'architecture hexagonale
  - [x] Méthode `archive()` dans ITicketRepository
  - [x] Implémentation dans MongoTicketRepository
  - [x] Use case ArchiveTicket avec tests
  - [x] TicketService.archiveTicket()
- [x] Créer le composant ArchiveTicketButton avec confirmation (modale)
- [x] Implémenter le bouton "Archiver" dans la page de détail
- [x] Rediriger vers la liste après archivage
- [x] Ajouter un indicateur visuel "ARCHIVÉ" dans le détail si le ticket est archivé
- [x] Masquer les boutons Modifier et Archiver pour les tickets archivés
- [x] Ajouter un badge "Archivé" dans les cartes de la liste (TicketCard)
- [x] Ajouter un style visuel distinct (opacité 70%, bordure grise)
- [x] Implémenter le toggle "Voir les archives" dans la liste
- [x] Créer le composant TicketListWithArchiveToggle
- [x] Trier les tickets pour afficher les archivés en fin de liste
- [x] Ajouter la protection API : interdire modification d'un ticket archivé (UpdateTicket use case)
- [x] Tests unitaires complets (342 tests passants)
- [x] Build TypeScript et Next.js réussis
- [ ] Déployer

### Validation

- ✅ Le bouton "Archiver" demande confirmation via une modale
- ✅ L'archivage marque le ticket comme archived dans MongoDB
- ✅ Toggle "Voir les archives" fonctionne (masque/affiche les tickets archivés)
- ✅ Les tickets archivés sont affichés en fin de liste (tri automatique)
- ✅ Badge "Archivé" visible dans les cartes de la liste (TicketCard)
- ✅ Style visuel distinct pour les tickets archivés (opacité 70%, bordure grise)
- ✅ Les commentaires du ticket restent accessibles
- ✅ On peut toujours consulter un ticket archivé via son URL directe
- ✅ Redirection vers la liste après archivage avec router.push('/')
- ✅ Badge "ARCHIVÉ" affiché en haut du détail pour les tickets archivés
- ✅ Boutons Modifier et Archiver masqués pour les tickets archivés
- ✅ Protection API : impossible de modifier un ticket archivé (ValidationError)
- ✅ Architecture hexagonale respectée
- ✅ Tous les tests passent (342/342)
- ✅ Build TypeScript réussi
- ✅ Build Next.js réussi
- ⏳ Déployé en production (en attente)

### Notes techniques

**Architecture hexagonale** :

- Entité `Ticket` étendue avec `archived: boolean`
- Interface `ITicketRepository.archive(id: string)` ajoutée
- Use case `ArchiveTicket` créé avec tests
- Use case `UpdateTicket` enrichi avec vérification anti-modification des tickets archivés (lignes 18-20)
- Méthode `MongoTicketRepository.archive()` implémentée (appelle findByIdAndUpdate avec `{ archived: true }`)
- `MongoTicketRepository.findAll()` retourne TOUS les tickets (le tri/filtre est géré côté UI)
- `TicketService.archiveTicket()` orchestre le use case

**Composant ArchiveTicketButton** :

- État local : showConfirmation, isArchiving, error
- Modale de confirmation avec overlay (z-50)
- Gestion des états de chargement avec aria-busy
- Redirection vers "/" après succès avec router.push() + router.refresh()
- Gestion des erreurs avec affichage dans la modale
- Accessibilité : role="dialog", aria-modal, aria-labelledby
- 14 tests couvrant : rendu, confirmation, archivage, erreurs, accessibilité

**API Route PATCH /api/tickets/[id]/archive** :

- Appelle `ServiceFactory.getTicketService().archiveTicket(id)`
- Gestion des erreurs : InvalidIdError (400), NotFound (404), Server Error (500)
- 6 tests unitaires

**Affichage** :

- Badge "ARCHIVÉ" affiché dans TicketDetail (pour les tickets archivés)
- Badge "Archivé" affiché dans TicketCard (liste) avec style gris
- Bouton Modifier masqué si ticket.archived
- Bouton Archiver masqué si ticket.archived
- Style visuel dans TicketCard : `opacity-70 border-2 border-gray-300`

**Tests** :

- Tous les tests existants mis à jour avec le champ `archived: false`
- +25 nouveaux tests (use case, API route, composants)
- 342 tests passants au total

**Fichiers créés** :

- `src/domain/use-cases/ArchiveTicket.ts` + `.test.ts`
- `app/api/tickets/[id]/archive/route.ts` + `.test.ts`
- `src/presentation/components/ArchiveTicketButton.tsx` + `.test.tsx`
- `src/presentation/components/TicketListWithArchiveToggle.tsx` (composant avec toggle)

**Fichiers modifiés** :

- `src/domain/entities/Ticket.ts` (+ archived)
- `src/domain/repositories/ITicketRepository.ts` (+ archive)
- `src/domain/use-cases/UpdateTicket.ts` (+ vérification anti-modification si archivé)
- `src/infrastructure/repositories/MongoTicketRepository.ts` (+ archive, findAll retourne tous les tickets)
- `src/infrastructure/database/schemas/TicketSchema.ts` (+ archived)
- `src/presentation/components/TicketDetail.tsx` (+ badge, conditions)
- `src/presentation/components/TicketCard.tsx` (+ badge Archivé, style visuel)
- `app/page.tsx` (utilise TicketListWithArchiveToggle)
- Tous les fichiers de tests (+ archived: false dans les mocks)

---

## 👥 Étape 10 : Liste des Utilisateurs

**Objectif** : Créer une gestion des utilisateurs et remplacer l'assignation par texte libre par une sélection d'utilisateur

### Ce qu'on livre

- Entité User dans MongoDB avec nom, prénom, email, mot de passe
- Architecture hexagonale complète pour les utilisateurs
- API pour récupérer la liste des utilisateurs
- Modification du champ `assignedTo` pour référencer un User (ObjectId)
- Formulaire d'assignation avec liste déroulante d'utilisateurs
- Script seed pour créer des utilisateurs de test
- Tests unitaires complets

### Tâches

- [x] Créer l'entité User dans le domain
  - [x] Interface User avec id, firstName, lastName, email, password
  - [x] Interface CreateUserData
- [x] Créer le schéma Mongoose pour User
  - [x] Champs : firstName, lastName, email (unique), password
  - [x] Index sur email
  - [x] Timestamps (createdAt, updatedAt)
- [x] Créer l'architecture hexagonale pour User
  - [x] Interface IUserRepository (findAll, findById, findByEmail, create)
  - [x] MongoUserRepository
  - [x] Use cases GetUsers, GetUserById, CreateUser
  - [x] UserService
  - [x] ServiceFactory.getUserService()
- [x] Créer les API routes
  - [x] GET /api/users (liste des utilisateurs)
  - [x] GET /api/users/[id] (détail d'un utilisateur)
- [x] Modifier l'entité Ticket
  - [x] Changer assignedTo de `string | null` vers `string | null` (ObjectId)
  - [x] Ajouter une méthode/propriété pour récupérer les infos de l'utilisateur assigné
- [x] Modifier le schéma Mongoose Ticket
  - [x] Changer assignedTo pour référencer User (type: ObjectId, ref: 'User')
  - [x] Ajouter populate() dans les requêtes pour récupérer les données de l'utilisateur
- [x] Modifier le composant EditTicketForm (anciennement UpdateTicketStatusForm)
  - [x] Remplacer le champ texte par un `<select>` avec la liste des utilisateurs
  - [x] Récupérer la liste des users via l'API
  - [x] Afficher "Prénom Nom" dans les options
- [x] Modifier l'affichage de l'utilisateur assigné
  - [x] Dans TicketCard : afficher "Assigné à : Prénom Nom"
  - [x] Dans TicketDetail : afficher "Assigné à : Prénom Nom"
- [x] Créer un script seed pour les utilisateurs
  - [x] Créer 4 utilisateurs de test
  - [x] Mettre à jour le seed des tickets pour référencer ces users
- [x] Mettre à jour tous les tests
  - [x] Tests User (use cases, repository, service, API routes) - 37 tests
  - [x] Tests Ticket (mise à jour avec références User)
  - [x] Tests composants (EditTicketForm avec select)
- [x] Build TypeScript et Next.js
- [ ] Déployer

### Validation

- ✅ On peut créer des utilisateurs dans MongoDB
- ✅ La liste des utilisateurs est accessible via API
- ✅ Le formulaire d'assignation affiche une liste déroulante
- ✅ L'assignation crée une référence MongoDB vers User
- ✅ Le nom complet de l'utilisateur s'affiche dans les tickets
- ✅ Architecture hexagonale respectée
- ✅ Tous les tests passent
- ✅ Build TypeScript et Next.js réussis
- ⏳ Déployé en production (en attente)

### Notes techniques

**Schéma User** :

```typescript
{
  firstName: string;
  lastName: string;
  email: string; // unique
  password: string; // hashé (bcrypt)
  createdAt: Date;
  updatedAt: Date;
}
```

**Référence dans Ticket** :

```typescript
// Avant
assignedTo: string | null;

// Après
assignedTo: ObjectId | null; // référence vers User
```

**Population Mongoose** :

Les requêtes doivent utiliser `.populate('assignedTo')` pour récupérer les données de l'utilisateur.

**Affichage** :

Format : "Prénom Nom" (ex: "Jean Dupont")

**Sécurité** :

- Ne JAMAIS renvoyer le mot de passe dans les API
- Hacher les mots de passe avec bcrypt avant stockage
- Pour cette étape, on stocke les mots de passe (sans authentification)
- L'authentification sera implémentée dans une étape future

**Fichiers créés** (20 nouveaux fichiers) :

```
src/domain/entities/User.ts
src/domain/repositories/IUserRepository.ts
src/domain/use-cases/CreateUser.ts + .test.ts
src/domain/use-cases/GetUsers.ts + .test.ts
src/domain/use-cases/GetUserById.ts + .test.ts
src/infrastructure/database/schemas/UserSchema.ts + .test.ts
src/infrastructure/repositories/MongoUserRepository.ts + .test.ts
src/application/services/UserService.ts + .test.ts
app/api/users/route.ts + .test.ts
app/api/users/[id]/route.ts + .test.ts
```

**Fichiers modifiés** (10 fichiers) :

```
PLAN.md
src/domain/entities/Ticket.ts (+ assignedUser)
src/infrastructure/database/schemas/TicketSchema.ts (ref User)
src/infrastructure/repositories/MongoTicketRepository.ts (populate)
src/application/services/ServiceFactory.ts (+ getUserService)
src/presentation/components/EditTicketForm.tsx (select au lieu d'input)
src/presentation/components/EditTicketForm.test.tsx (MSW mock)
src/presentation/components/TicketCard.tsx (assignedUser display)
src/presentation/components/TicketDetail.tsx (assignedUser display)
scripts/seed.ts (création users)
```

**Tests** : +37 nouveaux tests (use cases: 13, service: 4, repository: 11, API routes: 7, schema: 5)

---

## 📧 Étape 11 : Notifier les Utilisateurs par Mail

**Objectif** : Envoyer des notifications par email lors des événements importants (création de ticket, changement de statut, ajout de commentaire)

### Ce qu'on livre

- Service d'envoi d'email intégré à l'architecture hexagonale
- Templates d'emails HTML pour chaque type de notification
- Configuration du service Resend (API moderne et gratuite)
- Notifications automatiques lors de :
  - Création d'un nouveau ticket
  - Changement de statut d'un ticket
  - Ajout d'un commentaire sur un ticket
- Tests unitaires complets du service d'envoi

### Tâches

- [x] Choisir et configurer le service d'envoi (Resend)
- [x] Créer l'architecture hexagonale pour les emails
  - [x] Interface IEmailService dans le domain (src/domain/services/IEmailService.ts)
  - [x] Implémentation ResendEmailService dans l'infrastructure (src/infrastructure/services/ResendEmailService.ts)
  - [x] MockEmailService pour les tests (src/infrastructure/services/**mocks**/MockEmailService.ts)
  - [x] ServiceFactory.getEmailService() (retourne MockEmailService en test, ResendEmailService en prod)
- [x] Créer les templates d'emails HTML (src/infrastructure/services/EmailTemplates.ts)
  - [x] Template de création de ticket (ticketCreated)
  - [x] Template d'assignation de ticket (ticketAssigned)
  - [x] Template de changement de statut (ticketStatusChanged)
  - [x] Template de nouveau commentaire (commentAdded)
- [x] Intégrer les notifications dans les use cases
  - [x] CreateTicket → email à tous les utilisateurs
  - [x] UpdateTicket → email à l'utilisateur assigné (assignation) + tous les utilisateurs (changement de statut)
  - [x] AddComment → email à tous les utilisateurs
- [x] Configurer les variables d'environnement (.env.local.example)
  - [x] RESEND_API_KEY
  - [x] FROM_EMAIL
  - [x] NEXT_PUBLIC_APP_URL
- [x] Tests unitaires (528 tests passants au total, +20 nouveaux tests)
  - [x] Tests du service d'envoi (ResendEmailService.test.ts - 8 tests)
  - [x] Tests des templates (EmailTemplates.test.ts - 7 tests)
  - [x] Tests du mock (MockEmailService.test.ts - 5 tests)
  - [x] Tests d'intégration avec les use cases (CreateTicket, UpdateTicket, AddComment)
- [x] Build TypeScript et Next.js
- [ ] Déployer

### Validation

- ✅ Un email est envoyé lors de la création d'un ticket (tous les utilisateurs notifiés)
- ✅ Un email est envoyé lors du changement de statut (tous les utilisateurs notifiés)
- ✅ Un email est envoyé lors de l'assignation (utilisateur assigné notifié)
- ✅ Un email est envoyé lors de l'ajout d'un commentaire (tous les utilisateurs notifiés)
- ✅ Les templates sont professionnels et bien formatés (HTML + texte brut)
- ✅ Les emails contiennent les informations pertinentes (titre, description, statut, lien vers le ticket)
- ✅ Protection XSS : escapeHtml() dans les templates
- ✅ Architecture hexagonale respectée (IEmailService dans domain, ResendEmailService + MockEmailService dans infrastructure)
- ✅ Les erreurs d'envoi ne bloquent pas le flux métier (sendSafe + try/catch dans use cases)
- ✅ Tous les tests passent (528 tests, +20 nouveaux tests email)
- ✅ Build TypeScript et Next.js réussis
- ⏳ Déployé en production (en attente)

### Notes d'implémentation

**Fichiers créés** (10 nouveaux fichiers) :

```
src/domain/services/IEmailService.ts
src/domain/errors/EmailServiceError.ts
src/infrastructure/services/ResendEmailService.ts
src/infrastructure/services/ResendEmailService.test.ts
src/infrastructure/services/EmailTemplates.ts
src/infrastructure/services/EmailTemplates.test.ts
src/infrastructure/services/__mocks__/MockEmailService.ts
src/infrastructure/services/__mocks__/MockEmailService.test.ts
```

**Fichiers modifiés** (9 fichiers) :

```
package.json (+ resend@6.6.0)
.env.local.example (+ RESEND_API_KEY, FROM_EMAIL, NEXT_PUBLIC_APP_URL)
src/application/services/ServiceFactory.ts (+ getEmailService)
src/application/services/TicketService.ts (injection IEmailService)
src/application/services/CommentService.ts (injection IEmailService)
src/domain/use-cases/CreateTicket.ts (+ notifyTicketCreated)
src/domain/use-cases/UpdateTicket.ts (+ notifyTicketUpdated, notifyAssignment, notifyStatusChange)
src/domain/use-cases/AddComment.ts (+ notifyCommentAdded)
vitest.config.ts (setup EmailService mock pour tests)
```

**Tests** : +20 nouveaux tests (8 ResendEmailService, 7 EmailTemplates, 5 MockEmailService)

**Particularités** :

- **Méthode sendSafe()** : Envoie non-bloquant qui retourne true/false au lieu de throw, utilisée dans tous les use cases pour éviter de bloquer le flux métier
- **Gestion d'erreur** : Tous les appels d'email sont dans des try/catch, les erreurs sont loguées mais n'interrompent pas le flux
- **Templates** : Double format (HTML + texte brut) pour compatibilité clients mail
- **Protection XSS** : Méthode escapeHtml() pour échapper les caractères dangereux (&, <, >, ", ')
- **Configuration environnement** : MockEmailService en test (NODE_ENV=test), ResendEmailService en dev/prod
- **Variable FROM_EMAIL** : Utilisée au lieu de EMAIL_FROM pour cohérence avec Resend

### Notes techniques

**Service d'envoi : Resend**

- API moderne et simple (https://resend.com)
- Plan gratuit : 100 emails/jour, 3 000/mois
- Installation : `npm install resend`
- Nécessite vérification du domaine ou utilisation de `onboarding@resend.dev` pour les tests

**Architecture hexagonale** :

```typescript
// Domain
interface IEmailService {
  sendTicketCreated(ticket: Ticket, recipient: string): Promise<void>;
  sendTicketUpdated(ticket: Ticket, recipient: string): Promise<void>;
  sendCommentAdded(ticket: Ticket, comment: Comment, recipient: string): Promise<void>;
}

// Infrastructure
class ResendEmailService implements IEmailService {
  constructor(private resend: Resend) {}
  // Implémentation avec Resend
}

// Alternative pour les tests
class MockEmailService implements IEmailService {
  // Mock pour les tests
}
```

**Templates d'emails** :

Les emails doivent être en HTML avec un style inline (pour compatibilité clients mail) :

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1>Nouveau ticket créé : {{title}}</h1>
  <p><strong>Description :</strong> {{description}}</p>
  <p><strong>Statut :</strong> {{status}}</p>
  <a
    href="{{ticketUrl}}"
    style="background: #0070f3; color: white; padding: 10px 20px; text-decoration: none;"
  >
    Voir le ticket
  </a>
</div>
```

**Variables d'environnement** :

```bash
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@votredomaine.com
```

**Intégration dans les use cases** :

```typescript
// CreateTicket.ts
async execute(data: CreateTicketData): Promise<Ticket> {
  const ticket = await this.ticketRepository.create(data);

  // Envoyer notification email
  if (ticket.assignedUser?.email) {
    await this.emailService.sendTicketCreated(ticket, ticket.assignedUser.email);
  }

  return ticket;
}
```

**Gestion des erreurs** :

- Les erreurs d'envoi d'email ne doivent PAS bloquer la création/modification du ticket
- Logger les erreurs d'envoi mais continuer le flux métier
- Utiliser try/catch autour de l'envoi d'email

**Sécurité** :

- Ne jamais inclure de données sensibles dans les emails
- Utiliser HTTPS pour tous les liens
- Valider les adresses email avant envoi

**Tests** :

- Utiliser MockEmailService pour les tests unitaires
- Vérifier que les emails sont appelés avec les bons paramètres
- Tester que les erreurs d'envoi n'interrompent pas le flux

---

## 📧 Étape 11b : Service d'Envoi d'Emails Gmail

**Objectif** : Ajouter Gmail comme service d'envoi d'emails alternatif à Resend (qui nécessite un nom de domaine)

### Ce qu'on livre

- Service d'envoi d'emails Gmail via Nodemailer
- Architecture hexagonale respectée avec interchangeabilité des providers
- Sélection du provider via variable d'environnement `EMAIL_PROVIDER`
- Configuration simple avec mot de passe d'application Google
- Tests unitaires complets (543 tests passants au total, +14 nouveaux tests)
- Documentation de configuration Gmail

### Tâches

- [x] Installer les dépendances
  - [x] `npm install nodemailer`
  - [x] `npm install --save-dev @types/nodemailer`
- [x] Créer l'implémentation Gmail
  - [x] `src/infrastructure/services/GmailEmailService.ts` (implémente `IEmailService`)
  - [x] Configuration Nodemailer avec Gmail SMTP
  - [x] Validation des variables d'environnement (GMAIL_USER, GMAIL_APP_PASSWORD, FROM_EMAIL)
- [x] Créer les tests unitaires
  - [x] `src/infrastructure/services/GmailEmailService.test.ts` (9 tests)
  - [x] Mock de nodemailer avec vi.mock()
  - [x] Tests du constructeur, send(), sendSafe()
- [x] Modifier ServiceFactory
  - [x] Ajouter import de `GmailEmailService`
  - [x] Logique de sélection via `EMAIL_PROVIDER` (gmail|resend)
  - [x] Gestion des erreurs pour provider invalide
  - [x] Défaut à Resend si non spécifié
- [x] Mettre à jour les tests de ServiceFactory
  - [x] Test retour GmailEmailService quand EMAIL_PROVIDER=gmail
  - [x] Test retour ResendEmailService quand EMAIL_PROVIDER=resend
  - [x] Test défaut à ResendEmailService si non défini
  - [x] Test erreur si EMAIL_PROVIDER invalide
- [x] Mettre à jour `.env.local.example`
  - [x] Documentation des deux providers (Gmail et Resend)
  - [x] Instructions de configuration Gmail
  - [x] Variable `EMAIL_PROVIDER` pour choisir le service
- [x] Validation complète
  - [x] Type-check sans erreur
  - [x] Lint sans erreur
  - [x] Build Next.js réussi
  - [x] Tous les tests passent (543 tests)
- [ ] Déployer

### Validation

- ✅ GmailEmailService implémente correctement IEmailService
- ✅ ServiceFactory retourne le bon service selon EMAIL_PROVIDER
- ✅ Architecture hexagonale respectée (Domain inchangé)
- ✅ Les templates existants fonctionnent avec Gmail
- ✅ Tous les tests passent (543/543)
- ✅ Type-check sans erreur
- ✅ Lint sans erreur
- ✅ Build Next.js réussi
- ⏳ Déployé en production (en attente)

### Notes techniques

**Service Gmail : Nodemailer**

- Bibliothèque Node.js mature et bien documentée
- Support natif de Gmail SMTP
- Configuration simple avec mot de passe d'application Google
- Pas besoin de Google Cloud Console / OAuth2

**Configuration Gmail** :

1. **Activer la validation en 2 étapes** :
   - Aller sur https://myaccount.google.com
   - Sécurité → Validation en 2 étapes
   - Suivre les instructions

2. **Créer un mot de passe d'application** :
   - Retourner sur https://myaccount.google.com
   - Sécurité → Validation en 2 étapes → Mots de passe des applications
   - Sélectionner "Autre (nom personnalisé)"
   - Entrer "CoTiTra"
   - Cliquer sur "Générer"
   - **Copier le mot de passe** (16 caractères)

3. **Configurer `.env.local`** :
   ```bash
   EMAIL_PROVIDER=gmail
   GMAIL_USER=votreemail@gmail.com
   GMAIL_APP_PASSWORD=abcdefghijklmnop  # Mot de passe d'application (sans espaces)
   FROM_EMAIL=votreemail@gmail.com
   ```

**Variables d'environnement** :

```bash
# Choix du provider
EMAIL_PROVIDER=gmail  # ou 'resend' (défaut si non spécifié)

# Gmail
GMAIL_USER=votreemail@gmail.com
GMAIL_APP_PASSWORD=mot_de_passe_application

# Resend (alternative)
RESEND_API_KEY=your_resend_api_key_here

# Commun aux deux providers
FROM_EMAIL=noreply@votredomaine.com
```

**Architecture hexagonale** :

```typescript
// Domain (inchangé)
interface IEmailService {
  send(data: EmailData): Promise<void>;
  sendSafe(data: EmailData): Promise<boolean>;
}

// Infrastructure - Nouvel adapter Gmail
class GmailEmailService implements IEmailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }
}

// ServiceFactory - Sélection dynamique
static getEmailService(): IEmailService {
  if (NODE_ENV === 'test') return new MockEmailService();

  const provider = process.env.EMAIL_PROVIDER || 'resend';
  if (provider === 'gmail') return new GmailEmailService();
  if (provider === 'resend') return new ResendEmailService();
  throw new Error('EMAIL_PROVIDER invalide');
}
```

**Avantages de Gmail** :

- ✅ Gratuit (500 emails/jour pour comptes gratuits)
- ✅ Pas besoin de nom de domaine
- ✅ Configuration simple (juste email + mot de passe d'application)
- ✅ Fiable et bien supporté

**Limitations Gmail** :

- Limite de 500 emails/jour (comptes gratuits)
- Limite de 100 destinataires par email
- Nécessite validation en 2 étapes et mot de passe d'application

**Fichiers créés** (2 nouveaux fichiers) :

```
src/infrastructure/services/GmailEmailService.ts
src/infrastructure/services/GmailEmailService.test.ts
```

**Fichiers modifiés** (3 fichiers) :

```
src/application/services/ServiceFactory.ts (+ import GmailEmailService, + logique sélection)
src/application/services/ServiceFactory.test.ts (+ 5 nouveaux tests)
.env.local.example (+ documentation Gmail)
```

**Tests** : +14 nouveaux tests (9 GmailEmailService, 5 ServiceFactory)

**Sécurité** :

- Ne JAMAIS commiter le mot de passe d'application dans Git
- Utiliser `.env.local` (ignoré par Git)
- Le mot de passe d'application est différent du mot de passe principal Gmail

**Basculer entre providers** :

```bash
# Utiliser Gmail
EMAIL_PROVIDER=gmail

# Utiliser Resend
EMAIL_PROVIDER=resend

# Défaut (Resend)
# EMAIL_PROVIDER non défini
```

---

## 🔐 Étape 12a : Ajout des Mots de Passe

**Objectif** : Ajouter le champ `password` à l'entité User avec hashage automatique via hook Mongoose

### Ce qu'on livre

- Champ `password` (hashé avec bcryptjs) dans le schéma User
- Hook Mongoose `.pre('save')` pour hacher automatiquement les mots de passe
- Mise à jour de `users.json` avec mots de passe en clair (seront hashés automatiquement au seed)
- Script seed met à jour les utilisateurs avec mots de passe hashés
- Architecture hexagonale conservée

### Tâches

- [x] Installer bcryptjs : `npm install bcryptjs` et `npm install --save-dev @types/bcryptjs`
- [x] Ajouter le champ `password` au schéma Mongoose User
  - [x] Type: string
  - [x] Required: true
  - [x] Minlength: 8 caractères
  - [x] Pas de select par défaut (caché dans les requêtes lean)
- [x] Ajouter le hook `.pre('save')` dans UserSchema
  - [x] Hash automatique avec bcryptjs (10 rounds)
  - [x] Skip si password non modifié
  - [x] Gère les erreurs correctement
- [x] Mettre à jour `users.json` avec mots de passe
  - [x] Ajouter champ `"password"` avec mots de passe en clair
  - [x] Exemple : `{ "firstName": "Jean", "lastName": "Dupont", "email": "jean@example.com", "password": "monMotDePasse123" }`
- [x] Mettre à jour l'entité Domain User
  - [x] Ajouter `password` à l'interface User
  - [x] UserPublic reste sans password
- [x] Ajouter le champ `password` aux mocks des tests
- [x] Tests unitaires
  - [x] Tester que le password est hashé au save
  - [x] Tester que le hash ne se refait pas si password non modifié
  - [x] Tester que les utilisateurs seed ont des passwords hashés
- [x] Build TypeScript et Next.js
- [ ] Déployer

### Validation

- ✅ Champ `password` présent dans le schéma User
- ✅ Les mots de passe sont automatiquement hashés (jamais en clair dans la DB)
- ✅ Hook Mongoose fonctionne correctement
- ✅ Les utilisateurs seed ont des mots de passe hashés
- ✅ Impossible de créer un utilisateur sans password
- ✅ Build TypeScript réussi
- ✅ Build Next.js réussi
- ✅ Tous les tests existants passent

### Notes techniques

**Hook Mongoose Pre-Save** :

```typescript
// src/infrastructure/database/schemas/UserSchema.ts
import bcryptjs from 'bcryptjs';

UserSchema.pre('save', async function (next) {
  // Si le password n'a pas été modifié, on skip
  if (!this.isModified('password')) return next();

  try {
    // Hash avec bcryptjs (10 rounds = bon compromis sécurité/perf)
    this.password = await bcryptjs.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});
```

**Avantages de cette approche** :

- ✅ Automatique et transparent
- ✅ Garantit le hashing même si on oublie dans le code métier
- ✅ S'applique à tous les modes de création (`create()`, `insertMany()`, `save()`)
- ✅ Pattern standard Mongoose
- ✅ Pas besoin de scripts manuels
- ✅ Sûr et maintenable

**Bcryptjs vs Bcrypt** :

- Utiliser `bcryptjs` (pur JavaScript) plutôt que `bcrypt` (binding natif)
- Plus compatible, pas de dépendances de compilation
- Même sécurité, légèrement plus lent mais négligeable

**Workflow de seed** :

1. Lancer `npm run seed` ou `npm run seed:users`
2. Les utilisateurs sont créés avec `UserModel.create(users)`
3. Le hook `.pre('save')` est automatiquement appelé
4. Les mots de passe sont hashés
5. Les utilisateurs sont insérés dans la DB

**Fichiers créés** : Aucun

**Fichiers modifiés** (3 fichiers) :

```
src/infrastructure/database/schemas/UserSchema.ts (+ password field, + pre-save hook)
src/domain/entities/User.ts (+ password au type User)
scripts/users.json (+ password aux utilisateurs)
```

**Tests** : Mettre à jour les mocks existants pour inclure le champ `password`

---

## 🔐 Étape 12b : Ajout Authentification

**Objectif** : Implémenter l'authentification des utilisateurs

### Ce qu'on livre

- Pas de page d'inscription (signup)
- Page de connexion (login)
- Sessions utilisateur sécurisées
- Protection des routes (redirect non-authentifiés vers login)
- Architecture hexagonale respectée
- Tests unitaires complets

### Tâches

- [x] Installer et configurer le service d'authentification
- [x] Créer l'entité User avec hachage de mot de passe (Étape 12a)
- [x] Créer l'AuthService pour validation des credentials
- [x] Créer l'API route `/api/auth/[...nextauth]`
- [x] Créer la page `/login` avec LoginForm
- [x] Implémenter la gestion des sessions avec NextAuth
- [x] Protéger les routes (middleware Next.js)
- [x] Tests unitaires complets (568 tests ✅)
- [ ] Déployer

### Validation

- ✅ NextAuth.js installé et configuré
- ✅ AuthService implémente IAuthService (domain layer)
- ✅ Password validation avec bcryptjs
- ✅ src/auth.ts avec Credentials provider
- ✅ src/middleware.ts protège les routes
- ✅ app/api/auth/[...nextauth]/route.ts configuré
- ✅ Page de connexion `/login` fonctionnelle
- ✅ LoginForm avec validation client/serveur
- ✅ SessionProvider ajouté dans layout
- ✅ Architecture hexagonale respectée
- ✅ Tous les tests passent (568/568)
- ✅ Build Next.js réussi
- ⏳ Déployé en production
- ⏳ Affichage utilisateur dans header (Step 12c)
- ⏳ Bouton déconnexion (Step 12c)

### Notes techniques

**Solutions d'authentification** : **NextAuth.js**

- Framework d'authentification Next.js natif
- Support OAuth, JWT, database sessions
- Configuration simple avec Credentials provider
- Middleware automatique pour les routes protégées

**Approche : NextAuth.js + Credentials Provider**

- Configuration : `/src/auth.ts`
- Callback login : validation email/password (mots de passe déjà hashés par l'Étape 12a)
- Sessions : JWT tokens
- Middleware : protection des routes (dans `/src/middleware.ts`)
- Routes API : `/api/auth/[...nextauth]`

**Sécurité** :

- Validation des mots de passe hashés (bcrypt validé par NextAuth)
- Validation email
- CSRF protection (automatique avec NextAuth)
- Secrets sécurisés dans .env.local
- Tokens JWT avec expiration

**Fichiers créés** :

```
src/domain/services/IAuthService.ts (interface domain)
src/infrastructure/services/AuthService.ts (implémentation)
src/infrastructure/services/AuthService.test.ts (tests)
src/auth.ts (configuration NextAuth avec Credentials provider)
src/middleware.ts (protection des routes + redirects)
src/presentation/components/LoginForm.tsx (formulaire client)
src/presentation/components/LoginForm.test.tsx (tests)
src/presentation/components/Providers.tsx (SessionProvider wrapper)
src/presentation/components/LoginPageContent.tsx (page content client)
app/api/auth/[...nextauth]/route.ts (API handler NextAuth)
app/login/page.tsx (page login server-side)
```

**Fichiers modifiés** :

```
package.json (+ next-auth@beta)
.env.local.example (+ NextAuth config)
app/layout.tsx (+ Providers wrapper)
src/domain/entities/User.ts (+ password optionnel)
src/domain/repositories/IUserRepository.ts (+ findByEmail)
src/infrastructure/repositories/MongoUserRepository.ts (+ findByEmail)
src/infrastructure/repositories/MongoUserRepository.test.ts (+ tests findByEmail)
src/application/services/ServiceFactory.ts (+ getAuthService)
src/application/services/ServiceFactory.test.ts (+ tests)
```

---

## 👤 Étape 12c : Afficher l'Utilisateur Connecté

**Objectif** : Afficher l'utilisateur actuellement connecté dans le header et ajouter un bouton de déconnexion

### Ce qu'on livre

- Composant Header avec affichage du nom de l'utilisateur connecté
- Bouton "Déconnexion" fonctionnel
- Redirection vers la page de connexion après déconnexion
- Affichage conditionnel (masqué si non authentifié)
- Architecture hexagonale respectée
- Tests unitaires complets

### Tâches

- [x] Créer le composant `Header` avec l'affichage de l'utilisateur connecté
  - [x] Utiliser `useSession()` pour récupérer les données de session
  - [x] Afficher "Connecté en tant que : Prénom Nom"
- [x] Créer le composant `LogoutButton`
  - [x] Bouton "Déconnexion" avec `signOut()` de NextAuth
  - [x] Redirection vers la page d'accueil après déconnexion
  - [x] Gérer l'état de chargement (disabled pendant la déconnexion)
- [x] Ajouter le Header dans le layout principal (`app/layout.tsx`)
  - [x] Placer en haut de la page avant le contenu
  - [x] Rendre visible sur toutes les pages authentifiées
- [x] Créer les tests unitaires
  - [x] Tests Header avec session utilisateur (5 tests)
  - [x] Tests Header sans session (non authentifié)
  - [x] Tests LogoutButton (8 tests)
- [x] Type-check et build
- [ ] Déployer

### Validation

- ✅ Le header affiche le nom de l'utilisateur connecté
- ✅ Le bouton "Déconnexion" fonctionne et redirige vers "/"
- ✅ Le header est masqué quand l'utilisateur n'est pas connecté
- ✅ L'utilisateur revient à la page d'accueil après déconnexion
- ✅ Architecture hexagonale respectée
- ✅ Tous les tests passent (594 tests, +13 nouveaux tests Header & LogoutButton)
- ✅ Type-check sans erreur
- ✅ Lint sans erreur
- ✅ Build Next.js réussi
- ⏳ Déployé en production (en attente)

### Notes techniques

**Architecture implémentation** :

- **Header** : Composant client ('use client') qui affiche le header avec les infos de session
  - Retourne `null` si pas de session (caché pour les non-authentifiés)
  - Affiche "Connecté en tant que : Prénom Nom"
  - Import/utilisation du composant LogoutButton

- **LogoutButton** : Composant client séparé, réutilisable
  - Gère son propre état de chargement (`isLoading`)
  - Appelle `signOut({ redirectTo: '/' })` de NextAuth
  - Affiche "Déconnexion en cours..." pendant le chargement
  - Bouton désactivé pendant la déconnexion
  - Gestion des erreurs avec try/catch (silencieuse)

**Intégration dans le layout** :

```typescript
import { Header } from '@/presentation/components/Header';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <Providers>
          <Header />
          <main className="min-h-screen bg-gray-50 p-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
```

**Fichiers créés** (4 fichiers) :

```
src/presentation/components/Header.tsx
src/presentation/components/Header.test.tsx
src/presentation/components/LogoutButton.tsx
src/presentation/components/LogoutButton.test.tsx
```

**Fichiers modifiés** (1 fichier) :

```
app/layout.tsx (+ import Header, + <Header /> dans le layout)
```

**Tests** : +13 nouveaux tests

- Header.test.tsx : 5 tests (render null, avec session, affichage firstName/lastName, structure sémantique, LogoutButton call)
- LogoutButton.test.tsx : 8 tests (render, initial text, signOut call, loading text, disabled state, aria-busy, styling, error handling)

---

## 💬 Étape 12d : Utiliser l'Utilisateur Connecté pour les Commentaires

**Objectif** : Modifier les commentaires pour utiliser l'utilisateur connecté comme auteur automatique, au lieu d'un champ texte libre

### Ce qu'on livre

- Modification de l'entité `Comment` : `author` devient une référence `User` (ObjectId)
- Formulaire de commentaire sans champ "auteur" (dérivé automatiquement de la session)
- Affichage du nom complet de l'auteur (Prénom Nom)
- API protégée par authentification
- Architecture hexagonale respectée
- Tests unitaires complets

### Tâches

- [x] Modifier l'entité Domain `Comment`
  - [x] Changer `author: string` en `authorId: string` (ObjectId de User)
  - [x] Ajouter interface `CommentWithAuthor` avec `author: User` (pour l'affichage)
- [x] Mettre à jour le schéma Mongoose `CommentSchema`
  - [x] Changer `author: string` en `authorId: { type: ObjectId, ref: 'User' }`
  - [x] Ajouter populate() dans les requêtes pour récupérer les données de l'utilisateur
- [x] Modifier l'entité Domain `AddCommentData`
  - [x] Supprimer le champ `author: string`
  - [x] Remplacer par `authorId: string` (venant de la session)
- [x] Modifier l'API route `POST /api/tickets/[id]/comments`
  - [x] Récupérer l'utilisateur connecté via la session
  - [x] Valider que l'utilisateur est authentifié
  - [x] Passer `authorId` au lieu de `author` au use case
- [x] Modifier le use case `AddComment`
  - [x] Accepter `authorId` au lieu de `author`
  - [x] Valider que `authorId` correspond à un utilisateur valide
- [x] Modifier le composant `AddCommentForm`
  - [x] Supprimer le champ input pour le nom de l'auteur
  - [x] Afficher un message "Vous commentez en tant que [Prénom Nom]"
  - [x] Garder juste le champ textarea pour le contenu
  - [x] Ajouter la session utilisateur via hook (ex: `useSession()`)
- [x] Modifier le composant `CommentCard`
  - [x] Afficher `author.firstName author.lastName` (au lieu de juste `author`)
- [x] Modifier l'API route `GET /api/tickets/[id]/comments`
  - [x] S'assurer que le populate('authorId') retourne les données User
- [x] Mettre à jour le use case `GetComments`
  - [x] Retourner les commentaires avec les données de l'utilisateur
- [x] Mettre à jour tous les tests
  - [x] Tests use case AddComment avec `authorId`
  - [x] Tests composant AddCommentForm sans champ auteur
  - [x] Tests composant CommentCard avec affichage du nom complet
  - [x] Tests API routes
  - [x] Tous les mocks de commentaires avec `authorId`
- [x] Mise à jour du composant `TicketComments`
  - [x] Passer la session utilisateur aux composants enfants
- [x] Type-check et build
- [ ] Déployer

### Validation

- ✅ Les nouveaux commentaires ont une référence à `User` au lieu d'une string
- ✅ Le formulaire n'affiche plus le champ "auteur"
- ✅ L'auteur du commentaire est automatiquement l'utilisateur connecté
- ✅ Le nom complet de l'auteur s'affiche dans les commentaires (Prénom Nom)
- ✅ L'API est protégée (erreur si non authentifié)
- ✅ Architecture hexagonale respectée
- ✅ Tous les tests passent (595/595 tests)
- ✅ Type-check sans erreur
- ✅ Lint sans erreur
- ✅ Build Next.js réussi
- ⏳ Déployé en production (en attente)

### Notes techniques

**Modification du schéma** :

Avant :

```typescript
interface Comment {
  ticketId: string;
  content: string;
  author: string; // Texte libre
  createdAt: Date;
}
```

Après :

```typescript
interface Comment {
  ticketId: string;
  content: string;
  authorId: string; // ObjectId vers User
  author?: User; // Population optionnelle (pour les requêtes GET)
  createdAt: Date;
}

interface CommentWithAuthor extends Comment {
  author: User; // Obligatoire après populate
}
```

**Session utilisateur** :

Pour accéder à l'utilisateur connecté :

```typescript
import { getSession } from 'next-auth/react';

// Côté serveur (API route)
const session = await getSession({ req });
const userId = session?.user?.id;

// Côté client (composant React)
import { useSession } from 'next-auth/react';
const { data: session } = useSession();
const userId = session?.user?.id;
```

**Fichiers modifiés** (7 fichiers) :

```
src/domain/entities/Comment.ts (+ authorId, interface CommentWithAuthor)
src/infrastructure/database/schemas/CommentSchema.ts (ref User)
src/infrastructure/repositories/MongoCommentRepository.ts (populate)
src/domain/use-cases/AddComment.ts (authorId au lieu d'author)
src/domain/use-cases/GetComments.ts (retour avec author hydraté)
src/presentation/components/AddCommentForm.tsx (sans champ auteur)
src/presentation/components/CommentCard.tsx (affichage firstName + lastName)
```

**Fichiers de test modifiés** (10+ fichiers) :

- Tous les tests de commentaires doivent utiliser `authorId` au lieu de `author`
- Tests du composant `AddCommentForm` : vérifier absence du champ auteur
- Tests du composant `CommentCard` : vérifier affichage du nom complet
- Tests des API routes : vérifier que le populate marche

**Tests** : +10-15 nouveaux tests pour couvrir la nouvelle logique avec utilisateurs

**Fichiers créés** : Aucun

**Fichiers modifiés** (10 fichiers) :

- `src/domain/entities/Comment.ts` (+ authorId, interface CommentWithAuthor)
- `src/infrastructure/database/schemas/CommentSchema.ts` (authorId ObjectId ref)
- `src/domain/use-cases/AddComment.ts` (validation authorId)
- `src/infrastructure/repositories/MongoCommentRepository.ts` (populate + mapToEntity)
- `app/api/tickets/[id]/comments/route.ts` (récupération authorId de session)
- `src/presentation/components/AddCommentForm.tsx` (suppression champ auteur)
- `src/presentation/components/CommentCard.tsx` (affichage firstName + lastName)
- `src/presentation/components/AddCommentForm.test.tsx` (mock useSession)
- `app/api/tickets/[id]/comments/route.test.ts` (création utilisateur test)
- `src/infrastructure/database/schemas/CommentSchema.test.ts` (authorId ObjectId)

**Résultats des tests** :

- ✅ 595 tests passent (595/595)
- ✅ 62 suites de tests
- ✅ Type-check : 0 erreur
- ✅ Lint : 0 erreur
- ✅ Build Next.js : réussi

---

## 👤 Étape 12e : Ajouter l'Utilisateur Courant comme Créateur d'un Ticket

**Objectif** : Ajouter l'utilisateur connecté comme créateur du ticket. Le créateur est automatiquement défini lors de la création du ticket basé sur l'utilisateur authentifié.

### Ce qu'on livre

- Ajout du champ `createdBy` à l'entité `Ticket` : référence vers `UserPublic`
- Le créateur du ticket est automatiquement l'utilisateur connecté (stocké en base de données)
- Affichage du nom complet du créateur (Prénom Nom) sur les tickets
- API protégée par authentification
- Architecture hexagonale respectée
- Tests unitaires complets

### Tâches

- [ ] Ajouter le champ `createdBy` à l'entité Domain `Ticket`
  - [ ] Ajouter `createdBy: UserPublic` à l'interface `Ticket`
- [ ] Mettre à jour le schéma Mongoose `TicketSchema`
  - [ ] Ajouter `createdBy: { type: ObjectId, ref: 'User' }`
  - [ ] Ajouter populate('createdBy') dans les requêtes
- [ ] Modifier l'API route `POST /api/tickets`
  - [ ] Récupérer l'utilisateur connecté via la session
  - [ ] Valider que l'utilisateur est authentifié
  - [ ] Passer `createdBy` (l'ID utilisateur) au use case
- [ ] Modifier le use case `CreateTicket`
  - [ ] Accepter `createdBy: string` (ID utilisateur)
  - [ ] Valider que `createdBy` correspond à un utilisateur valide
- [ ] Modifier le composant `CreateTicketForm`
  - [ ] Afficher le message "Vous créez un ticket en tant que [Prénom Nom]"
  - [ ] Ajouter la session utilisateur via hook (ex: `useSession()`)
- [ ] Modifier l'API route `GET /api/tickets`
  - [ ] S'assurer que populate('createdBy') retourne les données User
- [ ] Modifier l'API route `GET /api/tickets/[id]`
  - [ ] S'assurer que populate('createdBy') retourne les données User
- [ ] Mettre à jour le use case `GetTickets`
  - [ ] Retourner les tickets avec les données du créateur
- [ ] Mettre à jour le use case `GetTicketById`
  - [ ] Retourner les tickets avec les données du créateur
- [ ] Modifier le composant `TicketCard`
  - [ ] Afficher `createdBy.firstName createdBy.lastName`
- [ ] Modifier le composant `TicketDetail` (ou page)
  - [ ] Afficher `createdBy.firstName createdBy.lastName`
- [ ] Mettre à jour tous les tests
  - [ ] Tests use case CreateTicket avec `createdBy`
  - [ ] Tests composant CreateTicketForm
  - [ ] Tests composant TicketCard avec affichage du créateur
  - [ ] Tests composant TicketDetail avec affichage du créateur
  - [ ] Tests API routes
  - [ ] Tous les mocks de tickets avec `createdBy`
- [ ] Type-check et build
- [ ] Déployer

### Validation

- ✅ Le champ `createdBy` existe sur les nouveaux tickets
- ✅ Le créateur du ticket est automatiquement l'utilisateur connecté
- ✅ Le nom complet du créateur s'affiche sur les tickets
- ✅ L'API est protégée (erreur si non authentifié)
- ✅ Architecture hexagonale respectée
- ✅ Tous les tests passent
- ✅ Type-check et build réussis
- ⏳ Déployé en production (en attente)

### Notes techniques

**Modification du schéma** :

Avant :

```typescript
interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  assignedTo: UserPublic | null;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

Après :

```typescript
interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdBy: UserPublic; // Nouveau champ
  assignedTo: UserPublic | null;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Fichiers modifiés** (10 fichiers) :

```
src/domain/entities/Ticket.ts (+ createdBy: UserPublic)
src/infrastructure/database/schemas/TicketSchema.ts (add createdBy ref)
src/infrastructure/repositories/MongoTicketRepository.ts (populate createdBy)
src/domain/use-cases/CreateTicket.ts (accept createdBy)
src/domain/use-cases/GetTickets.ts (return with createdBy populated)
src/domain/use-cases/GetTicketById.ts (return with createdBy populated)
src/presentation/components/CreateTicketForm.tsx (show user creating)
src/presentation/components/TicketCard.tsx (display createdBy)
src/presentation/pages/TicketDetail.tsx (display createdBy)
src/infrastructure/api/routes (POST/GET endpoints)
```

**Fichiers de test modifiés** (12+ fichiers) :

- Tous les tests de tickets doivent inclure `createdBy` dans les mocks
- Tests du composant `CreateTicketForm` : vérifier affichage de l'utilisateur courant
- Tests du composant `TicketCard` : vérifier affichage du créateur
- Tests du composant `TicketDetail` : vérifier affichage du créateur
- Tests des API routes : vérifier que le populate marche

**Tests** : +12-15 nouveaux tests pour couvrir la nouvelle logique

---

## 🎯 Étape 13 : Filtrer par Statut

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

## 🔍 Étape 14 : Recherche de Tickets

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

## 📊 Étape 15 : Dashboard avec Statistiques

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

## 🎨 Étape 16 : Polish UX/UI

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
