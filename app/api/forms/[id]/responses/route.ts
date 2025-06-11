import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forms, responses } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

// GET /api/forms/[id]/responses - Get responses for a specific form
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // First verify the form exists and belongs to the user
    const form = await db
      .select()
      .from(forms)
      .where(and(eq(forms.id, params.id), eq(forms.userId, userId)))
      .limit(1);

    if (form.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Get responses for the form
    const formResponses = await db
      .select({
        id: responses.id,
        formId: responses.formId,
        data: responses.data,
        metadata: responses.metadata,
        completedAt: responses.completedAt,
      })
      .from(responses)
      .where(eq(responses.formId, params.id))
      .orderBy(desc(responses.completedAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalResponsesResult = await db
      .select({ count: responses.id })
      .from(responses)
      .where(eq(responses.formId, params.id));

    const totalResponses = totalResponsesResult.length;
    const totalPages = Math.ceil(totalResponses / limit);

    return NextResponse.json({
      responses: formResponses,
      pagination: {
        page,
        limit,
        totalResponses,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      form: form[0] // Include form details for context
    });
  } catch (error) {
    console.error("Error fetching form responses:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
