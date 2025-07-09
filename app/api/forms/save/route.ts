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
    const { workspaceId, name, description, config } = body;

    if (!workspaceId || !name || !config) {
      return NextResponse.json(
        { error: 'Workspace ID, name and config are required' },
        { status: 400 }
      );
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

    // Generate unique ID for the form
    const formId = createId();

    // Save form to database
    const [newForm] = await db
      .insert(forms)
      .values({
        id: formId,
        workspaceId,
        createdBy: userId,
        title: name,
        description: description || '',
        prompt: 'Created with manual form builder',
        config: JSON.stringify(config),
        isConversational: false,
        isPublished: false,
        version: 1,
      })
      .returning();

    return NextResponse.json({
      success: true,
      formId: newForm.id,
      redirectUrl: `/app/${workspaceId}/forms/${newForm.id}/edit`,
    });
  } catch (error) {
    console.error('Error saving form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
