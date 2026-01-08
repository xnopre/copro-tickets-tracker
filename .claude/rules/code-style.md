# Code Style & Minimalism

## YAGNI Principle (You Aren't Gonna Need It)

**Every line of code must have a reason to exist NOW, not "just in case" or "for later".**

### Rules

- Write only what's needed for the current task
- No anticipatory code
- No premature abstractions
- Delete dead code completely

### Configuration Example

✅ **GOOD — Minimal**:

```typescript
const config: NextConfig = {};
```

❌ **BAD — Over-engineered**:

```typescript
const config: NextConfig = {
  /* config options here */
  // future: true,  // Commented "for later"
  // TODO: add feature
};
```

## Refactoring & Cleanup

- Only refactor when explicitly requested
- Don't add docstrings/comments to unchanged code
- Remove unused imports before finalizing
- Delete unused exports and re-exports
- No `_removed` comments or backwards-compat shims

## Over-engineering Prevention

❌ Don't do:

- Add extra error handling for impossible scenarios
- Create helper functions for one-time operations
- Design abstractions for hypothetical requirements
- Add feature flags when you can just change the code
- Add configurability beyond current needs
- Add validation for internal code boundaries

✅ Do:

- Trust framework guarantees
- Validate only at system boundaries (user input, external APIs)
- Keep it simple: three similar lines are fine (premature abstraction is waste)
- One responsibility per function

## TypeScript

- Strict mode ALWAYS (no `any`)
- Use proper typing at boundaries
- Trust internal type system

## React

- Functional components only
- Use hooks for side effects
- Keep components focused on one responsibility
