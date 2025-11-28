# Plan : Ajout de tests manquants pour CoTiTra

## Résumé exécutif

**Objectif** : Ajouter des tests complets pour 4 fichiers critiques de l'application CoTiTra
**Approche** : Tests hybrides combinant tests unitaires (avec mocks) et tests d'intégration (avec MongoDB in-memory)
**Couverture actuelle** : 2/10 fichiers (20%) → **Cible** : 6/10 fichiers (60%)

## Choix de l'utilisateur

✅ **Périmètre** : Haute + Moyenne priorité (4 fichiers)
✅ **Tests API** : Les deux approches (unitaires + intégration)
✅ **Server Components** : Les deux (fonction getTickets + rendu)
✅ **Modèle Mongoose** : MongoDB in-memory (mongodb-memory-server)

---

## 1. Dépendances à installer

```bash
npm install --save-dev mongodb-memory-server node-mocks-http
```

**Justification** :
- `mongodb-memory-server` : Instance MongoDB en mémoire pour tests d'intégration rapides et isolés
- `node-mocks-http` : Création de mocks Request/Response pour tester les API routes Next.js

---

## 2. Structure des fichiers de test

```
copro-tickets-tracker/
├── lib/
│   ├── models/
│   │   └── Ticket.test.ts          ← NOUVEAU
│   └── mongodb.test.ts              ← NOUVEAU
├── app/
│   ├── api/tickets/
│   │   └── route.test.ts            ← NOUVEAU
│   └── page.test.tsx                ← NOUVEAU
└── tests/
    └── helpers/
        └── db-setup.ts              ← NOUVEAU (utilitaires partagés)
```

---

## 3. Fichiers à créer (détails)

### 3.1 `lib/models/Ticket.test.ts`

**Stratégie** : Tests d'intégration avec mongodb-memory-server
**Objectif** : Valider le schéma Mongoose, les validations, et les comportements

**Tests clés** :
- ✅ Création de ticket valide avec tous les champs requis
- ✅ Échec de validation si `title` manque
- ✅ Échec de validation si `description` manque
- ✅ Trim automatique du `title`
- ✅ Acceptation des statuts valides (NEW, IN_PROGRESS, RESOLVED, CLOSED)
- ✅ Rejet des statuts invalides
- ✅ Valeur par défaut `status = NEW`
- ✅ Génération automatique de `createdAt` et `updatedAt`
- ✅ Mise à jour de `updatedAt` lors de modification
- ✅ Réutilisation du modèle en cache

**Pattern** : `beforeAll` (démarrer MongoDB), `afterAll` (arrêter), `beforeEach` (nettoyer DB)

---

### 3.2 `lib/mongodb.test.ts`

**Stratégie** : Tests unitaires (mocks) + Tests d'intégration (mongodb-memory-server)
**Objectif** : Valider le pooling de connexion et la gestion d'erreurs

**Tests unitaires** :
- ✅ Erreur si `MONGODB_URI` n'est pas définie

**Tests d'intégration** :
- ✅ Établissement de connexion au premier appel
- ✅ Réutilisation de la connexion en cache aux appels suivants
- ✅ Gestion gracieuse des échecs de connexion
- ✅ Utilisation des bonnes options de connexion (`bufferCommands: false`)
- ✅ Initialisation du cache global si absent
- ✅ Pas de nouvelle connexion si promesse en cours

**Pattern** : Mock de `process.env.MONGODB_URI`, `vi.resetModules()` pour forcer re-import

---

### 3.3 `app/api/tickets/route.test.ts`

**Stratégie** : Tests unitaires (mocks Mongoose) + Tests d'intégration (vraie DB in-memory)
**Objectif** : Valider l'endpoint GET /api/tickets

**Tests unitaires** :
- ✅ Retourne tableau vide si aucun ticket
- ✅ Retourne tickets formatés correctement
- ✅ Retourne erreur 500 si requête DB échoue
- ✅ Trie par `createdAt` descendant

**Tests d'intégration** :
- ✅ Retourne tickets depuis vraie base de données
- ✅ Convertit `_id` MongoDB en `id` string
- ✅ Convertit dates en objets Date dans la réponse

**Pattern** : `vi.spyOn(TicketModel, 'find')` pour mocks, vraie DB pour intégration

---

### 3.4 `app/page.test.tsx`

**Stratégie** : Tests de la fonction `getTickets` + Tests de rendu (limités pour Server Component)
**Objectif** : Valider la récupération de données et le rendu de page

**Tests de getTickets** :
- ✅ Récupère et formate les tickets correctement
- ✅ Retourne tableau vide en cas d'erreur DB
- ✅ Logs serveur corrects (`[SERVER]` messages)

**Tests de rendu** :
- ✅ Affiche le titre "CoTiTra"
- ✅ Affiche "Copro Tickets Tracker"
- ✅ Structure de page correcte

