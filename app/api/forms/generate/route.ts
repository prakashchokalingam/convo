import { auth } from '@clerk/nextjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createId } from '@paralleldrive/cuid2';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/drizzle/db';
import { forms, workspaceMembers } from '@/drizzle/schema';


const apiKey = process.env.GOOGLE_AI_API_KEY;
if (!apiKey) {
  throw new Error('GOOGLE_AI_API_KEY is not configured');
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, workspaceId } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
    }

    // Verify user has access to the workspace
    const workspaceMember = await db
      .select({
        role: workspaceMembers.role,
      })
      .from(workspaceMembers)
      .where(
        and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId))
      )
      .limit(1);

    if (workspaceMember.length === 0) {
      return NextResponse.json({ error: 'Access denied to workspace' }, { status: 403 });
    }

    // Check if user has create_form permission (owner, admin, or member)
    const userRole = workspaceMember[0].role;
    if (!['owner', 'admin', 'member'].includes(userRole)) {
      return NextResponse.json(
        {
          error: 'Insufficient permissions. Requires create_form permission.',
        },
        { status: 403 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

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
        name: 'AI Generated Form',
        description: 'Form created based on your requirements',
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
      console.error('Error parsing form configuration:', error);
      return NextResponse.json({ error: 'Invalid form configuration generated' }, { status: 500 });
    }

    // Generate unique ID for the form
    const formId = createId();

    // Save form to database
    const [newForm] = await db
      .insert(forms)
      .values({
        id: formId,
        workspaceId,
        createdBy: userId,
        title: metadata.name,
        description: metadata.description,
        prompt,
        config: JSON.stringify(config),
        isConversational: false,
        isPublished: false,
        version: 1,
      })
      .returning();

    return NextResponse.json({ formId: newForm.id, title: newForm.title }, { status: 201 });
  } catch (error) {
    console.error('Error generating form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
