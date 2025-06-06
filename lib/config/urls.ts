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
const PROD_DOMAIN = process.env.NEXT_PUBLIC_PROD_DOMAIN || 'convoforms.com';
const DEV_PORT = process.env.PORT || '3000';

export const urls = {
  // Website URLs (marketing site)
  website: {
    base: isDevelopment ? `http://localhost:${DEV_PORT}` : `https://${PROD_DOMAIN}`,
    home: '/',
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
  
  // Application URLs (dashboard/app)
  app: {
    base: isDevelopment ? `http://localhost:${DEV_PORT}/app` : `https://app.${PROD_DOMAIN}`,
    signUp: isDevelopment ? '/sign-up' : `https://app.${PROD_DOMAIN}/sign-up`,
    signIn: isDevelopment ? '/sign-in' : `https://app.${PROD_DOMAIN}/sign-in`,
    dashboard: isDevelopment ? '/dashboard' : `https://app.${PROD_DOMAIN}/dashboard`,
    forms: isDevelopment ? '/forms' : `https://app.${PROD_DOMAIN}/forms`,
    analytics: isDevelopment ? '/analytics' : `https://app.${PROD_DOMAIN}/analytics`,
  },
  
  // Form URLs (customer-facing forms)
  forms: {
    base: isDevelopment ? `http://localhost:${DEV_PORT}/form` : `https://form.${PROD_DOMAIN}`,
    view: (formId: string) => isDevelopment ? `/form/${formId}` : `https://form.${PROD_DOMAIN}/${formId}`,
  },
  
  // API URLs
  api: {
    base: isDevelopment ? `http://localhost:${DEV_PORT}/api` : `https://${PROD_DOMAIN}/api`,
  },
  
  // External URLs
  external: {
    twitter: 'https://twitter.com/convoforms',
    linkedin: 'https://linkedin.com/company/convoforms',
    github: 'https://github.com/convoforms',
  }
};

// Helper functions
export const getAppUrl = (path: string = '') => {
  return `${urls.app.base}${path.startsWith('/') ? path : `/${path}`}`;
};

export const getFormUrl = (formId: string) => {
  return urls.forms.view(formId);
};

export const getWebsiteUrl = (path: string = '') => {
  return `${urls.website.base}${path.startsWith('/') ? path : `/${path}`}`;
};

export const getApiUrl = (endpoint: string = '') => {
  return `${urls.api.base}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};