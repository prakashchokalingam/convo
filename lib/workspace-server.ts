// IMPORTANT: This file contains server-side code only.
// Do not import this file into client components.

import { db } from '@/lib/db';
import { workspaces, workspaceMembers, users } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
// import { cache } from 'react'; // Removed React.cache import
import { createId } from '@paralleldrive/cuid2';
import type { WorkspaceWithRole, WorkspaceRole } from '@/lib/types/workspace';
import { getWorkspaceUrl } from '@/lib/context';

// Get all workspaces accessible by current user
export const getCurrentUserWorkspaces = async (): Promise<WorkspaceWithRole[]> => {
  try {
    const { userId } = auth();
    if (!userId) return [];

    const userWorkspaces = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        slug: workspaces.slug,
        type: workspaces.type,
        ownerId: workspaces.ownerId,
        description: workspaces.description,
        avatarUrl: workspaces.avatarUrl,
        settings: workspaces.settings,
        role: workspaceMembers.role,
        createdAt: workspaces.createdAt,
        updatedAt: workspaces.updatedAt,
      })
      .from(workspaces)
      .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(eq(workspaceMembers.userId, userId))
      .orderBy(desc(workspaces.createdAt));

    return userWorkspaces as WorkspaceWithRole[];
  } catch (error) {
    console.error('Error getting user workspaces:', error);
    return [];
  }
};

// Get user's default workspace
export const getUserDefaultWorkspace = async (): Promise<WorkspaceWithRole | null> => {
  try {
    const { userId } = auth();
    if (!userId) return null;

    // First try to find a default workspace owned by the user
    const defaultWorkspace = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        slug: workspaces.slug,
        type: workspaces.type,
        ownerId: workspaces.ownerId,
        description: workspaces.description,
        avatarUrl: workspaces.avatarUrl,
        settings: workspaces.settings,
        role: workspaceMembers.role,
        createdAt: workspaces.createdAt,
        updatedAt: workspaces.updatedAt,
      })
      .from(workspaces)
      .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(
        and(
          eq(workspaceMembers.userId, userId),
          eq(workspaces.type, 'default'),
          eq(workspaces.ownerId, userId)
        )
      )
      .limit(1);

    if (defaultWorkspace[0]) {
      return defaultWorkspace[0] as WorkspaceWithRole;
    }

    // If no default workspace found, fall back to any workspace the user has access to
    const anyWorkspace = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        slug: workspaces.slug,
        type: workspaces.type,
        ownerId: workspaces.ownerId,
        description: workspaces.description,
        avatarUrl: workspaces.avatarUrl,
        settings: workspaces.settings,
        role: workspaceMembers.role,
        createdAt: workspaces.createdAt,
        updatedAt: workspaces.updatedAt,
      })
      .from(workspaces)
      .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(eq(workspaceMembers.userId, userId))
      .orderBy(desc(workspaces.createdAt))
      .limit(1);

    return anyWorkspace[0] as WorkspaceWithRole || null;
  } catch (error) {
    console.error('Error getting default workspace:', error);
    return null;
  }
};

// Get workspace by slug with user access check
export const getWorkspaceBySlug = async (slug: string): Promise<WorkspaceWithRole | null> => {
  try {
    const { userId } = auth();
    if (!userId) return null;

    const workspace = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        slug: workspaces.slug,
        type: workspaces.type,
        ownerId: workspaces.ownerId,
        description: workspaces.description,
        avatarUrl: workspaces.avatarUrl,
        settings: workspaces.settings,
        role: workspaceMembers.role,
        createdAt: workspaces.createdAt,
        updatedAt: workspaces.updatedAt,
      })
      .from(workspaces)
      .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(
        and(
          eq(workspaces.slug, slug),
          eq(workspaceMembers.userId, userId)
        )
      )
      .limit(1);

    return workspace[0] as WorkspaceWithRole || null;
  } catch (error) {
    console.error('Error getting workspace by slug:', error);
    return null;
  }
};

