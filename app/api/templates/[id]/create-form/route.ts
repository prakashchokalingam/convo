import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { createId } from "@paralleldrive/cuid2";
import { db } from "@/drizzle/db";
import { templates, forms, formTemplates, workspaceMembers } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * @swagger
 * /api/templates/{id}/create-form:
 *   post:
 *     summary: Create a form from template
 *     description: |
 *       Creates a new form using the specified template as a starting point.
 *       Copies the template's form schema and increments the template's usage count.
 *       Requires create_form permission in the target workspace.
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
 *         description: Template ID to create form from
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workspaceId
 *               - name
 *             properties:
 *               workspaceId:
 *                 type: string
 *                 format: uuid
 *                 description: Target workspace ID for the new form
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 description: Name for the new form
 *               description:
 *                 type: string
 *                 description: Description for the new form (optional)
 *               isConversational:
 *                 type: boolean
 *                 default: false
 *                 description: Whether to enable conversational mode
 *               isPublished:
 *                 type: boolean
 *                 default: false
 *                 description: Whether to publish the form immediately
 *           examples:
 *             createFormFromTemplate:
 *               summary: Create form from job application template
 *               value:
 *                 workspaceId: "550e8400-e29b-41d4-a716-446655440000"
 *                 name: "Software Engineer Application"
 *                 description: "Application form for software engineering positions"
 *                 isConversational: true
 *                 isPublished: false
 *     responses:
 *       201:
 *         description: Form created successfully from template
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 form:
 *                   $ref: '#/components/schemas/Form'
 *                 template:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: "Form created successfully from template"
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
    const { workspaceId, name, description, isConversational = false, isPublished = false } = body;

    if (!workspaceId || !name) {
      return NextResponse.json({ 
        error: "Missing required fields: workspaceId, name" 
      }, { status: 400 });
    }

    // Get source template
    const sourceTemplate = await db
      .select()
      .from(templates)
      .where(eq(templates.id, params.id))
      .limit(1);

    if (sourceTemplate.length === 0) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const templateData = sourceTemplate[0];

    // Check access to source template
    if (!templateData.isGlobal) {
      // For workspace templates, verify user has access to the source workspace
      if (!templateData.workspaceId) {
        return NextResponse.json({ error: "Template access error" }, { status: 403 });
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
        return NextResponse.json({ error: "Access denied to template" }, { status: 403 });
      }
    }

    // Verify user has create_form permission in target workspace
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
      return NextResponse.json({ error: "Access denied to workspace" }, { status: 403 });
    }

    // Check if user has create_form permission (owner, admin, or member)
    const userRole = targetWorkspaceMember[0].role;
    if (!['owner', 'admin', 'member'].includes(userRole)) {
      return NextResponse.json({ 
        error: "Insufficient permissions. Requires create_form permission." 
      }, { status: 403 });
    }

    // Convert template formSchema to form config format
    const formConfig = JSON.stringify(templateData.formSchema);

    // Generate unique ID for the form
    const formId = createId();

    // Create the form
    const [newForm] = await db
      .insert(forms)
      .values({
        id: formId,
        workspaceId: workspaceId,
        createdBy: userId,
        title: name,
        description: description || templateData.description,
        config: formConfig,
        isConversational,
        isPublished,
        version: 1,
      })
      .returning();

    // Create form-template relationship
    await db
      .insert(formTemplates)
      .values({
        id: createId(),
        formId: newForm.id,
        templateId: templateData.id,
      });

    // Increment template usage count
    await db
      .update(templates)
      .set({
        usageCount: templateData.usageCount + 1,
        updatedAt: new Date()
      })
      .where(eq(templates.id, params.id));

    return NextResponse.json({
      success: true,
      form: newForm,
      template: {
        id: templateData.id,
        name: templateData.name
      },
      message: "Form created successfully from template"
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating form from template:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
