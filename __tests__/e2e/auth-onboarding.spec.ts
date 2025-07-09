import { test, expect } from './fixtures'; // Import from custom fixtures
// import { clerkSetup } from '@clerk/testing/playwright'; // No longer needed here
import { createNavigator } from './utils/subdomain';
import { generateTestUser, createTestWorkspace } from './utils/test-data';

// test.use(clerkSetup()); // This is now handled by the extended 'test' in fixtures.ts

/**
 * Authentication and Onboarding E2E Tests
 *
 * Tests the complete user journey from signup to workspace creation
 */

test.describe('Authentication Flow', () => {
  test('should complete signup and onboarding flow', async ({ page }) => {
    const navigator = createNavigator(page);
    const testUser = generateTestUser();
    const testWorkspace = createTestWorkspace();

    // 1. Navigate to marketing site
    await navigator.toMarketing();
    await page.waitForFunction(() => (window as any).Clerk?.isReady());
    await expect(page).toHaveURL(/.*convo\.ai.*|.*localhost:3002.*/);

    // 2. Navigate to signup
    await page.click('[data-testid="signup-cta"], [href*="sign-up"], text="Get Started"');
    await navigator.waitForAuthRedirect();
    await page.waitForFunction(() => (window as any).Clerk?.isReady());

    // 3. Complete signup form
    await page.waitForSelector('[data-clerk-loading="false"]', { timeout: 10000 });
    await page.fill('[name="emailAddress"], [type="email"]', testUser.email);
    await page.fill('[name="password"], [type="password"]', testUser.password);
    await page.click('[type="submit"], button[form] >> text="Sign up"');

    // 4. Handle onboarding flow
    await page.waitForURL('**/onboarding**', { timeout: 30000 });
    await page.waitForSelector('[data-testid="workspace-creation-form"], form');

    // 5. Create workspace
    await page.fill('[name="name"], [placeholder*="workspace"]', testWorkspace.name);
    await page.fill('[name="slug"], [placeholder*="slug"]', testWorkspace.slug);
    await page.click('[type="submit"], button >> text="Create"');

    // 6. Verify redirect to workspace dashboard
    await page.waitForURL(new RegExp(`.*/${testWorkspace.slug}.*`), { timeout: 15000 });
    await expect(page).toHaveURL(new RegExp(`.*/${testWorkspace.slug}.*`));

    // 7. Verify workspace elements are present
    await expect(page.locator('[data-testid="workspace-name"], h1')).toContainText(
      testWorkspace.name
    );
    await expect(
      page.locator('[data-testid="user-menu"], [data-testid="user-avatar"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="create-form-button"], button >> text="Create Form"')
    ).toBeVisible();
  });

  test('should handle login flow for existing user', async ({ page }) => {
    const navigator = createNavigator(page);

    // This test assumes a user exists from previous test or setup
    // In real scenarios, you'd have a known test user

    // 1. Navigate to login
    await navigator.toApp('/login');
    await page.waitForFunction(() => (window as any).Clerk?.isReady());
    await page.waitForSelector('[data-clerk-loading="false"]');

    // 2. Fill login form (using known test credentials)
    await page.fill('[name="identifier"], [type="email"]', 'test@example.com');
    await page.click('[type="submit"], button >> text="Continue"');

    // 3. Enter password
    await page.fill('[name="password"], [type="password"]', 'TestPassword123!');
    await page.click('[type="submit"], button >> text="Continue"');

    // 4. Should redirect to workspace
    await navigator.waitForAuthRedirect();
    await expect(
      page.locator('[data-testid="workspace-dashboard"], [data-testid="user-menu"]')
    ).toBeVisible();
  });

  test('should validate signup form properly', async ({ page }) => {
    const navigator = createNavigator(page);

    // 1. Navigate to signup
    await navigator.toApp('/signup');
    await page.waitForFunction(() => (window as any).Clerk?.isReady());
    await page.waitForSelector('[data-clerk-loading="false"]');

    // 2. Try to submit without required fields
    await page.click('[type="submit"], button >> text="Sign up"');

    // 3. Verify validation errors appear
    await expect(page.locator('text="Email is required", [data-error*="email"]')).toBeVisible();
    await expect(
      page.locator('text="Password is required", [data-error*="password"]')
    ).toBeVisible();

    // 4. Test invalid email format
    await page.fill('[name="emailAddress"], [type="email"]', 'invalid-email');
    await page.click('[type="submit"]');
    await expect(page.locator('text="Invalid email", [data-error*="email"]')).toBeVisible();

    // 5. Test weak password
    await page.fill('[name="emailAddress"]', 'test@example.com');
    await page.fill('[name="password"]', '123');
    await page.click('[type="submit"]');
    await expect(page.locator('text="Password must be", [data-error*="password"]')).toBeVisible();
  });

  test('should prevent duplicate workspace slugs', async ({ page }) => {
    const navigator = createNavigator(page);
    const testWorkspace = createTestWorkspace();

    // Assuming we're logged in (using auth state from setup)
    await navigator.toApp('/onboarding');
    await page.waitForFunction(() => (window as any).Clerk?.isReady());
    await page.waitForSelector('[data-testid="workspace-creation-form"]');

    // Try to create workspace with existing slug
    await page.fill('[name="name"]', testWorkspace.name);
    await page.fill('[name="slug"]', 'existing-slug');
    await page.click('[type="submit"]');

    // Should show error about slug being taken
    await expect(page.locator('text="Slug is already taken", [data-error*="slug"]')).toBeVisible();
  });

  test('should logout user properly', async ({ page }) => {
    const navigator = createNavigator(page);

    // Navigate to authenticated area
    await navigator.toApp();
    await page.waitForFunction(() => (window as any).Clerk?.isReady());
    await page.waitForSelector('[data-testid="user-menu"]');

    // Open user menu and logout
    await page.click('[data-testid="user-menu"], [data-testid="user-avatar"]');
    await page.click('[data-testid="logout-button"], text="Sign out"');

    // Should redirect to marketing site
    await page.waitForURL(/.*(?:convo\.ai|localhost:3002)(?!.*subdomain=app).*/);
    await expect(page.locator('[data-testid="signup-cta"], text="Get Started"')).toBeVisible();

    // Verify cannot access protected routes
    await navigator.toApp();
    await navigator.waitForAuthRedirect();
    await expect(page.locator('[data-testid="login-form"], text="Sign in"')).toBeVisible();
  });
});

