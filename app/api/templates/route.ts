import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import { templates, workspaceMembers, workspaces } from "@/lib/db/schema"; // Assuming workspaceMembers is still needed for other checks or can be removed if not.
import { eq, and, or, count, desc, ilike } from "drizzle-orm";
import { checkWorkspacePermission, getUserWorkspaceRole } from "@/lib/rbac"; // Added checkWorkspacePermission and getUserWorkspaceRole

/**
 * @swagger
 * /api/templates:
 *   get:
 *     summary: List templates with filtering
 *     description: |
 *       Retrieves templates available to the user. Returns both global templates 
 *       and workspace-specific templates based on user permissions.
 *     tags: [Templates]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: query
 *         name: workspaceId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Workspace ID to filter templates for
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter templates by category (HR, Marketing, Support, Sales)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search templates by name or description
 *       - in: query
 *         name: isGlobal
 *         schema:
 *           type: boolean
 *         description: Filter by global templates only
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
 *           default: 50
 *         description: Number of templates per page
 *     responses:
 *       200:
 *         description: Successfully retrieved templates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 templates:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Template'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalTemplates:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    // const isGlobal = searchParams.get('isGlobal') === 'true'; // Logic moved down
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
    }

    // Verify user has access to the workspace
    const workspaceMember = await db
      .select()
      .from(workspaceMembers)
      .where(and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      ))
      .limit(1);

    if (workspaceMember.length === 0) {
      return NextResponse.json({ error: "Access denied to workspace" }, { status: 403 });
    }

    // Build query conditions
    let conditions = [];

    // Determine the value of isGlobal from searchParams
    const isGlobalParam = searchParams.get('isGlobal');

    if (isGlobalParam === 'true') {
      // Only global templates
      conditions.push(eq(templates.isGlobal, true));
    } else if (isGlobalParam === 'false') {
      // Only workspace-specific templates
      conditions.push(
        and(
          eq(templates.isGlobal, false),
          eq(templates.workspaceId, workspaceId)
        )
      );
    } else {
      // Default behavior: Global templates OR workspace templates for the given workspaceId
      // This handles cases where isGlobal is not 'true' or 'false' or is missing
      conditions.push(
        or(
          eq(templates.isGlobal, true),
          and(
            eq(templates.isGlobal, false), // Make sure it's a workspace template
            eq(templates.workspaceId, workspaceId) // And it belongs to the current workspace
          )
        )
      );
    }

    if (category) {
      conditions.push(eq(templates.category, category));
    }

    if (search) {
      conditions.push(
        or(
          ilike(templates.name, `%${search}%`),
          ilike(templates.description, `%${search}%`)
        )
      );
    }

    const whereCondition = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Get templates with pagination
    const templatesResult = await db
      .select()
      .from(templates)
      .where(whereCondition)
      .orderBy(desc(templates.usageCount), desc(templates.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalTemplatesResult = await db
      .select({ count: count() })
      .from(templates)
      .where(whereCondition);

    const totalTemplates = totalTemplatesResult[0]?.count || 0;
    const totalPages = Math.ceil(totalTemplates / limit);

    return NextResponse.json({
      templates: templatesResult,
      pagination: {
        page,
        limit,
        totalTemplates,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/templates:
 *   post:
 *     summary: Create a new template
 *     description: |
 *       Creates a new template in the specified workspace. 
 *       Requires create_template permission.
 *     tags: [Templates]
 *     security:
 *       - ClerkAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - formSchema
 *               - workspaceId
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 description: Template name
 *               description:
 *                 type: string
 *                 description: Template description
 *               formSchema:
 *                 type: object
 *                 description: Form configuration schema
 *               category:
 *                 type: string
 *                 enum: [HR, Marketing, Support, Sales, Education, Healthcare, Other]
 *                 description: Business category
 *               workspaceId:
 *                 type: string
 *                 format: uuid
 *                 description: Target workspace ID
 *               thumbnailUrl:
 *                 type: string
 *                 format: uri
 *                 description: Optional template preview image
 *           examples:
 *             createTemplate:
 *               summary: Create a new template
 *               value:
 *                 name: "Customer Onboarding Form"
 *                 description: "Standard form for new customer onboarding"
 *                 category: "Sales"
 *                 workspaceId: "550e8400-e29b-41d4-a716-446655440000"
 *                 formSchema:
 *                   fields:
 *                     - id: "company_name"
 *                       type: "text"
 *                       label: "Company Name"
 *                       required: true
 *                     - id: "contact_email"
 *                       type: "email"
 *                       label: "Contact Email"
 *                       required: true
 *     responses:
 *       201:
 *         description: Template created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 template:
 *                   $ref: '#/components/schemas/Template'
 *                 message:
 *                   type: string
 *                   example: "Template created successfully"
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, formSchema, category, workspaceId, thumbnailUrl } = body;

    // Validate required fields
    if (!name || !formSchema || !workspaceId) {
      return NextResponse.json({ 
        error: "Missing required fields: name, formSchema, workspaceId" 
      }, { status: 400 });
    }

    // Verify user has create_template permission in the workspace
    // First, ensure the user is part of the workspace.
    const userRole = await getUserWorkspaceRole(userId, workspaceId);
    if (!userRole) {
      return NextResponse.json({ error: "Access denied to workspace. User is not a member." }, { status: 403 });
    }

    // Now, check for specific 'create_template' permission
    const canCreateTemplate = await checkWorkspacePermission(userId, workspaceId, 'templates', 'create');
    if (!canCreateTemplate) {
      return NextResponse.json({ 
        error: "Insufficient permissions. Requires 'create_template' permission."
      }, { status: 403 });
    }

    // Generate unique ID for the template
    const templateId = createId();

    // Create the template
    const [newTemplate] = await db
      .insert(templates)
      .values({
        id: templateId,
        name,
        description,
        formSchema,
        category,
        workspaceId,
        createdBy: userId,
        thumbnailUrl,
        isGlobal: false, // User templates are never global
        usageCount: 0,
        cloneCount: 0,
      })
      .returning();

    return NextResponse.json({
      success: true,
      template: newTemplate,
      message: "Template created successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