// Get current workspace from URL context
export async function getCurrentWorkspace(workspaceSlug?: string): Promise<WorkspaceWithRole> {
  try {
    // If no workspace slug provided, get user's default workspace
    if (!workspaceSlug) {
      const defaultWorkspace = await getUserDefaultWorkspace();
      if (!defaultWorkspace) {
        redirect('/app/onboarding');
      }
      return defaultWorkspace;
    }

    // Get workspace by slug
    const workspace = await getWorkspaceBySlug(workspaceSlug);
    if (!workspace) {
      // User doesn't have access to this workspace or it doesn't exist
      console.error(`Workspace not found for slug: ${workspaceSlug}`);
      redirect('/app/onboarding');
    }

    return workspace;
  } catch (error) {
    console.error('Error getting current workspace:', error);
    // If there's an auth error, redirect to login
    redirect('/app/onboarding');
  }
}

// Switch workspace helper
export function switchToWorkspace(workspaceSlug: string) {
  const url = getWorkspaceUrl(workspaceSlug);
  redirect(url);
}

// Validate workspace access middleware
export async function validateWorkspaceAccess(
  workspaceSlug: string,
  requiredRole?: WorkspaceRole
): Promise<WorkspaceWithRole> {
  const workspace = await getWorkspaceBySlug(workspaceSlug);
  
  if (!workspace) {
    redirect('/app/onboarding');
  }

  // Check role requirement if specified
  if (requiredRole) {
    const roleHierarchy = { viewer: 1, member: 2, admin: 3, owner: 4 };
    const userRoleLevel = roleHierarchy[workspace.role];
    const requiredRoleLevel = roleHierarchy[requiredRole];
    
    if (userRoleLevel < requiredRoleLevel) {
      redirect(getWorkspaceUrl(workspaceSlug));
    }
  }

  return workspace;
}