test.describe('Onboarding Edge Cases', () => {
  test('should handle network errors during workspace creation', async ({ page }) => {
    const navigator = createNavigator(page);
    const testWorkspace = createTestWorkspace();

    // Navigate to onboarding (assuming authenticated)
    await navigator.toApp('/onboarding');
    await page.waitForFunction(() => (window as any).Clerk?.isReady());
    await page.waitForSelector('[data-testid="workspace-creation-form"]');

    // Fill form
    await page.fill('[name="name"]', testWorkspace.name);
    await page.fill('[name="slug"]', testWorkspace.slug);

    // Simulate network failure
    await page.route('**/api/workspaces**', route => route.abort());

    // Try to submit
    await page.click('[type="submit"]');

    // Should show error message
    await expect(page.locator('[data-testid="error-message"], text="Network error"')).toBeVisible();

    // Remove network mock and retry
    await page.unroute('**/api/workspaces**');
    await page.click('[type="submit"]');

    // Should succeed
    await page.waitForURL(new RegExp(`.*/${testWorkspace.slug}.*`));
  });

  test('should validate workspace slug format', async ({ page }) => {
    const navigator = createNavigator(page);

    await navigator.toApp('/onboarding');
    await page.waitForFunction(() => (window as any).Clerk?.isReady());
    await page.waitForSelector('[data-testid="workspace-creation-form"]');

    // Test invalid slug formats
    const invalidSlugs = [
      'UPPERCASE',
      'spaces here',
      'special@chars',
      'underscore_here',
      'trailing-',
      '-leading',
      'a', // too short
      'a'.repeat(100), // too long
    ];

    for (const slug of invalidSlugs) {
      await page.fill('[name="slug"]', slug);
      await page.click('[type="submit"]');
      await expect(page.locator('[data-error*="slug"], text="Invalid slug"')).toBeVisible();
      await page.fill('[name="slug"]', ''); // Clear field
    }

    // Test valid slug
    await page.fill('[name="name"]', 'Valid Workspace');
    await page.fill('[name="slug"]', 'valid-workspace-slug');
    await page.click('[type="submit"]');

    // Should succeed
    await page.waitForURL('**/valid-workspace-slug**');
  });
});
