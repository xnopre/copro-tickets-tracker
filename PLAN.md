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

### Configuration et Déploiement Initial

- ✅ [📦 Étape 0 : Application Minimale Déployable](docs/plan/0.md#étape-0--application-minimale-déployable)
- ✅ [🚫 Étape 0b : Bloquer le Référencement par les Moteurs de Recherche](docs/plan/0.md#étape-0b--bloquer-le-référencement-par-les-moteurs-de-recherche)
- ✅ [🧪 Étape 0c : Tests E2E et Vérification des Headers HTTP](docs/plan/0.md#étape-0c--tests-e2e-et-vérification-des-headers-http)

### Interface Utilisateur et Tickets de Base

- ✅ [🎨 Étape 1 : Liste Statique de Tickets](docs/plan/1.md#étape-1--liste-statique-de-tickets)
- ✅ [🗄️ Étape 3 : Tickets depuis MongoDB](docs/plan/3.md#étape-3--tickets-depuis-mongodb)
- ✅ [➕ Étape 4 : Créer un Nouveau Ticket](docs/plan/4.md#étape-4--créer-un-nouveau-ticket)
- ✅ [📄 Étape 5 : Voir le Détail d'un Ticket](docs/plan/5.md#étape-5--voir-le-détail-dun-ticket)

### Tickets et Statuts

- ✅ [🔄 Étape 6 : Changer le Statut et Assigner un Ticket](docs/plan/6.md#étape-6--changer-le-statut-et-assigner-un-ticket)
- ✅ [💬 Étape 7 : Ajouter des Commentaires](docs/plan/7.md#étape-7--ajouter-des-commentaires)
- ✅ [✏️ Étape 8 : Modifier un Ticket](docs/plan/8.md#étape-8--modifier-un-ticket)
- ✅ [📦 Étape 9 : Archiver un Ticket](docs/plan/9.md#étape-9--archiver-un-ticket)

### Utilisateurs et Gestion

- ✅ [👥 Étape 10 : Liste des Utilisateurs](docs/plan/10.md#étape-10--liste-des-utilisateurs)

### Email et Notifications

- ✅ [📧 Étape 11 : Notifier les Utilisateurs par Mail](docs/plan/11.md#étape-11--notifier-les-utilisateurs-par-mail)
- ✅ [📧 Étape 11b : Service d'Envoi d'Emails Gmail](docs/plan/11.md#étape-11b--service-denvoi-demails-gmail)

### Infrastructure et Architecture

- ✅ [🤖 Étape 2 : CI/CD avec GitHub Actions](docs/plan/2.md#étape-2--cicd-avec-github-actions)
- ✅ [🤖 Étape 2b : Workflows GitHub avec Claude](docs/plan/2.md#étape-2b--workflows-github-avec-claude)
- ✅ [🔄 Étape 2c : Renovate pour la Gestion Automatique des Dépendances](docs/plan/2.md#étape-2c--renovate-pour-la-gestion-automatique-des-dépendances)
- ✅ [🏗️ Architecture Hexagonale](docs/plan/architecture.md#architecture-hexagonale)

### Authentification et Utilisateurs Connectés

- ✅ [Étape 12a : Ajout des Mots de Passe](docs/plan/12.md#étape-12a--ajout-des-mots-de-passe)
- ✅ [Étape 12b : Ajout Authentification](docs/plan/12.md#étape-12b--ajout-authentification)
- ✅ [Étape 12c : Afficher l'Utilisateur Connecté](docs/plan/12.md#étape-12c--afficher-lutilisateur-connecté)
- ✅ [Étape 12d : Utiliser l'Utilisateur Connecté pour les Commentaires](docs/plan/12.md#étape-12d--utiliser-lutilisateur-connecté-pour-les-commentaires)
- ✅ [Étape 12e : Ajouter l'Utilisateur Courant comme Créateur d'un Ticket](docs/plan/12.md#étape-12e--ajouter-lutilisateur-courant-comme-créateur-dun-ticket)

### Filtrage et Recherche

- ⭕ [🎯 Étape 13 : Filtrer par Statut](docs/plan/13-16.md#étape-13--filtrer-par-statut)
- ⭕ [🔍 Étape 14 : Recherche de Tickets](docs/plan/13-16.md#étape-14--recherche-de-tickets)
- ⭕ [📊 Étape 15 : Dashboard avec Statistiques](docs/plan/13-16.md#étape-15--dashboard-avec-statistiques)
- ⭕ [🎨 Étape 16 : Polish UX/UI](docs/plan/13-16.md#étape-16--polish-uxui)

### 🚀 Étapes Futures (Optionnelles)

- 🚀 [Étapes Futures](docs/plan/future.md#étapes-futures-optionnelles)

---

## Documentation Complémentaire

- 📝 [Notes Importantes](docs/plan/notes.md)

---

## Légende des Statuts

- ✅ **Réalisée** : Étape implémentée, testée et déployée
- 🔄 **En cours** : Étape actuellement en développement
- ⭕ **Non réalisée** : Étape à mettre en œuvre
- 🚀 **Future** : Évolution optionnelle après le MVP
