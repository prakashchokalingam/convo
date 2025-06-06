import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forms, responses } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";

// GET /api/forms - List user's forms with stats
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = (page - 1) * limit;

    // Get forms with response counts
    const userForms = await db
      .select({
        id: forms.id,
        name: forms.name,
        description: forms.description,
        isPublished: forms.isPublished,
        isConversational: forms.isConversational,
        createdAt: forms.createdAt,
        updatedAt: forms.updatedAt,
        responseCount: count(responses.id)
      })
      .from(forms)
      .leftJoin(responses, eq(forms.id, responses.formId))
      .where(eq(forms.userId, userId))
      .groupBy(forms.id)
      .orderBy(desc(forms.updatedAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalFormsResult = await db
      .select({ count: count() })
      .from(forms)
      .where(eq(forms.userId, userId));

    const totalForms = totalFormsResult[0]?.count || 0;
    const totalPages = Math.ceil(totalForms / limit);

    return NextResponse.json({
      forms: userForms,
      pagination: {
        page,
        limit,
        totalForms,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
