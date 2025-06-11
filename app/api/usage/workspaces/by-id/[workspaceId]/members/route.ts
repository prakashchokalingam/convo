import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { getWorkspaceMemberUsage } from '@/lib/plans';
import { checkWorkspacePermission } from '@/lib/rbac';

interface MemberUsageParams {
  params: {
    workspaceId: string;
  };
}

// GET - Get member usage for a specific workspace
export async function GET(req: NextRequest, { params }: MemberUsageParams) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workspaceId } = params;

    // Check if user has access to this workspace
    const hasPermission = await checkWorkspacePermission(
      userId, 
      workspaceId, 
      'workspace', 
      'read'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to view this workspace' }, 
        { status: 403 }
      );
    }

    const usage = await getWorkspaceMemberUsage(workspaceId, userId);

    if (!usage) {
      return NextResponse.json(
        { error: 'Failed to fetch member usage data' }, 
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: usage
    });

  } catch (error) {
    console.error('Error fetching member usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member usage' }, 
      { status: 500 }
    );
  }
}
