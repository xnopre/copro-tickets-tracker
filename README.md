# CoTiTra - Copro Tickets Tracker

[![CI](https://github.com/xnopre/copro-tickets-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/xnopre/copro-tickets-tracker/actions/workflows/ci.yml)

Application web de gestion de tickets pour copropriété.

## 📋 À propos du projet

**CoTiTra** est une application web permettant de gérer les tickets de maintenance et les demandes d'intervention pour une copropriété. Elle permet de :

- Créer et suivre des tickets d'intervention
- Assigner les tickets à des responsables
- Commenter et suivre l'historique des tickets
- Filtrer et rechercher les tickets
- Archiver les tickets terminés

## 🛠️ Technologies utilisées

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript (strict mode)
- **UI** : React 19
- **Styling** : Tailwind CSS 4
- **Base de données** : MongoDB (local en dev, MongoDB Atlas en production)
- **Tests** : Vitest + React Testing Library
- **Hébergement** : Render.com

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ installé
- npm ou yarn
- MongoDB installé localement (pour le développement)
- Un compte GitHub
- Un compte Render.com (pour le déploiement)

### Installation locale

1. **Cloner le repository**

   ```bash
   git clone https://github.com/xnopre/copro-tickets-tracker.git
   cd copro-tickets-tracker
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Installer et démarrer MongoDB localement**

   **macOS** :

   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```

   **Windows** : Télécharger depuis [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

   **Linux** : Suivre la documentation officielle selon votre distribution

4. **Configurer les variables d'environnement**

   Créer un fichier `.env.local` à la racine :

   ```bash
   MONGODB_URI=mongodb://localhost:27017/cotitra
   ```

5. **Ajouter des tickets de test dans la base de données**

   Pour peupler la base de données avec des tickets d'exemple :

   ```bash
   npm run seed
   ```

   Ce script va :
   - Supprimer les tickets existants
   - Créer 4 tickets de démonstration avec différents statuts
   - Afficher un résumé des tickets créés

6. **Lancer le serveur de développement**

   ```bash
   npm run dev
   ```

7. **Ouvrir l'application**

   Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 📦 Scripts disponibles

```bash
npm run dev            # Lancer le serveur de développement (avec Turbopack)
npm run dev:stop       # Arrêter le serveur de développement
npm run build          # Builder l'application pour la production
npm start              # Démarrer le serveur de production
npm run lint           # Linter le code avec ESLint
npm run type-check     # Vérifier les types TypeScript
npm test               # Lancer les tests
npm run seed           # Peupler la base de données avec des tickets de test
npm run mongodb:start  # Démarrer MongoDB (macOS)
npm run mongodb:stop   # Arrêter MongoDB (macOS)
```

## 🌍 Déploiement sur Render.com

### 1. Préparer MongoDB Atlas (Base de données production)

1. **Créer un compte MongoDB Atlas**
   - Aller sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - S'inscrire gratuitement

2. **Créer un cluster gratuit**
   - Cliquer sur "Build a Database"
   - Choisir le plan **FREE** (M0 Sandbox)
   - Sélectionner une région proche (ex: Paris)
   - Cliquer sur "Create Cluster"

3. **Configurer l'accès**
   - Créer un utilisateur de base de données (Database User)
   - Ajouter votre adresse IP actuelle dans "Network Access"
   - **Important** : Ajouter aussi `0.0.0.0/0` pour autoriser Render.com

4. **Récupérer l'URL de connexion**
   - Cliquer sur "Connect"
   - Choisir "Connect your application"
   - Copier l'URL (format : `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Remplacer `<password>` par votre mot de passe
   - Ajouter le nom de la base à la fin : `.../cotitra`

### 2. Déployer sur Render.com

1. **Créer un compte Render**
   - Aller sur [render.com](https://render.com)
   - S'inscrire avec GitHub (recommandé)

2. **Créer un nouveau Web Service**
   - Cliquer sur **"New +"** → **"Web Service"**
   - Autoriser Render à accéder à vos repositories GitHub
   - Sélectionner le repository **`copro-tickets-tracker`**
   - Cliquer sur **"Connect"**

3. **Configurer le service**

   Remplir les champs suivants :

   | Champ             | Valeur                          |
   | ----------------- | ------------------------------- |
   | **Name**          | `cotitra` (ou votre choix)      |
   | **Region**        | `Frankfurt` (ou proche de vous) |
   | **Branch**        | `main`                          |
   | **Runtime**       | `Node`                          |
   | **Build Command** | `npm install && npm run build`  |
   | **Start Command** | `npm start`                     |
   | **Instance Type** | `Free`                          |

4. **Configurer les variables d'environnement**

   Dans la section "Environment Variables", ajouter :

   | Key           | Value                                                     |
   | ------------- | --------------------------------------------------------- |
   | `MONGODB_URI` | `mongodb+srv://user:password@cluster.mongodb.net/cotitra` |

   ⚠️ Remplacer par votre URL MongoDB Atlas complète

5. **Lancer le déploiement**
   - Cliquer sur **"Create Web Service"**
   - Attendre 5-10 minutes que le déploiement se termine
   - Votre application sera accessible sur `https://cotitra.onrender.com`

### 3. Déploiements automatiques

Une fois configuré, chaque `git push` sur la branche `main` déclenchera automatiquement un nouveau déploiement sur Render.com.

## 📁 Structure du projet

```
copro-tickets-tracker/
├── app/                    # Pages Next.js (App Router)
│   ├── api/               # API Routes (à venir)
│   ├── tickets/           # Pages des tickets (à venir)
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout racine
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React réutilisables
├── lib/                   # Utilitaires et configurations
├── public/                # Assets statiques
├── .env.local             # Variables d'environnement locales (non versionné)
├── next.config.ts         # Configuration Next.js
├── tailwind.config.ts     # Configuration Tailwind CSS
├── tsconfig.json          # Configuration TypeScript
├── CLAUDE.md              # Documentation pour Claude Code
├── PLAN.md                # Plan de développement par étapes
└── README.md              # Ce fichier
```

## 🗺️ Plan de développement

Le projet suit un développement incrémental. Chaque étape livre une version fonctionnelle et déployable.

Consultez [PLAN.md](./PLAN.md) pour le détail complet des étapes.

## 🏗️ Architecture

Le projet vise une **architecture hexagonale** (ports & adapters) :

```
src/
├── domain/              # Cœur métier (entities, use cases)
├── application/         # Services applicatifs
├── infrastructure/      # Adapters (MongoDB, API)
└── presentation/        # Composants UI React
```

L'architecture sera progressivement mise en place au fur et à mesure des étapes.

## 🛡️ Protection Git

Le projet utilise **Husky** pour empêcher les commits accidentels sur la branche `main`.

### Comment ça fonctionne

**Installation automatique** :
Lors du `npm install`, Husky s'installe automatiquement grâce au script `prepare`.

**Protection à deux niveaux** :

1. 🛡️ **Husky (local)** - Bloque les commits sur `main` avant même de les créer
2. 🛡️ **GitHub (remote)** - Bloque les push directs vers `main`

**En pratique** :

- Si vous essayez de commiter sur `main`, le commit est bloqué avec un message d'aide
- Sur toute autre branche, les commits fonctionnent normalement
- Vous devez créer une branche (`feature/...`) pour toute modification

### Workflow de développement (⚠️ NE JAMAIS commiter directement sur `main`)

À partir de maintenant, pour toute modification, suivre ce workflow :

```bash
# 1. S'assurer d'être sur main et à jour
git checkout main
git pull origin main

# 2. Créer une branche de feature
git checkout -b feature/nom-de-la-fonctionnalite
# Exemples : feature/etape-3-mongodb, feature/fix-typo, feature/add-comments

# 3. Faire vos modifications et commiter
git add .
git commit -m "Description des changements"

# 4. Pousser la branche sur GitHub
git push origin feature/nom-de-la-fonctionnalite

# 5. Créer une Pull Request sur GitHub
# - Aller sur github.com/xnopre/copro-tickets-tracker
# - Cliquer sur "Compare & pull request"
# - Vérifier que les checks CI passent ✅
# - Merger la PR une fois les checks validés
# - Supprimer la branche après le merge

# 6. Revenir sur main et mettre à jour
git checkout main
git pull origin main
git branch -d feature/nom-de-la-fonctionnalite  # Supprimer la branche locale
```

**Important** :

- ❌ `git push origin main` est maintenant bloqué (branche protégée)
- ❌ `git commit` sur `main` est bloqué par Husky
- ✅ Toujours passer par une branche + Pull Request
- ✅ Les tests/build doivent passer avant de pouvoir merger

**Contournement** (à éviter sauf urgence absolue) :

```bash
git commit --no-verify  # Bypass le hook Husky
```

## 🧪 Tests

Les tests seront configurés à l'étape 1 avec :

- **Vitest** pour les tests unitaires
- **React Testing Library** pour les tests de composants
- Tests d'intégration pour les API routes

```bash
npm test              # Lancer tous les tests
npm test -- <file>    # Tester un fichier spécifique
npm test -- --coverage # Avec couverture de code
```

## 📝 Documentation

- [PLAN.md](./PLAN.md) - Plan de développement détaillé
- [CLAUDE.md](./CLAUDE.md) - Guide pour Claude Code

## 📄 Licence

ISC

## 👤 Auteur

[@xnopre](https://github.com/xnopre)

---

**Status** : 🚧 En développement - Étape 3 en cours (MongoDB local configuré)
