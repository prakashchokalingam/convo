import { test, expect } from '@playwright/test';
import { createNavigator, buildContextUrl, extractWorkspaceSlug } from './utils/subdomain';

/**
 * Subdomain Routing E2E Tests
 * 
 * Tests the complex subdomain-based routing system
 * Marketing (convo.ai) → App (app.convo.ai) → Forms (forms.convo.ai)
 */

test.describe('Subdomain Context Detection', () => {
  test('should detect marketing context correctly', async ({ page }) => {
    const navigator = createNavigator(page);
    
    // Navigate to marketing site
    await navigator.toMarketing();
    
    // Verify marketing elements are present
    await expect(page.locator('[data-testid="marketing-hero"], h1')).toBeVisible();
    await expect(page.locator('[data-testid="signup-cta"], text="Get Started"')).toBeVisible();
    await expect(page.locator('[data-testid="pricing-link"], text="Pricing"')).toBeVisible();
    
    // Verify no app navigation is present
    await expect(page.locator('[data-testid="app-sidebar"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="workspace-switcher"]')).not.toBeVisible();
  });
  
  test('should detect app context correctly', async ({ page }) => {
    const navigator = createNavigator(page);
    
    // Navigate to app (will redirect to login if not authenticated)
    await navigator.toApp();
    await navigator.waitForAuthRedirect();
    
    // Should either show login page or authenticated app
    const isAuthenticated = await page.locator('[data-testid="workspace-dashboard"]').isVisible();
    
    if (isAuthenticated) {
      // Verify app elements
      await expect(page.locator('[data-testid="app-header"]')).toBeVisible();
      await expect(page.locator('[data-testid="workspace-switcher"]')).toBeVisible();
    } else {
      // Verify login page in app context
      await expect(page.locator('[data-testid="login-form"], text="Sign in"')).toBeVisible();
      await expect(page.locator('[data-testid="marketing-hero"]')).not.toBeVisible();
    }
  });
  
  test('should handle forms context correctly', async ({ page }) => {
    const navigator = createNavigator(page);
    
    // Try to navigate to a forms URL (will 404 if form doesn't exist)
    // This tests the context detection, not form existence
    await navigator.toForms('test-workspace', 'test-form');
    
    // Should either show form or 404, but in forms context
    const hasForm = await page.locator('[data-testid="form-container"]').isVisible();
    const has404 = await page.locator('text="Not Found", text="404"').isVisible();
    
    expect(hasForm || has404).toBe(true);
    
    // Verify no app navigation in forms context
    await expect(page.locator('[data-testid="app-sidebar"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="workspace-switcher"]')).not.toBeVisible();
  });
});

test.describe('Context URL Building', () => {
  test('should build correct URLs for development', async ({ page }) => {
    // Test URL building utility functions
    const marketingUrl = buildContextUrl('marketing', 'pricing');
    const appUrl = buildContextUrl('app', 'workspace/test');
    const formsUrl = buildContextUrl('forms', 'test/form123');
    
    // In development, should use query parameters
    if (process.env.NODE_ENV !== 'production') {
      expect(marketingUrl).toContain('localhost:3002/pricing');
      expect(appUrl).toContain('localhost:3002/workspace/test?subdomain=app');
      expect(formsUrl).toContain('localhost:3002/test/form123?subdomain=forms');
    }
    
    // Test navigation with built URLs
    await page.goto(marketingUrl);
    await expect(page).toHaveURL(new RegExp('.*pricing.*'));
    
    await page.goto(appUrl);
    await expect(page).toHaveURL(new RegExp('.*subdomain=app.*'));
  });
  
  test('should extract workspace slug from URLs correctly', async ({ page }) => {
    const testWorkspace = 'my-test-workspace';
    const navigator = createNavigator(page);
    
    // Navigate to workspace URL
    await navigator.toWorkspace(testWorkspace);
    
    // Extract slug from current URL
    const currentUrl = page.url();
    const extractedSlug = extractWorkspaceSlug(currentUrl);
    
    expect(extractedSlug).toBe(testWorkspace);
  });
});

