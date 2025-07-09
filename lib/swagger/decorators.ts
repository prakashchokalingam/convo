/**
 * JSDoc helper functions and decorators for consistent API documentation
 */

/**
 * Creates standardized JSDoc documentation for API endpoints
 */
export class SwaggerDecorator {
  /**
   * Generate JSDoc for a GET endpoint with pagination
   */
  static paginated(config: {
    summary: string;
    description?: string;
    tags: string[];
    responseSchema: string;
    auth?: boolean;
  }): string {
    const { summary, description, tags, responseSchema, auth = true } = config;

    return `
/**
 * @swagger
 * ${this.getPath()}:
 *   get:
 *     summary: ${summary}
 *     ${description ? `description: ${description}` : ''}
 *     tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
 *     ${auth ? 'security:\n *       - ClerkAuth: []' : ''}
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Successfully retrieved items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/${responseSchema}'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/RateLimitError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */`;
  }

  /**
   * Generate JSDoc for a simple GET endpoint
   */
  static get(config: {
    summary: string;
    description?: string;
    tags: string[];
    responseSchema?: string;
    auth?: boolean;
    parameters?: Array<{ name: string; type: string; description: string; required?: boolean }>;
  }): string {
    const { summary, description, tags, responseSchema, auth = true, parameters = [] } = config;

    return `
/**
 * @swagger
 * ${this.getPath()}:
 *   get:
 *     summary: ${summary}
 *     ${description ? `description: ${description}` : ''}
 *     tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
 *     ${auth ? 'security:\n *       - ClerkAuth: []' : ''}
 *     ${parameters.length > 0 ? 'parameters:' : ''}
 *     ${parameters
   .map(
     param => `
 *       - in: ${param.name.includes('Id') ? 'path' : 'query'}
 *         name: ${param.name}
 *         ${param.required !== false ? 'required: true' : ''}
 *         schema:
 *           type: ${param.type}
 *         description: ${param.description}`
   )
   .join('')}
 *     responses:
 *       200:
 *         description: Successfully retrieved resource
 *         content:
 *           application/json:
 *             schema:
 *               ${responseSchema ? `$ref: '#/components/schemas/${responseSchema}'` : 'type: object'}
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */`;
  }

  /**
   * Generate JSDoc for a POST endpoint
   */
  static post(config: {
    summary: string;
    description?: string;
    tags: string[];
    requestSchema?: string;
    responseSchema?: string;
    auth?: boolean;
  }): string {
    const { summary, description, tags, requestSchema, responseSchema, auth = true } = config;

    return `
/**
 * @swagger
 * ${this.getPath()}:
 *   post:
 *     summary: ${summary}
 *     ${description ? `description: ${description}` : ''}
 *     tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
 *     ${auth ? 'security:\n *       - ClerkAuth: []' : ''}
 *     ${
   requestSchema
     ? `requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/${requestSchema}'`
     : ''
 }
 *     responses:
 *       201:
 *         description: Resource created successfully
 *         content:
 *           application/json:
 *             schema:
 *               ${responseSchema ? `$ref: '#/components/schemas/${responseSchema}'` : "$ref: '#/components/schemas/SuccessResponse'"}
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       409:
 *         description: Resource already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Conflict
 *                 message:
 *                   type: string
 *                   example: Resource already exists
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */`;
  }

  /**
   * Generate JSDoc for a PATCH endpoint
   */
  static patch(config: {
    summary: string;
    description?: string;
    tags: string[];
    requestSchema?: string;
    responseSchema?: string;
    auth?: boolean;
    pathParams?: Array<{ name: string; description: string }>;
  }): string {
    const {
      summary,
      description,
      tags,
      requestSchema,
      responseSchema,
      auth = true,
      pathParams = [],
    } = config;

    return `
/**
 * @swagger
 * ${this.getPath()}:
 *   patch:
 *     summary: ${summary}
 *     ${description ? `description: ${description}` : ''}
 *     tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
 *     ${auth ? 'security:\n *       - ClerkAuth: []' : ''}
 *     ${pathParams.length > 0 ? 'parameters:' : ''}
 *     ${pathParams
   .map(
     param => `
 *       - in: path
 *         name: ${param.name}
 *         required: true
 *         schema:
 *           type: string
 *         description: ${param.description}`
   )
   .join('')}
 *     ${
   requestSchema
     ? `requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/${requestSchema}'`
     : ''
 }
 *     responses:
 *       200:
 *         description: Resource updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               ${responseSchema ? `$ref: '#/components/schemas/${responseSchema}'` : "$ref: '#/components/schemas/SuccessResponse'"}
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */`;
  }

  /**
   * Generate JSDoc for a DELETE endpoint
   */
  static delete(config: {
    summary: string;
    description?: string;
    tags: string[];
    auth?: boolean;
    pathParams?: Array<{ name: string; description: string }>;
  }): string {
    const { summary, description, tags, auth = true, pathParams = [] } = config;

    return `
/**
 * @swagger
 * ${this.getPath()}:
 *   delete:
 *     summary: ${summary}
 *     ${description ? `description: ${description}` : ''}
 *     tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
 *     ${auth ? 'security:\n *       - ClerkAuth: []' : ''}
 *     ${pathParams.length > 0 ? 'parameters:' : ''}
 *     ${pathParams
   .map(
     param => `
 *       - in: path
 *         name: ${param.name}
 *         required: true
 *         schema:
 *           type: string
 *         description: ${param.description}`
   )
   .join('')}
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */`;
  }

  /**
   * Helper to get the current path (to be replaced during generation)
   */
  private static getPath(): string {
    return '{PATH_PLACEHOLDER}';
  }
}

/**
 * Helper functions for common documentation patterns
 */
export const DocHelpers = {
  /**
   * Standard authentication requirement
   */
  requireAuth: () => `
 *     security:
 *       - ClerkAuth: []`,

  /**
   * Standard pagination parameters
   */
  paginationParams: () => `
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'`,

