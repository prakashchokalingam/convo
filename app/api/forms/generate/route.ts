import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { forms } from "@/lib/db/schema";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const prompt = formData.get("prompt") as string;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Generate form metadata (name and description)
    const metadataPrompt = `Based on this form requirement, generate a JSON with a concise name and description:

"${prompt}"

Return ONLY a JSON object with this structure:
{
  "name": "Brief, clear form name (max 50 chars)",
  "description": "One sentence description of the form's purpose (max 100 chars)"
}

Examples:
- For customer feedback: {"name": "Customer Feedback Survey", "description": "Collect valuable feedback about your product or service experience."}
- For job application: {"name": "Job Application Form", "description": "Apply for open positions by providing your experience and qualifications."}`;

    const metadataResult = await model.generateContent(metadataPrompt);
    const metadataText = metadataResult.response.text();
    
    let metadata;
    try {
      metadata = JSON.parse(metadataText);
    } catch (error) {
      // Fallback if JSON parsing fails
      metadata = {
        name: "AI Generated Form",
        description: "Form created based on your requirements"
      };
    }

    // Generate form configuration
    const systemPrompt = `You are an expert form builder AI. Based on the user's requirements, generate a JSON configuration for a form.

The JSON should have this exact structure:
{
  "fields": [
    {
      "id": "field_1",
      "type": "text|email|number|tel|select|radio|checkbox|textarea|date|time|url|file",
      "label": "Field label as a question",
      "placeholder": "Helpful placeholder text",
      "required": true|false,
      "options": [{"value": "option1", "label": "Option 1"}], // only for select/radio/checkbox
      "validation": {
        "minLength": 2,
        "maxLength": 100,
        "min": 1,
        "max": 10,
        "pattern": "regex pattern"
      }
    }
  ],
  "settings": {
    "submitText": "Submit",
    "successMessage": "Thank you for your submission!",
    "allowMultipleSubmissions": false
  }
}

Rules:
- Use appropriate field types for the data being collected
- Make labels conversational and friendly
- Add reasonable validation rules
- For select/radio/checkbox fields, provide realistic options
- Keep field IDs simple: field_1, field_2, etc.
- Make required fields that are essential for the form's purpose
- Use helpful placeholder text
- Return ONLY the JSON, no additional text

Create a form configuration for: ${prompt}`;

    const configResult = await model.generateContent(systemPrompt);
    const configText = configResult.response.text();

    let config;
    try {
      // Clean the response to extract JSON if it's wrapped in code blocks
      const cleanedText = configText.replace(/```json\n?|\n?```/g, '').trim();
      config = JSON.parse(cleanedText);
    } catch (error) {
      console.error("Error parsing form configuration:", error);
      return NextResponse.json({ error: "Invalid form configuration generated" }, { status: 500 });
    }

    // Save form to database
    const [newForm] = await db.insert(forms).values({
      userId,
      name: metadata.name,
      description: metadata.description,
      prompt,
      config: JSON.stringify(config),
      isConversational: false,
      isPublished: false,
    }).returning();

    // Redirect to form editor
    return NextResponse.redirect(new URL(`/forms/${newForm.id}/edit`, request.url));
  } catch (error) {
    console.error("Error generating form:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}