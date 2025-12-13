import { test, expect } from '@playwright/test';

test.describe('HTTP Headers and Meta Tags', () => {
  test('should have X-Robots-Tag header on all routes', async ({ page }) => {
    const routes = ['/', '/tickets/new'];

    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      expect(response?.headers()['x-robots-tag']).toBe('noindex, nofollow');
    }
  });

  test('should have X-Robots-Tag header on API routes', async ({ request }) => {
    const response = await request.get('/api/tickets');
    expect(response.headers()['x-robots-tag']).toBe('noindex, nofollow');
  });

  test('should have meta robots tag in HTML', async ({ page }) => {
    await page.goto('/');
    const metaRobots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(metaRobots).toContain('noindex');
    expect(metaRobots).toContain('nofollow');
  });
});
