const fs = require('fs');
const path = require('path');

// Simple OpenAPI spec for initial testing
const basicOpenApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Convo Forms API',
    version: '1.0.0',
    description: 'API for managing conversational forms and workspaces',
    'x-generated-at': new Date().toISOString(),
  },
  servers: [
    {
      url: 'http://localhost:3002',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      ClerkAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Clerk session token',
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
                error: { type: 'string', example: 'Unauthorized' },
                message: { type: 'string', example: 'Authentication required' },
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
                error: { type: 'string', example: 'Internal Server Error' },
                message: { type: 'string', example: 'An unexpected error occurred' },
              },
            },
          },
        },
      },
    },
    schemas: {
      Form: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          isPublished: { type: 'boolean' },
          isConversational: { type: 'boolean' },
          config: { type: 'string', description: 'Form configuration as JSON' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'userId', 'name', 'config'],
      },
    },
  },
  paths: {
    '/api/forms': {
      get: {
        summary: 'List user forms',
        tags: ['Forms'],
        security: [{ ClerkAuth: [] }],
        responses: {
          '200': {
            description: 'Successfully retrieved forms',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    forms: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Form' },
                    },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
  },
  tags: [
    { name: 'Forms', description: 'Form management operations' },
  ],
};

// Ensure directory exists
const outputDir = path.join(__dirname, 'docs', 'swagger', 'generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the spec
const outputPath = path.join(outputDir, 'openapi.json');
fs.writeFileSync(outputPath, JSON.stringify(basicOpenApiSpec, null, 2));

console.log('✅ Basic OpenAPI spec generated successfully!');
console.log(`📄 Output: ${outputPath}`);
console.log('🚀 You can now run: npm run docs:dev');
