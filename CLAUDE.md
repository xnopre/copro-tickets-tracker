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

## ⚠️ CHECKLIST DE FIN D'ÉTAPE (OBLIGATOIRE)

Avant de considérer une étape comme terminée, vérifier SYSTÉMATIQUEMENT :

### 1. Tests Unitaires Complets

- [ ] Chaque nouveau fichier de code a son fichier `.test.ts` ou `.test.tsx`
- [ ] Chaque fichier modifié a ses tests mis à jour
- [ ] Les tests couvrent les cas nominaux ET les cas d'erreur
- [ ] Tous les tests passent : `npm test`

### 2. Validation Build

- [ ] Type-check sans erreur : `npm run type-check`
- [ ] Build réussi : `npm run build`

### 3. Vérification Systématique des Tests Manquants

**Commande de détection** :

```bash
# Liste tous les fichiers .ts/.tsx sans tests
find src app -type f \( -name "*.ts" -o -name "*.tsx" \) \
  ! -name "*.test.ts" ! -name "*.test.tsx" ! -name "*.d.ts" \
  ! -path "*/types/*" ! -path "*/entities/*" ! -path "*/value-objects/*"
```

**Pour chaque fichier listé**, vérifier qu'il rentre dans une exception :

- Interface TypeScript pure (pas de logique)
- Type/Value Object simple (pas de validation complexe)
- Fichier de configuration

**Si aucun des cas ci-dessus** → CRÉER LE TEST IMMÉDIATEMENT

### 4. Comptage des Tests

- Noter le nombre de tests AVANT l'étape
- Vérifier que le nombre a augmenté APRÈS l'étape
- **Minimum** : +1 test par nouveau fichier de code

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

## Tests - Règles Strictes

### Principe Absolu

**AUCUN code ne doit être écrit sans tests correspondants.**

### Fichiers qui DOIVENT avoir des tests

Composants React, Use Cases, Services, Repositories, Schémas MongoDB, API Routes, Pages Next.js, Utils/Helpers

### Fichiers SANS tests (exceptions)

Interfaces pures, Types simples, Config

### Convention de Nommage Stricte

- **TOUJOURS** dans le même répertoire que le fichier source
- `MyComponent.tsx` → `MyComponent.test.tsx`
- `MyService.ts` → `MyService.test.ts`

### Bonnes Pratiques

**Structure AAA** (Arrange-Act-Assert) :

```typescript
describe('MyComponent', () => {
  it('should do something', () => {
    // Arrange : préparer les données
    const data = { ... };

    // Act : exécuter l'action
    const result = doSomething(data);

    // Assert : vérifier le résultat
    expect(result).toBe(expectedValue);
  });
});
```

**Assertions avec valeurs en dur** (pas de regexp ni calculs) :

```typescript
// ✅ BON
expect(result.title).toBe('Mon titre');
expect(result.createdAt).toEqual(new Date('2025-01-15T10:00:00.000Z'));

// ❌ MAUVAIS
expect(result.title).toMatch(/titre/);
expect(result.createdAt).toBe(new Date());
```

**Frameworks et Outils** :

- Vitest pour les tests unitaires
- React Testing Library pour les composants
- Mocker les dépendances externes (database, API calls)
- Ne pas tester les appels à console.log

## Accessibilité (a11y)

### Principes obligatoires

Tous les composants visuels DOIVENT respecter les standards d'accessibilité WCAG 2.1 niveau AA.

### 1. Éléments sémantiques HTML

Utiliser les balises sémantiques appropriées :

```tsx
// ✅ BON
<article>
  <header>
    <h1>Titre</h1>
  </header>
  <nav aria-label="Navigation de retour">
    <a href="/">Retour</a>
  </nav>
  <section aria-labelledby="description-heading">
    <h2 id="description-heading">Description</h2>
    <p>Contenu...</p>
  </section>
  <footer aria-label="Informations supplémentaires">
    <time dateTime="2025-01-15T10:30:00">15/01/2025 à 10:30</time>
  </footer>
</article>

// ❌ MAUVAIS
<div>
  <div>
    <div>Titre</div>
  </div>
  <div>
    <div>Retour</div>
  </div>
  <div>
    <div>Description</div>
    <div>Contenu...</div>
  </div>
  <div>
    <div>15/01/2025 à 10:30</div>
  </div>
</div>
```

### 2. Attributs ARIA

#### Rôles et labels

