# Development Rules & Validation

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
