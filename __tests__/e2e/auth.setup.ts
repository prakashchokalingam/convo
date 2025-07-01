import { test as setup, expect } from '@playwright/test';
import { generateTestUser, createTestWorkspace } from './utils/test-data';
import { buildContextUrl } from './utils/subdomain';

const authFile = '.auth/user.json';

/**
 * Authentication setup for E2E tests
 * This creates a test user and authenticates them before running tests
 */
setup('authenticate', async ({ page }) => {
  console.log('🔐 Setting up authentication for E2E tests...');
  
  // Generate test user data
  const testUser = generateTestUser();
  
  try {
    // Navigate to signup page (app context)
    // Using buildContextUrl to get the correct path for app's signup page
    await page.goto(buildContextUrl('app', '/signup'));
    await page.waitForLoadState('networkidle');
    
    // Check if we're already on the login page or need to navigate
    // The above goto should directly land on signup or login if signup needs login first.
    const currentUrl = page.url();
    if (!currentUrl.includes('/sign-')) {
      // Navigate to signup
      await page.click('[data-testid="signup-button"], [href*="sign-up"], text="Sign up"');
    }
    
    // Wait for Clerk auth component to load
    await page.waitForSelector('[data-clerk-loading="false"]', { timeout: 10000 });
    
    // Fill in the signup form
    await page.fill('[name="emailAddress"], [type="email"]', testUser.email);
    await page.fill('[name="password"], [type="password"]', testUser.password);
    
    // Submit the form
    await page.click('[type="submit"], button[form] >> text="Sign up"');
    
    // Handle email verification if required (in test environment, this might be skipped)
    // Wait for either verification page or redirect to onboarding
    await Promise.race([
      page.waitForURL('**/onboarding**', { timeout: 30000 }),
      page.waitForURL('**/verify-email**', { timeout: 10000 }),
      page.waitForSelector('[data-testid="onboarding-form"]', { timeout: 30000 })
    ]);
    
    // If we're on verification page, we might need to handle that
    // For development/test environment, Clerk might skip email verification
    if (page.url().includes('verify-email')) {
      console.log('📧 Email verification required - handling in test mode...');
      // In test environment, you might want to use Clerk's test mode
      // or mock the verification process
    }
    
    // Check if we reached onboarding or need to navigate there
    if (!page.url().includes('onboarding')) {
      // Navigate to onboarding using the app context path
      await page.goto(buildContextUrl('app', '/onboarding'));
    }
    
    // Wait for onboarding page to load
    await page.waitForSelector('[data-testid="workspace-creation-form"], form', { timeout: 15000 });
    
    // Create a test workspace
    const testWorkspace = createTestWorkspace();
    await page.fill('[name="name"], [placeholder*="workspace"], input[type="text"]', testWorkspace.name);
    await page.fill('[name="slug"], [placeholder*="slug"]', testWorkspace.slug);
    
    // Submit workspace creation
    await page.click('[type="submit"], button >> text="Create"');
    
    // Wait for redirect to workspace dashboard
    await page.waitForURL(new RegExp(`.*/${testWorkspace.slug}.*`), { timeout: 15000 });
    
    // Verify we're authenticated and in the workspace
    await expect(page).toHaveURL(new RegExp(`.*/${testWorkspace.slug}.*`));
    
    // Save the authentication state
    await page.context().storageState({ path: authFile });
    
    console.log('✅ Authentication setup completed successfully');
    console.log(`📝 Test user: ${testUser.email}`);
    console.log(`🏢 Test workspace: ${testWorkspace.name} (${testWorkspace.slug})`);
    
  } catch (error) {
    console.error('❌ Authentication setup failed:', error);
    
    // Take a screenshot for debugging
    await page.screenshot({ 
      path: 'test-results/auth-setup-failure.png', 
      fullPage: true 
    });
    
    throw error;
  }
});
