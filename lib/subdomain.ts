/**
 * Subdomain Context Management
 * 
 * ConvoForms uses a subdomain-based architecture to separate different parts of the app:
 * - Marketing: convo.ai (landing page, pricing, about)
 * - App: app.convo.ai (authenticated dashboard, form builder)
 * - Forms: forms.convo.ai (public form submissions)
 * 
 * In development, we simulate subdomains using query parameters:
 * - Marketing: localhost:3002/
 * - App: localhost:3002/?subdomain=app
 * - Forms: localhost:3002/?subdomain=forms
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
    
    if (process.env.NODE_ENV === 'development') {
      // Development: Detect context from pathname
      // Examples: /app/dashboard -> app, /forms/submit -> forms, /marketing/about -> marketing
      const pathSegments = window.location.pathname.split('/');
      const firstSegment = pathSegments[1]; // Pathname starts with '/', so segment 0 is empty

      if (firstSegment === 'app') return 'app';
      if (firstSegment === 'forms') return 'forms';
      // Default to marketing for paths like /marketing/..., / (root), or any other path
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
    const { headers } = require('next/headers');
    
    // First, try to get context from middleware header
    const contextHeader = headers().get('x-subdomain-context');
    if (contextHeader && (contextHeader === 'marketing' || contextHeader === 'app' || contextHeader === 'forms')) {
      return contextHeader as SubdomainContext;
    }
    
    // Fallback to host detection for production
    const host = headers().get('host') || '';
    if (process.env.NODE_ENV === 'production') {
      if (host.startsWith('app.')) return 'app';
      if (host.startsWith('forms.')) return 'forms';
      return 'marketing';
    }
    
    // Development fallback:
    // This fallback is hit if 'x-subdomain-context' header is NOT set by middleware in dev.
    // Middleware should be the primary source of context server-side.
    // We can't easily get the pathname here server-side without more complex parsing if the header is missing.
    // Log a warning and default to 'marketing'. The middleware should be fixed.
    if (process.env.NODE_ENV === 'development' && host && host.includes('localhost')) {
      console.warn(
        "getSubdomainContext: 'x-subdomain-context' header not found in development. " +
        "Middleware might not be correctly setting the context. Defaulting to 'marketing'."
      );
    }
    return 'marketing';
  } catch (error) {
    // Fallback if headers are not available (e.g. during build or non-request environments)
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
 * - buildContextUrl('marketing', '/workspace') → 'http://localhost:3002/marketing/workspace' (dev)
 * - buildContextUrl('marketing', '/workspace') → 'https://convo.ai/workspace' (prod)
 * - buildContextUrl('app', '/workspace') → 'http://localhost:3002/app/workspace' (dev)
 * - buildContextUrl('app', '/workspace') → 'https://app.convo.ai/workspace' (prod)
 * - buildContextUrl('forms', '/contact/123') → 'http://localhost:3002/forms/contact/123' (dev)
 * - buildContextUrl('forms', '/workspace') → 'https://forms.convo.ai/workspace' (prod)
 */
export function buildContextUrl(context: SubdomainContext, path: string): string {
  // Ensure path starts with a slash and handle root path correctly
  const normalizedPath = path === '/' ? '' : path;

  if (process.env.NODE_ENV === 'development') {
    const base = 'http://localhost:3002';
    // Prepend context to path, e.g., /app/workspace or /marketing/about
    return `${base}/${context}${normalizedPath}`;
  } else {
    // Production: Use real subdomains
    if (context === 'marketing') {
      return `https://convo.ai${normalizedPath === '' ? '/' : normalizedPath}`;
    }
    // For 'app' and 'forms'
    const subdomain = `${context}.`;
    return `https://${subdomain}convo.ai${normalizedPath === '' ? '/' : normalizedPath}`;
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
