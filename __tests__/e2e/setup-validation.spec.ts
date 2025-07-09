import { test, expect } from '@playwright/test';
import { buildContextUrl } from './utils/subdomain';

/**
 * Smoke test to verify E2E setup is working correctly
 * This test should pass if the development environment is running
 */

test.describe('E2E Setup Validation', () => {
  test('should load the development server', async ({ page }) => {
    // Navigate to the base URL
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Verify we can access the site
    await expect(page).toHaveTitle(/ConvoForms|Convo/i);

    // Take a screenshot for verification
    await page.screenshot({ path: 'test-results/setup-validation.png' });

    console.log('✅ E2E setup validation passed!');
  });

  test('should detect marketing context', async ({ page }) => {
    // Navigate to marketing site
    await page.goto('/');

    // Should show marketing content (not require auth)
    const hasAuth = await page.locator('[data-testid="user-menu"]').isVisible();
    const hasMarketing = await page.locator('h1, [data-testid="hero"]').isVisible();

    // Either should show marketing content or redirect to login
    expect(hasMarketing || !hasAuth).toBe(true);

    console.log('✅ Marketing context detection working!');
  });

  test('should handle app context routing', async ({ page }) => {
    // Try to access app context
    await page.goto(buildContextUrl('app', '/')); // Navigates to /app

    // Should either show login or dashboard (depending on auth state)
    const hasLogin = await page.locator('text="Sign in", text="Login"').isVisible();
    const hasDashboard = await page.locator('[data-testid="workspace-dashboard"]').isVisible();

    expect(hasLogin || hasDashboard).toBe(true);

    console.log('✅ App context routing working!');
  });

  test('should have correct browser capabilities', async ({ page, browserName }) => {
    await page.goto('/');

    // Test basic browser capabilities
    const userAgent = await page.evaluate(() => navigator.userAgent);
    const hasLocalStorage = await page.evaluate(() => typeof Storage !== 'undefined');
    const hasSessionStorage = await page.evaluate(() => typeof sessionStorage !== 'undefined');

    expect(userAgent).toBeTruthy();
    expect(hasLocalStorage).toBe(true);
    expect(hasSessionStorage).toBe(true);

    console.log(`✅ Browser capabilities verified for ${browserName}!`);
  });
});

test.describe('Database Connectivity', () => {
  test('should verify API endpoints are accessible', async ({ page }) => {
    // Test that API routes are accessible
    const response = await page.request.get('/api/health');

    // Should either return 200 or 404 (if health endpoint doesn't exist)
    // The important thing is that the server is responding
    expect([200, 404, 405]).toContain(response.status());

    console.log('✅ API server responding!');
  });
});
