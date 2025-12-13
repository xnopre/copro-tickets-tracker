import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage should load successfully', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('should display the application title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('CoTiTra');
  });

  test('should display ticket list', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h2:has-text("Tickets")')).toBeVisible();
  });

  test('create ticket page should be accessible', async ({ page }) => {
    const response = await page.goto('/tickets/new');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1:has-text("Créer un nouveau ticket")')).toBeVisible();
  });
});