```tsx
// Liste de tickets
<div role="list" aria-label="Liste de 5 tickets">
  {tickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
</div>

// État vide
<div role="status" aria-live="polite">
  <p>Aucun ticket à afficher</p>
</div>

// Lien avec description
<Link
  href="/tickets/123"
  aria-label="Voir le ticket : Réparer l'ascenseur - Statut : En cours"
>
  <article>...</article>
</Link>
```

#### Formulaires

```tsx
// Champs requis
<label htmlFor="title">
  Titre <span aria-label="requis">*</span>
</label>
<input
  id="title"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? 'title-error' : undefined}
/>
{error && <div id="title-error" role="alert" aria-live="assertive">{error}</div>}

// Bouton avec état de chargement
<button
  type="submit"
  disabled={isSubmitting}
  aria-busy={isSubmitting}
>
  {isSubmitting ? 'Création en cours...' : 'Créer le ticket'}
</button>

// Message de succès
<div role="status" aria-live="polite">
  Ticket créé avec succès !
</div>
```

### 3. Focus et navigation au clavier

```tsx
// Focus visible avec Tailwind
<Link
  href="/"
  className="text-blue-600 hover:text-blue-800
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
>
  Retour
</Link>

// Éviter les tabindex positifs (toujours utiliser 0 ou -1)
// ✅ BON
<div role="button" tabIndex={0} onKeyDown={handleKeyDown}>...</div>

// ❌ MAUVAIS
<div role="button" tabIndex={1}>...</div>
```

### 4. Dates et heures

Toujours utiliser l'élément `<time>` avec l'attribut `dateTime` :

```tsx
<time dateTime={ticket.createdAt.toISOString()}>{formatTicketDate(ticket.createdAt)}</time>
```

### 5. Tests d'accessibilité

Chaque composant visuel DOIT avoir des tests d'accessibilité :

```typescript
describe('Accessibility', () => {
  it('should have proper accessibility attributes and semantic elements', () => {
    const { container } = render(<MyComponent />);

    // Vérifier les aria-labels
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-label', 'Description du lien');

    // Vérifier les rôles
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();

    // Vérifier les éléments sémantiques
    const article = container.querySelector('article');
    expect(article).toBeInTheDocument();

    // Vérifier aria-live
    const status = container.querySelector('[aria-live="polite"]');
    expect(status).toBeInTheDocument();
  });
});
```

### 6. Checklist d'accessibilité

Avant de livrer un composant, vérifier :

- [ ] Utilisation d'éléments sémantiques HTML (`article`, `nav`, `header`, `footer`, `section`, `main`)
- [ ] Tous les liens interactifs ont un `aria-label` descriptif
- [ ] Tous les formulaires ont des labels associés (`htmlFor` / `id`)
- [ ] Les champs requis ont `aria-required="true"`
- [ ] Les erreurs ont `role="alert"` et `aria-live="assertive"`
- [ ] Les succès ont `role="status"` et `aria-live="polite"`
- [ ] Les états de chargement ont `aria-busy="true"`
- [ ] Les dates utilisent `<time dateTime="...">`
- [ ] Le focus est visible (ring Tailwind)
- [ ] Les tests d'accessibilité sont présents et passent

### Ressources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

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

### Architecture

- Respecter la séparation des couches hexagonales
- Le Domain ne doit JAMAIS importer de code Infrastructure
- Utiliser TypeScript strict mode (pas de `any`, toujours typer)
- Préférer les functional components et hooks React

### Workflow

- Consulter la **CHECKLIST DE FIN D'ÉTAPE** avant de finaliser
- Mettre à jour PLAN.md au fur et à mesure des implémentations

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
  /* config options here */
  // Commentaire inutile
  // future: true,             // Code commenté "pour plus tard"
};
```

### Règle d'or

**Chaque ligne de code doit avoir une raison d'exister maintenant, pas "au cas où" ou "pour plus tard".**

Si quelque chose n'est pas utilisé dans l'étape actuelle, il ne doit pas être dans le code.

## Règles de Gestion du Projet

### PLAN.md

- Toujours mettre à jour le plan au fur et à mesure des implémentations
- Ajouter les nouvelles informations quand demandées

### Git

- Ne JAMAIS commiter (l'utilisateur le fait toujours lui-même)
- Supprimer les imports inutiles avant de finaliser

### Tests

- Voir la section **"Tests - Règles Strictes"** ci-dessus
- Utiliser des valeurs en dur dans les assertions (pas de regexp/calculs)
