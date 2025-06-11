import { Page, expect } from '@playwright/test';

/**
 * Subdomain navigation utilities for E2E tests
 * Handles the complex routing between marketing, app, and forms contexts
 */

export type SubdomainContext = 'marketing' | 'app' | 'forms';

export interface NavigationOptions {
  waitForLoadState?: boolean;
  timeout?: number;
}

/**
 * Base URLs for different environments
 */
const getBaseUrls = () => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  if (isDevelopment) {
    return {
      base: 'http://localhost:3002',
      marketing: 'http://localhost:3002',
      app: 'http://localhost:3002',
      forms: 'http://localhost:3002'
    };
  }
  
  return {
    base: 'https://convo.ai',
    marketing: 'https://convo.ai',
    app: 'https://app.convo.ai',
    forms: 'https://forms.convo.ai'
  };
};

/**
 * Builds context-aware URLs for different subdomains
 */
export function buildContextUrl(context: SubdomainContext, path: string = ''): string {
  const urls = getBaseUrls();
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  if (isDevelopment) {
    // In development, use query parameters to simulate subdomains
    const baseUrl = urls.base;
    const queryParam = context === 'marketing' ? '' : `?subdomain=${context}`;
    return `${baseUrl}/${cleanPath}${queryParam}`;
  }
  
  // In production, use actual subdomains
  return `${urls[context]}/${cleanPath}`;
}

/**
 * Navigation helper class for subdomain-aware page navigation
 */
export class SubdomainNavigator {
  constructor(private page: Page) {}
  
  /**
   * Navigate to marketing site
   */
  async toMarketing(path: string = '', options: NavigationOptions = {}) {
    const url = buildContextUrl('marketing', path);
    await this.navigateToUrl(url, options);
    await this.verifyContext('marketing');
  }
  
  /**
   * Navigate to app (authenticated area)
   */
  async toApp(path: string = '', options: NavigationOptions = {}) {
    const url = buildContextUrl('app', path);
    await this.navigateToUrl(url, options);
    // Note: Context verification might show login page if not authenticated
  }
  
  /**
   * Navigate to forms (public form area)
   */
  async toForms(workspaceSlug: string, formId: string, options: NavigationOptions = {}) {
    const path = `${workspaceSlug}/${formId}`;
    const url = buildContextUrl('forms', path);
    await this.navigateToUrl(url, options);
    await this.verifyContext('forms');
  }
  
  /**
   * Navigate to specific workspace
   */
  async toWorkspace(workspaceSlug: string, path: string = '', options: NavigationOptions = {}) {
    const fullPath = path ? `${workspaceSlug}/${path}` : workspaceSlug;
    await this.toApp(fullPath, options);
  }
  
  /**
   * Navigate to form builder
   */
  async toFormBuilder(workspaceSlug: string, formId?: string, options: NavigationOptions = {}) {
    const path = formId 
      ? `${workspaceSlug}/forms/${formId}/edit`
      : `${workspaceSlug}/forms/new`;
    await this.toApp(path, options);
  }
  
  /**
   * Navigate to workspace settings
   */
  async toWorkspaceSettings(workspaceSlug: string, section: string = '', options: NavigationOptions = {}) {
    const path = section 
      ? `${workspaceSlug}/settings/${section}`
      : `${workspaceSlug}/settings`;
    await this.toApp(path, options);
  }
  
  /**
   * Internal navigation method
   */
  private async navigateToUrl(url: string, options: NavigationOptions) {
    await this.page.goto(url, {
      waitUntil: options.waitForLoadState !== false ? 'networkidle' : undefined,
      timeout: options.timeout || 30000
    });
  }
  
  /**
   * Verify we're in the correct context
   */
  private async verifyContext(expectedContext: SubdomainContext) {
    // Wait a moment for context to be established
    await this.page.waitForTimeout(1000);
    
    const currentUrl = this.page.url();
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    if (isDevelopment) {
      // In development, check query parameters
      if (expectedContext === 'marketing') {
        expect(currentUrl).not.toContain('?subdomain=');
      } else {
        expect(currentUrl).toContain(`subdomain=${expectedContext}`);
      }
    } else {
      // In production, check actual subdomain
      const urls = getBaseUrls();
      expect(currentUrl).toContain(urls[expectedContext]);
    }
  }
  
  /**
   * Wait for authentication redirect
   */
  async waitForAuthRedirect(timeout: number = 15000) {
    // Wait for either login page or authenticated page
    await Promise.race([
      this.page.waitForURL('**/sign-in**', { timeout }),
      this.page.waitForURL('**/sign-up**', { timeout }),
      this.page.waitForURL('**/onboarding**', { timeout }),
      this.page.waitForSelector('[data-testid="workspace-dashboard"]', { timeout }),
      this.page.waitForSelector('[data-testid="user-menu"]', { timeout })
    ]);
  }
  
  /**
   * Switch between workspaces
   */
  async switchWorkspace(workspaceSlug: string) {
    // Click workspace switcher
    await this.page.click('[data-testid="workspace-switcher"]');
    
    // Wait for dropdown to open
    await this.page.waitForSelector('[data-testid="workspace-list"]');
    
    // Select the target workspace
    await this.page.click(`[data-testid="workspace-option-${workspaceSlug}"]`);
    
    // Wait for navigation to complete
    await this.page.waitForURL(new RegExp(`.*/${workspaceSlug}.*`));
  }
}

/**
 * Create a subdomain navigator for a page
 */
export function createNavigator(page: Page): SubdomainNavigator {
  return new SubdomainNavigator(page);
}

/**
 * Helper to extract workspace slug from current URL
 */
export function extractWorkspaceSlug(url: string): string | null {
  // Match patterns like /workspace-slug or /workspace-slug/path
  const match = url.match(/\/([a-z0-9-]+)(?:\/|$)/);
  return match ? match[1] : null;
}

/**
 * Helper to extract form ID from forms URL
 */
export function extractFormId(url: string): string | null {
  // Match patterns like /workspace/form-id
  const match = url.match(/\/[a-z0-9-]+\/([a-z0-9-]+)$/);
  return match ? match[1] : null;
}

/**
 * Verify page is loaded and ready for interaction
 */
export async function waitForPageReady(page: Page, timeout: number = 10000) {
  // Wait for basic page readiness
  await page.waitForLoadState('networkidle', { timeout });
  
  // Wait for React to hydrate (Next.js specific)
  await page.waitForFunction(() => window.next?.router?.isReady, { timeout });
  
  // Wait for any loading spinners to disappear
  await page.waitForSelector('[data-loading="true"]', { state: 'hidden', timeout: 5000 }).catch(() => {
    // Ignore if no loading indicators found
  });
}
