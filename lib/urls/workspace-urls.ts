// URL helper functions for workspace navigation
// Safe to import in client components (no database dependencies)

import { 
  getWorkspaceUrl as getBaseWorkspaceUrl,
  getWorkspaceSettingsUrl as getBaseWorkspaceSettingsUrl,
  getMembersUrl as getBaseMembersUrl,
  getFormsListUrl,
  getFormEditorUrl as getBaseFormEditorUrl,
  getPublicFormUrl as getBasePublicFormUrl,
  getMarketingUrl as getBaseMarketingUrl
} from '@/lib/context';

// Workspace URLs (app context)
export function getWorkspaceUrl(workspaceSlug: string, path: string = ''): string {
  if (path) {
    return `/app/${workspaceSlug}${path.startsWith('/') ? path : '/' + path}`;
  }
  return getBaseWorkspaceUrl(workspaceSlug);
}

export function getWorkspaceDashboardUrl(workspaceSlug: string): string {
  return `/app/${workspaceSlug}/dashboard`;
}

export function getFormsUrl(workspaceSlug: string): string {
  return getFormsListUrl(workspaceSlug);
}

export function getFormEditorUrl(workspaceSlug: string, formId: string): string {
  return getBaseFormEditorUrl(workspaceSlug, formId);
}

export function getWorkspaceSettingsUrl(workspaceSlug: string): string {
  return getBaseWorkspaceSettingsUrl(workspaceSlug);
}

export function getMembersUrl(workspaceSlug: string): string {
  return getBaseMembersUrl(workspaceSlug);
}

export function getTemplatesUrl(workspaceSlug: string): string {
  return `/app/${workspaceSlug}/templates`;
}

export function getResponsesUrl(workspaceSlug: string, formId?: string): string {
  if (formId) {
    return `/app/${workspaceSlug}/forms/${formId}/responses`;
  }
  return `/app/${workspaceSlug}/responses`;
}

// Form URLs (forms context)
export function getPublicFormUrl(workspaceSlug: string, formId: string): string {
  return getBasePublicFormUrl(workspaceSlug, formId);
}

// Marketing URLs
export function getMarketingUrl(path: string = ''): string {
  return getBaseMarketingUrl(path);
}

// Switch workspace helper (client-safe)
export function buildWorkspaceSwitchUrl(workspaceSlug: string): string {
  return getBaseWorkspaceUrl(workspaceSlug);
}
