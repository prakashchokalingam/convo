// URL helper functions for workspace navigation
// Safe to import in client components (no database dependencies)

import { buildContextUrl } from '@/lib/subdomain';

// Workspace URLs (app context)
export function getWorkspaceUrl(workspaceSlug: string, path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return buildContextUrl('app', `/${workspaceSlug}${cleanPath}`);
}

export function getWorkspaceDashboardUrl(workspaceSlug: string): string {
  return buildContextUrl('app', `/${workspaceSlug}`);
}

export function getFormsUrl(workspaceSlug: string): string {
  return buildContextUrl('app', `/${workspaceSlug}/forms`);
}

export function getFormEditorUrl(workspaceSlug: string, formId: string): string {
  return buildContextUrl('app', `/${workspaceSlug}/forms/${formId}`);
}

export function getWorkspaceSettingsUrl(workspaceSlug: string): string {
  return buildContextUrl('app', `/${workspaceSlug}/settings`);
}

export function getMembersUrl(workspaceSlug: string): string {
  return buildContextUrl('app', `/${workspaceSlug}/members`);
}

export function getTemplatesUrl(workspaceSlug: string): string {
  return buildContextUrl('app', `/${workspaceSlug}/templates`);
}

export function getResponsesUrl(workspaceSlug: string, formId?: string): string {
  if (formId) {
    return buildContextUrl('app', `/${workspaceSlug}/forms/${formId}/responses`);
  }
  return buildContextUrl('app', `/${workspaceSlug}/responses`);
}

// Form URLs (forms context)
export function getPublicFormUrl(workspaceSlug: string, formId: string): string {
  return buildContextUrl('forms', `/${workspaceSlug}/${formId}`);
}

// Marketing URLs
export function getMarketingUrl(path: string = ''): string {
  return buildContextUrl('marketing', path);
}

// Switch workspace helper (client-safe)
export function buildWorkspaceSwitchUrl(workspaceSlug: string): string {
  return buildContextUrl('app', `/${workspaceSlug}`);
}
