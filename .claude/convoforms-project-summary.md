## 🧪 Testing Strategy

### Unit & Integration Testing (Vitest)
- **Component tests**: React component functionality
- **Utility tests**: Helper functions and business logic
- **API tests**: Database operations and API endpoints
- **Configuration**: `vitest.config.ts` with jsdom environment

### End-to-End Testing (Playwright)
- **Complete user journeys**: Signup → Onboarding → Form Creation → Submission
- **Subdomain routing**: Marketing, App, and Forms context switching
- **Cross-browser testing**: Chrome, Firefox, Safari (desktop + mobile)
- **Authentication flows**: Signup, login, workspace management
- **Form lifecycle**: AI generation, manual building, submission, analytics

### Test Architecture
```
__tests__/
├── components/          # Component unit tests
├── integration/         # API and integration tests
├── lib/                 # Utility function tests
├── e2e/                 # End-to-end tests
│   ├── auth-onboarding.spec.ts
│   ├── subdomain-routing.spec.ts
│   ├── form-lifecycle.spec.ts
│   └── utils/           # E2E test utilities
└── setup.ts             # Test configuration
```

### Testing Commands
```bash
# Unit/Integration Tests
npm test                 # Run all unit tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report

# E2E Tests
npm run e2e:validate     # Quick setup validation
npm run e2e:test         # Run all E2E tests
npm run e2e:ui           # Interactive test runner
npm run e2e:headed       # See browser during tests
npm run e2e:debug        # Debug individual tests
```

# ConvoForms - Complete Project Summary for Claude Instructions

## 🎯 Project Overview

**Convo** (formerly ConvoForms) is an AI-powered conversational form builder SaaS that transforms static forms into engaging chat-like experiences. The product has been rebranded to "Convo" with a modern website redesign. The core value proposition is reducing form abandonment rates from 81% (traditional forms) to 40-60% higher completion rates through conversational interfaces.

### Business Model
- **Target Revenue**: $500 MRR in 3 months, $2000 MRR in 6 months
- **Pricing**: Free (3 forms), Starter ($19/month), Pro ($49/month), Enterprise (custom)
- **Target Market**: Small businesses, HR teams, marketers, customer support teams
- **Key Differentiator**: AI-generated forms + conversational mode toggle

## 🏗️ Technical Architecture

### Core Stack
- **Framework**: Next.js 14 (App Router) with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk (handles all user management)
- **AI**: Google Gemini API (form generation and optimization)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Deployment**: Designed for Vercel + Supabase
- **e2e**: Playwright

### URL Architecture (Path-Based)
ConvoForms uses a clean path-based routing system that's consistent across environments:

**Development & Production URLs:**
- Marketing: `localhost:3002/marketing` | `convo.ai` (rewrites to `/marketing`)
- App: `localhost:3002/app` | `app.convo.ai` (rewrites to `/app`)
- Forms: `localhost:3002/forms` | `forms.convo.ai` (rewrites to `/forms`)

**URL Examples:**
- Marketing: `/marketing`, `/marketing/pricing`, `/marketing/v2-sparrow-jot`
- App: `/app/login`, `/app/signup`, `/app/{workspaceSlug}`
- Forms: `/forms/{workspaceSlug}/{formId}`

### Route Structure
```
app/
├── page.tsx                    # Root redirect to /marketing
├── marketing/                  # Marketing site (public)
│   ├── layout.tsx              # Marketing layout
│   ├── page.tsx                # Landing page
│   ├── pricing/page.tsx        # Pricing page
│   └── v2-sparrow-jot/page.tsx # New modern landing
├── app/                        # SaaS Application (auth required)
│   ├── layout.tsx              # App layout + auth check
│   ├── login/page.tsx          # Login page
│   ├── signup/page.tsx         # Signup page
│   ├── onboarding/page.tsx     # Workspace creation
│   └── [workspaceSlug]/        # Workspace routes
│       ├── page.tsx            # Dashboard
│       ├── forms/              # Form management
│       ├── settings/           # Workspace settings
│       └── members/            # Team management
├── forms/                      # Public Forms (no auth)
│   ├── layout.tsx              # Forms layout
│   └── [workspaceSlug]/[formId]/page.tsx # Public form submission
└── api/                        # Backend APIs
```

## 🔧 Key Components & Utilities

### Context Detection (`lib/context.ts`)
Simplified context detection based on URL paths:
- `getContext()`: Returns 'marketing', 'app', or 'forms' based on pathname
- Simple URL helpers: `getWorkspaceUrl()`, `getPublicFormUrl()`, etc.
- No complex environment checks or subdomain parsing needed

### Database Schema (`drizzle/schema.ts`)
**Core Tables:**
- `users`: Synced from Clerk authentication
- `workspaces`: Containers for forms (personal/team)
- `workspace_members`: Role-based access (owner/admin/member/viewer)
- `forms`: Form definitions with AI-generated schemas
- `responses`: User submissions to forms
- `workspace_activities`: Audit log for all actions

