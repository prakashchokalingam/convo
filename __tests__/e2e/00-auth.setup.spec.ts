import { test as setup, expect } from './fixtures'; // Import from custom fixtures
import { createTestWorkspace } from './utils/test-data'; // generateTestUser not needed for programmatic
import { buildContextUrl } from './utils/subdomain';

const authFile = '.auth/user.json';

/**
 * Authentication setup for E2E tests
 * This creates a test user and authenticates them before running tests
 */
setup('authenticate', async ({ page, clerk }) => { // 'clerk' fixture should now be available
  console.log('🔐 Setting up authentication for E2E tests programmatically...');

  const testUser = {
    email: `test-user-${Date.now()}@example.com`,
    password: 'TestPassword123!', // Ensure this matches any password strength requirements
    firstName: 'E2E',
    lastName: 'TestUser',
  };

  try {
    // Programmatically create and sign in the user.
    // This uses the 'clerk' fixture from @clerk/testing/playwright.
    await clerk.user.create({
      emailAddress: testUser.email,
      password: testUser.password,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      skipVerification: true, // Important for testing to bypass email verification
    });
    console.log(`User ${testUser.email} created/signed in programmatically via clerk fixture.`);

    // Navigate to a page to allow the session to be fully established by the browser
    // and for any client-side Clerk initialization to occur.
    // The onboarding page is a good candidate as it's an authenticated route.
    await page.goto(buildContextUrl('app', '/onboarding'));

    // Wait for Clerk to be ready on the client-side (important after programmatic auth)
    // The AppStoreInitializer workaround might still show a console warning here, which is okay for now.
    await page.waitForFunction(() => (window as any).Clerk?.isReady(), null, { timeout: 15000 });
    console.log('Clerk is ready on the client-side after programmatic sign-in.');

    // Proceed with workspace creation (UI part)
    await page.waitForSelector('[data-testid="workspace-creation-form"], form', { timeout: 15000 });
    console.log('Onboarding page loaded, workspace creation form visible.');

    const testWorkspace = createTestWorkspace();
    await page.fill('[name="name"], [placeholder*="workspace"], input[type="text"]', testWorkspace.name);
    await page.fill('[name="slug"], [placeholder*="slug"]', testWorkspace.slug);
    await page.click('[type="submit"], button >> text="Create"');
    console.log(`Attempting to create workspace: ${testWorkspace.name}`);

    // Wait for redirect to the workspace dashboard
    await page.waitForURL(new RegExp(`.*/${testWorkspace.slug}.*`), { timeout: 20000 });
    await expect(page).toHaveURL(new RegExp(`.*/${testWorkspace.slug}.*`));
    console.log(`Workspace ${testWorkspace.slug} created and redirected.`);

    // Save the authentication state (cookies, local storage, etc.)
    await page.context().storageState({ path: authFile });

    console.log('✅ Programmatic authentication setup completed successfully');
    console.log(`📝 Test user: ${testUser.email}`);
    console.log(`🏢 Test workspace: ${testWorkspace.name} (${testWorkspace.slug})`);

  } catch (error) {
    console.error('❌ Programmatic authentication setup in 00-auth.setup.spec.ts failed:', error);

    // Take a screenshot for debugging
    await page.screenshot({
      path: 'test-results/auth-setup-failure.png',
      fullPage: true
    });

    throw error;
  }
});
