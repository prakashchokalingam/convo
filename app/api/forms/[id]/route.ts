import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forms } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/forms/[id] - Get a specific form
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

// PATCH /api/forms/[id] - Update a specific form
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

// DELETE /api/forms/[id] - Delete a specific form
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
