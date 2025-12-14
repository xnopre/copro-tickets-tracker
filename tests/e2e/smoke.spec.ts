import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage should load successfully', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('should display the application title', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('CoTiTra');
  });

  test('should display ticket list', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Tickets' })).toBeVisible();
  });

  test('create ticket page should be accessible', async ({ page }) => {
    const response = await page.goto('/tickets/new');
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Créer un nouveau ticket' })
    ).toBeVisible();
  });
});
