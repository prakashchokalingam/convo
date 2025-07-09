import crypto from 'crypto';

import { auth } from '@clerk/nextjs';
import { createId } from '@paralleldrive/cuid2';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/drizzle/db';
import { workspaceInvitations, users } from '@/drizzle/schema';
import {
  withErrorHandling,
  createSuccessResponse,
  ApiError,
  ErrorCodes,
  requireAuth,
  validateRequiredFields,
  requirePermission,
} from '@/lib/api-errors';
import { sendInvitationEmail } from '@/lib/email';
import { canInviteToWorkspace } from '@/lib/plans';
import { checkWorkspacePermission, ActivityLogger } from '@/lib/rbac';


interface InviteParams {
  params: {
    workspaceId: string;
  };
}

export const POST = withErrorHandling(async (req: NextRequest, { params }: InviteParams) => {
  const { userId } = auth();
  requireAuth(userId);

  const { workspaceId } = params;
  const body = await req.json();
  const { email, role = 'member' } = body;

  // Validate required fields
  validateRequiredFields(body, ['email']);

  // Validate role
  const validRoles = ['admin', 'member', 'viewer'];
  if (!validRoles.includes(role)) {
    throw new ApiError(
      'Invalid role. Must be admin, member, or viewer',
      400,
      ErrorCodes.INVALID_FORMAT
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError('Invalid email format', 400, ErrorCodes.INVALID_FORMAT);
  }

  // Check if user has permission to invite members (admin+ required)
  const hasPermission = await checkWorkspacePermission(userId, workspaceId, 'members', 'invite');

  requirePermission(
    hasPermission,
    'You do not have permission to invite members to this workspace'
  );

  // Check plan limits
  const canInvite = await canInviteToWorkspace(workspaceId, userId);
  if (!canInvite.allowed) {
    throw new ApiError(canInvite.reason || 'Plan limit exceeded', 403, ErrorCodes.PLAN_LIMIT_EXCEEDED);
  }

  // Check if user is already a member
  // For now, we'll check by email in invitations
  const existingInvitation = await db.query.workspaceInvitations.findFirst({
    where: and(
      eq(workspaceInvitations.workspaceId, workspaceId),
      eq(workspaceInvitations.email, email),
      eq(workspaceInvitations.status, 'pending')
    ),
  });

  if (existingInvitation) {
    throw new ApiError(
      'User has already been invited to this workspace',
      409,
      ErrorCodes.ALREADY_EXISTS
    );
  }

  // Generate unique invitation token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Invitation expires in 7 days

  // Create invitation
  const invitation = await db
    .insert(workspaceInvitations)
    .values({
      id: createId(),
      workspaceId,
      email: email.toLowerCase(),
      role: role as 'admin' | 'member' | 'viewer',
      invitedBy: userId,
      token,
      expiresAt,
      status: 'pending',
      emailStatus: 'pending',
      emailAttempts: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  // Get workspace and inviter details for email
  const [workspace, inviter] = await Promise.all([
    db.query.workspaces.findFirst({
      where: (workspaces, { eq }) => eq(workspaces.id, workspaceId),
      columns: {
        name: true,
        description: true,
      },
    }),
    db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
      columns: {
        firstName: true,
        lastName: true,
      },
    }),
  ]);

  if (!workspace || !inviter) {
    throw new ApiError('Workspace or inviter not found', 404, ErrorCodes.NOT_FOUND);
  }

  // Send invitation email
  const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/invite?token=${token}`;
  const inviterName =
    inviter.firstName && inviter.lastName
      ? `${inviter.firstName} ${inviter.lastName}`
      : inviter.firstName || 'A team member';

  const emailResult = await sendInvitationEmail({
    inviteeEmail: email,
    inviterName,
    workspaceName: workspace.name,
    workspaceDescription: workspace.description || undefined,
    role: role as 'admin' | 'member' | 'viewer',
    invitationUrl,
    expiresAt,
  });

  // Update invitation with email status
  const emailStatus = emailResult.success ? 'sent' : 'failed';
  const emailSentAt = emailResult.success ? new Date() : null;
  const emailErrorMessage = emailResult.success ? null : emailResult.error;

  await db
    .update(workspaceInvitations)
    .set({
      emailStatus,
      emailSentAt,
      emailErrorMessage,
      emailAttempts: 1,
      updatedAt: new Date(),
    })
    .where(eq(workspaceInvitations.id, invitation[0].id));

  // Log activity
  await ActivityLogger.memberInvited(workspaceId, userId, email, role, req);

  // console.log('✅ Invitation created:', {
  //   workspaceId,
  //   email,
  //   role,
  //   token,
  //   invitedBy: userId,
  //   emailSent: emailResult.success,
  // });

  return createSuccessResponse(
    {
      invitation: {
        id: invitation[0].id,
        email: invitation[0].email,
        role: invitation[0].role,
        expiresAt: invitation[0].expiresAt,
        emailStatus,
        // Don't return the token for security
      },
    },
    emailResult.success
      ? 'Invitation sent successfully'
      : `Invitation created but email failed to send: ${emailResult.error}`
  );
});

// GET - List all pending invitations for a workspace
export async function GET(req: NextRequest, { params }: InviteParams) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workspaceId } = params;

    // Check if user has permission to view invitations
    const hasPermission = await checkWorkspacePermission(userId, workspaceId, 'members', 'read');

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to view invitations' },
        { status: 403 }
      );
    }

    // Get all pending invitations
    const invitations = await db
      .select({
        id: workspaceInvitations.id,
        email: workspaceInvitations.email,
        role: workspaceInvitations.role,
        status: workspaceInvitations.status,
        expiresAt: workspaceInvitations.expiresAt,
        createdAt: workspaceInvitations.createdAt,
        inviterName: users.firstName,
        inviterEmail: users.email,
      })
      .from(workspaceInvitations)
      .leftJoin(users, eq(workspaceInvitations.invitedBy, users.id))
      .where(eq(workspaceInvitations.workspaceId, workspaceId))
      .orderBy(workspaceInvitations.createdAt);

    return NextResponse.json({
      success: true,
      invitations,
    });
  } catch (_error) {
    console.error('Error fetching invitations:', _error);
    return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
  }
}
