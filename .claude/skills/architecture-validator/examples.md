# Architecture Validator - Examples

## Verification Commands

### Detect Domain → Infrastructure violations

```bash
grep -rn "from '@/infrastructure" src/domain/
grep -rn "from '@/application" src/domain/
grep -rn "from '@/presentation" src/domain/
grep -rn "from 'mongoose'" src/domain/
grep -rn "from 'next/" src/domain/
grep -rn "from 'react'" src/domain/
```

If **NO lines** → ✅ Domain is pure
If **LINES found** → ❌ CRITICAL VIOLATION

### Detect Application → Infrastructure violations

```bash
grep -rn "from '@/infrastructure" src/application/
grep -rn "from '@/presentation" src/application/
```

### Detect direct instantiation (no injection)

```bash
grep -rn "new Mongo" src/domain/use-cases/
grep -rn "new Mongo" src/application/
```

If **LINES found** → ❌ Dependency injection violation

## Structured Validation Report

```markdown
# Hexagonal Architecture Validation Report

## ✅ Rules Respected

- ✅ Domain depends on nothing
- ✅ Application depends only on Domain
- ✅ Infrastructure implements Domain interfaces
- ✅ Dependency injection respected

## ❌ Violations Detected

### Critical (P0)

#### Violation 1 : Domain imports Infrastructure

- **File** : src/domain/use-cases/CreateTicket.ts:15
- **Forbidden import** : `import ... from '@/infrastructure/database'`
- **Impact** : Domain is no longer independent
- **Solution** :
  1. Create an interface in `src/domain/repositories/`
  2. Implement in `src/infrastructure/repositories/`
  3. Inject via constructor

## 📊 Statistics

- Domain files analyzed : X
- Critical violations : X
- Important violations : X

## ✅ Verdict

[ARCHITECTURE VALID / VIOLATIONS TO FIX]
```

## TypeScript Strict - Checklist

```typescript
// ❌ AVOID
const getValue = (obj: any) => obj.value; // any
const id = value!; // non-null assertion

// ✅ PREFER
const getValue = (obj: { value: string }) => obj.value; // Typing
const id = value ?? defaultValue; // Optional or guard
```

Check in `tsconfig.json` : `"strict": true`