### Authentication Flow
1. User visits `app.convo.ai/signup`
2. Clerk handles signup → redirects to `/onboarding`
3. User creates workspace → redirects to workspace dashboard
4. All app routes require authentication via layout checks

## ✨ Core Features

### 1. AI Form Generation
**Input**: Natural language prompt ("Create a job application form")
**Output**: Complete form schema with:
- Proper field types (text, email, select, radio, checkbox, etc.)
- Validation rules (required, min/max length, patterns)
- Smart labels and placeholders
- Logical field ordering

### 2. Conversational Mode
Any form can toggle between static and conversational modes:
- **Static**: Traditional form with all fields visible
- **Conversational**: Chat-like interface with one question at a time
- Same data collection, different user experience
- Progressive disclosure with natural transitions

### 3. Workspace Management
- **Personal workspaces**: Individual user environments
- **Team workspaces**: Collaborative environments with role-based access
- **URL structure**: `app.convo.ai/{workspace-slug}`
- **Workspace switching**: Dropdown component with role indicators

### 4. Form Builder
- **Drag & drop interface**: Reorder fields visually
- **Field properties panel**: Customize labels, validation, help text
- **Real-time preview**: See changes instantly
- **AI suggestions**: Smart recommendations for improvements

### 5. Response Management
- **Real-time collection**: Forms submit to `/api/forms/[id]/responses`
- **Analytics dashboard**: Completion rates, drop-off points, timing
- **Export functionality**: CSV downloads for analysis
- **Search and filtering**: Find specific responses quickly

## 🔄 Development Workflow

### Daily Commands
```bash
npm run db:up        # Start PostgreSQL
npm run dev          # Start development server
npm run db:studio    # Visual database browser
npm test             # Run unit tests (Vitest)
npm run test:e2e     # Run E2E tests (Playwright)
npm run e2e:ui       # Run E2E tests with UI
```

### Database Development
```bash
# 1. Edit schema
code drizzle/schema.ts

# 2. Generate migration
npm run db:generate

# 3. Apply changes
npm run db:push
```

### Context Testing
Direct path access for testing different contexts:
- Marketing: `localhost:3002/marketing`
- App: `localhost:3002/app/login`
- Forms: `localhost:3002/forms/workspace/formId`

## 📁 File Organization

### Component Structure (Organized by Context)
```
components/
├── shared/              # Shared across all contexts
│   ├── ui/             # shadcn/ui base components
│   ├── theme/          # Theme provider and configuration
│   └── error-boundary.tsx # Global error handling
├── marketing/           # Marketing context components
│   ├── landing-page.tsx # Original landing page
│   ├── features-showcase.tsx
│   ├── hero-demo.tsx
│   ├── faq-section.tsx
│   └── v2/             # New modern marketing site (Convo rebrand)
│       ├── convo-landing-page.tsx # Main V2 landing page
│       ├── navigation/ # Header and footer
│       │   ├── header.tsx
│       │   └── footer.tsx
│       └── sections/   # Landing page sections
│           ├── hero-section.tsx
│           ├── social-proof-section.tsx
│           ├── features-showcase.tsx
│           ├── use-cases-section.tsx
│           ├── roi-calculator-section.tsx
│           ├── testimonials-section.tsx
│           ├── integrations-section.tsx
│           ├── pricing-preview-section.tsx
│           ├── trust-indicators-section.tsx
│           └── cta-section.tsx
├── app/                 # App context components (authenticated)
│   ├── dashboard/       # Main dashboard interface
│   │   ├── app-header.tsx
│   │   ├── app-sidebar.tsx
│   │   ├── dashboard-components.tsx
│   │   └── welcome-banner.tsx
│   ├── workspace/       # Workspace management
│   │   ├── workspace-switcher.tsx
│   │   └── workspace-creation-dialog.tsx
│   ├── form-builder/    # Form creation interface
│   │   ├── core/        # Main builder components
│   │   └── conditional/ # Conditional logic components
│   ├── members/         # Team member management
│   ├── settings/        # Workspace settings
│   ├── auth/           # Authentication components
│   └── plan-usage-dashboard.tsx # Usage tracking
└── forms/              # Forms context components (public)
    └── form-components.tsx # Public form rendering
```

### Utility Structure
```
lib/
├── context.ts       # Simple path-based context detection
├── urls.ts          # Clean URL helper functions
├── workspace.ts     # Workspace management utilities
├── db.ts           # Database connection
└── utils.ts        # General utilities
```

### Hook Patterns
```
hooks/
├── use-forms.ts     # Form-related state management
├── use-workspace.ts # Workspace operations
└── use-auth.ts     # Authentication helpers
```

## 🎨 Code Patterns & Conventions

