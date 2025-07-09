import { auth } from '@clerk/nextjs';
import { createId } from '@paralleldrive/cuid2';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/drizzle/db';
import { workspaceInvitations, workspaceMembers, users } from '@/drizzle/schema';
import { sendWelcomeEmail } from '@/lib/email';
import { ActivityLogger } from '@/lib/rbac';
import { getWorkspaceUrl } from '@/lib/workspace-server';

// GET - Validate invitation token and get invitation details
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Invitation token is required' }, { status: 400 });
    }

    // Find invitation by token
    const invitation = await db.query.workspaceInvitations.findFirst({
      where: eq(workspaceInvitations.token, token),
      with: {
        workspace: {
          columns: {
            id: true,
            name: true,
            slug: true,
            description: true,
            avatarUrl: true,
          },
        },
        inviter: {
          columns: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invalid invitation token' }, { status: 404 });
    }

    // Check if invitation is expired
    if (new Date() > new Date(invitation.expiresAt)) {
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 410 });
    }

    // Check if invitation is still pending
    if (invitation.status !== 'pending') {
      return NextResponse.json({ error: 'Invitation is no longer valid' }, { status: 410 });
    }

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        workspace: invitation.workspace,
        inviter: invitation.inviter,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.error('Error validating invitation:', error);
    return NextResponse.json({ error: 'Failed to validate invitation' }, { status: 500 });
  }
}

// POST - Accept invitation
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { token, userDetails } = body;

    if (!token) {
      return NextResponse.json({ error: 'Invitation token is required' }, { status: 400 });
    }

    // Find invitation by token
    const invitation = await db.query.workspaceInvitations.findFirst({
      where: eq(workspaceInvitations.token, token),
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invalid invitation token' }, { status: 404 });
    }

    // Check if invitation is expired
    if (new Date() > new Date(invitation.expiresAt)) {
      // Update invitation status to expired
      await db
        .update(workspaceInvitations)
        .set({ status: 'expired', updatedAt: new Date() })
        .where(eq(workspaceInvitations.id, invitation.id));

      return NextResponse.json({ error: 'Invitation has expired' }, { status: 410 });
    }

    // Check if invitation is still pending
    if (invitation.status !== 'pending') {
      return NextResponse.json({ error: 'Invitation is no longer valid' }, { status: 410 });
    }

    // Get current user from auth
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    // If user doesn't exist, create them (this handles new signups via invitation)
    if (!currentUser && userDetails) {
      await db.insert(users).values({
        id: userId,
        email: userDetails.email || invitation.email,
        firstName: userDetails.firstName || '',
        lastName: userDetails.lastName || '',
        username: userDetails.username || '',
        avatarUrl: userDetails.avatarUrl || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Check if user is already a member of the workspace
    const existingMember = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, invitation.workspaceId),
        eq(workspaceMembers.userId, userId)
      ),
    });

    if (existingMember) {
      // Update invitation status to accepted
      await db
        .update(workspaceInvitations)
        .set({ status: 'accepted', updatedAt: new Date() })
        .where(eq(workspaceInvitations.id, invitation.id));

      return NextResponse.json(
        { error: 'You are already a member of this workspace' },
        { status: 409 }
      );
    }

    const now = new Date();

    // Add user to workspace
    const newMember = await db
      .insert(workspaceMembers)
      .values({
        id: createId(),
        workspaceId: invitation.workspaceId,
        userId,
        role: invitation.role,
        invitedBy: invitation.invitedBy,
        invitedAt: invitation.createdAt,
        joinedAt: now,
        lastSeenAt: now,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Update invitation status to accepted
    await db
      .update(workspaceInvitations)
      .set({ status: 'accepted', updatedAt: now })
      .where(eq(workspaceInvitations.id, invitation.id));

    // Log activity
    await ActivityLogger.memberJoined(
      invitation.workspaceId,
      invitation.invitedBy,
      userId,
      invitation.role,
      req
    );

    // console.log('✅ Invitation accepted:', {
    //   invitationId: invitation.id,
    //   workspaceId: invitation.workspaceId,
    //   userId,
    //   role: invitation.role,
    // });

    // Get workspace details for response
    const workspace = await db.query.workspaces.findFirst({
      where: (workspaces, { eq }) => eq(workspaces.id, invitation.workspaceId),
      columns: {
        id: true,
        name: true,
        slug: true,
      },
    });

    // Send welcome email to new member
    if (workspace && currentUser) {
      const userName = currentUser.firstName || currentUser.email.split('@')[0] || 'there';
      const workspaceUrl = getWorkspaceUrl(workspace.slug);

      await sendWelcomeEmail({
        userName,
        workspaceName: workspace.name,
        workspaceUrl,
      });
    }

    return NextResponse.json({
      success: true,
      member: newMember[0],
      workspace,
      message: 'Successfully joined the workspace',
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json({ error: 'Failed to accept invitation' }, { status: 500 });
  }
}
