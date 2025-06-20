# ConvoForms - Complete Project Summary for Claude Instructions

## 🎯 Project Overview

**Convo** (formerly ConvoForms) is an AI-powered conversational form builder SaaS that transforms static forms into engaging chat-like experiences. The core value proposition is reducing form abandonment rates from 81% (traditional forms) to 40-60% higher completion rates through conversational interfaces.

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
- **Testing**: Vitest (unit) + Playwright (E2E)

## 🎨 shadcn/ui Design System

### Visual Identity
- **Foundation**: shadcn/ui components (New York style, Slate base)
- **Brand Colors**: ConvoForms purple (#a855f7) primary, blue (#3b82f6) secondary
- **Philosophy**: Professional Elegance with Proven Foundation
- **Accessibility**: WCAG 2.1 AA compliant out of the box
- **Mobile**: Mobile-first responsive design

### Component Architecture
```
components/
├── ui/                     # shadcn/ui foundation components
│   ├── button.tsx         # Base Button component
│   ├── card.tsx           # Base Card component
│   ├── input.tsx          # Base Input component
│   ├── form.tsx           # Form validation components
│   └── ...                # Other shadcn/ui components
├── app/                    # ConvoForms custom components
│   ├── dashboard/         # Dashboard components built on shadcn/ui
│   ├── form-builder/      # Form builder UI (shadcn/ui + existing logic)
│   ├── layout/            # Layout components (AppHeader, AppSidebar)
│   └── workspace/         # Workspace management components
└── shared/                 # Shared components across contexts
```

### Key Design Features
- **Button**: shadcn/ui Button with ConvoForms theme variants
- **Card**: shadcn/ui Card with hover effects and custom styling
- **Input**: shadcn/ui Input with enhanced validation states
- **StatsCard**: Custom component built on shadcn/ui Card foundation
- **AppLayout**: shadcn/ui layout patterns with Tailwind responsive design
- **Theme**: shadcn/ui theme system with ConvoForms color palette
- **Clean Imports**: `import { Button } from '@/components/ui'`

### URL Architecture (Path-Based)
ConvoForms uses a clean path-based routing system:

**Development & Production URLs:**
- Marketing: `localhost:3002/marketing` | `convo.ai` (rewrites to `/marketing`)
- App: `localhost:3002/app` | `app.convo.ai` (rewrites to `/app`)
- Forms: `localhost:3002/forms` | `forms.convo.ai` (rewrites to `/forms`)

### Route Structure
```
app/
├── page.tsx                    # Root redirect to /marketing
├── marketing/                  # Marketing site (public)
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
│   └── [workspaceSlug]/[formId]/page.tsx # Public form submission
└── api/                        # Backend APIs
```

## 🔧 Key Components & Utilities

### Context Detection (`lib/context.ts`)
- `getContext()`: Returns 'marketing', 'app', or 'forms' based on pathname
- Simple URL helpers: `getWorkspaceUrl()`, `getPublicFormUrl()`, etc.

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
**Output**: Complete form schema with proper field types, validation rules, labels, and logical ordering

### 2. Conversational Mode
Toggle between static and conversational modes:
- **Static**: Traditional form with all fields visible
- **Conversational**: Chat-like interface with one question at a time
- Same data collection, different user experience

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

## 🔄 Development Workflow

### Daily Commands
```bash
npm run db:up        # Start PostgreSQL
npm run dev          # Start development server
npm run db:studio    # Visual database browser
npm test             # Run unit tests (Vitest)
npm run test:e2e     # Run E2E tests (Playwright)
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
- Marketing: `localhost:3002/marketing`
- App: `localhost:3002/app/login`
- Forms: `localhost:3002/forms/workspace/formId`

## 📁 File Organization

### Component Structure (Organized by Context)
```
components/
├── ui/                     # shadcn/ui base components
├── shared/                 # Shared across all contexts
│   ├── theme/              # Theme provider configuration
│   └── error-boundary.tsx  # Global error handling
├── marketing/              # Marketing context components
├── app/                    # App context components (authenticated)
│   ├── dashboard/          # Dashboard components using shadcn/ui
│   ├── form-builder/       # Form builder interface
│   ├── layout/             # App layout components
│   ├── workspace/          # Workspace management
│   └── auth/               # Authentication components
└── forms/                  # Forms context components (public)
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

// 3. shadcn/ui components
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// 4. Custom app components
import { StatsCard } from '@/components/app/dashboard/stats-card'
import { AppLayout } from '@/components/app/layout/app-layout'

// 5. Utilities and types
import { cn } from '@/lib/utils'
import type { Form, Workspace } from '@/types'
```

### Component Development with shadcn/ui
```typescript
// Build custom components on shadcn/ui foundation
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function StatsCard({ title, value, change }: StatsCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <Badge variant={change.trend === 'up' ? 'default' : 'destructive'}>
              {change.value}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

## 🧪 Testing Strategy

### Unit & Integration Testing (Vitest)
- **Component tests**: shadcn/ui integration and custom components
- **Utility tests**: Helper functions and business logic
- **API tests**: Database operations and API endpoints

### End-to-End Testing (Playwright)
- **Complete user journeys**: Signup → Form Creation → Submission
- **Form builder functionality**: All form building workflows
- **Cross-browser testing**: Chrome, Firefox, Safari
- **Authentication flows**: Signup, login, workspace management

## 📋 Development Guidelines

### When Adding Features
1. **Check context**: Determine if feature belongs in marketing, app, or forms context
2. **Verify cases**: Document test cases in `docs/cases/`
3. **Use shadcn/ui foundation**: Build on proven components
4. **Follow component structure**: Place in appropriate `components/` directory
5. **Ensure accessibility**: shadcn/ui provides WCAG 2.1 AA compliance
6. **Add tests**: Write unit and E2E tests
7. **Update docs**: Keep documentation current

### Design System Implementation
- **Use shadcn/ui Components**: Import from `@/components/ui`
- **Customize with Tailwind**: Extend with utility classes for ConvoForms branding
- **Follow Color System**: Use ConvoForms purple/blue theme on shadcn/ui foundation
- **Maintain Accessibility**: Leverage built-in shadcn/ui accessibility standards
- **Dark Mode**: Use shadcn/ui theme system with seamless switching
- **Mobile Responsive**: shadcn/ui responsive patterns with Tailwind utilities

### Form Builder Safety
- **UI Enhancement Only**: Only modify styling, never business logic
- **Preserve APIs**: Keep all existing form builder APIs intact
- **Test Extensively**: Validate every change to form builder components
- **Backup Strategy**: Maintain rollback capability for form builder changes

## 🚀 Deployment & Infrastructure

### Production Stack
- **Frontend/API**: Vercel
- **Database**: Supabase PostgreSQL
- **Auth**: Clerk
- **Monitoring**: Vercel Analytics

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

## 📊 Business Context

### User Journey
1. **Discovery**: Land on `convo.ai` marketing site
2. **Signup**: Create account via `app.convo.ai/signup`
3. **Onboarding**: Create workspace with unique slug
4. **Form Creation**: Use AI prompt or drag-and-drop builder
5. **Sharing**: Embed or share forms via `forms.convo.ai`
6. **Analytics**: Review completion rates and responses

### Competitive Advantage
- **AI-first approach**: Natural language form generation
- **Conversational toggle**: Unique UX differentiation
- **Professional UI**: shadcn/ui provides polished, accessible interface
- **Developer-friendly**: Clean APIs and embed options

## 📚 Documentation Structure

### Design System Documentation
- **[Design System](./docs/design/shadcn-ui-design-system.md)**: Complete shadcn/ui design system specification
- **[Component Architecture](./docs/design/shadcn-component-architecture.md)**: Component structure and usage patterns
- **[Design Overview](./docs/design/README.md)**: Design system overview and navigation

### Feature Documentation
All features documented in `docs/cases/` with test cases:
- Form Builder, AI Generation, Workspace Management
- Authentication, Analytics, Path-based Routing
- Each feature includes comprehensive test scenarios

## 🛠️ Development Standards

### Code Quality
- **TypeScript**: Full type safety throughout
- **Testing**: Unit tests (Vitest) + E2E tests (Playwright)
- **Accessibility**: WCAG 2.1 AA compliance via shadcn/ui
- **Performance**: Optimized with Next.js and shadcn/ui best practices

### Component Guidelines
- Build custom components on shadcn/ui foundation
- Use Tailwind utilities for styling customization
- Follow established import patterns
- Document component APIs with TypeScript interfaces
- Include loading and error states

This project summary provides complete context for ConvoForms development using shadcn/ui as the design system foundation, enabling rapid development while maintaining professional quality and accessibility standards.
