import { auth, currentUser } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

import {
  getUserSubscription,
  getUserPlanLimits,
  canCreateWorkspace,
  getWorkspaceMemberUsage,
  getWorkspaceUsage,
  PLAN_CONFIGS,
  type Plan,
} from '@/lib/plans';
import type {
  BootstrapData,
  BootstrapUserData,
  BootstrapCurrentWorkspaceData,
  BootstrapWorkspaceLimitsData,
  BootstrapSeatLimitsData,
  BootstrapFeaturesData,
  BootstrapAbilitiesData,
} from '@/lib/types/bootstrap';
import {
  getWorkspaceBySlug,
  getUserDefaultWorkspace,
} from '@/lib/workspace-server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clerkUser = await currentUser();
    const url = new URL(request.url);
    const workspaceSlug = url.searchParams.get('workspaceSlug');

    // 1. User Data
    const subscription = await getUserSubscription(userId);
    const userPlan: Plan = subscription?.plan || 'starter';

    const userData: BootstrapUserData = {
      id: userId,
      email: clerkUser?.emailAddresses[0]?.emailAddress || null,
      firstName: clerkUser?.firstName || null,
      lastName: clerkUser?.lastName || null,
      profileImageUrl: clerkUser?.imageUrl || null,
      plan: userPlan,
      subscriptionStatus: subscription?.status || (userPlan === 'starter' ? 'active' : null), // Starter is active by default
    };

    // 2. Current Workspace Data
    let currentWorkspace: BootstrapCurrentWorkspaceData = null; // Type is WorkspaceWithRole | null
    if (workspaceSlug) {
      currentWorkspace = await getWorkspaceBySlug(workspaceSlug);
    } else {
      currentWorkspace = await getUserDefaultWorkspace();
    }

    // 3. Workspace Limits Data
    const planLimits = await getUserPlanLimits(userId); // PlanLimits type from lib/plans
    const canCreate = await canCreateWorkspace(userId);
    const usage = await getWorkspaceUsage(userId); // For currentWorkspacesOwned

    const workspaceLimitsData: BootstrapWorkspaceLimitsData = {
      maxWorkspaces: planLimits.maxWorkspaces,
      currentWorkspacesOwned: usage ? usage.workspaces.used : 0,
      canCreateMoreWorkspaces: canCreate.allowed,
    };

    // 4. Seat Limits Data
    let seatLimitsData: BootstrapSeatLimitsData | null = null;
    if (currentWorkspace) {
      const memberUsage = await getWorkspaceMemberUsage(currentWorkspace.id, userId);
      if (memberUsage) {
        seatLimitsData = {
          maxSeats: memberUsage.members.limit,
          currentSeats: memberUsage.members.used,
          canInviteMoreMembers:
            memberUsage.members.limit === -1 ||
            memberUsage.members.used < memberUsage.members.limit,
        };
      }
    }

    // 5. Features Data
    const featuresData: BootstrapFeaturesData = {
      canInviteUsersToAnyWorkspace: PLAN_CONFIGS[userPlan].canInviteUsers,
    };

    // 6. Abilities Data
    let abilitiesData: BootstrapAbilitiesData | null = null;
    if (currentWorkspace && currentWorkspace.role) {
      const role = currentWorkspace.role;
      abilitiesData = {
        canManageWorkspaceSettings: role === 'owner' || role === 'admin',
        canManageMembers: role === 'owner' || role === 'admin',
        canDeleteWorkspace: role === 'owner',
      };
    }

    // 7. Compile BootstrapData
    const bootstrapResponseData: BootstrapData = {
      user: userData,
      currentWorkspace,
      workspaceLimits: workspaceLimitsData,
      seatLimits: seatLimitsData,
      features: featuresData,
      abilities: abilitiesData,
    };

    return NextResponse.json(bootstrapResponseData);
  } catch (error) {
    console.error('Error fetching bootstrap data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
