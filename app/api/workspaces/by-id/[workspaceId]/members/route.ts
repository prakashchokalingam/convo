import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/drizzle/db';
import { workspaceMembers, users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { checkWorkspacePermission } from '@/lib/rbac';

interface MembersParams {
  params: {
    workspaceId: string;
  };
}

// GET - List all members in a workspace
export async function GET(req: NextRequest, { params }: MembersParams) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workspaceId } = params;

    // Check if user has permission to view members
    const hasPermission = await checkWorkspacePermission(
      userId, 
      workspaceId, 
      'members', 
      'read'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to view workspace members' }, 
        { status: 403 }
      );
    }

    // Get all members with user details
    const members = await db
      .select({
        id: workspaceMembers.id,
        userId: workspaceMembers.userId,
        role: workspaceMembers.role,
        joinedAt: workspaceMembers.joinedAt,
        lastSeenAt: workspaceMembers.lastSeenAt,
        invitedBy: workspaceMembers.invitedBy,
        invitedAt: workspaceMembers.invitedAt,
        // User details
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        username: users.username,
        avatarUrl: users.avatarUrl,
      })
      .from(workspaceMembers)
      .innerJoin(users, eq(workspaceMembers.userId, users.id))
      .where(eq(workspaceMembers.workspaceId, workspaceId))
      .orderBy(workspaceMembers.joinedAt);

    // Format response
    const formattedMembers = members.map(member => ({
      id: member.id,
      userId: member.userId,
      role: member.role,
      joinedAt: member.joinedAt,
      lastSeenAt: member.lastSeenAt,
      invitedBy: member.invitedBy,
      invitedAt: member.invitedAt,
      user: {
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        username: member.username,
        avatarUrl: member.avatarUrl,
        displayName: member.firstName && member.lastName 
          ? `${member.firstName} ${member.lastName}` 
          : member.firstName || member.username || member.email,
      }
    }));

    return NextResponse.json({
      success: true,
      members: formattedMembers,
      count: formattedMembers.length
    });

  } catch (error) {
    console.error('Error fetching workspace members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workspace members' }, 
      { status: 500 }
    );
  }
}
