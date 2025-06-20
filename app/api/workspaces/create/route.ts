import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { z } from 'zod';
import { 
  createWorkspace, 
  canCreateTeamWorkspace, 
  canCreateDefaultWorkspace,
  getWorkspaceLimitsInfo,
  isSlugAvailable 
} from '@/lib/workspace-server';

// Validation schema for workspace creation
const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required').max(50, 'Workspace name must be less than 50 characters'),
  slug: z.string()
    .min(3, 'Workspace slug must be at least 3 characters')
    .max(20, 'Workspace slug must be less than 20 characters')
    .regex(/^[a-z0-9-]+$/, 'Workspace slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
  type: z.enum(['default', 'team']).optional()
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = createWorkspaceSchema.parse(body);

    // Check if slug is available
    const slugAvailable = await isSlugAvailable(validatedData.slug);
    if (!slugAvailable) {
      return NextResponse.json(
        { error: 'Workspace slug is already taken. Please choose a different one.' },
        { status: 400 }
      );
    }

    // Get current workspace limits
    const limitsInfo = await getWorkspaceLimitsInfo(userId);

    // Determine workspace type if not specified
    let workspaceType = validatedData.type;
    if (!workspaceType) {
      // Auto-determine type based on what user can create
      if (limitsInfo.canCreateDefault) {
        workspaceType = 'default';
      } else if (limitsInfo.canCreateTeam) {
        workspaceType = 'team';
      } else {
        return NextResponse.json(
          { 
            error: 'You have reached the maximum number of workspaces allowed.',
            details: {
              currentCount: limitsInfo.currentCount,
              limits: limitsInfo.limits
            }
          },
          { status: 400 }
        );
      }
    }

    // Validate workspace creation based on type and limits
    if (workspaceType === 'default') {
      if (!limitsInfo.canCreateDefault) {
        return NextResponse.json(
          { 
            error: 'You can only have one default workspace.',
            details: {
              currentCount: limitsInfo.currentCount,
              limits: limitsInfo.limits
            }
          },
          { status: 400 }
        );
      }
    } else if (workspaceType === 'team') {
      if (!limitsInfo.canCreateTeam) {
        return NextResponse.json(
          { 
            error: 'Maximum 3 team workspaces allowed per account.',
            details: {
              currentCount: limitsInfo.currentCount,
              limits: limitsInfo.limits
            }
          },
          { status: 400 }
        );
      }
    }

    // Create the workspace
    const workspace = await createWorkspace({
      name: validatedData.name,
      slug: validatedData.slug,
      description: validatedData.description,
      type: workspaceType
    });

    console.log('✅ Workspace created successfully:', {
      userId,
      workspaceId: workspace.id,
      workspaceSlug: workspace.slug,
      workspaceName: workspace.name,
      workspaceType: workspace.type
    });

    return NextResponse.json({
      success: true,
      data: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        type: workspace.type,
        description: workspace.description
      },
      message: `${workspaceType === 'default' ? 'Default' : 'Team'} workspace created successfully`
    });

  } catch (error) {
    console.error('Error creating workspace:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      );
    }

    // Return detailed error for debugging in development
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      { 
        error: 'Failed to create workspace',
        details: isDevelopment ? error.message : undefined
      }, 
      { status: 500 }
    );
  }
}

// Get workspace limits for current user
export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limitsInfo = await getWorkspaceLimitsInfo(userId);

    return NextResponse.json({
      success: true,
      data: limitsInfo
    });

  } catch (error) {
    console.error('Error getting workspace limits:', error);
    
    return NextResponse.json(
      { error: 'Failed to get workspace limits' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
