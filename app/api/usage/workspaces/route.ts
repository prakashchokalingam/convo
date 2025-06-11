import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { getWorkspaceUsage, getUserSubscription } from '@/lib/plans';

// GET - Get workspace usage for current user
export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [usage, subscription] = await Promise.all([
      getWorkspaceUsage(userId),
      getUserSubscription(userId)
    ]);

    if (!usage) {
      return NextResponse.json(
        { error: 'Failed to fetch usage data' }, 
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...usage,
        subscription
      }
    });

  } catch (error) {
    console.error('Error fetching workspace usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workspace usage' }, 
      { status: 500 }
    );
  }
}
