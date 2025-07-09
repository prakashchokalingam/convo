import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/drizzle/db';
import { forms } from '@/drizzle/schema';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formId = params.id;
    if (!formId) {
      return NextResponse.json({ error: 'Form ID is required' }, { status: 400 });
    }

    let isPublished: boolean;
    try {
      const body = await request.json();
      isPublished = body.isPublished;
      if (typeof isPublished !== 'boolean') {
        return NextResponse.json(
          { error: 'Invalid isPublished value. Must be a boolean.' },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Authorization: Check if the form exists and belongs to the user
    const formArray = await db
      .select({ createdBy: forms.createdBy })
      .from(forms)
      .where(eq(forms.id, formId))
      .limit(1);

    if (formArray.length === 0) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    const form = formArray[0];
    if (form.createdBy !== userId) {
      // Although workspace membership might also be a valid check,
      // for toggling publish, direct ownership is a stricter and safer default.
      return NextResponse.json({ error: 'Forbidden: You do not own this form' }, { status: 403 });
    }

    // Update the form status
    const newStatus = isPublished;
    const updateResult = await db
      .update(forms)
      .set({
        isPublished: newStatus,
        updatedAt: new Date(),
        publishedAt: newStatus ? new Date() : null,
      })
      .where(eq(forms.id, formId))
      .returning({ updatedId: forms.id });

    if (updateResult.length === 0) {
      // This case should ideally not be reached if the prior check passed,
      // but it's a safeguard.
      return NextResponse.json(
        { error: 'Failed to update form, or form not found after ownership check.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Form publish status updated successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating form publish status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