**Modification requise** : Exporter la fonction `getTickets` de `app/page.tsx`

```typescript
// Avant
async function getTickets(): Promise<Ticket[]> {

// Après
export async function getTickets(): Promise<Ticket[]> {
```

---

### 3.5 `tests/helpers/db-setup.ts`

**Objectif** : Utilitaires partagés pour réduire la duplication de code

**Fonctions** :
- `setupTestDB()` : Démarre MongoDB in-memory et connecte Mongoose
- `teardownTestDB()` : Déconnecte et arrête le serveur
- `clearDatabase()` : Nettoie toutes les collections

**Usage** :
```typescript
import { setupTestDB, teardownTestDB, clearDatabase } from '@/tests/helpers/db-setup'

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await setupTestDB()
})

afterAll(async () => {
  await teardownTestDB(mongoServer)
})

beforeEach(async () => {
  await clearDatabase()
})
```

---

## 4. Séquence d'implémentation

### Phase 1 : Configuration (15 min)
1. Installer les dépendances
2. Créer `tests/helpers/db-setup.ts`
3. Exporter `getTickets` de `app/page.tsx`

### Phase 2 : Tests du modèle (30 min)
4. Créer `lib/models/Ticket.test.ts`
5. Exécuter : `npm test Ticket.test.ts`

### Phase 3 : Tests de connexion (30 min)
6. Créer `lib/mongodb.test.ts`
7. Exécuter : `npm test mongodb.test.ts`

### Phase 4 : Tests API (45 min)
8. Créer `app/api/tickets/route.test.ts`
9. Exécuter : `npm test route.test.ts`

### Phase 5 : Tests de page (30 min)
10. Créer `app/page.test.tsx`
11. Exécuter : `npm test page.test.tsx`

### Phase 6 : Vérification (15 min)
12. Exécuter tous les tests : `npm test`
13. Vérifier la couverture : `npm test -- --coverage`
14. Valider que CI passe

**Durée totale estimée** : 2h30

---

## 5. Patterns de test utilisés

### Pattern AAA (Arrange-Act-Assert)
Tous les tests suivent cette structure claire et explicite.

### Isolation des tests
- Chaque test est indépendant
- `beforeEach` réinitialise l'état de la DB
- Mocks réinitialisés entre tests

### Noms de tests descriptifs
- Utilisation de `should` dans les noms
- Groupement logique avec `describe`

### Approche hybride
- Tests unitaires : Rapides, dépendances mockées
- Tests d'intégration : Lents, comportement réel vérifié

### Couverture des erreurs
- Test des chemins de succès ET d'échec
- Vérification des messages d'erreur
- Validation des logs console

---

## 6. Objectifs de couverture

| Fichier | Couverture cible | Justification |
|---------|------------------|---------------|
| `lib/models/Ticket.ts` | 100% | Toutes les validations de schéma |
| `lib/mongodb.ts` | 90%+ | Logique de pooling de connexion |
| `app/api/tickets/route.ts` | 95%+ | Tous endpoints et erreurs |
| `app/page.tsx` | 80%+ | Fonction getTickets + rendu de base |

---

## 7. Commandes de test

```bash
# Tous les tests
npm test

# Fichier spécifique
npm test Ticket.test.ts

# Avec couverture
npm test -- --coverage

# Mode watch
npm test -- --watch

# Interface UI
npm run test:ui
```

---

## 8. Fichiers critiques à modifier/créer

### À créer (5 nouveaux fichiers)
1. `lib/models/Ticket.test.ts` - Tests du schéma Mongoose
2. `lib/mongodb.test.ts` - Tests de connexion DB
3. `app/api/tickets/route.test.ts` - Tests de l'API endpoint
4. `app/page.test.tsx` - Tests du Server Component
5. `tests/helpers/db-setup.ts` - Utilitaires partagés

### À modifier (1 fichier)
6. `app/page.tsx` - Exporter la fonction `getTickets`

---

## 9. Points d'attention

⚠️ **Server Components** : Difficiles à tester directement ; on teste la logique de récupération et le rendu statique
⚠️ **MongoDB in-memory** : Plus lent que les mocks purs, mais comportement réaliste
⚠️ **Mocks de modules** : Utiliser `vi.resetModules()` pour forcer re-import après changement d'env
⚠️ **Dates** : JSON.stringify() convertit les dates en strings, vérifier avec `typeof` dans les tests
⚠️ **Cache global** : Nettoyer `global.mongoose` entre les tests pour éviter interférences

---

## 10. Bénéfices attendus

✅ **Fiabilité** : Détection précoce des régressions
✅ **Confiance** : Modifications futures plus sûres
✅ **Documentation** : Les tests documentent le comportement attendu
✅ **CI/CD** : Validation automatique avant déploiement
✅ **Qualité** : Code mieux structuré et maintenable
