import { auth, clerkClient } from '@clerk/nextjs/server';
import { createId } from '@paralleldrive/cuid2';
import { eq, count, desc, and, ilike, or, gte, lt, SQL } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/drizzle/db';
import { forms, responses, workspaceMembers } from '@/drizzle/schema';


/**
 * @swagger
 * /api/forms:
 *   get:
 *     summary: List user's forms with statistics
 *     description: Retrieves a paginated list of forms belonging to the authenticated user.
 *     tags: [Forms]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 100
 *         description: Number of forms per page
 *     responses:
 *       200:
 *         description: Successfully retrieved forms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 forms:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Form'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalForms:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10'); // Default to 10
    const offset = (page - 1) * limit;

    const workspaceId = searchParams.get('workspaceId');
    const searchTerm = searchParams.get('searchTerm');
    const status = searchParams.get('status'); // 'published' or 'draft'
    const createdBy = searchParams.get('createdBy'); // userId
    const createdAtParam = searchParams.get('createdAt'); // ISO date string YYYY-MM-DD

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId query parameter is required' },
        { status: 400 }
      );
    }

    const conditions: SQL[] = [eq(forms.workspaceId, workspaceId)];

    if (searchTerm) {
      conditions.push(
        or(
          ilike(forms.title, `%${searchTerm}%`),
          ilike(forms.description, `%${searchTerm}%`) // Assuming description can be searched
        ) as SQL
      );
    }

    if (status) {
      if (status === 'published') {
        conditions.push(eq(forms.isPublished, true));
      } else if (status === 'draft') {
        conditions.push(eq(forms.isPublished, false));
      }
    }

    if (createdBy) {
      conditions.push(eq(forms.createdBy, createdBy));
    }

    if (createdAtParam) {
      try {
        const date = new Date(createdAtParam);
        if (isNaN(date.getTime())) {
          return NextResponse.json(
            { error: 'Invalid createdAt date format. Use YYYY-MM-DD.' },
            { status: 400 }
          );
        }
        // Adjust to local timezone if needed, but default JS Date is UTC.
        // For filtering a whole day, use date for start and start of next day for end.
        const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const nextDay = new Date(startDate);
        nextDay.setDate(startDate.getDate() + 1);

        conditions.push(and(gte(forms.createdAt, startDate), lt(forms.createdAt, nextDay)) as SQL);
      } catch (_e) {
        return NextResponse.json({ error: 'Invalid createdAt date processing.' }, { status: 400 });
      }
    }

    const selectedFormFields = {
      id: forms.id,
      workspaceId: forms.workspaceId,
      createdBy: forms.createdBy,
      title: forms.title,
      description: forms.description,
      prompt: forms.prompt,
      config: forms.config,
      isConversational: forms.isConversational,
      isPublished: forms.isPublished,
      version: forms.version,
      publishedAt: forms.publishedAt,
      createdAt: forms.createdAt,
      updatedAt: forms.updatedAt,
    };

    const userFormsData = await db
      .select({
        ...selectedFormFields,
        responseCount: count(responses.id),
      })
      .from(forms)
      .leftJoin(responses, eq(forms.id, responses.formId))
      .where(and(...conditions))
      .groupBy(...Object.values(selectedFormFields)) // Spread all selected form fields
      .orderBy(desc(forms.updatedAt))
      .limit(limit)
      .offset(offset);

    const formsWithCreator = [];
    for (const form of userFormsData) {
      let creatorName = 'Unknown User';
      if (form.createdBy) {
        try {
          const user = await clerkClient.users.getUser(form.createdBy);
          creatorName = user.firstName
            ? `${user.firstName} ${user.lastName || ''}`.trim()
            : user.username || 'Unknown User';
        } catch (_error) {
          console.error(`Failed to fetch user ${form.createdBy}`, _error);
          // creatorName remains 'Unknown User'
        }
      }
      formsWithCreator.push({ ...form, creatorName });
    }

    // Get total count for pagination with the same filters
    const totalFormsResult = await db
      .select({ count: count() })
      .from(forms)
      .where(and(...conditions));

    const totalForms = totalFormsResult[0]?.count || 0;
    const totalPages = Math.ceil(totalForms / limit);

    return NextResponse.json({
      forms: formsWithCreator,
      pagination: {
        page,
        limit,
        totalForms,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/forms:
 *   post:
 *     summary: Create a new form
 *     description: |
 *       Creates a new form in the specified workspace. The user must have
 *       create_form permission in the workspace (member role or above).
 *     tags: [Forms]
 *     security:
 *       - ClerkAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workspaceId
 *               - title
 *               - config
 *             properties:
 *               workspaceId:
 *                 type: string
 *                 format: uuid
 *                 description: Target workspace ID
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 description: Form title
 *               description:
 *                 type: string
 *                 description: Form description (optional)
 *               config:
 *                 type: string
 *                 description: Form configuration as JSON string
 *               isConversational:
 *                 type: boolean
 *                 default: false
 *                 description: Whether form is in conversational mode
 *               isPublished:
 *                 type: boolean
 *                 default: false
 *                 description: Whether form is published
 *           examples:
 *             createForm:
 *               summary: Create a new form
 *               value:
 *                 workspaceId: "550e8400-e29b-41d4-a716-446655440000"
 *                 title: "Customer Feedback Survey"
 *                 description: "Collect feedback from our customers"
 *                 config: '{"fields":[{"id":"feedback","type":"textarea","label":"Your Feedback","required":true}]}'
 *                 isConversational: false
 *                 isPublished: false
 *     responses:
 *       201:
 *         description: Form created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 form:
 *                   $ref: '#/components/schemas/Form'
 *                 message:
 *                   type: string
 *                   example: "Form created successfully"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      workspaceId,
      title,
      description,
      config,
      isConversational = false,
      isPublished = false,
    } = body;

    // Validate required fields
    if (!workspaceId || !title || !config) {
      return NextResponse.json(
        {
          error: 'Missing required fields: workspaceId, title, config',
        },
        { status: 400 }
      );
    }

    // Verify user has create_form permission in the workspace
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

    // Validate config is valid JSON
    try {
      JSON.parse(config);
    } catch (_error) {
      return NextResponse.json(
        {
          error: 'Invalid form configuration JSON',
        },
        { status: 400 }
      );
    }

    // Generate unique ID for the form
    const formId = createId();

    // Create the form
    const [newForm] = await db
      .insert(forms)
      .values({
        id: formId,
        workspaceId,
        createdBy: userId,
        title,
        description: description || null,
        config,
        isConversational,
        isPublished,
        version: 1,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        form: newForm,
        message: 'Form created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
