# Plan d'Action - Copro Tickets Tracker

Ce plan détaille les étapes de développement de l'application par petits pas incrémentaux.

## Phase 1 : Configuration Initiale

### Étape 1.1 : Initialiser Next.js avec TypeScript
- [ ] Créer le projet Next.js avec TypeScript
- [ ] Configurer `tsconfig.json` en mode strict
- [ ] Configurer ESLint et Prettier
- [ ] Vérifier que l'application démarre correctement

**Test** : `npm run dev` fonctionne et affiche la page d'accueil Next.js

### Étape 1.2 : Configurer Vitest
- [ ] Installer Vitest et React Testing Library
- [ ] Créer `vitest.config.ts`
- [ ] Créer un test simple pour valider la configuration
- [ ] Ajouter les scripts de test dans `package.json`

**Test** : `npm test` exécute les tests avec succès

### Étape 1.3 : Configurer la structure hexagonale
- [ ] Créer l'arborescence des dossiers (domain, application, infrastructure, presentation)
- [ ] Créer des fichiers README.md dans chaque dossier pour expliquer leur rôle
- [ ] Configurer les path aliases dans `tsconfig.json` (@domain, @application, etc.)

**Test** : Les imports avec alias fonctionnent correctement

## Phase 2 : Domain Layer (Cœur Métier)

### Étape 2.1 : Créer l'entité Ticket
- [ ] Créer `src/domain/entities/Ticket.ts`
- [ ] Définir l'interface Ticket avec : id, titre, description, statut, dates
- [ ] Créer l'enum TicketStatus (NEW, IN_PROGRESS, RESOLVED, CLOSED)
- [ ] Écrire les tests unitaires pour l'entité

**Test** : Tests unitaires de l'entité Ticket passent

### Étape 2.2 : Créer l'entité Comment
- [ ] Créer `src/domain/entities/Comment.ts`
- [ ] Définir l'interface Comment avec : id, ticketId, contenu, auteur, date
- [ ] Écrire les tests unitaires

**Test** : Tests unitaires de l'entité Comment passent

### Étape 2.3 : Créer les interfaces de repositories (ports)
- [ ] Créer `src/domain/repositories/TicketRepository.ts` (interface)
- [ ] Définir les méthodes : findAll, findById, create, update, delete
- [ ] Créer `src/domain/repositories/CommentRepository.ts` (interface)
- [ ] Définir les méthodes : findByTicketId, create, delete

**Test** : Les interfaces TypeScript compilent sans erreur

### Étape 2.4 : Créer les use cases pour les Tickets
- [ ] Créer `src/domain/use-cases/CreateTicket.ts`
- [ ] Créer `src/domain/use-cases/UpdateTicket.ts`
- [ ] Créer `src/domain/use-cases/GetAllTickets.ts`
- [ ] Créer `src/domain/use-cases/GetTicketById.ts`
- [ ] Créer `src/domain/use-cases/DeleteTicket.ts`
- [ ] Écrire les tests unitaires avec des mocks de repositories

**Test** : Tests unitaires des use cases passent (avec repositories mockés)

### Étape 2.5 : Créer les use cases pour les Comments
- [ ] Créer `src/domain/use-cases/AddComment.ts`
- [ ] Créer `src/domain/use-cases/GetTicketComments.ts`
- [ ] Écrire les tests unitaires avec des mocks

**Test** : Tests unitaires des use cases passent

## Phase 3 : Infrastructure Layer (MongoDB)

### Étape 3.1 : Configurer MongoDB
- [ ] Installer mongoose
- [ ] Créer `src/infrastructure/database/connection.ts`
- [ ] Configurer la connexion MongoDB avec gestion d'erreurs
- [ ] Créer un fichier `.env.local` avec MONGODB_URI
- [ ] Ajouter `.env*.local` dans `.gitignore`

**Test** : La connexion MongoDB s'établit correctement en local

### Étape 3.2 : Créer les schémas Mongoose
- [ ] Créer `src/infrastructure/database/schemas/TicketSchema.ts`
- [ ] Créer `src/infrastructure/database/schemas/CommentSchema.ts`
- [ ] Ajouter les index nécessaires

**Test** : Les schémas Mongoose sont valides

### Étape 3.3 : Implémenter TicketRepository
- [ ] Créer `src/infrastructure/repositories/MongoTicketRepository.ts`
- [ ] Implémenter l'interface TicketRepository
- [ ] Mapper les documents Mongoose vers les entités Domain
- [ ] Écrire les tests d'intégration (avec MongoDB en mémoire ou test DB)

**Test** : Tests d'intégration du repository passent

### Étape 3.4 : Implémenter CommentRepository
- [ ] Créer `src/infrastructure/repositories/MongoCommentRepository.ts`
- [ ] Implémenter l'interface CommentRepository
- [ ] Écrire les tests d'intégration