test.describe('Cross-Context Navigation', () => {
  test('should navigate from marketing to app correctly', async ({ page }) => {
    const navigator = createNavigator(page);
    
    // Start on marketing site
    await navigator.toMarketing();
    await expect(page.locator('[data-testid="marketing-hero"]')).toBeVisible();
    
    // Click signup CTA
    await page.click('[data-testid="signup-cta"], [href*="sign-up"]');
    
    // Should navigate to app context (login/signup page)
    await navigator.waitForAuthRedirect();
    
    // Verify we're in app context
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/.*(?:app\.|subdomain=app).*/);
  });
  
  test('should maintain authentication across contexts', async ({ page }) => {
    const navigator = createNavigator(page);
    
    // Assuming we're authenticated (from auth.setup.ts)
    // Navigate to app
    await navigator.toApp();
    
    // Verify authenticated
    await expect(page.locator('[data-testid="user-menu"], [data-testid="workspace-dashboard"]')).toBeVisible();
    
    // Navigate back to marketing
    await navigator.toMarketing();
    
    // Navigate back to app
    await navigator.toApp();
    
    // Should still be authenticated (no login redirect)
    await expect(page.locator('[data-testid="user-menu"], [data-testid="workspace-dashboard"]')).toBeVisible();
  });
  
  test('should handle deep links correctly', async ({ page }) => {
    const navigator = createNavigator(page);
    const workspaceSlug = 'test-workspace';
    
    // Try to access deep link while unauthenticated
    await page.context().clearCookies();
    await navigator.toWorkspace(workspaceSlug, 'forms/123/edit');
    
    // Should redirect to login but preserve intended destination
    await navigator.waitForAuthRedirect();
    
    // After authentication (simulated), should redirect to intended page
    // This would require actual authentication flow in full test
  });
});

test.describe('Error Handling and Fallbacks', () => {
  test('should handle invalid subdomain gracefully', async ({ page }) => {
    // Navigate to invalid subdomain context
    await page.goto('http://localhost:3002/test?subdomain=invalid');
    
    // Should fallback to marketing or show appropriate error
    await page.waitForLoadState('networkidle');
    
    // Should either redirect to marketing or show error page
    const hasMarketing = await page.locator('[data-testid="marketing-hero"]').isVisible();
    const hasError = await page.locator('text="Error", text="Invalid"').isVisible();
    
    expect(hasMarketing || hasError).toBe(true);
  });
  
  test('should show appropriate 404 pages per context', async ({ page }) => {
    const navigator = createNavigator(page);
    
    // Test 404 in app context
    await navigator.toApp('/non-existent-page');
    await expect(page.locator('text="Not Found", text="404"')).toBeVisible();
    
    // Should still have app layout
    await expect(page.locator('[data-testid="app-header"], [data-testid="app-layout"]')).toBeVisible();
    
    // Test 404 in forms context
    await navigator.toForms('non-existent', 'form');
    await expect(page.locator('text="Not Found", text="404"')).toBeVisible();
    
    // Should not have app navigation
    await expect(page.locator('[data-testid="app-sidebar"]')).not.toBeVisible();
  });
  
  test('should handle network failures gracefully', async ({ page }) => {
    const navigator = createNavigator(page);
    
    // Mock network failure
    await page.route('**/*', route => route.abort());
    
    try {
      await navigator.toApp();
      // Should show network error or offline page
      await expect(page.locator('text="Network Error", text="Offline"')).toBeVisible();
    } catch (error) {
      // Expected behavior for network failure
      expect(error.message).toContain('net::ERR_FAILED');
    }
    
    // Remove network mock
    await page.unroute('**/*');
  });
});

test.describe('Performance and Caching', () => {
  test('should load contexts efficiently', async ({ page }) => {
    const navigator = createNavigator(page);
    
    // Measure navigation time between contexts
    const startTime = Date.now();
    
    await navigator.toMarketing();
    const marketingTime = Date.now() - startTime;
    
    await navigator.toApp();
    const appTime = Date.now() - marketingTime;
    
    // Context switching should be reasonably fast
    expect(marketingTime).toBeLessThan(5000); // 5 seconds max
    expect(appTime).toBeLessThan(5000);
  });
  
  test('should cache static assets appropriately', async ({ page }) => {
    const navigator = createNavigator(page);
    
    // Navigate to marketing site
    await navigator.toMarketing();
    
    // Check for cache headers on static assets
    const responses = await Promise.all([
      page.waitForResponse(response => response.url().includes('.css')),
      page.waitForResponse(response => response.url().includes('.js')),
      page.reload()
    ]);
    
    // Should have appropriate caching headers
    const cssResponse = responses[0];
    const jsResponse = responses[1];
    
    expect(cssResponse.headers()['cache-control']).toBeTruthy();
    expect(jsResponse.headers()['cache-control']).toBeTruthy();
  });
});

test.describe('Mobile Responsiveness', () => {
  test('should work correctly on mobile devices', async ({ page, isMobile }) => {
    const navigator = createNavigator(page);
    
    // Only run on mobile viewports
    if (!isMobile) {
      test.skip('Mobile-only test');
    }
    
    // Test marketing site on mobile
    await navigator.toMarketing();
    await expect(page.locator('[data-testid="mobile-menu"], [data-testid="hamburger-menu"]')).toBeVisible();
    
    // Test app on mobile
    await navigator.toApp();
    await navigator.waitForAuthRedirect();
    
    // Should have mobile-appropriate layout
    const isMobileLayout = await page.locator('[data-testid="mobile-app-layout"]').isVisible();
    const hasHamburger = await page.locator('[data-testid="mobile-menu-toggle"]').isVisible();
    
    expect(isMobileLayout || hasHamburger).toBe(true);
  });
});
