# 📚 API Documentation System

**Automatic Swagger/OpenAPI Documentation for Convo Forms API**

A comprehensive, automatically generated API documentation system using JSDoc + TypeScript + Swagger UI.

## ✨ Features

- **🤖 Automatic Generation**: Generates OpenAPI specs from JSDoc comments and TypeScript types
- **🎨 Interactive UI**: Beautiful Swagger UI with "Try it out" functionality
- **🔐 Authentication**: Full Clerk authentication documentation
- **📊 Type Safety**: TypeScript integration for type-safe documentation
- **⚡ Hot Reload**: Development mode with automatic regeneration
- **🏷️ Rate Limiting**: API rate limit documentation and headers
- **📈 API Versioning**: Support for multiple API versions
- **🌐 Developer Portal**: Professional documentation portal

## 🏗️ Architecture

```
📂 docs/swagger/
├── 📄 config.ts              # OpenAPI base configuration
├── 🔧 generator.ts           # Main documentation generator
├── 📁 schemas/               # TypeScript schema definitions
│   └── api-schemas.ts        # API request/response schemas
└── 📁 generated/             # Auto-generated files
    └── openapi.json          # Generated OpenAPI specification

📂 lib/swagger/
├── 📄 types.ts               # Common TypeScript types
└── 🎨 decorators.ts          # JSDoc helper functions

📂 app/
├── 📁 api/docs/              # Documentation API endpoints
│   └── route.ts              # Serves OpenAPI spec
└── 📁 docs/                  # Documentation UI
    └── page.tsx              # Swagger UI portal
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Documentation

```bash
# Generate documentation once
npm run docs:generate

# Start development with auto-regeneration
npm run docs:dev

# Build with documentation
npm run docs:build
```

### 3. View Documentation

- **Interactive Documentation**: http://localhost:3002/docs
- **Raw OpenAPI Spec**: http://localhost:3002/api/docs
- **Download Spec**: http://localhost:3002/api/docs?format=json

## 📖 Usage

### Adding JSDoc to API Routes

Add comprehensive JSDoc comments to your API route handlers:

```typescript
/**
 * @swagger
 * /api/forms:
 *   get:
 *     summary: List user's forms with statistics
 *     description: |
 *       Retrieves a paginated list of forms belonging to the authenticated user.
 *       Includes response counts and basic form metadata.
 *     tags: [Forms]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Successfully retrieved forms
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormListResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function GET(request: NextRequest) {
  // Your implementation here
}
```

### Helper Functions

Use the provided helper functions for consistent documentation:

```typescript
import { SwaggerDecorator } from '@/lib/swagger/decorators';

// Quick pagination endpoint
SwaggerDecorator.paginated({
  summary: 'List forms',
  tags: ['Forms'],
  responseSchema: 'Form'
});

// Simple GET endpoint
SwaggerDecorator.get({
  summary: 'Get form',
  tags: ['Forms'],
  responseSchema: 'Form',
  parameters: [{
    name: 'id',
    type: 'string',
    description: 'Form ID',
    required: true
  }]
});
```

## 🔧 Configuration

### Base Configuration

Customize the base OpenAPI config in `docs/swagger/config.ts`:

```typescript
export const swaggerConfig: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Your API',
    version: '1.0.0',
    description: 'API description',
  },
  servers: [
    { url: 'http://localhost:3002', description: 'Development' },
    { url: 'https://api.yourapp.com', description: 'Production' },
  ],
  // ... security, components, etc.
};
```

## 📝 npm Scripts

```json
{
  "docs:generate": "tsx docs/swagger/generator.ts",
  "docs:watch": "tsx watch docs/swagger/generator.ts",
  "docs:dev": "concurrently \"next dev -p 3002\" \"npm run docs:watch\"",
  "docs:build": "npm run docs:generate && next build",
  "docs:serve": "npm run docs:generate && npm run dev"
}
```

## 🛠️ Development Workflow

### 1. Add JSDoc to New Endpoints

```typescript
/**
 * @swagger
 * /api/new-endpoint:
 *   post:
 *     summary: Create new resource
 *     # ... complete documentation
 */
export async function POST(request: NextRequest) {
  // Implementation
}
```

### 2. Update Schemas

Add new schemas to `docs/swagger/schemas/api-schemas.ts`

### 3. Regenerate Documentation

```bash
npm run docs:generate
```

### 4. Test in UI

Visit http://localhost:3002/docs to test the new documentation

## 📋 Best Practices

### JSDoc Documentation

- ✅ **Complete**: Document all endpoints, parameters, and responses
- ✅ **Consistent**: Use consistent naming and formatting
- ✅ **Examples**: Include realistic examples for all schemas
- ✅ **Descriptions**: Provide clear, helpful descriptions
- ✅ **Error Handling**: Document all possible error responses

### Schema Design

- ✅ **Reusable**: Create reusable component schemas
- ✅ **Validation**: Include validation rules (min/max, patterns)
- ✅ **Required Fields**: Clearly mark required vs optional fields
- ✅ **Types**: Use appropriate OpenAPI types and formats

## 🐛 Troubleshooting

### Documentation Not Generating

1. Check JSDoc syntax in API routes
2. Verify file paths in generator configuration
3. Ensure TypeScript compilation succeeds
4. Check console for generation errors

### Swagger UI Not Loading

1. Verify OpenAPI spec is valid JSON
2. Check browser console for errors
3. Ensure `/api/docs` endpoint is accessible
4. Verify Swagger UI dependencies are installed

### Missing Routes

1. Check if route files are named `route.ts`
2. Verify routes are in the correct directory structure
3. Ensure JSDoc comments are properly formatted
4. Check generator's route discovery logic

## 📚 Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [JSDoc Reference](https://jsdoc.app/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

🎉 **Congratulations!** You now have a fully automated, type-safe API documentation system that will grow with your API and provide an excellent developer experience.
