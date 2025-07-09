# 🏗️ Convo Architecture

This document explains how Convo is built and organized.

## High-Level Overview

Convo is a **Next.js 14 application** with these main parts:

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

- **Marketing**: `convo.ai` (e.g., `https://convo.ai/pricing`)
- **App**: `app.convo.ai` (e.g., `https://app.convo.ai/workspace-slug/settings`)
- **Forms**: `forms.convo.ai` (e.g., `https://forms.convo.ai/workspace-slug/form-id`)
- **Admin**: `admin.convo.ai` (e.g., `https://admin.convo.ai/overview`)

### Development URLs (Path-based)

- **Marketing**: `localhost:3002/marketing` (e.g., `http://localhost:3002/marketing/pricing`)
- **App**: `localhost:3002/app` (e.g., `http://localhost:3002/app/workspace-slug/settings`)
- **Forms**: `localhost:3002/forms` (e.g., `http://localhost:3002/forms/workspace-slug/form-id`)
- **Admin**: `localhost:3002/admin` (e.g., `http://localhost:3002/admin/overview`)

## File Structure

```
app/
├── marketing/                # 🌐 Marketing pages (e.g., homepage, pricing)
│   └── page.tsx              # Example: Marketing homepage (if moved from app/page.tsx)
├── app/                      # 📱 SaaS App (e.g., app.convo.ai, localhost:3002/app)
│   ├── layout.tsx            # Layout for the main application
│   ├── login/page.tsx        # Login page
│   ├── signup/page.tsx       # Signup page
│   ├── onboarding/page.tsx   # Workspace creation
│   └── [workspaceSlug]/      # Workspace-specific routes
│       ├── page.tsx          # Dashboard
│       ├── forms/            # Form management
│       └── ...               # Other app features (settings, members)
├── admin/                    # 🛡️ Admin Dashboard (e.g., admin.convo.ai, localhost:3002/admin)
│   ├── layout.tsx            # Layout for the admin section
│   ├── overview/page.tsx     # Admin overview page
│   └── ...                   # Other admin features (workspaces, users)
├── forms/                    # 📝 Public Forms (e.g., forms.convo.ai, localhost:3002/forms)
│   ├── layout.tsx            # Layout for public forms
│   └── [workspaceSlug]/[formId]/ # Public form submission page
│       └── page.tsx
├── api/                      # 🔧 Backend APIs
│   ├── ...                   # API routes
└── layout.tsx                # Root layout (applies to all, including marketing if not overridden)
└── page.tsx                  # Root page (often the main marketing homepage)
```

_Note: `app/page.tsx` is often the marketing homepage. If marketing has its own layout and more pages, it might be in `app/marketing/`._

## Key Components

### Directory-based Routing

Next.js uses directory structure within `app/` for routing:

- `app/app/...` maps to `/app/...` URLs (main application, `app.convo.ai`).
- `app/admin/...` maps to `/admin/...` URLs (admin dashboard, `admin.convo.ai`).
- `app/forms/...` maps to `/forms/...` URLs (public forms, `forms.convo.ai`).
- `app/marketing/...` or root `app/page.tsx` for marketing site (`convo.ai`).
  Route groups like `(groupName)` can still be used for organization without affecting URL paths, if needed.

### Context Detection

The app detects which "context" (or part of the site) you're in, often via middleware:

```typescript
// Example logic in middleware.ts
// let context: 'marketing' | 'app' | 'forms' | 'admin' = 'marketing';
// Based on hostname (prod) or path prefix (dev)
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
4. **Test different contexts**: Navigate to paths like `/app` or `/forms` (e.g., `http://localhost:3002/app/dashboard`)

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
