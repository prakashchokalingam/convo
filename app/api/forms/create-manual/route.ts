import { auth } from '@clerk/nextjs';
import { createId } from '@paralleldrive/cuid2';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/drizzle/db';
import { forms, workspaceMembers } from '@/drizzle/schema';


export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { workspaceId } = body;

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

    // Create a default form configuration
    const defaultConfig = {
      fields: [],
      settings: {
        submitText: 'Submit',
        successMessage: 'Thank you for your submission!',
        allowMultipleSubmissions: false,
      },
    };

    // Generate unique ID for the form
    const formId = createId();

    // Save form to database
    const [newForm] = await db
      .insert(forms)
      .values({
        id: formId,
        workspaceId,
        createdBy: userId,
        title: 'Untitled Form',
        description: 'A form created with the manual builder',
        prompt: null, // No prompt for manually created forms
        config: JSON.stringify(defaultConfig),
        isConversational: false,
        isPublished: false,
        version: 1,
      })
      .returning();

    return NextResponse.json({
      success: true,
      formId: newForm.id,
      message: 'Form created successfully',
    });
  } catch (error) {
    console.error('Error creating manual form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