// Workspace creation helper
export async function createWorkspace(data: {
  name: string;
  slug: string;
  description?: string;
  type?: 'default' | 'team';
}) {
  const { userId } = auth();
  if (!userId) throw new Error('Not authenticated');

  const workspace = await db.insert(workspaces).values({
    id: createId(),
    name: data.name,
    slug: data.slug,
    type: data.type || 'team',
    ownerId: userId,
    description: data.description || null,
    settings: JSON.stringify({
      theme: 'light',
      timezone: 'UTC',
      notifications: {
        email: true,
        browser: true,
      }
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();

  // Add creator as owner
  await db.insert(workspaceMembers).values({
    workspaceId: workspace[0].id,
    userId,
    role: 'owner',
    joinedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return workspace[0];
}

// Email-to-slug generation utilities for automatic onboarding
export async function generateWorkspaceSlugFromEmail(email: string): Promise<string> {
  const [username, domain] = email.split('@');
  let baseSlug = cleanSlugFromUsername(username);
  
  // Add domain for generic terms to make slug more unique
  if (isGenericTerm(baseSlug)) {
    const domainPart = cleanSlugFromUsername(domain.split('.')[0]);
    baseSlug = `${baseSlug}-${domainPart}`;
  }
  
  // Try base slug first
  if (await isSlugAvailable(baseSlug)) {
    return baseSlug;
  }
  
  // Try numbered versions (reasonable attempts)
  for (let i = 2; i <= 10; i++) {
    const numberedSlug = `${baseSlug}-${i}`;
    if (await isSlugAvailable(numberedSlug)) {
      return numberedSlug;
    }
  }
  
  // Bulletproof fallback: guaranteed unique with random ID
  const randomId = generateRandomId(6);
  return `${baseSlug}-${randomId}`;
}

// Clean username/domain part for slug generation
function cleanSlugFromUsername(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')  // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-')        // Replace multiple hyphens with single
    .replace(/^-|-$/g, '')      // Remove leading/trailing hyphens
    .substring(0, 20);          // Limit length
}

// Check if term is too generic and needs domain suffix
function isGenericTerm(slug: string): boolean {
  const genericTerms = [
    'user', 'admin', 'test', 'demo', 'info', 'contact',
    'hello', 'hi', 'me', 'my', 'app', 'web', 'site'
  ];
  return genericTerms.includes(slug) || slug.length < 3;
}

// Check if workspace slug is available
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const existing = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, slug),
  });
  return !existing;
}

// Generate random ID for bulletproof uniqueness
function generateRandomId(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Workspace count validation functions
export async function getWorkspaceCount(userId: string): Promise<{ default: number; team: number }> {
  const userWorkspaces = await db
    .select({
      type: workspaces.type,
    })
    .from(workspaces)
    .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
    .where(
      and(
        eq(workspaceMembers.userId, userId),
        eq(workspaces.ownerId, userId) // Only count owned workspaces
      )
    );

  const count = { default: 0, team: 0 };
  userWorkspaces.forEach(ws => {
    if (ws.type === 'default') count.default++;
    if (ws.type === 'team') count.team++;
  });

  return count;
}

export async function canCreateDefaultWorkspace(userId: string): Promise<boolean> {
  const count = await getWorkspaceCount(userId);
  return count.default === 0;
}

export async function canCreateTeamWorkspace(userId: string): Promise<boolean> {
  const count = await getWorkspaceCount(userId);
  return count.team < 3;
}

export async function getWorkspaceLimitsInfo(userId: string): Promise<{
  canCreateDefault: boolean;
  canCreateTeam: boolean;
  currentCount: { default: number; team: number };
  limits: { default: number; team: number };
}> {
  const currentCount = await getWorkspaceCount(userId);
  
  return {
    canCreateDefault: currentCount.default === 0,
    canCreateTeam: currentCount.team < 3,
    currentCount,
    limits: { default: 1, team: 3 }
  };
}

// Create workspace from email automatically (for onboarding)
export async function createWorkspaceFromEmail(
  email: string,
  firstName?: string,
  lastName?: string
): Promise<{ slug: string; name: string }> {
  const slug = await generateWorkspaceSlugFromEmail(email);
  
  // Generate workspace name from user info
  const name = firstName 
    ? `${firstName}'s Workspace`
    : `${email.split('@')[0]} Workspace`;
  
  const workspace = await createWorkspace({
    name,
    slug,
    type: 'default',
    description: 'Your default workspace for creating conversational forms'
  });
  
  return {
    slug: workspace.slug,
    name: workspace.name
  };
}

// Admin specific functions
import { clerkClient } from '@clerk/nextjs/server';
import { subscriptions } from '@/lib/db/schema'; // Ensure subscriptions is imported if not already
import type { Workspace } from '@/lib/db/schema';

export interface AdminWorkspaceInfo extends Workspace {
  ownerName: string | null;
  ownerEmail: string | null;
  plan: string;
}

export const getAllWorkspacesForAdmin = async (): Promise<AdminWorkspaceInfo[]> => {
  try {
    const allWorkspaces = await db.select().from(workspaces).orderBy(desc(workspaces.createdAt));

    if (!allWorkspaces.length) {
      return [];
    }

    const augmentedWorkspaces: AdminWorkspaceInfo[] = [];

    for (const ws of allWorkspaces) {
      let ownerName: string | null = 'N/A';
      let ownerEmail: string | null = 'N/A';
      let plan = 'Free'; // Default plan

      // Fetch owner details from Clerk
      if (ws.ownerId) {
        try {
          const owner = await clerkClient.users.getUser(ws.ownerId);
          ownerName = owner.firstName && owner.lastName ? `${owner.firstName} ${owner.lastName}` : (owner.firstName || owner.lastName || null);
          if (!ownerName && owner.username) {
            ownerName = owner.username;
          }
          const primaryEmail = owner.emailAddresses.find(e => e.id === owner.primaryEmailAddressId);
          ownerEmail = primaryEmail ? primaryEmail.emailAddress : (owner.emailAddresses[0]?.emailAddress || 'No primary email');
        } catch (clerkError) {
          console.error(`Failed to fetch owner details for ${ws.ownerId}:`, clerkError);
          ownerName = 'Error fetching user';
          ownerEmail = 'Error fetching user';
        }
      }

      // Fetch subscription plan
      if (ws.ownerId) {
        try {
          const subscription = await db
            .select({ plan: subscriptions.plan })
            .from(subscriptions)
            .where(eq(subscriptions.userId, ws.ownerId))
            .orderBy(desc(subscriptions.createdAt)) // In case of multiple, take the latest
            .limit(1);

          if (subscription.length > 0 && subscription[0].plan) {
            plan = subscription[0].plan;
          }
        } catch (dbError) {
          console.error(`Failed to fetch subscription for owner ${ws.ownerId}:`, dbError);
          plan = 'Error fetching plan';
        }
      }

      augmentedWorkspaces.push({
        ...ws,
        ownerName,
        ownerEmail,
        plan,
      });
    }

    return augmentedWorkspaces;
  } catch (error) {
    console.error('Error getting all workspaces for admin:', error);
    return [];
  }
};
