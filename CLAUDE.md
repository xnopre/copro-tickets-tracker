# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Présentation du Projet

**CoTiTra** (Copro Tickets Tracker) - Application web de suivi de tickets pour la gestion de copropriété.

### Stack Technique
- **Framework**: Next.js 15+ (App Router)
- **Langage**: TypeScript (strict mode)
- **UI**: React 19 (dernière version stable)
- **Base de données**: MongoDB (MongoDB Atlas)
- **Tests**: Vitest + React Testing Library
- **Hébergement**: Render.com

### Architecture

Le projet suit une **architecture hexagonale** (ports & adapters) :

```
src/
├── domain/              # Cœur métier (entities, value objects, domain services)
│   ├── entities/        # Entités métier (Ticket, Comment)
│   ├── repositories/    # Interfaces de repositories (ports)
│   └── use-cases/       # Cas d'utilisation métier
├── application/         # Couche application (orchestration)
│   └── services/        # Services applicatifs
├── infrastructure/      # Adapters (implémentations techniques)
│   ├── database/        # Implémentation MongoDB
│   ├── api/             # API Routes Next.js
│   └── repositories/    # Implémentation des repositories
└── presentation/        # Couche UI
    ├── components/      # Composants React
    ├── pages/           # Pages Next.js (App Router)
    └── hooks/           # React hooks
```

#### Principes de l'Architecture Hexagonale

1. **Domain** ne dépend de rien (code métier pur)
2. **Application** dépend uniquement du Domain
3. **Infrastructure** implémente les interfaces du Domain
4. **Presentation** utilise Application et Infrastructure
5. Les dépendances pointent vers l'intérieur (Domain au centre)

## Commandes de Développement

```bash
# Installation
npm install

# Développement local
npm run dev

# Tests
npm test                # Tous les tests
npm test -- <file>      # Test spécifique
npm test -- --coverage  # Avec couverture

# Build
npm run build

# Linting
npm run lint
npm run type-check
```

## Configuration de la Base de Données

Le projet utilise MongoDB via Mongoose. La connexion est configurée dans `src/infrastructure/database/`.

### Environnements

**Développement local** : MongoDB installé localement
```bash
# .env.local
MONGODB_URI=mongodb://localhost:27017/cotitra
```

**Production (Render.com)** : MongoDB Atlas (cloud)
```bash
# Variables d'environnement Render.com
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/cotitra
```

### Installation MongoDB en local

**macOS** :
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows** : Télécharger depuis [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

**Linux** : Suivre la doc officielle selon votre distribution

## Tests

- Tous les fichiers de code doivent avoir des tests unitaires
- Les tests sont dans des fichiers `*.test.ts` ou `*.test.tsx`
- Utiliser Vitest pour les tests unitaires
- Utiliser React Testing Library pour les composants
- Mocker les dépendances externes (database, API calls)

Structure de test recommandée :
```typescript
describe('MyComponent', () => {
  it('should do something', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Fonctionnalités Principales

### Gestion des Tickets
- Créer, lire, modifier, supprimer des tickets
- Statuts : NEW, IN_PROGRESS, RESOLVED, CLOSED
- Champs : titre, description, statut, date de création, date de mise à jour

### Commentaires et Historique
- Ajouter des commentaires sur les tickets
- Conserver l'historique des modifications
- Afficher la chronologie des événements

## Déploiement sur Render.com

Le projet est configuré pour être déployé sur Render.com :
- Type de service : Web Service
- Build Command : `npm install && npm run build`
- Start Command : `npm start`
- Variables d'environnement à configurer dans Render dashboard

## Notes Importantes

- Toujours écrire les tests AVANT ou EN MÊME TEMPS que le code
- Respecter la séparation des couches de l'architecture hexagonale
- Les entities du domain ne doivent jamais importer de code infrastructure
- Utiliser TypeScript strict mode (pas de `any`, toujours typer)
- Préférer les functional components et hooks React

## Principes de Code Minimaliste

### YAGNI (You Aren't Gonna Need It)
- **Ne pas coder par anticipation** : N'ajoutez que ce qui est nécessaire pour l'étape en cours
- **Pas de sur-ingénierie** : Évitez les abstractions prématurées
- **Supprimez le code mort** : Retirez tout ce qui n'est pas utilisé

### Configuration minimaliste
- Ne pas ajouter de dépendances inutiles
- Garder les fichiers de configuration simples et épurés
- Supprimer les commentaires évidents ou les placeholders vides
- Ne configurer que ce qui est actuellement utilisé dans le projet

### Exemples à suivre
✅ **BON** :
```typescript
const config: NextConfig = {};
```

❌ **MAUVAIS** :
```typescript
const config: NextConfig = {
  /* config options here */  // Commentaire inutile
  // future: true,             // Code commenté "pour plus tard"
};
```

### Règle d'or
**Chaque ligne de code doit avoir une raison d'exister maintenant, pas "au cas où" ou "pour plus tard".**

Si quelque chose n'est pas utilisé dans l'étape actuelle, il ne doit pas être dans le code.
