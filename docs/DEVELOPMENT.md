# 🛠️ Development Guide

This guide covers everything you need for day-to-day development on Convo.

## 🚀 Daily Development Workflow

### Starting Your Day
```bash
# 1. Start the database (if not running)
npm run db:up

# 2. Start the development server
npm run dev

# 3. Open your browser
# Marketing: http://localhost:3002/marketing (or / which redirects)
# App: http://localhost:3002/app/login
```

### During Development
```bash
# Hot reload is automatic - just save your files!

# Check database with visual interface
npm run db:studio

# View database logs if needed
npm run db:logs
```

### End of Day
```bash
# Database keeps running (that's fine)
# Or stop it if you prefer:
npm run db:down
```

## 🗄️ Database Development

### Schema Changes
When you need to modify the database structure:

```bash
# 1. Edit the schema file
code lib/db/schema.ts

# 2. Generate migration files
npm run db:generate

# 3. Apply changes to database
npm run db:push
```

### Inspecting Data
```bash
# Visual database browser (recommended)
npm run db:studio

# pgAdmin web interface (alternative)
npm run pgadmin
# Then visit: http://localhost:5050
# Email: admin@convo.ai
# Password: admin123
```

### Database Utilities
```bash
# View real-time database logs
npm run db:logs

# Reset database (⚠️ deletes all data)
npm run db:reset

# Check database health
npm run health
```

## 🎯 Testing Different Contexts

ConvoForms has three different "contexts" that you can test:

### Marketing Context (Public Website)
```bash
# URL: http://localhost:3002/
# What it shows: Landing page, pricing, about
# Authentication: Not required
```

### App Context (SaaS Dashboard)
```bash
# URL: http://localhost:3002/app/login
# What it shows: Login, dashboard, form builder
# Authentication: Required
```

### Forms Context (Public Form Submission)
```bash
# URL: http://localhost:3002/forms/contact/[form-id]
# What it shows: Public form for users to fill
# Authentication: Not required
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode (reruns on file changes)
npm run test:watch

# Run tests with UI (visual test runner)
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Writing Tests
Tests are located in `__tests__/` directory:
```
__tests__/
├── components/     # Component tests
├── lib/           # Utility function tests
├── integration/   # Full feature tests
└── setup.ts      # Test configuration
```

### Example Component Test
```typescript
// __tests__/components/button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

## 🔧 Common Development Tasks

### Adding a New Component
```bash
# 1. Create the component file
touch components/ui/my-component.tsx

# 2. Write the component with proper TypeScript
# 3. Export it from components/ui/index.ts
# 4. Write tests in __tests__/components/
```

### Adding a New Page
```bash
# For app pages (authenticated)
touch app/(app)/my-page/page.tsx

# For marketing pages (public)  
touch app/my-page/page.tsx

# For form pages (public)
touch app/(forms)/my-form/page.tsx
```

### Adding a New API Route
```bash
# Create API route file
touch app/api/my-endpoint/route.ts

# Example structure:
export async function GET(request: Request) {
  // Handle GET requests
}

export async function POST(request: Request) {
  // Handle POST requests
}
```

### Adding a Database Table
```typescript
// 1. Edit lib/db/schema.ts
export const myTable = pgTable('my_table', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// 2. Generate and apply migration
// npm run db:generate
// npm run db:push
```

## 🔍 Debugging

### Database Issues
```bash
# Check if database is running
docker ps | grep postgres

# View database connection logs
npm run db:logs

# Reset database (nuclear option)
npm run db:reset
```

### Application Issues
```bash
# Clear Next.js cache
rm -rf .next

# Restart with fresh cache
npm run dev
```

### Environment Issues
```bash
# Check environment variables are loaded
cat .env.local

# Verify required variables are present
echo $DATABASE_URL
```

## 📁 File Organization

### Adding New Files
Follow these conventions:

**Components**
```
components/
├── ui/              # Reusable UI components
├── app/             # App-specific components  
├── forms/           # Form-related components
├── marketing/       # Landing page components
└── [feature]/       # Feature-specific components
```

**Utilities**
```
lib/
├── db/              # Database schema and utilities
├── auth/            # Authentication helpers
├── forms/           # Form processing logic
└── utils/           # General utilities
```

**Hooks**
```
hooks/
├── use-forms.ts     # Form-related hooks
├── use-auth.ts      # Authentication hooks
└── use-[feature].ts # Feature-specific hooks
```

