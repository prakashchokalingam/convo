import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs';
import { db } from '@/drizzle/db';
import { users, workspaceMembers, workspaceActivities } from '@/drizzle/schema';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { createDefaultSubscription } from '@/lib/plans';
import { createWorkspaceFromEmail, getUserDefaultWorkspace } from '@/lib/workspace-server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data from Clerk to extract email and name
    let userData;
    try {
      userData = await clerkClient.users.getUser(userId);
    } catch (error) {
      console.error('Failed to get user data from Clerk:', error);
      return NextResponse.json({ error: 'Failed to get user information' }, { status: 400 });
    }

    const email = userData.emailAddresses[0]?.emailAddress;
    const firstName = userData.firstName;
    const lastName = userData.lastName;
    const username = userData.username;
    const avatarUrl = userData.imageUrl;

    if (!email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    // Check if user record already exists (prevent duplicate creation)
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    const now = new Date();

    // Create user record if it doesn't exist
    if (!existingUser) {
      await db.insert(users).values({
        id: userId,
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        username: username || '',
        avatarUrl: avatarUrl || null,
        createdAt: now,
        updatedAt: now,
      });

      // Create default subscription for new users
      try {
        await createDefaultSubscription(userId);
      } catch (error) {
        console.error('Failed to create default subscription:', error);
        // Continue with workspace creation even if subscription creation fails
      }
    }

    // SMART DEFAULT DETECTION: Check if user already has a default workspace
    const existingDefaultWorkspace = await getUserDefaultWorkspace();
    
    if (existingDefaultWorkspace) {
      // User already has default workspace - redirect to existing one
      console.log('✅ Existing default workspace found during onboarding:', {
        userId,
        email: email.split('@')[0] + '@***', // Partial email for privacy
        workspaceSlug: existingDefaultWorkspace.slug,
        workspaceName: existingDefaultWorkspace.name
      });

      return NextResponse.json({
        success: true,
        data: {
          workspaceSlug: existingDefaultWorkspace.slug,
          workspaceName: existingDefaultWorkspace.name,
          isNewWorkspace: false // No welcome parameter
        },
        message: 'Redirected to existing default workspace'
      });
    }

    // No default workspace found - create new one
    const workspaceResult = await createWorkspaceFromEmail(email, firstName, lastName);

    // Get the actual workspace ID for activity logging
    const createdWorkspace = await db.query.workspaces.findFirst({
      where: (workspaces, { eq }) => eq(workspaces.slug, workspaceResult.slug),
    });

    if (createdWorkspace) {
      // Log workspace creation activity
      await db.insert(workspaceActivities).values({
        id: createId(),
        workspaceId: createdWorkspace.id,
        userId,
        action: 'workspace.created',
        resource: 'workspace',
        resourceId: createdWorkspace.id,
        metadata: JSON.stringify({
          workspaceName: workspaceResult.name,
          workspaceType: 'default',
          source: 'automatic_onboarding',
          email: email.split('@')[0] // Log username part only for privacy
        }),
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        createdAt: now,
      });
    }

    console.log('✅ New default workspace created via onboarding:', {
      userId,
      email: email.split('@')[0] + '@***', // Partial email for privacy
      workspaceSlug: workspaceResult.slug,
      workspaceName: workspaceResult.name
    });

    return NextResponse.json({
      success: true,
      data: {
        workspaceSlug: workspaceResult.slug,
        workspaceName: workspaceResult.name,
        isNewWorkspace: true // Add welcome parameter
      },
      message: 'Default workspace created successfully'
    });

  } catch (error) {
    console.error('Error during automatic onboarding:', error);
    
    // Return detailed error for debugging in development
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      { 
        error: 'Failed to create workspace automatically',
        details: isDevelopment ? error.message : undefined
      }, 
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
