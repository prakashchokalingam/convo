import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forms } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, config } = body;

    if (!name || !config) {
      return NextResponse.json({ error: "Name and config are required" }, { status: 400 });
    }

    // Save form to database
    const [newForm] = await db.insert(forms).values({
      userId,
      name,
      description: description || '',
      prompt: 'Created with manual form builder',
      config: JSON.stringify(config),
      isConversational: false,
      isPublished: false,
    }).returning();

    return NextResponse.json({ 
      success: true, 
      formId: newForm.id,
      redirectUrl: `/forms/${newForm.id}/edit`
    });
  } catch (error) {
    console.error("Error saving form:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
