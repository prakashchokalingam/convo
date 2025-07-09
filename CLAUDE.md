# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Essential commands for working with this codebase:

```bash
# Development
npm run dev                 # Start development server on port 3002
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint
npm run setup              # Initial project setup

# Database Operations
npm run db:up              # Start PostgreSQL with Docker
npm run db:down            # Stop PostgreSQL
npm run db:studio          # Open Drizzle Studio (database GUI)
npm run db:push            # Apply schema changes to database
npm run db:generate        # Generate migration files
npm run db:reset           # Reset database (deletes all data)
npm run pgadmin            # Open pgAdmin web interface

# Testing
npm test                   # Run unit tests (Vitest)
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report
npm run test:e2e           # Run E2E tests (Playwright)
npm run test:e2e:ui        # Run E2E tests with UI
npm run test:e2e:headed    # Run E2E tests in headed mode
npm run test:e2e:debug     # Debug E2E tests

# E2E Test Management (via scripts)
npm run e2e:setup          # Setup E2E environment
npm run e2e:validate       # Validate E2E setup
npm run e2e:test           # Run E2E tests via script
npm run e2e:clean          # Clean E2E environment

# Documentation
npm run docs:generate      # Generate API documentation
npm run docs:watch         # Watch and regenerate docs
npm run docs:dev           # Start dev server with docs generation
```

## Code Architecture Overview

ConvoForms is a Next.js 14 application using the App Router with multi-context architecture:

### URL Structure & Context Detection

The app uses middleware-based context detection:

**Development (Path-based):**

- Marketing: `localhost:3002/marketing` or `localhost:3002/`
- App: `localhost:3002/app/[workspaceSlug]`
- Forms: `localhost:3002/forms/[workspaceSlug]/[formId]`
- Admin: `localhost:3002/admin`

**Production (Subdomain-based):**

- Marketing: `convo.ai`
- App: `app.convo.ai/[workspaceSlug]`
- Forms: `forms.convo.ai/[workspaceSlug]/[formId]`
- Admin: `admin.convo.ai`

### Core Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk
- **AI Integration**: Google Gemini API
- **State Management**: Zustand (see `lib/store/appStore.ts`)
- **Testing**: Vitest (unit), Playwright (E2E)
- **Deployment**: Vercel + Supabase

### Key Directories

```
app/                        # Next.js App Router pages
├── (admin)/admin/         # Admin dashboard pages
├── app/[workspaceSlug]/   # Main SaaS application
├── forms/                 # Public form rendering
├── marketing/             # Marketing website
└── api/                   # Backend API routes

components/
├── ui/                    # shadcn/ui base components
├── app/                   # App-specific components
├── forms/                 # Form rendering components
├── marketing/             # Marketing components
└── shared/                # Shared utilities and theme

lib/
├── db/                    # Database schema and utilities
├── form-builder/          # Form builder logic and types
├── store/                 # Zustand state management
├── auth/                  # Authentication helpers
└── utils/                 # Shared utilities

__tests__/                 # All test files
├── components/            # Component tests
├── lib/                   # Utility tests
├── integration/           # Integration tests
└── e2e/                   # End-to-end tests
```

### Database Schema

Core tables include:

- **workspaces** - Team/personal workspaces with workspace type (`default`/`team`)
- **workspace_members** - Workspace membership with roles (owner/admin/member/viewer)
- **forms** - Form definitions with AI-generated configurations
- **templates** - Global and workspace-specific form templates
- **responses** - Form submission data
- **conversations** - Conversational form interactions
- **subscriptions** - User subscription and billing data

### Authentication & Authorization

- Clerk handles authentication with custom sign-in/sign-up pages at `/app/login` and `/app/signup`
- Workspace-based permissions with role-based access control (RBAC)
- Admin dashboard requires emails listed in `ADMIN_EMAILS` environment variable
- Admin API routes must use `withAdminApiAuth` wrapper from `lib/admin-api-auth.ts`

### Form Builder System

- Complex type system in `lib/form-builder/types.ts` supporting 20+ field types
- AI-powered form generation using Google Gemini
- Drag-and-drop form builder with conditional logic
- Template system for reusable form configurations
- Conversational mode transforms traditional forms into chat-like experiences

### Testing Strategy

- Unit tests with Vitest in `__tests__/` directory
- E2E tests with Playwright covering authentication flows, form creation, and workspace management
- Test utilities in `__tests__/utils/` for common testing patterns
- Custom E2E setup with Clerk authentication testing

### Development Workflow

1. Always start database: `npm run db:up`
2. Start development server: `npm run dev`
3. For schema changes: edit `lib/db/schema.ts` → `npm run db:generate` → `npm run db:push`
4. Use `npm run db:studio` for visual database inspection
5. Run `npm run lint` before committing
6. Run tests with `npm test` and `npm run test:e2e`

### Important Implementation Notes

- Middleware in `middleware.ts` handles context detection and workspace routing
- All forms use React Hook Form with Zod validation
- The app supports both traditional and conversational form modes
- Template system allows cloning forms and creating reusable templates
- Extensive use of shadcn/ui components with custom theming

# IMPORTANT INSTRUCTIONS

code:

- write very performant and human readable code, strictly typed
- Follow DRY Principle
  tests:
- cover essential test cases, only required
