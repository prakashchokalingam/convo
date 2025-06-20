import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { templates, workspaceMembers } from "@/lib/db/schema"; // workspaceMembers might be removable if getUserWorkspaceRole makes it redundant here
import { eq, and, or } from "drizzle-orm";
import { checkWorkspacePermission, getUserWorkspaceRole } from "@/lib/rbac"; // Added imports

/**
 * @swagger
 * /api/templates/{id}:
 *   get:
 *     summary: Get a specific template
 *     description: |
 *       Retrieves detailed information about a specific template.
 *       Returns global templates or workspace templates the user has access to.
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
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Template retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Template'
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "Job Application Form"
 *                   description: "Comprehensive job application form template"
 *                   category: "HR"
 *                   isGlobal: true
 *                   usageCount: 145
 *                   cloneCount: 23
 *                   formSchema:
 *                     fields:
 *                       - id: "full_name"
 *                         type: "text"
 *                         label: "Full Name"
 *                         required: true
 *                   createdAt: "2024-01-15T10:30:00Z"
 *                   updatedAt: "2024-01-20T14:45:00Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get template
    const template = await db
      .select()
      .from(templates)
      .where(eq(templates.id, params.id))
      .limit(1);

    if (template.length === 0) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const templateData = template[0];

    // Check access permissions
    if (templateData.isGlobal) {
      // Global templates are accessible to all authenticated users
      return NextResponse.json(templateData);
    } else {
      // For workspace templates, verify user has access to the workspace
      if (!templateData.workspaceId) {
        return NextResponse.json({ error: "Template access error" }, { status: 403 });
      }

      const workspaceMember = await db
        .select()
        .from(workspaceMembers)
        .where(and(
          eq(workspaceMembers.workspaceId, templateData.workspaceId),
          eq(workspaceMembers.userId, userId)
        ))
        .limit(1);

      if (workspaceMember.length === 0) {
        return NextResponse.json({ error: "Access denied to template" }, { status: 403 });
      }

      return NextResponse.json(templateData);
    }
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/templates/{id}:
 *   put:
 *     summary: Update a specific template
 *     description: |
 *       Updates template properties such as name, description, form schema, and category.
 *       Only workspace templates can be updated, and only by users with edit_template permission.
 *       Global templates cannot be modified by users.
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
 *         description: Template ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 description: Template name
 *               description:
 *                 type: string
 *                 description: Template description
 *               formSchema:
 *                 type: object
 *                 description: Form configuration schema
 *               category:
 *                 type: string
 *                 enum: [HR, Marketing, Support, Sales, Education, Healthcare, Other]
 *                 description: Business category
 *               thumbnailUrl:
 *                 type: string
 *                 format: uri
 *                 description: Template preview image
 *           examples:
 *             updateTemplate:
 *               summary: Update template information
 *               value:
 *                 name: "Updated Customer Survey"
 *                 description: "Updated description for customer feedback template"
 *                 category: "Marketing"
 *     responses:
 *       200:
 *         description: Template updated successfully
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
 *                   example: "Template updated successfully"
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
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, formSchema, category, thumbnailUrl } = body;

    // Get existing template
    const existingTemplate = await db
      .select()
      .from(templates)
      .where(eq(templates.id, params.id))
      .limit(1);

    if (existingTemplate.length === 0) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const templateData = existingTemplate[0];

    // Prevent editing global templates
    if (templateData.isGlobal) {
      return NextResponse.json({ 
        error: "Global templates cannot be modified" 
      }, { status: 403 });
    }

    // Verify user has edit_template permission in the workspace
    if (!templateData.workspaceId) {
      // This case should ideally not be reached if non-global templates always have a workspaceId
      return NextResponse.json({ error: "Template workspace ID is missing for a non-global template" }, { status: 500 });
    }

    // First, ensure the user is part of the workspace.
    const userRole = await getUserWorkspaceRole(userId, templateData.workspaceId);
    if (!userRole) {
      return NextResponse.json({ error: "Access denied to workspace. User is not a member." }, { status: 403 });
    }

    // Now, check for specific 'edit_template' permission
    const canEditTemplate = await checkWorkspacePermission(userId, templateData.workspaceId, 'templates', 'edit');
    if (!canEditTemplate) {
      return NextResponse.json({ 
        error: "Insufficient permissions. Requires 'edit_template' permission."
      }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (formSchema !== undefined) updateData.formSchema = formSchema;
    if (category !== undefined) updateData.category = category;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;

    // Update the template
    const [updatedTemplate] = await db
      .update(templates)
      .set(updateData)
      .where(eq(templates.id, params.id))
      .returning();

    return NextResponse.json({
      success: true,
      template: updatedTemplate,
      message: "Template updated successfully"
    });
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/templates/{id}:
 *   delete:
 *     summary: Delete a specific template
 *     description: |
 *       Permanently deletes a template. Only workspace templates can be deleted,
 *       and only by users with edit_template permission. Global templates cannot be deleted.
 *       
 *       ⚠️ Warning: This action cannot be undone. Forms created from this template will not be affected.
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
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Template deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Template deleted successfully"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get existing template
    const existingTemplate = await db
      .select()
      .from(templates)
      .where(eq(templates.id, params.id))
      .limit(1);

    if (existingTemplate.length === 0) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const templateData = existingTemplate[0];

    // Prevent deleting global templates
    if (templateData.isGlobal) {
      return NextResponse.json({ 
        error: "Global templates cannot be deleted" 
      }, { status: 403 });
    }

    // Verify user has delete_template permission in the workspace
    if (!templateData.workspaceId) {
      // This case should ideally not be reached if non-global templates always have a workspaceId
      return NextResponse.json({ error: "Template workspace ID is missing for a non-global template" }, { status: 500 });
    }

    // First, ensure the user is part of the workspace.
    const userRole = await getUserWorkspaceRole(userId, templateData.workspaceId);
    if (!userRole) {
      return NextResponse.json({ error: "Access denied to workspace. User is not a member." }, { status: 403 });
    }

    // Now, check for specific 'delete_template' permission
    const canDeleteTemplate = await checkWorkspacePermission(userId, templateData.workspaceId, 'templates', 'delete');
    if (!canDeleteTemplate) {
      return NextResponse.json({ 
        error: "Insufficient permissions. Requires 'delete_template' permission."
      }, { status: 403 });
    }

    // Delete the template
    await db
      .delete(templates)
      .where(eq(templates.id, params.id));

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
