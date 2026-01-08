# E2E Writer - Examples

## Pattern de test complet

```typescript
import { test, expect } from '@playwright/test';

test.describe('Create Ticket Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should create a new ticket successfully', async ({ page }) => {
    // Navigate
    await page.getByRole('link', { name: 'Créer un ticket' }).click();

    // Verify page
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Créer un nouveau ticket');

    // Fill form using semantic selectors
    await page.getByLabel('Titre').fill("Réparer l'ascenseur");
    await page.getByLabel('Description').fill("L'ascenseur ne monte plus");
    await page.getByLabel('Statut').selectOption('NEW');

    // Submit
    await page.getByRole('button', { name: 'Créer' }).click();

    // Verify success
    await expect(page.getByText(/ticket créé avec succès/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: "Réparer l'ascenseur" })).toBeVisible();
  });

  test('should show error when required fields are missing', async ({ page }) => {
    // Navigate
    await page.getByRole('link', { name: 'Créer un ticket' }).click();

    // Submit without filling
    await page.getByRole('button', { name: 'Créer' }).click();

    // Verify error
    await expect(page.getByText(/titre est requis/i)).toBeVisible();
  });
});
```

## Bonnes pratiques

### Attendre les éléments dynamiques

```typescript
// ✅ BON - Attendre explicitement
await page.getByText('Chargement...').toBeVisible();
await page.getByText('Chargement...').toBeHidden();

// Puis continuer
await expect(page.getByRole('heading')).toContainText('Tickets');
```

### Éviter les timeouts arbitraires

```typescript
// ❌ MAUVAIS
await page.waitForTimeout(2000);

// ✅ BON - Attendre un élément spécifique
await page.getByRole('button', { name: 'Créer' }).waitFor();
```

### Nettoyer après les tests

```typescript
test.afterEach(async ({ page }) => {
  // Nettoyer les données de test si nécessaire
  await page.evaluate(() => localStorage.clear());
});
```

## Convention de nommage

```
tests/e2e/[nom-du-scenario].spec.ts

Exemples :
- tests/e2e/create-ticket.spec.ts
- tests/e2e/edit-ticket.spec.ts
- tests/e2e/add-comment.spec.ts
```

## Exécuter les tests E2E

```bash
npm run test:e2e        # Mode headless (CI)
npm run test:e2e:ui     # Interface graphique
npm run test:e2e:debug  # Mode pas à pas
```
