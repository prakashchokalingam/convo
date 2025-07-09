import fs from 'fs/promises';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';

import { SwaggerGenerator } from '../../../docs/swagger/generator';

/**
 * @swagger
 * /api/docs:
 *   get:
 *     summary: Get OpenAPI specification
 *     description: Returns the complete OpenAPI specification for the Convo Forms API
 *     tags: [Documentation]
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, yaml]
 *           default: json
 *         description: Response format (json or yaml)
 *       - in: query
 *         name: version
 *         schema:
 *           type: string
 *           default: latest
 *         description: API version to retrieve
 *     responses:
 *       200:
 *         description: OpenAPI specification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: OpenAPI 3.0 specification object
 *           application/x-yaml:
 *             schema:
 *               type: string
 *               description: OpenAPI specification in YAML format
 *       404:
 *         description: API documentation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Not Found
 *                 message:
 *                   type: string
 *                   example: API documentation not found. Please run 'npm run docs:generate' to generate documentation.
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    // Path to the generated OpenAPI specification
    const specPath = path.join(process.cwd(), 'docs/swagger/generated/openapi.json');

    try {
      // Check if the specification file exists
      await fs.access(specPath);
    } catch {
      // If file doesn't exist, try to generate it
      try {
        const generator = new SwaggerGenerator();
        await generator.generate();
      } catch (generateError) {
        console.error('❌ Failed to generate OpenAPI spec:', generateError);
        return NextResponse.json(
          {
            error: 'Not Found',
            message:
              'API documentation not found. Please run "npm run docs:generate" to generate documentation.',
            code: 'DOCS_NOT_FOUND',
          },
          { status: 404 }
        );
      }
    }

    // Read the specification file
    const specContent = await fs.readFile(specPath, 'utf-8');
    const spec = JSON.parse(specContent);

    // Add runtime metadata
    spec.info = {
      ...spec.info,
      'x-served-at': new Date().toISOString(),
      'x-server-version': process.env.npm_package_version || '1.0.0',
    };

    // Return appropriate format
    if (format === 'yaml') {
      // Convert to YAML (you'd need to install js-yaml for this)
      // For now, just return JSON with yaml content-type
      return new NextResponse(JSON.stringify(spec, null, 2), {
        headers: {
          'Content-Type': 'application/x-yaml',
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        },
      });
    }

    return NextResponse.json(spec, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'X-API-Version': spec.info?.version || '1.0.0',
      },
    });
  } catch (error) {
    console.error('Error serving OpenAPI documentation:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to serve API documentation',
        code: 'DOCS_ERROR',
      },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/docs:
 *   post:
 *     summary: Regenerate API documentation
 *     description: Triggers regeneration of the OpenAPI specification
 *     tags: [Documentation]
 *     security:
 *       - ClerkAuth: []
 *     responses:
 *       200:
 *         description: Documentation regenerated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API documentation regenerated successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     routesCount:
 *                       type: integer
 *                       example: 25
 *                     schemasCount:
 *                       type: integer
 *                       example: 15
 *                     generatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function POST() {
  try {
    const generator = new SwaggerGenerator();
    const result = await generator.generate();

    return NextResponse.json({
      success: true,
      message: 'API documentation regenerated successfully',
      metadata: {
        routesCount: result.routes.length,
        schemasCount: result.schemas.length,
        generatedAt: result.timestamp,
        version: result.version,
      },
    });
  } catch (error) {
    console.error('Error regenerating documentation:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to regenerate API documentation',
        code: 'DOCS_GENERATION_ERROR',
      },
      { status: 500 }
    );
  }
}
