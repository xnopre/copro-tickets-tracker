# Hexagonal Architecture (Ports & Adapters)

## Structure

```
src/
├── domain/              # Pure business logic (no external deps)
│   ├── entities/        # Business entities (Ticket, Comment)
│   ├── repositories/    # Repository interfaces (ports)
│   └── use-cases/       # Business use cases
├── application/         # Orchestration layer
│   └── services/        # Application services
├── infrastructure/      # Adapters (technical implementations)
│   ├── database/        # MongoDB implementation
│   ├── api/             # Next.js API routes
│   └── repositories/    # Repository implementations
└── presentation/        # UI layer
    ├── components/      # React components
    ├── pages/           # Next.js App Router pages
    └── hooks/           # React hooks
```

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
