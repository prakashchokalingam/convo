/**
 * Subdomain Context Management
 * 
 * ConvoForms uses a subdomain-based architecture to separate different parts of the app:
 * - Marketing: convo.ai (landing page, pricing, about)
 * - App: app.convo.ai (authenticated dashboard, form builder)
 * - Forms: forms.convo.ai (public form submissions)
 * 
 * In development, we use path prefixes:
 * - Marketing: localhost:3002/marketing (or localhost:3002/ for the conceptual root landing)
 * - App: localhost:3002/app
 * - Forms: localhost:3002/forms
 */

// The three contexts our app operates in
export type SubdomainContext = 'marketing' | 'app' | 'forms';

/**
 * Detects which context the current request is in
 * 
 * Works both client-side (browser) and server-side (API routes)
 * Handles both development (query params) and production (real subdomains)
 * 
 * @returns The current context: 'marketing', 'app', or 'forms'
 */

export function getSubdomainContext(): SubdomainContext {
  if (typeof window !== 'undefined') {
    // CLIENT-SIDE DETECTION (in browser)
    const hostname = window.location.hostname;
    const pathname = window.location.pathname; // Get the path
    
    if (process.env.NODE_ENV === 'development') {
      // Development: Check path prefix
      // Examples: /app/..., /forms/..., /marketing/... or /
      if (pathname.startsWith('/app')) return 'app';
      if (pathname.startsWith('/forms')) return 'forms';
      // All other paths, including / and /marketing, map to marketing
      return 'marketing';
    } else {
      // Production: Check actual subdomain in hostname
      // Examples: app.convo.ai, forms.convo.ai
      if (hostname.startsWith('app.')) return 'app';
      if (hostname.startsWith('forms.')) return 'forms';
      return 'marketing'; // Default for convo.ai
    }
  }
  
  // SERVER-SIDE DETECTION (in API routes and server components)
  try {
    const { headers } = require('next/headers'); // Keep this for middleware header
    const requestHeaders = headers(); // Get all headers

    // First, try to get context from middleware header (BEST WAY)
    const contextHeader = requestHeaders.get('x-subdomain-context');
    if (contextHeader && (contextHeader === 'marketing' || contextHeader === 'app' || contextHeader === 'forms')) {
      return contextHeader as SubdomainContext;
    }
    
    // Fallback detection if middleware header is not set (should be less common)
    const host = requestHeaders.get('host') || '';
    // For server components, NextRequest's url is available in headers as 'x-url' or similar.
    // Or, if we are in a route handler, req.url is available.
    // However, direct access to the path is tricky here without the full request object.
    // Relying on 'host' for production and 'referer' or a specific path header for dev if possible.
    // For now, the primary mechanism on the server should be the 'x-subdomain-context' header set by middleware.

    if (process.env.NODE_ENV === 'production') {
      if (host.startsWith('app.')) return 'app';
      if (host.startsWith('forms.')) return 'forms';
      return 'marketing'; // Default for convo.ai
    } else {
      // Development server-side:
      // The middleware should set 'x-subdomain-context'.
      // If not, this indicates an issue or a context where middleware didn't run.
      // As a last resort for server components in dev, we might need to parse 'x-forwarded-host' or 'referer'
      // but this can be unreliable. The 'x-subdomain-context' header is the most robust.
      // If we absolutely must determine from path on server in dev without middleware header:
      const urlHeader = requestHeaders.get('x-url'); // Next.js specific header for request URL
      if (urlHeader) {
        const pathFromServer = new URL(urlHeader).pathname;
        if (pathFromServer.startsWith('/app')) return 'app';
        if (pathFromServer.startsWith('/forms')) return 'forms';
      }
      return 'marketing'; // Default for localhost:3002/ or if path undetermined
    }
  } catch (error) {
    // Fallback if headers are not available
    return 'marketing';
  }
}

/**
 * Builds context-aware URLs for the application
 * 
 * This is the core function that handles URL generation for different contexts.
 * It automatically switches between development and production URL formats.
 * 
 * @param context - Which context to build URL for ('marketing', 'app', 'forms')
 * @param path - The path to append (should start with /)
 * @returns Complete URL with proper subdomain or query parameter
 * 
 * Examples:
 * - buildContextUrl('app', '/workspace') → 'http://localhost:3002/app/workspace' (dev)
 * - buildContextUrl('app', '/workspace') → 'https://app.convo.ai/workspace' (prod)
 * - buildContextUrl('forms', '/contact/123') → 'http://localhost:3002/forms/contact/123' (dev)
 */