### Import Organization
```typescript
// 1. React and Next.js
import React from 'react'
import { NextRequest } from 'next/server'

// 2. Third-party libraries
import { z } from 'zod'
import { eq } from 'drizzle-orm'

// 3. Internal utilities
import { db } from '@/lib/db'
import { getSubdomainContext } from '@/lib/subdomain'

// 4. Components (organized by subdomain)
import { Button } from '@/components/shared/ui/button'
import { WorkspaceSwitcher } from '@/components/app/workspace/workspace-switcher'
import { FormBuilder } from '@/components/app/form-builder/core/FormBuilder'
import { PublicFormRenderer } from '@/components/forms/form-components'

// 5. Types
import type { Form, Workspace } from '@/types'
```

### Error Handling Pattern
```typescript
try {
  // Database operation or API call
  const result = await db.select()...
  return { success: true, data: result }
} catch (error) {
  console.error('Operation failed:', error)
  return { success: false, error: error.message }
}
```

### API Route Pattern
```typescript
export async function POST(request: Request) {
  try {
    // 1. Authentication check
    const { userId } = auth()
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    // 2. Input validation
    const body = await request.json()
    const validatedData = schema.parse(body)

    // 3. Database operation
    const result = await db.insert(table).values(validatedData)

    // 4. Success response
    return Response.json({ success: true, data: result })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

## 🔐 Authentication & Security

### Route Protection
- **App routes**: Protected by `app/(app)/layout.tsx`
- **Context verification**: Each layout checks subdomain context
- **Role-based access**: Workspace-level permissions enforced
- **API protection**: All APIs verify authentication

### Data Validation
- **Zod schemas**: All inputs validated server-side
- **Type safety**: TypeScript throughout codebase
- **SQL injection prevention**: Drizzle ORM parameterized queries

## 📊 Business Context

### User Journey
1. **Discovery**: Land on `convo.ai` marketing site
2. **Signup**: Create account via `app.convo.ai/signup`
3. **Onboarding**: Create workspace with unique slug
4. **Form Creation**: Use AI prompt or manual builder
5. **Sharing**: Embed or share forms via `forms.convo.ai`
6. **Analytics**: Review completion rates and responses

### Revenue Model
- **Freemium**: 3 forms, 100 responses/month
- **Subscription tiers**: Based on form limits and response volume
- **Team features**: Collaboration tools for higher tiers
- **Enterprise**: White-label and custom integrations

### Competitive Advantage
- **AI-first approach**: Natural language form generation
- **Conversational toggle**: Unique UX differentiation
- **Mobile-optimized**: Better mobile completion rates
- **Developer-friendly**: Clean APIs and embed options

## 🚀 Deployment & Infrastructure

### Production Stack
- **Frontend/API**: Vercel (recommended)
- **Database**: Supabase PostgreSQL
- **Auth**: Clerk (handles all user management)
- **Monitoring**: Vercel Analytics + Sentry (optional)

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# AI
GOOGLE_AI_API_KEY=AIza...

# App
NEXT_PUBLIC_APP_URL=https://convo.ai
```

### Performance Optimizations
- **Server Components**: Default to server-side rendering
- **Client Components**: Only when interactivity needed
- **Database indexing**: Optimized queries for forms/responses
- **Image optimization**: Next.js automatic optimization

## 📋 Development Guidelines

### When Adding Features
1. **Check context**: Determine if feature belongs in marketing, app, or forms context
2. **Verify cases**: Craft all the essential cases with ref to existing docs/cases/* get verified and start coding
3. **Follow patterns**: Use existing component and utility patterns
4. **Place components correctly**:
   - `components/shared/` for components used across contexts
   - `components/app/` for authenticated app features
   - `components/marketing/` for marketing site
   - `components/forms/` for public form rendering
5. **Add tests**: Write tests for new functionality
6. **Update docs**: Keep documentation current
7. **Consider mobile**: Ensure mobile-first responsive design

### Code Quality
- **TypeScript**: Use proper types, avoid `any`
- **Comments**: Add JSDoc comments for complex functions
- **Naming**: Use descriptive names for variables and functions
- **Error handling**: Always handle potential errors gracefully
- **Avoid DRY**: Have clean UI, app components, utils, hooks for reusables dont repeat.

### Database Changes
- **Migrations**: Always use Drizzle migrations for schema changes
- **Relationships**: Define proper foreign key relationships
- **Indexing**: Add indexes for frequently queried fields
- **Data validation**: Validate data both client and server-side

### Other Instructions
- Use proper linebreaks in code instead of \n
- Don't generate long summaries instead, update the docs where ever it is required.
- Keep the doc simple, should be understandble for New entry level junior Developers and UML whereever possible
- Have Swagger doc for API's
- Update the project summary if required .claude/convoforms-project-summary.md (keep it token constrained but dont miss any)
- Have a detailed cases written in docs/cases for each and every features we are building, samples below
  - Feature Name
   - [case 1] When enabled verify
   - [case 2] When enabled verify
- Cover all the essential cases with e2e test automation, feature level, don't miss out any

This project summary provides a complete technical and business context for ConvoForms, enabling AI assistants to understand the architecture, codebase patterns, and business goals effectively.
