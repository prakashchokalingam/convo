# Project Organization Guide

## 📁 Directory Structure

### Root Level
```
convo/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/                    # Utilities and business logic
├── __tests__/             # Test files (organized by type)
├── docs/                  # Documentation
├── scripts/               # Build and utility scripts
├── public/                # Static assets
├── drizzle/               # Database migrations
└── config files           # Various configuration files
```

### App Directory (`/app`)
```
app/
├── (app)/                 # App subdomain (app.mywebsite.com)
│   ├── (auth)/           # Authentication routes (grouped)
│   │   ├── sign-in/      # Sign-in page
│   │   ├── sign-up/      # Sign-up page
│   │   └── layout.tsx    # Auth-specific layout
│   ├── dashboard/        # User dashboard
│   ├── forms/            # Form management
│   │   └── new/         # Create new form
│   ├── form/            # Form builder
│   ├── layout.tsx       # App layout (with sidebar/navbar)
│   └── page.tsx         # App home (redirects to dashboard)
├── (forms)/              # Forms subdomain (forms.mywebsite.com)
│   ├── layout.tsx       # Minimal public layout
│   └── page.tsx         # Forms landing page
├── (marketing)/          # Main domain (mywebsite.com)
│   ├── layout.tsx       # Marketing layout
│   └── page.tsx         # Marketing homepage
├── api/                  # API routes
│   └── forms/           # Form-related API endpoints
├── globals.css          # Global styles
├── layout.tsx           # Root layout
└── page.tsx             # Root page (redirects to marketing)
```

### Components Directory (`/components`)
```
components/
├── app/                  # App subdomain specific components
│   ├── navbar.tsx       # App navigation bar
│   └── sidebar.tsx      # App sidebar navigation
├── form-builder/        # Form builder components
│   └── core/           # Core form builder logic
│       ├── FormBuilder.tsx
│       ├── FormCanvas.tsx
│       ├── FieldLibrary.tsx
│       └── PropertiesPanel.tsx
├── theme/               # Theme provider and components
│   ├── index.ts
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
└── ui/                  # Reusable UI components (shadcn/ui)
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── ...
```

### Library Directory (`/lib`)
```
lib/
├── db/                   # Database related code
│   ├── index.ts         # Database connection
│   └── schema.ts        # Drizzle schema definitions
├── form-builder/        # Form builder business logic
│   ├── types.ts         # TypeScript types
│   ├── constants.ts     # Constants and defaults
│   └── field-registry.ts # Field type registry
└── utils.ts             # Shared utility functions
```

### Test Directory (`/__tests__`)
```
__tests__/
├── components/          # Component tests
│   ├── form-builder.test.tsx
│   └── section-drop-overlay.test.tsx
├── lib/                 # Library/utility tests
│   ├── constants-and-types.test.ts
│   └── field-registry.test.ts
├── utils/               # Test utilities and helpers
│   ├── test-helpers.tsx
│   └── test-utilities.test.tsx
├── integration/         # Integration tests
│   └── form-workflows.test.ts
└── setup.ts            # Global test setup
```

### Documentation Directory (`/docs`)
```
docs/
├── development/         # Development guides
│   ├── quickstart.md
│   ├── subdomain-setup.md
│   ├── database-schema.md
│   └── project-organization.md
├── deployment/          # Deployment guides
├── api/                 # API documentation
│   └── prompts/        # AI prompt templates
├── features.md         # Feature specifications
└── roadmap.md          # Project roadmap
```

## 🎯 Organization Principles

### 1. Feature-Based Grouping
- Components are grouped by feature area (app, form-builder, ui)
- Tests are organized by type and mirror source structure
- API routes follow RESTful conventions

### 2. Subdomain Architecture
- Each subdomain has its own route group in `/app`
- Shared components are in `/components/ui`
- Subdomain-specific components are in feature folders

### 3. Separation of Concerns
- Business logic in `/lib`
- UI components in `/components`
- Tests in `/__tests__` (not scattered)
- Documentation in `/docs`

### 4. Scalable Structure
- Easy to add new subdomains
- Clear boundaries between features
- Modular component architecture
- Comprehensive test coverage

## 📝 File Naming Conventions

### Components
- PascalCase: `FormBuilder.tsx`
- Index files for barrel exports: `index.ts`
- Feature prefixes: `form-builder/core/FormBuilder.tsx`

### Pages
- kebab-case directories: `sign-in/`
- Always `page.tsx` for pages
- Always `layout.tsx` for layouts

### Tests
- Match source file names: `form-builder.test.tsx`
- Test utilities: `test-helpers.tsx`
- Integration tests: descriptive names

### Documentation
- kebab-case: `project-organization.md`
- Descriptive names: `subdomain-setup.md`

## 🔄 Import Patterns

### Absolute Imports
```typescript
// Use @ alias for project root
import { Button } from '@/components/ui/button'
import { FormBuilder } from '@/components/form-builder/core/FormBuilder'
import { db } from '@/lib/db'
```

### Relative Imports
```typescript
// Only for sibling files
import { FormCanvas } from './FormCanvas'
import { FieldLibrary } from './FieldLibrary'
```

### Barrel Exports
```typescript
// components/ui/index.ts
export { Button } from './button'
export { Card } from './card'
export { Input } from './input'

// Usage
import { Button, Card, Input } from '@/components/ui'
```

## 🧪 Testing Strategy

### Test Organization
- **Unit tests**: Test individual components/functions
- **Integration tests**: Test workflows and component interactions
- **Utilities**: Test helper functions and shared logic

### Test Location
- Co-located with source code type (components, lib, etc.)
- Separate directory structure mirrors source
- Shared test utilities in `/__tests__/utils`

### Test Naming
- Descriptive test names
- Group related tests with `describe` blocks
- Use `it` for specific test cases

## 📚 Documentation Strategy

### Development Docs
- Setup and installation guides
- Architecture explanations
- Troubleshooting guides

### API Documentation
- Endpoint specifications
- Request/response examples
- Authentication requirements

### User Documentation
- Feature explanations
- Usage examples
- Best practices

## 🎨 Component Architecture

### UI Components (`/components/ui`)
- Reusable, unstyled base components
- No business logic
- Props-based customization
- Consistent API patterns

### Feature Components
- Business logic integration
- Feature-specific styling
- Composed from UI components
- Clear prop interfaces

### Layout Components
- Page structure and navigation
- Authentication boundaries
- Responsive design
- Theme integration

## 🔧 Configuration Files

### Root Level Config
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `next.config.js` - Next.js configuration
- `vitest.config.ts` - Test configuration
- `drizzle.config.ts` - Database configuration

### Environment Files
- `.env.local.example` - Template for local environment
- `.env.local` - Local development variables (gitignored)

## 🚀 Deployment Structure

### Build Artifacts
- `.next/` - Next.js build output (gitignored)
- `node_modules/` - Dependencies (gitignored)
- Coverage reports (gitignored)

### Static Assets
- `public/` - Images, icons, and static files
- Served directly by Next.js

## 📋 Maintenance Guidelines

### Adding New Features
1. Create feature directory in appropriate location
2. Add corresponding tests
3. Update documentation
4. Add to export barrels if needed

### Refactoring
1. Maintain directory structure principles
2. Update imports and exports
3. Run full test suite
4. Update documentation

### Code Review Checklist
- [ ] Follows naming conventions
- [ ] Proper directory placement
- [ ] Tests included
- [ ] Documentation updated
- [ ] Import paths correct

This organization ensures the project remains maintainable, scalable, and easy to navigate as it grows.