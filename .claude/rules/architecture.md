# Hexagonal Architecture (Ports & Adapters)

## Structure

```
src/
├── domain/              # Pure business logic (no external deps)
│   ├── entities/        # Business entities (Ticket, Comment, User)
│   ├── errors/          # Domain errors (ValidationError, InvalidIdError)
│   ├── repositories/    # Repository interfaces (ports)
│   ├── services/        # Service interfaces (IAuthService, IEmailService, ILogger)
│   ├── use-cases/       # Business use cases
│   └── value-objects/   # Value objects (TicketStatus)
├── application/         # Orchestration layer
│   └── services/        # Application services (TicketService, CommentService, UserService)
├── infrastructure/      # Adapters (technical implementations)
│   ├── crypto/          # Cryptography utilities (passwordUtils)
│   ├── database/        # MongoDB connection and schemas
│   │   └── schemas/     # Mongoose schemas (TicketSchema, CommentSchema, UserSchema)
│   ├── repositories/    # Repository implementations (MongoTicketRepository, etc.)
│   └── services/        # Service implementations (AuthService, EmailService, etc.)
│       └── __mocks__/   # Mock implementations for testing
├── presentation/        # UI layer
│   ├── components/      # React components
│   │   └── ui/          # Design system (Button, Input, Card, etc.)
│   ├── constants/       # UI constants (ticketDisplay)
│   └── utils/           # UI utilities (statusBadgeVariant, ticketFormatters)
└── types/               # TypeScript type definitions (next-auth.d.ts)
```

**Note**: Next.js API routes are in `app/api/`, not in `src/infrastructure/`

## Core Principles

1. **Domain** — Pure business logic, depends on nothing
2. **Application** — Depends only on Domain
3. **Infrastructure** — Implements Domain interfaces
4. **Presentation** — Uses Application + Infrastructure
5. **Dependency Rule** — Dependencies point inward (Domain at center)

## Key Rules

- Domain must NEVER import Infrastructure code
- Use TypeScript strict mode (no `any`)
- Prefer functional components + React hooks
