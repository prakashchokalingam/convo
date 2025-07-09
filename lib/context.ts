/**
 * Path-Based Context Management
 *
 * ConvoForms uses a clean path-based routing system:
 * - Marketing: /marketing/* (public website)
 * - App: /app/* (authenticated dashboard)
 * - Forms: /forms/* (public form submissions)
 *
 * In production, subdomains rewrite to these paths:
 * - convo.ai → /marketing
 * - app.convo.ai → /app
 * - forms.convo.ai → /forms
 */

// The three contexts our app operates in
export type Context = 'marketing' | 'app' | 'forms';

/**
 * Detects which context the current request is in based on pathname
 *
 * Works both client-side and server-side
 * Simple path-based detection - no complex environment checks needed
 *
 * @returns The current context: 'marketing', 'app', or 'forms'
 */
export function getContext(): Context {
  let pathname: string;

  if (typeof window !== 'undefined') {
    // CLIENT-SIDE: Use window.location
    pathname = window.location.pathname;
  } else {
    // SERVER-SIDE: Try to get pathname from headers
    try {
      const { headers } = require('next/headers');
      const headersList = headers();
      pathname = headersList.get('x-pathname') || '/';
    } catch {
      // Fallback if headers not available
      pathname = '/';
    }
  }

  // Simple path-based detection
  if (pathname.startsWith('/app')) {return 'app';}
  if (pathname.startsWith('/forms')) {return 'forms';}
  return 'marketing'; // Default for /marketing/* and other paths
}

/**
 * Alternative context detection using a provided pathname
 * Useful for middleware and server components that have access to the request
 */
export function getContextFromPath(pathname: string): Context {
  if (pathname.startsWith('/app')) {return 'app';}
  if (pathname.startsWith('/forms')) {return 'forms';}
  return 'marketing';
}

// =============================================================================
// URL HELPER FUNCTIONS
// =============================================================================
// Simple, clean URL generation - no environment checks needed!

// -----------------------------------------------------------------------------
// MARKETING CONTEXT URLs (Public Website)
// -----------------------------------------------------------------------------
export const getMarketingUrl = (path: string = '') => `/marketing${path}`;
export const getLandingUrl = () => '/marketing';
export const getPricingUrl = () => '/marketing/pricing';
export const getV2LandingUrl = () => '/marketing/v2-sparrow-jot';

// -----------------------------------------------------------------------------
// APP CONTEXT URLs (Authentication Required)
// -----------------------------------------------------------------------------
export const getLoginUrl = (redirect?: string) => {
  const url = '/app/login';
  return redirect ? `${url}?redirect=${encodeURIComponent(redirect)}` : url;
};

export const getSignupUrl = (redirect?: string) => {
  const url = '/app/signup';
  return redirect ? `${url}?redirect=${encodeURIComponent(redirect)}` : url;
};

export const getOnboardingUrl = () => '/app/onboarding';

export const getWorkspaceUrl = (workspaceSlug: string) => `/app/${workspaceSlug}/dashboard`;

export const getFormsListUrl = (workspaceSlug: string) => `/app/${workspaceSlug}/forms`;

export const getFormEditorUrl = (workspaceSlug: string, formId: string) =>
  `/app/${workspaceSlug}/forms/${formId}`;

export const getWorkspaceSettingsUrl = (workspaceSlug: string) => `/app/${workspaceSlug}/settings`;

export const getMembersUrl = (workspaceSlug: string) => `/app/${workspaceSlug}/members`;

// -----------------------------------------------------------------------------
// FORMS CONTEXT URLs (Public Access)
// -----------------------------------------------------------------------------
export const getPublicFormUrl = (workspaceSlug: string, formId: string) =>
  `/forms/${workspaceSlug}/${formId}`;

// -----------------------------------------------------------------------------
// UTILITY FUNCTIONS
// -----------------------------------------------------------------------------

/**
 * Check if current page is in a specific context
 */
export const isMarketingContext = () => getContext() === 'marketing';
export const isAppContext = () => getContext() === 'app';
export const isFormsContext = () => getContext() === 'forms';

/**
 * Get context-appropriate navigation items
 */
export function getContextNavigation(context: Context) {
  switch (context) {
    case 'marketing':
      return [
        { label: 'Pricing', href: getPricingUrl() },
        { label: 'Features', href: getMarketingUrl('/features') },
        { label: 'About', href: getMarketingUrl('/about') },
        { label: 'Login', href: getLoginUrl() },
        { label: 'Sign Up', href: getSignupUrl() },
      ];

    case 'app':
      return [
        { label: 'Dashboard', href: '#' }, // Will be filled by workspace context
        { label: 'Forms', href: '#' },
        { label: 'Settings', href: '#' },
        { label: 'Members', href: '#' },
      ];

    case 'forms':
      return []; // Forms context typically has no navigation

    default:
      return [];
  }
}

/**
 * Generate breadcrumbs based on current path
 */
export function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const context = getContextFromPath(pathname);

  const breadcrumbs = [
    { label: context.charAt(0).toUpperCase() + context.slice(1), href: `/${context}` },
  ];

  // Add additional segments based on path
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    const href = '/' + segments.slice(0, i + 1).join('/');

    breadcrumbs.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href,
    });
  }

  return breadcrumbs;
}

/**
 * Check if a URL belongs to a specific context
 */
export function isUrlInContext(url: string, context: Context): boolean {
  const urlContext = getContextFromPath(new URL(url, 'http://localhost').pathname);
  return urlContext === context;
}
