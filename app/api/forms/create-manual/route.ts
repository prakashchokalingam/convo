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

    // Create a default form configuration
    const defaultConfig = {
      fields: [],
      settings: {
        submitText: "Submit",
        successMessage: "Thank you for your submission!",
        allowMultipleSubmissions: false
      }
    };

    // Save form to database
    const [newForm] = await db.insert(forms).values({
      userId,
      name: "Untitled Form",
      description: "A form created with the manual builder",
      prompt: null, // No prompt for manually created forms
      config: JSON.stringify(defaultConfig),
      isConversational: false,
      isPublished: false,
    }).returning();

    return NextResponse.json({
      success: true,
      formId: newForm.id,
      message: "Form created successfully"
    });
  } catch (error) {
    console.error("Error creating manual form:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
