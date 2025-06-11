import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/drizzle/db';
import { workspaces, workspaceMembers } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { withErrorHandling, createSuccessResponse, ApiError, ErrorCodes, requireAuth } from '@/lib/api-errors';

/**
 * @swagger
 * /api/workspaces/{workspaceSlug}:
 *   get:
 *     summary: Get workspace by slug
 *     description: |
 *       Retrieves a specific workspace by its slug. The user must be a member
 *       of the workspace to access it. Returns workspace details along with
 *       the user's role in the workspace.
 *     tags: [Workspaces]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: Workspace slug (URL identifier)
 *         example: "acme-corp"
 *     responses:
 *       200:
 *         description: Workspace retrieved successfully
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
 *                       $ref: '#/components/schemas/WorkspaceWithRole'
 *                 message:
 *                   type: string
 *                   example: "Workspace retrieved successfully"
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   success: true
 *                   data:
 *                     workspace:
 *                       id: "550e8400-e29b-41d4-a716-446655440000"
 *                       name: "Acme Corp Forms"
 *                       slug: "acme-corp"
 *                       type: "team"
 *                       ownerId: "user_2NiWrEwuDBCQ7XiZpFxGD7CpYKx"
 *                       description: "Customer feedback forms"
 *                       avatarUrl: null
 *                       settings: "{\"theme\":\"light\"}"
 *                       role: "owner"
 *                       createdAt: "2024-01-15T10:30:00Z"
 *                       updatedAt: "2024-01-20T14:45:00Z"
 *                   message: "Workspace retrieved successfully"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Access denied to workspace
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden"
 *                 message:
 *                   type: string
 *                   example: "Access denied to workspace"
 *                 code:
 *                   type: string
 *                   example: "ACCESS_DENIED"
 *       404:
 *         description: Workspace not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not Found"
 *                 message:
 *                   type: string
 *                   example: "Workspace not found"
 *                 code:
 *                   type: string
 *                   example: "NOT_FOUND"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export const GET = withErrorHandling(async (
  req: NextRequest,
  { params }: { params: { workspaceSlug: string } }
) => {
  const { userId } = auth();
  requireAuth(userId);

  const { workspaceSlug } = params;

  if (!workspaceSlug) {
    throw new ApiError(
      'Workspace slug is required',
      400,
      ErrorCodes.MISSING_FIELDS
    );
  }

  // Get workspace with user's role
  const workspace = await db
    .select({
      id: workspaces.id,
      name: workspaces.name,
      slug: workspaces.slug,
      type: workspaces.type,
      ownerId: workspaces.ownerId,
      description: workspaces.description,
      avatarUrl: workspaces.avatarUrl,
      settings: workspaces.settings,
      role: workspaceMembers.role,
      createdAt: workspaces.createdAt,
      updatedAt: workspaces.updatedAt,
    })
    .from(workspaces)
    .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
    .where(
      and(
        eq(workspaces.slug, workspaceSlug),
        eq(workspaceMembers.userId, userId)
      )
    )
    .limit(1);

  if (workspace.length === 0) {
    throw new ApiError(
      'Workspace not found or access denied',
      404,
      ErrorCodes.NOT_FOUND
    );
  }

  return createSuccessResponse(
    { workspace: workspace[0] },
    'Workspace retrieved successfully'
  );
});
