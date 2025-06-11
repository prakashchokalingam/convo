# 🏗️ ConvoForms Architecture

This document explains how ConvoForms is built and organized.

## High-Level Overview

ConvoForms is a **Next.js 14 application** with these main parts:

```
🌐 Frontend (Next.js + React)
├── Marketing Website (public)
├── App Dashboard (authenticated)
└── Form Submission Pages (public)

🔧 Backend (Next.js API Routes)
├── Form Management APIs
├── AI Integration (Google Gemini)
└── Authentication (Clerk)

🗄️ Database (PostgreSQL + Drizzle ORM)
├── Users & Workspaces
├── Forms & Fields
└── Responses & Analytics
```

## URL Structure (Subdomain-Based)

We use **route groups** and **subdomain simulation** for clean separation:

### Production URLs
- **Marketing**: `convo.ai`
- **App**: `app.convo.ai/workspace`
- **Forms**: `forms.convo.ai/contact/form123`

### Development URLs
- **Marketing**: `localhost:3002/`
- **App**: `localhost:3002/workspace?subdomain=app`
- **Forms**: `localhost:3002/contact/form123?subdomain=forms`

## File Structure

```
app/
├── page.tsx                    # 🏠 Marketing homepage
├── (app)/                      # 📱 SaaS App (auth required)
│   ├── layout.tsx              # App-wide layout + auth check
│   ├── login/page.tsx          # Login page
│   ├── signup/page.tsx         # Signup page
│   ├── onboarding/page.tsx     # Workspace creation
│   └── [workspaceSlug]/        # Workspace routes
│       ├── page.tsx            # Dashboard
│       ├── forms/              # Form management
│       ├── settings/           # Workspace settings
│       └── members/            # Team management
├── (forms)/                    # 📝 Public Forms (no auth)
│   ├── layout.tsx              # Forms-only layout
│   └── [type]/[formId]/        # Public form submission
│       └── page.tsx
└── api/                        # 🔧 Backend APIs
    ├── forms/                  # Form CRUD operations
    └── setup-workspace/        # Workspace creation
```

## Key Components

### Route Groups
We use Next.js route groups for clean organization:
- `(app)/` - All authenticated app routes
- `(forms)/` - All public form submission routes
- Root level - Marketing pages

### Context Detection
The app detects which "context" you're in:
```typescript
// lib/subdomain.ts
export function getSubdomainContext(): 'marketing' | 'app' | 'forms'
```

This determines:
- What layout to show
- Whether authentication is required
- How URLs are generated

### Authentication Flow
1. **Marketing Context**: No auth required
2. **App Context**: Requires login → redirects to workspace
3. **Forms Context**: Public access for form submissions

## Data Flow

### 1. Form Creation
```
User types prompt → AI generates schema → Save to database → Show in builder
```

### 2. Form Submission
```
User fills form → Validate data → Save response → Show thank you
```

### 3. Conversational Mode
```
Form schema → Generate chat flow → Progressive disclosure → Same data collection
```

## Database Schema

### Core Tables
- **users** - User profiles from Clerk
- **workspaces** - Team/personal workspaces
- **workspace_members** - Who has access to what
- **forms** - Form definitions and settings
- **form_fields** - Individual form fields
- **form_responses** - Submitted form data

### Key Relationships
```
User → Workspace (via workspace_members)
Workspace → Forms (one-to-many)
Form → Fields (one-to-many)
Form → Responses (one-to-many)
```

## AI Integration

### Prompt to Schema
```typescript
// User input: "Create a contact form"
// AI output: JSON schema with fields, validation, etc.
{
  "fields": [
    { "type": "text", "label": "Name", "required": true },
    { "type": "email", "label": "Email", "required": true },
    { "type": "textarea", "label": "Message", "required": true }
  ]
}
```

### Conversational Flow
The same form schema gets transformed into a chat-like experience:
- One question at a time
- Natural transitions
- Progress tracking
- Same validation rules

## State Management

### Client State
- **React Hook Form** for form handling
- **URL state** for navigation and filters
- **Local storage** for user preferences

### Server State
- **Database** as source of truth
- **Clerk** for authentication state
- **API routes** for data fetching

## Styling & UI

### Design System
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for consistent components
- **CSS variables** for theming
- **Mobile-first** responsive design

### Component Structure
```
components/
├── ui/              # Basic UI components (buttons, inputs)
├── app/             # App-specific components (sidebar, header)
├── form-builder/    # Form creation interface
├── forms/           # Form rendering components
└── marketing/       # Landing page components
```

## Development Workflow

### Local Development
1. **Start database**: `npm run db:up`
2. **Start app**: `npm run dev`
3. **Make changes**: Hot reload automatically
4. **Test different contexts**: Add `?subdomain=app` or `?subdomain=forms`

### Database Changes
1. **Edit schema**: `lib/db/schema.ts`
2. **Generate migration**: `npm run db:generate`
3. **Apply changes**: `npm run db:push`

## Performance Considerations

### Server Components
- Most pages are server components (faster initial load)
- Client components only when needed (forms, interactive elements)

### Database Optimization
- Proper indexing on frequently queried fields
- Pagination for large datasets
- Connection pooling for database efficiency

### Caching Strategy
- Static pages cached at CDN level
- API responses cached where appropriate
- Database queries optimized with proper relations

## Security

### Authentication
- **Clerk** handles all auth complexity
- **Route protection** at layout level
- **API protection** using Clerk middleware

### Data Validation
- **Zod schemas** for all inputs
- **Server-side validation** for all API routes
- **SQL injection protection** via Drizzle ORM

### Access Control
- **Workspace-level permissions** (owner, admin, member, viewer)
- **Route-level access checks**
- **API-level authorization**

## Deployment Architecture

### Production Setup
```
Vercel (Frontend + API) → Supabase (Database) → Clerk (Auth)
```

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

This architecture provides:
- **Scalable** - Can handle growth
- **Maintainable** - Clear separation of concerns
- **Secure** - Proper authentication and validation
- **Fast** - Optimized for performance
