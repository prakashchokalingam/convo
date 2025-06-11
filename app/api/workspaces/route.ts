import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/drizzle/db';
import { workspaces, workspaceMembers, workspaceActivities } from '@/drizzle/schema';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { canCreateWorkspace } from '@/lib/plans';
import { ActivityLogger } from '@/lib/rbac';
import { withErrorHandling, createSuccessResponse, ApiError, ErrorCodes, requireAuth, validateRequiredFields } from '@/lib/api-errors';

/**
 * @swagger
 * /api/workspaces:
 *   post:
 *     summary: Create a new workspace
 *     description: |
 *       Creates a new workspace for organizing forms and team collaboration.
 *       The authenticated user becomes the owner of the workspace.
 *       
 *       **Features:**
 *       - Automatic owner assignment
 *       - Unique slug validation
 *       - Plan limit enforcement
 *       - Activity logging
 *       - Default settings initialization
 *     tags: [Workspaces]
 *     security:
 *       - ClerkAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWorkspaceRequest'
 *           examples:
 *             teamWorkspace:
 *               summary: Create a team workspace
 *               value:
 *                 name: "Acme Corp Forms"
 *                 slug: "acme-corp"
 *                 description: "Customer feedback and lead generation forms"
 *                 type: "team"
 *             personalWorkspace:
 *               summary: Create a personal workspace
 *               value:
 *                 name: "John's Personal Forms"
 *                 slug: "john-personal"
 *                 type: "personal"
 *     responses:
 *       201:
 *         description: Workspace created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     workspace:
 *                       $ref: '#/components/schemas/Workspace'
 *                 message:
 *                   type: string
 *                   example: "Workspace created successfully"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation Error"
 *                 message:
 *                   type: string
 *                   example: "Slug can only contain lowercase letters, numbers, and hyphens"
 *                 code:
 *                   type: string
 *                   example: "INVALID_FORMAT"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Plan limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Plan limit exceeded"
 *                 message:
 *                   type: string
 *                   example: "You have reached the maximum number of workspaces for your plan"
 *                 code:
 *                   type: string
 *                   example: "PLAN_LIMIT_EXCEEDED"
 *       409:
 *         description: Workspace slug already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Conflict"
 *                 message:
 *                   type: string
 *                   example: "Workspace URL is already taken"
 *                 code:
 *                   type: string
 *                   example: "ALREADY_EXISTS"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export const POST = withErrorHandling(async (req: NextRequest) => {
  const { userId } = auth();
  requireAuth(userId);

  const body = await req.json();
  const { name, slug, description, type = 'team' } = body;

  // Validate required fields
  validateRequiredFields(body, ['name', 'slug']);

  // Validate slug format
  const slugRegex = /^[a-z0-9-]+$/;
  if (!slugRegex.test(slug)) {
    throw new ApiError(
      'Slug can only contain lowercase letters, numbers, and hyphens',
      400,
      ErrorCodes.INVALID_FORMAT
    );
  }

  // Check if user can create workspace based on their plan
  const canCreate = await canCreateWorkspace(userId);
  if (!canCreate.allowed) {
    throw new ApiError(
      canCreate.reason!,
      403,
      ErrorCodes.PLAN_LIMIT_EXCEEDED
    );
  }

  // Check if slug is unique
  const existingWorkspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, slug),
  });

  if (existingWorkspace) {
    throw new ApiError(
      'Workspace URL is already taken',
      409,
      ErrorCodes.ALREADY_EXISTS
    );
  }

  const workspaceId = createId();
  const now = new Date();

  // Create workspace
  const newWorkspace = await db.insert(workspaces).values({
    id: workspaceId,
    name,
    slug,
    type: type as 'default' | 'team',
    ownerId: userId,
    description: description || null,
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
  }).returning();

  // Add creator as owner
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
  await ActivityLogger.workspaceUpdated(
    workspaceId,
    userId,
    { action: 'created', name, type },
    req
  );

  console.log('✅ Workspace created:', { 
    userId, 
    workspaceId,
    name,
    slug
  });

  return createSuccessResponse(
    { workspace: newWorkspace[0] },
    'Workspace created successfully'
  );
});

/**
 * @swagger
 * /api/workspaces:
 *   get:
 *     summary: List all workspaces for the current user
 *     description: |
 *       Retrieves all workspaces where the authenticated user is a member.
 *       Includes the user's role in each workspace.
 *       
 *       **Returned Data:**
 *       - Workspace basic information
 *       - User's role in each workspace
 *       - Ordered by creation date
 *     tags: [Workspaces]
 *     security:
 *       - ClerkAuth: []
 *     responses:
 *       200:
 *         description: Workspaces retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkspaceListResponse'
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   success: true
 *                   data:
 *                     workspaces:
 *                       - id: "550e8400-e29b-41d4-a716-446655440000"
 *                         name: "Acme Corp Forms"
 *                         slug: "acme-corp"
 *                         type: "team"
 *                         ownerId: "user_2NiWrEwuDBCQ7XiZpFxGD7CpYKx"
 *                         description: "Customer feedback forms"
 *                         role: "owner"
 *                         createdAt: "2024-01-15T10:30:00Z"
 *                         updatedAt: "2024-01-20T14:45:00Z"
 *                       - id: "550e8400-e29b-41d4-a716-446655440001"
 *                         name: "Marketing Team"
 *                         slug: "marketing-team"
 *                         type: "team"
 *                         ownerId: "user_2NiWrEwuDBCQ7XiZpFxGD7CpYKx"
 *                         role: "member"
 *                         createdAt: "2024-01-10T08:00:00Z"
 *                   message: "Workspaces retrieved successfully"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export const GET = withErrorHandling(async () => {
  const { userId } = auth();
  requireAuth(userId);

  const userWorkspaces = await db
    .select({
      id: workspaces.id,
      name: workspaces.name,
      slug: workspaces.slug,
      type: workspaces.type,
      ownerId: workspaces.ownerId,
      description: workspaces.description,
      avatarUrl: workspaces.avatarUrl,
      role: workspaceMembers.role,
      createdAt: workspaces.createdAt,
      updatedAt: workspaces.updatedAt,
    })
    .from(workspaces)
    .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
    .where(eq(workspaceMembers.userId, userId))
    .orderBy(workspaces.createdAt);

  return createSuccessResponse(
    { workspaces: userWorkspaces },
    'Workspaces retrieved successfully'
  );
});
