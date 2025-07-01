import type { SwaggerDefinition } from 'swagger-jsdoc';

/**
 * Base OpenAPI configuration for the Convo Forms API
 */
export const swaggerConfig: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Convo API',
    version: '1.0.0',
    description: `
      **Convo API Documentation**
      
      A comprehensive API for managing conversational forms, workspaces, and user interactions.
      
      ## Authentication
      This API uses Clerk for authentication. Include your session token in the Authorization header:
      \`Authorization: Bearer <your-token>\`
      
      ## Rate Limiting
      API requests are rate limited per user:
      - **Free Plan**: 100 requests/hour
      - **Pro Plan**: 1000 requests/hour
      - **Enterprise**: Custom limits
      
      Rate limit headers are included in all responses:
      - \`X-RateLimit-Limit\`: Maximum requests allowed
      - \`X-RateLimit-Remaining\`: Requests remaining in current window
      - \`X-RateLimit-Reset\`: Time when the limit resets (Unix timestamp)
    `,
    contact: {
      name: 'API Support',
      email: 'support@convo.ai',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3002',
      description: 'Development server',
    },
    {
      url: 'https://convo.ai/api', // Updated to new production API base URL
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      ClerkAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Clerk session token for user authentication',
      },
      ApiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API key for programmatic access',
      },
    },
    parameters: {
      PageParam: {
        in: 'query',
        name: 'page',
        schema: {
          type: 'integer',
          minimum: 1,
          default: 1,
        },
        description: 'Page number for pagination',
      },
      LimitParam: {
        in: 'query',
        name: 'limit',
        schema: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          default: 10,
        },
        description: 'Number of items per page',
      },
      WorkspaceIdParam: {
        in: 'path',
        name: 'workspaceId',
        required: true,
        schema: {
          type: 'string',
          pattern: '^[a-z0-9]+$',
        },
        description: 'Unique workspace identifier',
      },
      FormIdParam: {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
          type: 'string',
          pattern: '^[a-z0-9]+$',
        },
        description: 'Unique form identifier',
      },
    },
    responses: {
      UnauthorizedError: {
        description: 'Authentication required',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Unauthorized',
                },
                message: {
                  type: 'string',
                  example: 'Authentication required to access this resource',
                },
                code: {
                  type: 'string',
                  example: 'AUTH_REQUIRED',
                },
              },
            },
          },
        },
      },
      ForbiddenError: {
        description: 'Access forbidden',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Forbidden',
                },
                message: {
                  type: 'string',
                  example: 'Insufficient permissions to access this resource',
                },
                code: {
                  type: 'string',
                  example: 'INSUFFICIENT_PERMISSIONS',
                },
              },
            },
          },
        },
      },
      NotFoundError: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Not Found',
                },
                message: {
                  type: 'string',
                  example: 'The requested resource was not found',
                },
                code: {
                  type: 'string',
                  example: 'NOT_FOUND',
                },
              },
            },
          },
        },
      },
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Validation Error',
                },
                message: {
                  type: 'string',
                  example: 'Request validation failed',
                },
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR',
                },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: {
                        type: 'string',
                        example: 'email',
                      },
                      message: {
                        type: 'string',
                        example: 'Invalid email format',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      RateLimitError: {
        description: 'Rate limit exceeded',
        headers: {
          'X-RateLimit-Limit': {
            schema: {
              type: 'integer',
            },
            description: 'Request limit per time window',
          },
          'X-RateLimit-Remaining': {
            schema: {
              type: 'integer',
            },
            description: 'Requests remaining in current window',
          },
          'X-RateLimit-Reset': {
            schema: {
              type: 'integer',
            },
            description: 'Time when rate limit resets (Unix timestamp)',
          },
        },
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Rate Limit Exceeded',
                },
                message: {
                  type: 'string',
                  example: 'Too many requests. Please try again later.',
                },
                code: {
                  type: 'string',
                  example: 'RATE_LIMIT_EXCEEDED',
                },
                retryAfter: {
                  type: 'integer',
                  example: 3600,
                  description: 'Seconds until rate limit resets',
                },
              },
            },
          },
        },
      },
      InternalServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Internal Server Error',
                },
                message: {
                  type: 'string',
                  example: 'An unexpected error occurred',
                },
                code: {
                  type: 'string',
                  example: 'INTERNAL_ERROR',
                },
              },
            },
          },
        },
      },
    },
    schemas: {
      PaginationMeta: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            minimum: 1,
            example: 1,
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            example: 10,
          },
          totalItems: {
            type: 'integer',
            minimum: 0,
            example: 42,
          },
          totalPages: {
            type: 'integer',
            minimum: 0,
            example: 5,
          },
          hasNext: {
            type: 'boolean',
            example: true,
          },
          hasPrev: {
            type: 'boolean',
            example: false,
          },
        },
        required: ['page', 'limit', 'totalItems', 'totalPages', 'hasNext', 'hasPrev'],
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Operation completed successfully',
          },
        },
        required: ['success'],
      },
    },
  },
  tags: [
    {
      name: 'Forms',
      description: 'Form creation, management, and publishing operations',
    },
    {
      name: 'Workspaces',
      description: 'Workspace and team management',
    },
    {
      name: 'Members',
      description: 'Workspace member management and invitations',
    },
    {
      name: 'Responses',
      description: 'Form response collection and analytics',
    },
    {
      name: 'Invitations',
      description: 'User and workspace invitation management',
    },
    {
      name: 'Usage',
      description: 'Usage analytics and billing information',
    },
    {
      name: 'Documentation',
      description: 'API documentation and metadata',
    },
  ],
};

/**
 * JSDoc swagger options configuration
 */
export const swaggerOptions = {
  definition: swaggerConfig,
  apis: [
    './app/api/**/*.ts', // Include all API route files
    './docs/swagger/schemas/*.ts', // Include schema files
  ],
};
