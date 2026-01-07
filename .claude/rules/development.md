# Development Commands

## Installation & Setup

```bash
npm install
```

## Development Server

```bash
npm run dev
```

## Testing

```bash
# All tests
npm test

# Specific test file
npm test -- <file>

# With coverage
npm test -- --coverage
```

## E2E Testing (Playwright)

```bash
npm run test:e2e        # Headless
npm run test:e2e:ui     # UI mode
npm run test:e2e:debug  # Debug mode
```

## Code Quality

```bash
npm run type-check      # TypeScript validation
npm run lint            # ESLint check
npm run build           # Production build
```

## Step Completion Checklist

Before considering a step complete:

### 1. Unit Tests ✅

- [ ] Every new file has `.test.ts` or `.test.tsx`
- [ ] Modified files have updated tests
- [ ] Tests cover nominal + error cases
- [ ] `npm test` passes

### 2. Build Validation ✅

- [ ] `npm run type-check` — No errors
- [ ] `npm run lint` — No errors
- [ ] `npm run build` — Success

### 3. Test Coverage ✅

- Run the missing tests detection command (see testing.md)
- Create tests for any non-exception files
