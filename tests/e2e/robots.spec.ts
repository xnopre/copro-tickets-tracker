import { test, expect } from '@playwright/test';

test.describe('robots.txt', () => {
  test('should serve robots.txt', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test('should have text/plain content-type', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.headers()['content-type']).toContain('text/plain');
  });

  test('robots.txt should disallow all', async ({ request }) => {
    const response = await request.get('/robots.txt');
    const text = await response.text();
    expect(text).toMatch(/User-[Aa]gent: \*/);
    expect(text).toContain('Disallow: /');
  });
});
