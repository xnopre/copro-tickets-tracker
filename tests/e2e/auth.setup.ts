import { test as setup } from '@playwright/test';

const authFile = 'tests/e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Go to login page
  console.log('Navigating to /login');
  await page.goto('/login');

  // Wait for any input element to be visible
  console.log('Waiting for inputs to be visible');
  await page.waitForSelector('input[type="email"]', { timeout: 5000 });
  await page.waitForSelector('input[type="password"]', { timeout: 5000 });

  // Fill in credentials using element IDs
  console.log('Filling email');
  await page.locator('#email').fill('test@example.com');

  console.log('Filling password');
  await page.locator('#password').fill('Test123!@#');

  // Click sign in button - find by text or role
  console.log('Looking for submit button');
  const submitButton = page.locator('button[type="submit"]');
  await submitButton.click();

  // Wait for navigation - could go to / or elsewhere
  console.log('Waiting for page load');
  await page.waitForLoadState('networkidle', { timeout: 10000 });

  console.log(`Current URL after login: ${page.url()}`);

  // Save authenticated state to a file
  // This will be reused by all tests
  console.log('Saving storage state');
  await page.context().storageState({ path: authFile });
});
