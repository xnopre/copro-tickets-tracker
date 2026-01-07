# Architecture Hexagonale

**Objectif** : Refactoriser le code pour respecter une architecture hexagonale (ports & adapters)

## Structure finale

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

## Principes respectés

1. **Domain** ne dépend de rien (code métier pur, pas de Mongoose, pas de MongoDB)
2. **Application** dépend uniquement du Domain
3. **Infrastructure** implémente les interfaces du Domain
4. **Presentation** utilise Application et Infrastructure
5. Les dépendances pointent vers l'intérieur (Domain au centre)

## Tâches

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

## Validation

- ✅ Architecture hexagonale complète
- ✅ Domain ne dépend de rien (aucun import de Mongoose)
- ✅ Tous les tests passent (21 tests)
- ✅ Build TypeScript réussi
- ✅ Code inutilisé supprimé (YAGNI)
