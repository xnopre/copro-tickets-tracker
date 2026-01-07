# Testing Rules

## Absolute Principle

**NO code without tests.** Period.

## Which Files Need Tests

✅ **MUST have tests**: React components, Use Cases, Services, Repositories, MongoDB schemas, API routes, Pages, Utils/Helpers

❌ **NO tests needed**: Pure interfaces, Simple types, Config files

## File Naming Convention

- `MyComponent.tsx` → `MyComponent.test.tsx` (same directory)
- `MyService.ts` → `MyService.test.ts` (same directory)

## Test Structure (AAA Pattern)

```typescript
describe('MyComponent', () => {
  it('should do something', () => {
    // Arrange: prepare data
    const data = { ... };

    // Act: execute action
    const result = doSomething(data);

    // Assert: verify result
    expect(result).toBe(expectedValue);
  });
});
```

## Assertion Best Practices

✅ **GOOD — Use hard-coded values**:

```typescript
expect(result.title).toBe('Mon titre');
expect(result.createdAt).toEqual(new Date('2025-01-15T10:00:00.000Z'));
```

❌ **BAD — No regex or dynamic calculations**:

```typescript
expect(result.title).toMatch(/titre/);
expect(result.createdAt).toBe(new Date());
```

## Tools

- **Vitest** — Unit tests
- **React Testing Library** — Component tests
- **Mock external dependencies** — Database, API calls
- **Don't test** — console.log calls

## Missing Tests Detection

```bash
find src app -type f \( -name "*.ts" -o -name "*.tsx" \) \
  ! -name "*.test.ts" ! -name "*.test.tsx" ! -name "*.d.ts" \
  ! -path "*/types/*" ! -path "*/entities/*" ! -path "*/value-objects/*"
```

For each file listed, verify it's an exception (interface, type, config). Otherwise: **CREATE TEST IMMEDIATELY**