  /**
   * Standard error responses
   */
  standardErrors: () => `
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'`,

  /**
   * Rate limit headers
   */
  rateLimitHeaders: () => `
 *     headers:
 *       X-RateLimit-Limit:
 *         schema:
 *           type: integer
 *         description: Request limit per time window
 *       X-RateLimit-Remaining:
 *         schema:
 *           type: integer
 *         description: Requests remaining in current window
 *       X-RateLimit-Reset:
 *         schema:
 *           type: integer
 *         description: Time when rate limit resets (Unix timestamp)`,

  /**
   * Success response with data
   */
  successResponse: (schemaRef: string) => `
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/${schemaRef}'
 *                 message:
 *                   type: string
 *                   example: Operation completed successfully`,

  /**
   * Paginated response
   */
  paginatedResponse: (schemaRef: string) => `
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/${schemaRef}'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMeta'`,
};

/**
 * Common JSDoc templates for frequent patterns
 */
export const Templates = {
  /**
   * Template for workspace-scoped endpoints (ID-based)
   */
  workspaceEndpoint: (method: string, summary: string, description?: string) => `
/**
 * @swagger
 * /api/workspaces/by-id/{workspaceId}/[resource]:
 *   ${method.toLowerCase()}:
 *     summary: ${summary}
 *     ${description ? `description: ${description}` : ''}
 *     tags: [Workspaces]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/WorkspaceIdParam'
 */`,

  /**
   * Template for workspace-scoped endpoints (slug-based)
   */
  workspaceSlugEndpoint: (method: string, summary: string, description?: string) => `
/**
 * @swagger
 * /api/workspaces/{workspaceSlug}/[resource]:
 *   ${method.toLowerCase()}:
 *     summary: ${summary}
 *     ${description ? `description: ${description}` : ''}
 *     tags: [Workspaces]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/WorkspaceSlugParam'
 */`,

  /**
   * Template for form-scoped endpoints
   */
  formEndpoint: (method: string, summary: string, description?: string) => `
/**
 * @swagger
 * /api/forms/{id}/[resource]:
 *   ${method.toLowerCase()}:
 *     summary: ${summary}
 *     ${description ? `description: ${description}` : ''}
 *     tags: [Forms]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/FormIdParam'
 */`,

  /**
   * Template for public endpoints (no auth required)
   */
  publicEndpoint: (method: string, summary: string, description?: string) => `
/**
 * @swagger
 * /api/public/[resource]:
 *   ${method.toLowerCase()}:
 *     summary: ${summary}
 *     ${description ? `description: ${description}` : ''}
 *     tags: [Public]
 */`,
};
