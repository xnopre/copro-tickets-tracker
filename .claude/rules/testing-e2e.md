# E2E Testing Rules (Playwright)

## Selector Priority (Most Robust → Fragile)

1. **`page.getByRole()`** ⭐ PREFERRED
   - Uses ARIA roles and accessibility
   - Resilient to DOM structure changes
   - `page.getByRole('heading', { level: 1 })`

2. **`page.getByLabel()`** — Form elements
   - `page.getByLabel('Titre')`

3. **`page.getByText()`** — Text content
   - Avoid if possible (fragile with i18n)

4. **`page.getByTestId()`** — Last resort
   - Only if no semantic alternative
   - Add `data-testid` to component

5. **`page.locator()`** — AVOID
   - Exception: non-interactive meta elements

## Good Examples ✅

```typescript
await page.getByRole('heading', { level: 1 }).toContainText('CoTiTra');
await page.getByRole('button', { name: 'Créer un ticket' }).click();
await page.getByLabel('Titre').fill('Mon ticket');
```

## Bad Examples ❌

```typescript
await page.locator('h1').toContainText('CoTiTra'); // Generic tag
await page.locator('.btn-primary').click(); // CSS class
await page.locator('#title-input').fill('Mon ticket'); // ID selector
```

## Internationalization Strategy

**Use constants file** (when i18n implemented):

```typescript
// tests/e2e/constants.ts
export const TEXTS = {
  fr: {
    HOMEPAGE_TITLE: 'CoTiTra',
    TICKETS_HEADING: 'Tickets',
  },
  en: {
    HOMEPAGE_TITLE: 'CoTiTra',
    TICKETS_HEADING: 'Tickets',
  },
};
```

Then in tests:

```typescript
const locale = 'fr';
await page.getByRole('heading', { name: TEXTS[locale].TICKETS_HEADING }).toBeVisible();
```
