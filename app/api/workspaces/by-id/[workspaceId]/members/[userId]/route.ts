import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/drizzle/db';
import { workspaceMembers, users } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { checkWorkspacePermission, ActivityLogger, canManageRole } from '@/lib/rbac';

interface MemberParams {
  params: {
    workspaceId: string;
    userId: string;
  };
}

// PUT - Update member role
export async function PUT(req: NextRequest, { params }: MemberParams) {
  try {
    const { userId: currentUserId } = auth();
    
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workspaceId, userId: targetUserId } = params;
    const body = await req.json();
    const { role } = body;

    // Validate role
    const validRoles = ['owner', 'admin', 'member', 'viewer'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be owner, admin, member, or viewer' }, 
        { status: 400 }
      );
    }

    // Check if current user has permission to update members
    const hasPermission = await checkWorkspacePermission(
      currentUserId, 
      workspaceId, 
      'members', 
      'update'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update member roles' }, 
        { status: 403 }
      );
    }

    // Get current user's role and target member's current role
    const [currentUserMember, targetMember] = await Promise.all([
      db.query.workspaceMembers.findFirst({
        where: and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, currentUserId)
        ),
      }),
      db.query.workspaceMembers.findFirst({
        where: and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, targetUserId)
        ),
      })
    ]);

    if (!currentUserMember || !targetMember) {
      return NextResponse.json(
        { error: 'Member not found' }, 
        { status: 404 }
      );
    }

    // Check if current user can manage the target user's role
    const canManage = canManageRole(
      currentUserMember.role as any, 
      targetMember.role as any
    );

    if (!canManage) {
      return NextResponse.json(
        { error: 'You cannot manage this member\'s role' }, 
        { status: 403 }
      );
    }

    // Prevent changing your own role
    if (currentUserId === targetUserId) {
      return NextResponse.json(
        { error: 'You cannot change your own role' }, 
        { status: 400 }
      );
    }

    // Update member role
    const updatedMember = await db
      .update(workspaceMembers)
      .set({ 
        role: role as any,
        updatedAt: new Date()
      })
      .where(and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, targetUserId)
      ))
      .returning();

    // Log activity
    await ActivityLogger.memberJoined(
      workspaceId,
      currentUserId,
      targetUserId,
      role,
      req
    );

    console.log('✅ Member role updated:', { 
      workspaceId,
      targetUserId,
      newRole: role,
      updatedBy: currentUserId
    });

    return NextResponse.json({ 
      success: true,
      member: updatedMember[0],
      message: 'Member role updated successfully'
    });

  } catch (error) {
    console.error('Error updating member role:', error);
    return NextResponse.json(
      { error: 'Failed to update member role' }, 
      { status: 500 }
    );
  }
}

// DELETE - Remove member from workspace
export async function DELETE(req: NextRequest, { params }: MemberParams) {
  try {
    const { userId: currentUserId } = auth();
    
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workspaceId, userId: targetUserId } = params;

    // Check if current user has permission to remove members
    const hasPermission = await checkWorkspacePermission(
      currentUserId, 
      workspaceId, 
      'members', 
      'remove'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to remove members' }, 
        { status: 403 }
      );
    }

    // Get current user's role and target member's current role
    const [currentUserMember, targetMember] = await Promise.all([
      db.query.workspaceMembers.findFirst({
        where: and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, currentUserId)
        ),
      }),
      db.query.workspaceMembers.findFirst({
        where: and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, targetUserId)
        ),
      })
    ]);

    if (!currentUserMember || !targetMember) {
      return NextResponse.json(
        { error: 'Member not found' }, 
        { status: 404 }
      );
    }

    // Prevent owners from being removed
    if (targetMember.role === 'owner') {
      return NextResponse.json(
        { error: 'Cannot remove workspace owner' }, 
        { status: 400 }
      );
    }

    // Prevent removing yourself
    if (currentUserId === targetUserId) {
      return NextResponse.json(
        { error: 'You cannot remove yourself from the workspace' }, 
        { status: 400 }
      );
    }

    // Check if current user can manage the target user's role
    const canManage = canManageRole(
      currentUserMember.role as any, 
      targetMember.role as any
    );

    if (!canManage) {
      return NextResponse.json(
        { error: 'You cannot remove this member' }, 
        { status: 403 }
      );
    }

    // Remove member from workspace
    await db
      .delete(workspaceMembers)
      .where(and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, targetUserId)
      ));

    // Log activity
    await ActivityLogger.memberRemoved(
      workspaceId,
      currentUserId,
      targetUserId,
      req
    );

    console.log('✅ Member removed:', { 
      workspaceId,
      targetUserId,
      removedBy: currentUserId
    });

    return NextResponse.json({ 
      success: true,
      message: 'Member removed successfully'
    });

  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json(
      { error: 'Failed to remove member' }, 
      { status: 500 }
    );
  }
}
