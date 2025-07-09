import { createId } from '@paralleldrive/cuid2';
import { eq, and } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { workspaceMembers, workspaceActivities } from '@/drizzle/schema';

export type Role = 'owner' | 'admin' | 'member' | 'viewer';

export interface Permission {
  resource: string;
  action: string;
}

// Define role permissions (hardcoded for MVP)
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: [
    { resource: 'workspace', action: '*' },
    { resource: 'forms', action: '*' },
    { resource: 'responses', action: '*' },
    { resource: 'members', action: '*' },
    { resource: 'billing', action: '*' },
    { resource: 'activities', action: 'read' },
    { resource: 'templates', action: 'create' },
    { resource: 'templates', action: 'edit' },
    { resource: 'templates', action: 'delete' },
  ],
  admin: [
    { resource: 'workspace', action: 'read' },
    { resource: 'workspace', action: 'update' },
    { resource: 'forms', action: '*' },
    { resource: 'responses', action: '*' },
    { resource: 'members', action: 'read' },
    { resource: 'members', action: 'invite' },
    { resource: 'members', action: 'update' },
    { resource: 'activities', action: 'read' },
    { resource: 'templates', action: 'create' },
    { resource: 'templates', action: 'edit' },
    { resource: 'templates', action: 'delete' },
  ],
  member: [
    { resource: 'workspace', action: 'read' },
    { resource: 'forms', action: 'create' },
    { resource: 'forms', action: 'read' },
    { resource: 'forms', action: 'update' }, // own forms only
    { resource: 'responses', action: 'read' }, // own forms only
    { resource: 'responses', action: 'export' }, // own forms only
  ],
  viewer: [
    { resource: 'workspace', action: 'read' },
    { resource: 'forms', action: 'read' },
    { resource: 'responses', action: 'read' },
  ],
};

export function hasPermission(role: Role, resource: string, action: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];

  return permissions.some(
    permission =>
      (permission.resource === resource || permission.resource === '*') &&
      (permission.action === action || permission.action === '*')
  );
}

// Convenience functions for common permission checks
export function canAccessWorkspace(userRole: Role): boolean {
  return hasPermission(userRole, 'workspace', 'read');
}

export function canManageForms(userRole: Role): boolean {
  return hasPermission(userRole, 'forms', 'create');
}

export function canInviteMembers(userRole: Role): boolean {
  return hasPermission(userRole, 'members', 'invite');
}

export function canManageWorkspace(userRole: Role): boolean {
  return hasPermission(userRole, 'workspace', 'update');
}

export function canManageBilling(userRole: Role): boolean {
  return hasPermission(userRole, 'billing', 'manage');
}

export function canViewActivities(userRole: Role): boolean {
  return hasPermission(userRole, 'activities', 'read');
}

// Get user's role in a workspace
export async function getUserWorkspaceRole(
  userId: string,
  workspaceId: string
): Promise<Role | null> {
  const member = await db.query.workspaceMembers.findFirst({
    where: and(eq(workspaceMembers.userId, userId), eq(workspaceMembers.workspaceId, workspaceId)),
  });

  return (member?.role as Role) || null;
}

// Check if user can perform action on resource in workspace
export async function checkWorkspacePermission(
  userId: string,
  workspaceId: string,
  resource: string,
  action: string
): Promise<boolean> {
  const role = await getUserWorkspaceRole(userId, workspaceId);
  if (!role) {return false;}

  return hasPermission(role, resource, action);
}

// Log workspace activity
export async function logWorkspaceActivity(
  workspaceId: string,
  userId: string,
  action: string,
  resource: string,
  resourceId?: string,
  metadata?: Record<string, any>,
  request?: Request
) {
  const now = new Date();

  // Extract IP and User-Agent from request if available
  const ipAddress =
    request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || 'unknown';

  const userAgent = request?.headers.get('user-agent') || 'unknown';

  await db.insert(workspaceActivities).values({
    id: createId(),
    workspaceId,
    userId,
    action,
    resource,
    resourceId,
    metadata: metadata ? JSON.stringify(metadata) : null,
    ipAddress,
    userAgent,
    createdAt: now,
  });
}

// Common activity logging helpers
export const ActivityLogger = {
  formCreated: async (
    workspaceId: string,
    userId: string,
    formId: string,
    formTitle: string,
    request?: Request
  ) => {
    await logWorkspaceActivity(
      workspaceId,
      userId,
      'form.created',
      'form',
      formId,
      { title: formTitle },
      request
    );
  },

  formUpdated: async (
    workspaceId: string,
    userId: string,
    formId: string,
    changes: Record<string, any>,
    request?: Request
  ) => {
    await logWorkspaceActivity(
      workspaceId,
      userId,
      'form.updated',
      'form',
      formId,
      { changes },
      request
    );
  },

  formDeleted: async (
    workspaceId: string,
    userId: string,
    formId: string,
    formTitle: string,
    request?: Request
  ) => {
    await logWorkspaceActivity(
      workspaceId,
      userId,
      'form.deleted',
      'form',
      formId,
      { title: formTitle },
      request
    );
  },

  formPublished: async (
    workspaceId: string,
    userId: string,
    formId: string,
    formTitle: string,
    request?: Request
  ) => {
    await logWorkspaceActivity(
      workspaceId,
      userId,
      'form.published',
      'form',
      formId,
      { title: formTitle },
      request
    );
  },

  memberInvited: async (
    workspaceId: string,
    userId: string,
    invitedEmail: string,
    role: string,
    request?: Request
  ) => {
    await logWorkspaceActivity(
      workspaceId,
      userId,
      'member.invited',
      'member',
      undefined,
      { email: invitedEmail, role },
      request
    );
  },

  memberJoined: async (
    workspaceId: string,
    userId: string,
    joinedUserId: string,
    role: string,
    request?: Request
  ) => {
    await logWorkspaceActivity(
      workspaceId,
      userId,
      'member.joined',
      'member',
      joinedUserId,
      { role },
      request
    );
  },

  memberRemoved: async (
    workspaceId: string,
    userId: string,
    removedUserId: string,
    request?: Request
  ) => {
    await logWorkspaceActivity(
      workspaceId,
      userId,
      'member.removed',
      'member',
      removedUserId,
      {},
      request
    );
  },

  workspaceUpdated: async (
    workspaceId: string,
    userId: string,
    changes: Record<string, any>,
    request?: Request
  ) => {
    await logWorkspaceActivity(
      workspaceId,
      userId,
      'workspace.updated',
      'workspace',
      workspaceId,
      { changes },
      request
    );
  },
};

// Role hierarchy for comparisons (higher number = more permissions)
const ROLE_HIERARCHY: Record<Role, number> = {
  viewer: 1,
  member: 2,
  admin: 3,
  owner: 4,
};

export function isRoleHigherOrEqual(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canManageRole(managerRole: Role, targetRole: Role): boolean {
  // Owners can manage all roles
  if (managerRole === 'owner') {return true;}

  // Admins can manage members and viewers but not other admins or owners
  if (managerRole === 'admin') {
    return targetRole === 'member' || targetRole === 'viewer';
  }

  // Members and viewers cannot manage any roles
  return false;
}