export function buildContextUrl(context: SubdomainContext, path: string): string {
  // Ensure the path starts with a slash if it's not empty or already starting with one.
  const normalizedPath = path === '/' || path === '' ? '' : (path.startsWith('/') ? path : `/${path}`);

  if (process.env.NODE_ENV === 'development') {
    const base = 'http://localhost:3002';
    // In development, the context is part of the path.
    // Marketing context is at the root or /marketing
    // App context is at /app
    // Forms context is at /forms
    if (context === 'marketing') {
      // If path is for marketing root, it's just base. Otherwise, base/marketing/path
      // Or, if we decide marketing pages are always directly under root (e.g. /pricing, /about)
      // then it would be `${base}${normalizedPath}`.
      // Given current structure, /marketing is a path segment.
      if (normalizedPath === '') return `${base}/marketing`; // Marketing root page
      return `${base}/marketing${normalizedPath}`; // Other marketing pages like /marketing/pricing
    } else if (context === 'app') {
      return `${base}/app${normalizedPath}`;
    } else { // context === 'forms'
      return `${base}/forms${normalizedPath}`;
    }
  } else {
    // Production: Use real subdomains
    const prodDomain = 'convo.ai';
    let subdomainPart = '';
    if (context === 'app') {
      subdomainPart = 'app.';
    } else if (context === 'forms') {
      subdomainPart = 'forms.';
    }
    // For marketing, subdomainPart remains empty, so it's just convo.ai
    return `https://${subdomainPart}${prodDomain}${normalizedPath === '' && context !== 'marketing' ? '/' : normalizedPath}`;
  }
}

// =============================================================================
// URL HELPER FUNCTIONS
// =============================================================================
// These functions provide a consistent way to generate URLs throughout the app.
// They automatically handle the context switching and URL formatting.

// -----------------------------------------------------------------------------
// APP CONTEXT URLs (Authentication Required)
// -----------------------------------------------------------------------------
// These URLs all require the user to be logged in and use the 'app' context

/** Generate URL for login page */
export const getLoginUrl = () => buildContextUrl('app', '/login');

/** Generate URL for signup page */
export const getSignupUrl = () => buildContextUrl('app', '/signup');

/** Generate URL for post-signup onboarding */
export const getOnboardingUrl = () => buildContextUrl('app', '/onboarding');

/** Generate URL for workspace dashboard */
export const getWorkspaceUrl = (workspaceSlug: string) => 
  buildContextUrl('app', `/${workspaceSlug}`);

/** Generate URL for workspace forms list */
export const getFormsUrl = (workspaceSlug: string) => 
  buildContextUrl('app', `/${workspaceSlug}/forms`);

/** Generate URL for form editor */
export const getFormEditorUrl = (workspaceSlug: string, formId: string) => 
  buildContextUrl('app', `/${workspaceSlug}/forms/${formId}`);

/** Generate URL for workspace settings */
export const getWorkspaceSettingsUrl = (workspaceSlug: string) => 
  buildContextUrl('app', `/${workspaceSlug}/settings`);

/** Generate URL for workspace members management */
export const getMembersUrl = (workspaceSlug: string) => 
  buildContextUrl('app', `/${workspaceSlug}/members`);

// -----------------------------------------------------------------------------
// FORMS CONTEXT URLs (Public Access)
// -----------------------------------------------------------------------------
// These URLs are for public form submissions and don't require authentication

/** 
 * Generate URL for public form submission 
 * @param workspaceSlug - Workspace slug or form type (e.g., 'contact', 'survey', 'feedback')
 * @param formId - Unique form identifier
 */
export const getPublicFormUrl = (workspaceSlug: string, formId: string) => 
  buildContextUrl('forms', `/${workspaceSlug}/${formId}`);

// -----------------------------------------------------------------------------
// MARKETING CONTEXT URLs (Public Website)
// -----------------------------------------------------------------------------
// These URLs are for the public marketing website

/** Generate URL for marketing pages (landing, pricing, about, etc.) */
export const getMarketingUrl = (path: string) => 
  buildContextUrl('marketing', path);