### Import Organization
Order imports consistently:
```typescript
// 1. React and Next.js imports
import React from 'react'
import { NextRequest } from 'next/server'

// 2. Third-party libraries
import { z } from 'zod'
import { eq } from 'drizzle-orm'

// 3. Internal utilities and config
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

// 4. Components
import { Button } from '@/components/ui/button'
import { FormBuilder } from '@/components/form-builder'

// 5. Types
import type { Form, Field } from '@/types'
```

## 🔄 Git Workflow

### Daily Commits
```bash
# Make small, frequent commits
git add .
git commit -m "feat: add form validation"

# Push regularly
git push origin main
```

### Commit Message Format
```bash
# Types: feat, fix, docs, style, refactor, test, chore
feat: add conversational mode toggle
fix: resolve form submission bug
docs: update API documentation
style: improve button hover states
refactor: simplify form validation logic
test: add integration tests for forms
chore: update dependencies
```

### Branch Strategy
```bash
# For features
git checkout -b feature/conversational-mode
# Work on feature, commit, push
git push origin feature/conversational-mode
# Create PR when ready

# For bugs
git checkout -b fix/form-validation-error
# Fix bug, commit, push
git push origin fix/form-validation-error
# Create PR when ready
```

## 🚨 Common Issues & Solutions

### "Database connection failed"
```bash
# Solution: Start the database
npm run db:up

# Wait 5 seconds, then push schema
npm run db:push
```

### "Module not found" errors
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Environment variables not loading"
```bash
# Solution: Check .env.local exists and has correct format
ls -la .env.local
cat .env.local
```

### "Port 3002 already in use"
```bash
# Solution: Kill process or use different port
lsof -ti:3002 | xargs kill -9
# Or run on different port
npm run dev -- -p 3003
```

### "Authentication not working"
```bash
# Solution: Check Clerk keys in .env.local
# Make sure you're in the right context:
# Navigate to /app/* paths for authenticated routes (e.g., http://localhost:3002/app/login)
```

## 🛡️ Admin Dashboard Development

The application includes an admin dashboard with specific development patterns.

### Accessing the Admin Dashboard
-   **Local URL**: `http://localhost:3002/admin/overview` (or `/admin/workspaces`)
-   **Authentication**: Requires a user authenticated via Clerk whose email is listed in the `ADMIN_EMAILS` environment variable (comma-separated).
-   See `README.md` for `ADMIN_EMAILS` setup.

### Admin Pages
-   Admin pages are located under `app/(admin)/admin/`.
-   The layout `app/(admin)/admin/layout.tsx` handles page-level authentication and authorization.

### Admin API Routes
-   **Namespace**: Admin-specific API routes should be placed under `app/api/admin/`. For example, `app/api/admin/stats/route.ts`.
-   **Authorization**: All admin API routes **must** be protected using the `withAdminApiAuth` higher-order function from `lib/admin-api-auth.ts`. This helper verifies that the authenticated user's email is in `ADMIN_EMAILS`.

    ```typescript
    // Example: app/api/admin/some-action/route.ts
    import { NextRequest, NextResponse } from 'next/server';
    import { withAdminApiAuth } from '@/lib/admin-api-auth';

    export const GET = withAdminApiAuth(async (req, { authResult }) => {
      // authResult.userId is available if needed
      // ... your admin logic here
      return NextResponse.json({ message: "Admin action successful" });
    });
    ```
-   **Swagger Documentation**: All admin API routes must be documented using JSDoc comments for Swagger generation, similar to other API routes. Ensure you use the "Admin" tag. Schemas specific to admin APIs can be defined in `docs/swagger/schemas/admin-api-schemas.ts`.

## 📋 Development Checklist

### Before Starting Work
- [ ] Database is running (`npm run db:up`)
- [ ] Environment variables are set
- [ ] Dependencies are installed (`npm install`)
- [ ] Tests are passing (`npm test`)

### Before Committing
- [ ] Code is properly formatted
- [ ] No console.logs left in code
- [ ] Tests are passing
- [ ] TypeScript has no errors

### Before Deploying
- [ ] All tests pass
- [ ] Environment variables are set in production
- [ ] Database migrations are applied
- [ ] Error monitoring is configured

This development guide should help you work efficiently on Convo. Remember to commit early and often, test your changes, and ask questions when stuck!