**Test** : Tests d'intégration du repository passent

## Phase 4 : API Layer (Next.js API Routes)

### Étape 4.1 : Créer les API Routes pour les Tickets
- [ ] Créer `src/app/api/tickets/route.ts` (GET all, POST)
- [ ] Créer `src/app/api/tickets/[id]/route.ts` (GET, PUT, DELETE)
- [ ] Injecter les use cases et repositories
- [ ] Gérer les erreurs et retourner les bons codes HTTP
- [ ] Écrire les tests des API routes

**Test** : Tester les endpoints avec curl ou Postman

### Étape 4.2 : Créer les API Routes pour les Comments
- [ ] Créer `src/app/api/tickets/[id]/comments/route.ts` (GET, POST)
- [ ] Injecter les use cases
- [ ] Écrire les tests

**Test** : Tester les endpoints des commentaires

## Phase 5 : Presentation Layer (UI)

### Étape 5.1 : Créer la page d'accueil avec liste des tickets
- [ ] Créer `src/app/page.tsx`
- [ ] Créer le composant `TicketList.tsx`
- [ ] Fetch des tickets depuis l'API
- [ ] Afficher les tickets avec leur statut
- [ ] Écrire les tests des composants

**Test** : La page affiche la liste des tickets (peut être vide au début)

### Étape 5.2 : Créer le formulaire de création de ticket
- [ ] Créer le composant `CreateTicketForm.tsx`
- [ ] Valider les champs (titre et description requis)
- [ ] Gérer la soumission via POST à l'API
- [ ] Rafraîchir la liste après création
- [ ] Écrire les tests

**Test** : On peut créer un nouveau ticket via l'UI

### Étape 5.3 : Créer la page de détail d'un ticket
- [ ] Créer `src/app/tickets/[id]/page.tsx`
- [ ] Afficher tous les détails du ticket
- [ ] Afficher les commentaires
- [ ] Écrire les tests

**Test** : Cliquer sur un ticket affiche sa page de détail

### Étape 5.4 : Ajouter la modification du statut
- [ ] Créer un composant `StatusSelector.tsx`
- [ ] Permettre de changer le statut (dropdown ou boutons)
- [ ] Mettre à jour via PUT à l'API
- [ ] Écrire les tests

**Test** : On peut changer le statut d'un ticket

### Étape 5.5 : Ajouter la fonctionnalité de commentaires
- [ ] Créer le composant `CommentList.tsx`
- [ ] Créer le composant `AddCommentForm.tsx`
- [ ] Gérer l'ajout de commentaires
- [ ] Écrire les tests

**Test** : On peut ajouter et voir les commentaires sur un ticket

### Étape 5.6 : Ajouter la suppression de tickets
- [ ] Ajouter un bouton de suppression dans la page de détail
- [ ] Confirmer avant suppression (modal ou confirm)
- [ ] Rediriger vers la liste après suppression
- [ ] Écrire les tests

**Test** : On peut supprimer un ticket

### Étape 5.7 : Améliorer l'UI
- [ ] Ajouter du style (Tailwind CSS ou CSS modules)
- [ ] Ajouter des indicateurs de chargement
- [ ] Ajouter des messages d'erreur utilisateur
- [ ] Rendre l'UI responsive

**Test** : L'application est utilisable et agréable visuellement

## Phase 6 : Déploiement

### Étape 6.1 : Préparer le déploiement
- [ ] Créer un compte MongoDB Atlas et une database
- [ ] Créer un compte Render.com
- [ ] Vérifier que `npm run build` fonctionne en local

**Test** : Build réussit sans erreurs

### Étape 6.2 : Déployer sur Render.com
- [ ] Créer un nouveau Web Service sur Render
- [ ] Connecter le repository GitHub
- [ ] Configurer les variables d'environnement (MONGODB_URI)
- [ ] Lancer le déploiement

**Test** : L'application est accessible en ligne et fonctionne

### Étape 6.3 : Tests en production
- [ ] Tester toutes les fonctionnalités en production
- [ ] Vérifier les logs pour les erreurs
- [ ] Tester sur mobile et desktop

**Test** : Toutes les fonctionnalités marchent en production

## Phase 7 : Améliorations Futures (Optionnel)

- [ ] Ajouter l'authentification (NextAuth)
- [ ] Ajouter des catégories pour les tickets (plomberie, électricité, etc.)
- [ ] Ajouter des priorités (basse, moyenne, haute, urgente)
- [ ] Ajouter la recherche et le filtrage
- [ ] Ajouter la pagination pour les grandes listes
- [ ] Ajouter l'upload de photos pour les tickets
- [ ] Ajouter des notifications email

---

## Notes

- Chaque étape doit être testée avant de passer à la suivante
- Commit après chaque étape réussie
- Ne pas hésiter à décomposer une étape en sous-étapes si nécessaire
- Les tests sont essentiels à chaque étape
