import { auth } from '@clerk/nextjs/server';
import { eq, and, desc, count as drizzleCount } from 'drizzle-orm'; // aliasing count to avoid conflict if any
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
// Assuming forms schema has createdBy and workspaceId.
// Assuming workspaceMembers schema exists and has workspaceId and userId.
import { forms, responses, workspaceMembers } from '@/lib/db/schema';

// GET /api/forms/[id]/responses - Get responses for a specific form
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formId = params.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10'); // Adjusted default limit
    const offset = (page - 1) * limit;

    // 1. Fetch the form details for authorization
    const formResult = await db
      .select({
        createdBy: forms.createdBy,
        workspaceId: forms.workspaceId,
        // Select all other form fields needed for the 'form' object in response
        id: forms.id,
        title: forms.title,
        description: forms.description,
        isPublished: forms.isPublished,
        isConversational: forms.isConversational,
        // Add any other fields from the 'forms' table that are expected in form: formDetails in the response
        createdAt: forms.createdAt,
        updatedAt: forms.updatedAt,
        prompt: forms.prompt,
        config: forms.config,
        version: forms.version,
        publishedAt: forms.publishedAt,
      })
      .from(forms)
      .where(eq(forms.id, formId))
      .limit(1);

    if (formResult.length === 0) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }
    const formDetails = formResult[0];

    // 2. Authorization check
    let isAuthorized = false;
    if (formDetails.createdBy === userId) {
      isAuthorized = true;
    } else if (formDetails.workspaceId) {
      const memberResult = await db
        .select({ id: workspaceMembers.id }) // select minimal data
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, formDetails.workspaceId),
            eq(workspaceMembers.userId, userId)
          )
        )
        .limit(1);
      if (memberResult.length > 0) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
      .where(eq(responses.formId, formId))
      .orderBy(desc(responses.completedAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalResponsesResult = await db
      .select({ value: drizzleCount(responses.id) }) // Corrected count
      .from(responses)
      .where(eq(responses.formId, formId));

    const totalResponses = totalResponsesResult[0]?.value || 0; // Corrected access to count
    const totalPages = Math.ceil(totalResponses / limit);

    return NextResponse.json({
      responses: formResponses,
      pagination: {
        page,
        limit,
        totalResponses,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      form: formDetails, // Use the fetched formDetails
    });
  } catch (error) {
    console.error('Error fetching form responses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
