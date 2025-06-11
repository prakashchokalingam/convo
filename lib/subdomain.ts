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
    const searchParams = new URLSearchParams(window.location.search);
    
    if (process.env.NODE_ENV === 'development') {
      // Development: Check for ?subdomain= query parameter
      // Examples: ?subdomain=app, ?subdomain=forms
      const subdomain = searchParams.get('subdomain');
      if (subdomain === 'app') return 'app';
      if (subdomain === 'forms') return 'forms';
      return 'marketing'; // Default for localhost:3002/
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
    
    // Development fallback
    return 'marketing';
  } catch (error) {
    // Fallback if headers are not available (shouldn't happen normally)
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
 * - buildContextUrl('app', '/workspace') → 'localhost:3002/workspace?subdomain=app' (dev)
 * - buildContextUrl('app', '/workspace') → 'https://app.convo.ai/workspace' (prod)
 * - buildContextUrl('forms', '/contact/123') → 'localhost:3002/contact/123?subdomain=forms' (dev)
 */
export function buildContextUrl(context: SubdomainContext, path: string): string {
  if (process.env.NODE_ENV === 'development') {
    // Development: Use query parameters to simulate subdomains
    const base = 'http://localhost:3002';
    if (context === 'marketing') return `${base}${path}`;
    return `${base}${path}?subdomain=${context}`;
  } else {
    // Production: Use real subdomains
    const subdomain = context === 'marketing' ? '' : `${context}.`;
    return `https://${subdomain}convo.ai${path}`;
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
