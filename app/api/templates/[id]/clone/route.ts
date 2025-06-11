import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { templates, workspaceMembers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * @swagger
 * /api/templates/{id}/clone:
 *   post:
 *     summary: Clone a template to workspace
 *     description: |
 *       Creates a copy of an existing template in the specified workspace.
 *       Can clone both global templates and workspace templates (if user has access).
 *       Requires create_template permission in the target workspace.
 *     tags: [Templates]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Source template ID to clone
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
 *                 format: uuid
 *                 description: Target workspace ID for the cloned template
 *               name:
 *                 type: string
 *                 description: Custom name for the cloned template (optional)
 *               description:
 *                 type: string
 *                 description: Custom description for the cloned template (optional)
 *           examples:
 *             cloneTemplate:
 *               summary: Clone template to workspace
 *               value:
 *                 workspaceId: "550e8400-e29b-41d4-a716-446655440000"
 *                 name: "My Custom Job Application Form"
 *                 description: "Customized version of the global job application template"
 *     responses:
 *       201:
 *         description: Template cloned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 template:
 *                   $ref: '#/components/schemas/Template'
 *                 message:
 *                   type: string
 *                   example: "Template cloned successfully"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { workspaceId, name: customName, description: customDescription } = body;

    if (!workspaceId) {
      return NextResponse.json({ 
        error: "Missing required field: workspaceId" 
      }, { status: 400 });
    }

    // Get source template
    const sourceTemplate = await db
      .select()
      .from(templates)
      .where(eq(templates.id, params.id))
      .limit(1);

    if (sourceTemplate.length === 0) {
      return NextResponse.json({ error: "Source template not found" }, { status: 404 });
    }

    const templateData = sourceTemplate[0];

    // Check access to source template
    if (!templateData.isGlobal) {
      // For workspace templates, verify user has access to the source workspace
      if (!templateData.workspaceId) {
        return NextResponse.json({ error: "Source template access error" }, { status: 403 });
      }

      const sourceWorkspaceMember = await db
        .select()
        .from(workspaceMembers)
        .where(and(
          eq(workspaceMembers.workspaceId, templateData.workspaceId),
          eq(workspaceMembers.userId, userId)
        ))
        .limit(1);

      if (sourceWorkspaceMember.length === 0) {
        return NextResponse.json({ error: "Access denied to source template" }, { status: 403 });
      }
    }

    // Verify user has create_template permission in target workspace
    const targetWorkspaceMember = await db
      .select({
        role: workspaceMembers.role
      })
      .from(workspaceMembers)
      .where(and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      ))
      .limit(1);

    if (targetWorkspaceMember.length === 0) {
      return NextResponse.json({ error: "Access denied to target workspace" }, { status: 403 });
    }

    // Check if user has create_template permission (owner or admin)
    const userRole = targetWorkspaceMember[0].role;
    if (!['owner', 'admin'].includes(userRole)) {
      return NextResponse.json({ 
        error: "Insufficient permissions. Requires create_template permission." 
      }, { status: 403 });
    }

    // Increment clone count on source template
    await db
      .update(templates)
      .set({
        cloneCount: templateData.cloneCount + 1,
        updatedAt: new Date()
      })
      .where(eq(templates.id, params.id));

    // Create the cloned template
    const clonedName = customName || `${templateData.name} (Copy)`;
    const clonedDescription = customDescription || templateData.description;

    const [clonedTemplate] = await db
      .insert(templates)
      .values({
        name: clonedName,
        description: clonedDescription,
        formSchema: templateData.formSchema,
        category: templateData.category,
        workspaceId: workspaceId,
        createdBy: userId,
        thumbnailUrl: templateData.thumbnailUrl,
        isGlobal: false, // Cloned templates are always workspace-specific
        usageCount: 0,
        cloneCount: 0,
      })
      .returning();

    return NextResponse.json({
      success: true,
      template: clonedTemplate,
      message: "Template cloned successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Error cloning template:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
