import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/drizzle/db';
import { users, workspaces, workspaceMembers, workspaceActivities } from '@/drizzle/schema';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { createDefaultSubscription } from '@/lib/plans';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      email, 
      firstName, 
      lastName, 
      username, 
      avatarUrl 
    } = body;

    // Check if user already exists (prevent duplicate creation)
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (existingUser) {
      // User already exists, return their workspace
      const workspace = await db.query.workspaces.findFirst({
        where: (workspaces, { eq, and }) => and(
          eq(workspaces.ownerId, userId),
          eq(workspaces.type, 'default')
        ),
      });

      return NextResponse.json({ 
        success: true, 
        workspaceSlug: workspace?.slug,
        message: 'User already exists' 
      });
    }

    // Generate unique workspace slug
    const baseSlug = username 
      ? username.toLowerCase().replace(/[^a-z0-9-]/g, '') 
      : firstName?.toLowerCase().replace(/[^a-z0-9-]/g, '') || 'user';
    
    const workspaceSlug = await generateUniqueSlug(baseSlug);
    const workspaceId = createId();
    const now = new Date();

    // Create user record
    await db.insert(users).values({
      id: userId,
      email: email || '',
      firstName: firstName || '',
      lastName: lastName || '',
      username: username || '',
      avatarUrl: avatarUrl || null,
      createdAt: now,
      updatedAt: now,
    });

    // Create default subscription (starter plan)
    await createDefaultSubscription(userId);

    // Create default workspace  
    await db.insert(workspaces).values({
      id: workspaceId,
      name: `${firstName || 'My'} Workspace`,
      slug: workspaceSlug,
      type: 'default',
      ownerId: userId,
      description: 'Your default workspace for creating forms',
      settings: JSON.stringify({
        theme: 'light',
        timezone: 'UTC',
        notifications: {
          email: true,
          browser: true,
        }
      }),
      createdAt: now,
      updatedAt: now,
    });

    // Add user as owner to workspace
    await db.insert(workspaceMembers).values({
      id: createId(),
      workspaceId,
      userId,
      role: 'owner',
      joinedAt: now,
      lastSeenAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // Log workspace creation activity
    await db.insert(workspaceActivities).values({
      id: createId(),
      workspaceId,
      userId,
      action: 'workspace.created',
      resource: 'workspace',
      resourceId: workspaceId,
      metadata: JSON.stringify({
        workspaceName: `${firstName || 'My'} Workspace`,
        workspaceType: 'default',
        source: 'client_signup'
      }),
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      createdAt: now,
    });

    console.log('✅ User and workspace created via client:', { 
      userId, 
      email,
      workspaceSlug,
      workspaceName: `${firstName || 'My'} Workspace`
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        workspaceSlug,
        workspaceName: `${firstName || 'My'} Workspace`
      },
      message: 'Workspace created successfully'
    });

  } catch (error) {
    console.error('Error creating user workspace:', error);
    return NextResponse.json(
      { error: 'Failed to create workspace' }, 
      { status: 500 }
    );
  }
}

async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existing = await db.query.workspaces.findFirst({
      where: (workspaces, { eq }) => eq(workspaces.slug, slug),
    });
    
    if (!existing) {
      return slug;
    }
    
    counter++;
    slug = `${baseSlug}${counter}`;
  }
}
