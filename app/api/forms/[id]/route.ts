import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forms } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * @swagger
 * /api/forms/{id}:
 *   get:
 *     summary: Get a specific form
 *     description: |
 *       Retrieves detailed information about a specific form.
 *       Only returns forms that belong to the authenticated user.
 *     tags: [Forms]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/FormIdParam'
 *     responses:
 *       200:
 *         description: Form retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Form'
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *                   userId: "user_2NiWrEwuDBCQ7XiZpFxGD7CpYKx"
 *                   name: "Customer Feedback Survey"
 *                   description: "Collect valuable customer feedback"
 *                   config: '{"fields":[{"id":"field_1","type":"text","label":"Name","required":true,"order":1}]}'
 *                   isConversational: false
 *                   isPublished: true
 *                   createdAt: "2024-01-15T10:30:00Z"
 *                   updatedAt: "2024-01-20T14:45:00Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
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

    const form = await db
      .select()
      .from(forms)
      .where(and(eq(forms.id, params.id), eq(forms.userId, userId)))
      .limit(1);

    if (form.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(form[0]);
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/forms/{id}:
 *   patch:
 *     summary: Update a specific form
 *     description: |
 *       Updates form properties such as name, description, configuration, and publish status.
 *       Only the form owner can update their forms.
 *       
 *       **Updatable Fields:**
 *       - name: Form display name
 *       - description: Form description
 *       - config: Form structure and fields (JSON)
 *       - isConversational: Enable/disable conversational mode
 *       - isPublished: Publish/unpublish the form
 *     tags: [Forms]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/FormIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFormRequest'
 *           examples:
 *             updateBasicInfo:
 *               summary: Update basic form information
 *               value:
 *                 name: "Updated Customer Survey"
 *                 description: "Updated description for our customer feedback form"
 *             publishForm:
 *               summary: Publish a form
 *               value:
 *                 isPublished: true
 *             updateConfig:
 *               summary: Update form configuration
 *               value:
 *                 config:
 *                   fields:
 *                     - id: "field_1"
 *                       type: "text"
 *                       label: "Full Name"
 *                       required: true
 *                       order: 1
 *                     - id: "field_2"
 *                       type: "email"
 *                       label: "Email Address"
 *                       required: true
 *                       order: 2
 *     responses:
 *       200:
 *         description: Form updated successfully
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
 *                 message:
 *                   type: string
 *                   example: "Form updated successfully"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, config, isConversational, isPublished } = body;

    // Verify the form exists and belongs to the user
    const existingForm = await db
      .select()
      .from(forms)
      .where(and(eq(forms.id, params.id), eq(forms.userId, userId)))
      .limit(1);

    if (existingForm.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (config !== undefined) updateData.config = JSON.stringify(config);
    if (isConversational !== undefined) updateData.isConversational = isConversational;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    // Update the form
    const [updatedForm] = await db
      .update(forms)
      .set(updateData)
      .where(and(eq(forms.id, params.id), eq(forms.userId, userId)))
      .returning();

    return NextResponse.json({
      success: true,
      form: updatedForm,
    });
  } catch (error) {
    console.error("Error updating form:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/forms/{id}:
 *   delete:
 *     summary: Delete a specific form
 *     description: |
 *       Permanently deletes a form and all associated data including responses.
 *       Only the form owner can delete their forms.
 *       
 *       **⚠️ Warning:** This action cannot be undone. All form responses will be permanently deleted.
 *     tags: [Forms]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/FormIdParam'
 *     responses:
 *       200:
 *         description: Form deleted successfully
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
 *                   example: "Form deleted successfully"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
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

    // Verify the form exists and belongs to the user
    const existingForm = await db
      .select()
      .from(forms)
      .where(and(eq(forms.id, params.id), eq(forms.userId, userId)))
      .limit(1);

    if (existingForm.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Delete the form
    await db
      .delete(forms)
      .where(and(eq(forms.id, params.id), eq(forms.userId, userId)));

    return NextResponse.json({
      success: true,
      message: "Form deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting form:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
