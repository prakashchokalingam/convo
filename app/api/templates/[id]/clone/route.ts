import { auth } from '@clerk/nextjs';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { templates } from '@/lib/db/schema';
import { checkWorkspacePermission, getUserWorkspaceRole } from '@/lib/rbac';

/**
 * @swagger
 * /api/templates/{id}/clone:
 *   post:
 *     summary: Clone a template to a workspace
 *     description: |
 *       Creates a copy of an existing template (either global or workspace-specific)
 *       into the specified target workspace.
 *       Permissions are checked based on the source template type and target workspace.
 *     tags: [Templates]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the source template to clone.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workspaceId
 *             properties:
 *               workspaceId:
 *                 type: string
 *                 description: ID of the target workspace where the template will be cloned.
 *               name: # Optional custom name
 *                 type: string
 *                 description: Optional custom name for the cloned template. If not provided, appends "(Copy)".
 *     responses:
 *       201:
 *         description: Template cloned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 template:
 *                   $ref: '#/components/schemas/Template' # Assuming you have a Template schema defined
 *                 message:
 *                   type: string
 *                   example: "Template cloned successfully"
 *       400:
 *         description: Bad request (e.g., missing targetWorkspaceId).
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden (insufficient permissions or access denied).
 *       404:
 *         description: Source template not found.
 *       500:
 *         description: Internal server error.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } } // id is the source template ID
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const targetWorkspaceId = body.workspaceId;
    const customName = body.name; // Optional custom name from request body

    if (!targetWorkspaceId) {
      return NextResponse.json(
        { error: 'Target workspaceId is required in the request body' },
        { status: 400 }
      );
    }

    const sourceTemplateId = params.id;

    // 1. Fetch the source template
    const sourceTemplateResults = await db
      .select()
      .from(templates)
      .where(eq(templates.id, sourceTemplateId))
      .limit(1);

    if (sourceTemplateResults.length === 0) {
      return NextResponse.json({ error: 'Source template not found' }, { status: 404 });
    }
    const sourceTemplateData = sourceTemplateResults[0];

    // 2. Permission Checks
    // 2a. Check if user is part of the target workspace (required for all clone operations)
    const targetUserRole = await getUserWorkspaceRole(userId, targetWorkspaceId);
    if (!targetUserRole) {
      return NextResponse.json(
        { error: 'Access denied to target workspace. User is not a member.' },
        { status: 403 }
      );
    }

    // 2b. Check 'create_template' permission in the target workspace (required for all clone operations)
    const canCreateInTarget = await checkWorkspacePermission(
      userId,
      targetWorkspaceId,
      'templates',
      'create'
    );
    if (!canCreateInTarget) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create template in target workspace.' },
        { status: 403 }
      );
    }

    // 2c. Additional checks if the source template is workspace-specific (not global)
    if (!sourceTemplateData.isGlobal) {
      if (!sourceTemplateData.workspaceId) {
        console.error(
          `Source template ${sourceTemplateData.id} is not global but has no workspaceId.`
        );
        return NextResponse.json(
          { error: 'Source template data integrity issue.' },
          { status: 500 }
        );
      }
      // If source and target workspaces are different, verify membership in source workspace.
      if (sourceTemplateData.workspaceId !== targetWorkspaceId) {
        const sourceUserRole = await getUserWorkspaceRole(userId, sourceTemplateData.workspaceId);
        if (!sourceUserRole) {
          // User must be a member of the source template's workspace to clone it to a different workspace.
          return NextResponse.json(
            { error: "Access denied to source template's workspace. User is not a member." },
            { status: 403 }
          );
        }
      }
    }
    // If source is global, being a member of target and having create_template in target is sufficient.

    // 3. Create the new (cloned) template
    const newTemplateId = createId(); // Generate a new unique ID
    const clonedTemplateName = customName || `${sourceTemplateData.name} (Copy)`;

    const [newClonedTemplate] = await db
      .insert(templates)
      .values({
        id: newTemplateId,
        name: clonedTemplateName,
        description: sourceTemplateData.description,
        formSchema: sourceTemplateData.formSchema,
        category: sourceTemplateData.category,
        isGlobal: false,
        workspaceId: targetWorkspaceId,
        createdBy: userId,
        originalTemplateId: sourceTemplateData.id,
        usageCount: 0,
        cloneCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        thumbnailUrl: sourceTemplateData.thumbnailUrl, // Ensure this is copied
      })
      .returning();

    // 4. Increment cloneCount of the source template
    await db
      .update(templates)
      .set({
        cloneCount: (sourceTemplateData.cloneCount || 0) + 1,
        updatedAt: new Date(), // Also update updatedAt for the source template
      })
      .where(eq(templates.id, sourceTemplateData.id));

    return NextResponse.json(
      {
        success: true,
        template: newClonedTemplate,
        message: 'Template cloned successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error cloning template:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
