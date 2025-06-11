import { db } from '@/drizzle/db';
import { subscriptions, workspaces, workspaceMembers } from '@/drizzle/schema';
import { eq, and, count } from 'drizzle-orm';
import { auth } from '@clerk/nextjs';

export type Plan = 'starter' | 'pro' | 'enterprise';

export interface PlanLimits {
  maxWorkspaces: number; // -1 for unlimited
  maxSeatsPerWorkspace: number; // -1 for unlimited
  canInviteUsers: boolean;
  addonSeatsAvailable: boolean;
}

export const PLAN_CONFIGS: Record<Plan, PlanLimits> = {
  starter: {
    maxWorkspaces: 1,
    maxSeatsPerWorkspace: 1,
    canInviteUsers: false,
    addonSeatsAvailable: false,
  },
  pro: {
    maxWorkspaces: 3,
    maxSeatsPerWorkspace: 5,
    canInviteUsers: true,
    addonSeatsAvailable: true,
  },
  enterprise: {
    maxWorkspaces: -1, // unlimited
    maxSeatsPerWorkspace: -1, // unlimited
    canInviteUsers: true,
    addonSeatsAvailable: true,
  },
};

// Get user's subscription with plan details
export async function getUserSubscription(userId?: string) {
  const { userId: authUserId } = auth();
  const targetUserId = userId || authUserId;
  
  if (!targetUserId) return null;

  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, targetUserId),
  });

  return subscription;
}

// Get plan limits for a user
export async function getUserPlanLimits(userId?: string): Promise<PlanLimits> {
  const subscription = await getUserSubscription(userId);
  
  if (!subscription) {
    // Default to starter plan if no subscription found
    return PLAN_CONFIGS.starter;
  }

  // Use database values if they exist, otherwise fall back to plan config
  return {
    maxWorkspaces: subscription.maxWorkspaces ?? PLAN_CONFIGS[subscription.plan].maxWorkspaces,
    maxSeatsPerWorkspace: subscription.maxSeatsPerWorkspace ?? PLAN_CONFIGS[subscription.plan].maxSeatsPerWorkspace,
    canInviteUsers: PLAN_CONFIGS[subscription.plan].canInviteUsers,
    addonSeatsAvailable: PLAN_CONFIGS[subscription.plan].addonSeatsAvailable,
  };
}

// Check if user can create a new workspace
export async function canCreateWorkspace(userId?: string): Promise<{ allowed: boolean; reason?: string }> {
  const { userId: authUserId } = auth();
  const targetUserId = userId || authUserId;
  
  if (!targetUserId) {
    return { allowed: false, reason: 'User not authenticated' };
  }

  const planLimits = await getUserPlanLimits(targetUserId);
  
  if (planLimits.maxWorkspaces === -1) {
    return { allowed: true }; // Unlimited
  }

  // Count current workspaces
  const workspaceCount = await db
    .select({ count: count() })
    .from(workspaces)
    .where(eq(workspaces.ownerId, targetUserId));

  const currentCount = workspaceCount[0]?.count || 0;

  if (currentCount >= planLimits.maxWorkspaces) {
    return { 
      allowed: false, 
      reason: `You've reached your workspace limit of ${planLimits.maxWorkspaces}. Upgrade your plan to create more workspaces.` 
    };
  }

  return { allowed: true };
}

// Check if user can invite members to a workspace
export async function canInviteToWorkspace(
  workspaceId: string, 
  userId?: string
): Promise<{ allowed: boolean; reason?: string; availableSeats?: number }> {
  const { userId: authUserId } = auth();
  const targetUserId = userId || authUserId;
  
  if (!targetUserId) {
    return { allowed: false, reason: 'User not authenticated' };
  }

  const planLimits = await getUserPlanLimits(targetUserId);
  
  if (!planLimits.canInviteUsers) {
    return { 
      allowed: false, 
      reason: 'Your plan does not support inviting team members. Upgrade to Pro or Enterprise to add team members.' 
    };
  }

  if (planLimits.maxSeatsPerWorkspace === -1) {
    return { allowed: true }; // Unlimited
  }

  // Count current members
  const memberCount = await db
    .select({ count: count() })
    .from(workspaceMembers)
    .where(eq(workspaceMembers.workspaceId, workspaceId));

  const currentMembers = memberCount[0]?.count || 0;
  
  // Get addon seats for this user
  const subscription = await getUserSubscription(targetUserId);
  const addonSeats = subscription?.addonSeats || 0;
  const totalSeats = planLimits.maxSeatsPerWorkspace + addonSeats;

  if (currentMembers >= totalSeats) {
    const upgradeMessage = planLimits.addonSeatsAvailable 
      ? `You've reached your seat limit of ${totalSeats}. Purchase additional seats or upgrade your plan.`
      : `You've reached your seat limit of ${totalSeats}. Upgrade to a higher plan to add more members.`;
      
    return { 
      allowed: false, 
      reason: upgradeMessage,
      availableSeats: 0 
    };
  }

  return { 
    allowed: true, 
    availableSeats: totalSeats - currentMembers 
  };
}

// Get workspace usage statistics
export async function getWorkspaceUsage(userId?: string) {
  const { userId: authUserId } = auth();
  const targetUserId = userId || authUserId;
  
  if (!targetUserId) return null;

  const [planLimits, userWorkspaces] = await Promise.all([
    getUserPlanLimits(targetUserId),
    db.select({ count: count() })
      .from(workspaces)
      .where(eq(workspaces.ownerId, targetUserId))
  ]);

  const workspaceCount = userWorkspaces[0]?.count || 0;

  return {
    workspaces: {
      used: workspaceCount,
      limit: planLimits.maxWorkspaces,
      unlimited: planLimits.maxWorkspaces === -1,
    },
    planLimits,
  };
}

// Check workspace member limits for a specific workspace
export async function getWorkspaceMemberUsage(workspaceId: string, userId?: string) {
  const { userId: authUserId } = auth();
  const targetUserId = userId || authUserId;
  
  if (!targetUserId) return null;

  const [planLimits, memberCount, subscription] = await Promise.all([
    getUserPlanLimits(targetUserId),
    db.select({ count: count() })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, workspaceId)),
    getUserSubscription(targetUserId)
  ]);

  const currentMembers = memberCount[0]?.count || 0;
  const addonSeats = subscription?.addonSeats || 0;
  const totalSeats = planLimits.maxSeatsPerWorkspace === -1 
    ? -1 
    : planLimits.maxSeatsPerWorkspace + addonSeats;

  return {
    members: {
      used: currentMembers,
      limit: totalSeats,
      unlimited: totalSeats === -1,
      addonSeats,
    },
    planLimits,
  };
}

// Utility to create default subscription for new users
export async function createDefaultSubscription(userId: string) {
  const existingSubscription = await getUserSubscription(userId);
  if (existingSubscription) return existingSubscription;

  const newSubscription = await db.insert(subscriptions).values({
    userId,
    plan: 'starter',
    status: 'active',
    maxWorkspaces: PLAN_CONFIGS.starter.maxWorkspaces,
    maxSeatsPerWorkspace: PLAN_CONFIGS.starter.maxSeatsPerWorkspace,
    addonSeats: 0,
    addonPricePerSeat: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();

  return newSubscription[0];
}
