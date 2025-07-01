/**
 * URL Configuration for different environments and subdomains
 * 
 * Project structure:
 * / : website (marketing)
 * app.*.com : application 
 * form.*.com : customer facing form
 */

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Base domains
const PROD_DOMAIN = process.env.NEXT_PUBLIC_PROD_DOMAIN || 'convo.ai'; // Updated to convo.ai
const DEV_PORT = process.env.NEXT_PUBLIC_DEV_PORT || '3002'; // Updated to 3002 and use NEXT_PUBLIC_ prefix for env var

const DEV_BASE_URL = `http://localhost:${DEV_PORT}`;

export const urls = {
  // Base URLs for each context.
  // For specific paths, use buildContextUrl from lib/subdomain.ts, e.g., buildContextUrl('marketing', '/pricing')
  base: {
    development: DEV_BASE_URL,
    production: `https://${PROD_DOMAIN}`, // Marketing production base
    appProduction: `https://app.${PROD_DOMAIN}`,
    formsProduction: `https://forms.${PROD_DOMAIN}`,
  },

  // Static paths (primarily for reference or sitemap, use buildContextUrl for actual links)
  paths: {
    marketing: {
      home: '/', // conceptual root, maps to /marketing in dev
      features: '/features',
      pricing: '/pricing',
      about: '/about',
      contact: '/contact',
      blog: '/blog',
      help: '/help',
      docs: '/docs',
      privacy: '/privacy',
      terms: '/terms',
    },
    app: {
      login: '/login',
      signUp: '/signup',
      onboarding: '/onboarding',
      dashboardBase: '/', // Represents the base of a workspace, e.g., /:workspaceSlug
      formsBase: '/forms', // e.g., /:workspaceSlug/forms
      settingsBase: '/settings', // e.g., /:workspaceSlug/settings
      membersBase: '/members', // e.g., /:workspaceSlug/members
    },
    forms: {
      viewBase: '/', // Represents /:workspaceSlug/:formId for public forms
    },
  },
  
  // API base URLs
  // In this setup, API is not strictly context-path based in dev (e.g. /app/api) but at root /api
  apiBase: {
    development: `${DEV_BASE_URL}/api`,
    production: `https://${PROD_DOMAIN}/api`,
  },

  // External URLs
  external: {
    twitter: 'https://twitter.com/convoforms',
    linkedin: 'https://linkedin.com/company/convoforms',
    github: 'https://github.com/convoforms',
  }
};

// API URL Helper function
// For app, forms, and marketing URLs, please use buildContextUrl or specific helpers from 'lib/subdomain.ts'
export const getApiUrl = (endpoint: string = '') => {
  const base = isDevelopment ? urls.apiBase.development : urls.apiBase.production;
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${normalizedEndpoint === '/' ? '' : normalizedEndpoint}`;
};