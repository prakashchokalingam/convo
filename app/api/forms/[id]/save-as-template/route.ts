import { auth } from '@clerk/nextjs';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { forms, templates, workspaceMembers } from '@/lib/db/schema';

/**
 * @swagger
 * /api/forms/{id}/save-as-template:
 *   post:
 *     summary: Save form as template
 *     description: |
 *       Creates a new template based on an existing form's configuration.
 *       The form's config field is converted to the template's formSchema format.
 *       Requires create_template permission in the form's workspace.
 *     tags: [Forms, Templates]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Form ID to save as template
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 description: Template name
 *               description:
 *                 type: string
 *                 description: Template description
 *               category:
 *                 type: string
 *                 enum: [HR, Marketing, Support, Sales, Education, Healthcare, Other]
 *                 description: Business category
 *               thumbnailUrl:
 *                 type: string
 *                 format: uri
 *                 description: Template preview image
 *           examples:
 *             saveAsTemplate:
 *               summary: Save customer survey form as template
 *               value:
 *                 name: "Customer Satisfaction Survey Template"
 *                 description: "Reusable template for customer satisfaction surveys"
 *                 category: "Marketing"
 *     responses:
 *       201:
 *         description: Template created successfully from form
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
 *                 form:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     title:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: "Template created successfully from form"
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
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, category, thumbnailUrl } = body;

    if (!name) {
      return NextResponse.json(
        {
          error: 'Missing required field: name',
        },
        { status: 400 }
      );
    }

    // Get source form
    const sourceForm = await db.select().from(forms).where(eq(forms.id, params.id)).limit(1);

    if (sourceForm.length === 0) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    const formData = sourceForm[0];

    // Verify user has access to the form's workspace
    const workspaceMember = await db
      .select({
        role: workspaceMembers.role,
      })
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, formData.workspaceId),
          eq(workspaceMembers.userId, userId)
        )
      )
      .limit(1);

    if (workspaceMember.length === 0) {
      return NextResponse.json({ error: "Access denied to form's workspace" }, { status: 403 });
    }

    // Check if user has create_template permission (owner or admin)
    const userRole = workspaceMember[0].role;
    if (!['owner', 'admin'].includes(userRole)) {
      return NextResponse.json(
        {
          error: 'Insufficient permissions. Requires create_template permission.',
        },
        { status: 403 }
      );
    }

    // Parse form config to formSchema format
    let formSchema;
    try {
      formSchema = JSON.parse(formData.config);
    } catch (_error) {
      return NextResponse.json(
        {
          error: 'Invalid form configuration format',
        },
        { status: 400 }
      );
    }

    // Create the template
    const [newTemplate] = await db
      .insert(templates)
      .values({
        name,
        description: description || formData.description,
        formSchema,
        category,
        workspaceId: formData.workspaceId,
        createdBy: userId,
        thumbnailUrl,
        isGlobal: false, // User templates are never global
        usageCount: 0,
        cloneCount: 0,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        template: newTemplate,
        form: {
          id: formData.id,
          title: formData.title,
        },
        message: 'Template created successfully from form',
      },
      { status: 201 }
    );
  } catch (_error) {
    console.error('Error saving form as template:', _error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
