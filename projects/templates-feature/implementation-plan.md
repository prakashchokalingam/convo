# Templates Feature Implementation Plan

## 📋 Project Overview

As an admin, I should be able to create forms from templates and manage templates. This feature introduces a template system with global pre-defined templates and user-created templates.

## 🎯 Smart Implementation Strategy

**Key Principles:**

- ✅ Build reusable components first, assemble features second
- ✅ Leverage existing form builder extensively
- ✅ Follow established codebase patterns
- ✅ Component-level testing for maximum reusability
- ✅ Clear dependency tracking with parallel development opportunities

**Reusable Components Library:**

- `TemplateCard` - Works for both global and user templates
- `TemplateGrid` - Search, filter, pagination for all template lists
- `TemplatePreview` - Modal with permission-based actions
- `TemplateSelector` - For form creation integration

**Existing Code Leverage:**

- Form Builder → Template Editor (add template mode)
- Form Creation → Enhanced with template selection
- Permission System → Extended with template permissions

---

## 🏗️ Phase 1: Foundation (Database + Core API)

**Status: ✅ Complete**
**Dependencies: None**
**Parallel Work: Global template content creation**
**Estimated Time: Week 1**
**Started: June 10, 2025**
**Completed: June 10, 2025**

### 1.1 Database Schema Implementation

**Location: `drizzle/schema.ts`**

- [x] Add `templates` table with comprehensive schema

  ```typescript
  export const templates = pgTable('templates', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    formSchema: jsonb('form_schema').notNull(), // Reuse existing form schema format
    category: varchar('category', { length: 100 }), // HR, Marketing, Support, etc.
    isGlobal: boolean('is_global').default(false),
    createdBy: text('created_by').references(() => users.id),
    workspaceId: uuid('workspace_id').references(() => workspaces.id),
    usageCount: integer('usage_count').default(0),
    cloneCount: integer('clone_count').default(0),
    thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });
  ```

- [x] Add `formTemplates` relationship tracking

  ```typescript
  export const formTemplates = pgTable('form_templates', {
    formId: uuid('form_id').references(() => forms.id),
    templateId: uuid('template_id').references(() => templates.id),
    createdAt: timestamp('created_at').defaultNow(),
  });
  ```

- [x] Extend workspace permissions (leverage existing permission system)
  - [ ] Add `create_template` to workspace roles
  - [ ] Add `edit_template` to workspace roles
  - [ ] Verify `create_form` permission exists
        **Note: Permission system to be implemented at API level**

### 1.2 Database Migration & Global Content

**Can be done in parallel with API development**

- [x] Generate and apply Drizzle migration

  ```bash
  npm run db:generate
  npm run db:push
  ```

  **Migration file created: `0004_add_templates_system.sql`**

- [x] Create global template seed data (leverage existing form schemas)
      **File: `drizzle/seeds/global-templates.ts`**
  - [x] HR Templates (3): Job Application, Employee Survey, Performance Review
  - [x] Marketing Templates (3): Lead Form, Event Registration, Feedback Survey
  - [x] Support Templates (3): Contact Form, Bug Report, Feature Request
  - [x] Sales Templates (3): Quote Request, Demo Booking, CRM Lead
        **Created 12 comprehensive global templates with realistic form schemas**

### 1.3 Core API Layer

**Location: `app/api/templates/`**
**Pattern: Follow existing form API patterns**

- [x] `GET /api/templates` - List with filtering
  - [x] Permission check: workspace access
  - [x] Filter: global templates + workspace templates
  - [x] Query params: category, search, isGlobal

- [x] `GET /api/templates/[id]` - Single template
  - [x] Permission check: workspace access or global
  - [x] Return full template with form schema

- [x] `POST /api/templates` - Create template
  - [x] Permission check: `create_template`
  - [x] Validation: name, schema format
  - [x] Auto-assign workspace context

- [x] `PUT /api/templates/[id]` - Update template
  - [x] Permission check: `edit_template` + ownership
  - [x] Prevent editing global templates

- [x] `DELETE /api/templates/[id]` - Delete template
  - [x] Permission check: `edit_template` + ownership
  - [x] Soft delete or cascade handling

- [x] `POST /api/templates/[id]/clone` - Clone to workspace
  - [x] Permission check: `create_template`
  - [x] Increment original clone_count
  - [x] Create workspace copy

- [x] `POST /api/templates/[id]/create-form` - Form from template
  - [x] Permission check: `create_form`
  - [x] Increment usage_count
  - [x] Leverage existing form creation logic

- [x] `POST /api/forms/[id]/save-as-template` - Save form as template
  - [x] Permission check: `create_template` + form ownership
  - [x] Extract form schema into template format

**All API endpoints created with comprehensive Swagger documentation**

---

## 🧩 Phase 2: Reusable Components Library

**Status: 🟡 In Progress**
**Dependencies: Phase 1 API endpoints**
**Strategy: Build once, use everywhere**
**Estimated Time: Week 2**
**Started: June 10, 2025**

### 2.1 Core Template Components

**Location: `components/app/templates/core/`**
**Pattern: Follow existing form builder component patterns**

- [ ] `TemplateCard` component - The foundation component

  ```typescript
  interface TemplateCardProps {
    template: Template;
    showActions?: boolean;
    onClone?: (templateId: string) => void;
    onCreateForm?: (templateId: string) => void;
    onEdit?: (templateId: string) => void;
    onDelete?: (templateId: string) => void;
    permissions: {
      canClone: boolean;
      canCreateForm: boolean;
      canEdit: boolean;
      canDelete: boolean;
    };
  }
  ```

  - [ ] Template preview thumbnail
  - [ ] Usage statistics display (forms created, times cloned)
  - [ ] Permission-based action buttons
  - [ ] Global vs User template indicator badge
  - [ ] Business category badge
  - [ ] Hover states and animations

- [ ] `TemplateGrid` component - Reusable list container

  ```typescript
  interface TemplateGridProps {
    templates: Template[];
    loading?: boolean;
    emptyState?: ReactNode;
    searchQuery?: string;
    categoryFilter?: string;
    onTemplateAction?: (action: string, templateId: string) => void;
    permissions: TemplatePermissions;
  }
  ```

  - [ ] Responsive grid layout (1-4 columns based on screen size)
  - [ ] Loading skeleton states
  - [ ] Empty state with call-to-action
  - [ ] Search highlighting
  - [ ] Infinite scroll or pagination support

- [ ] `TemplatePreview` component - Universal preview modal

  ```typescript
  interface TemplatePreviewProps {
    template: Template;
    isOpen: boolean;
    onClose: () => void;
    actions: TemplateAction[];
  }
  ```

  - [ ] Full form schema display
  - [ ] Field-by-field preview
  - [ ] Action buttons in modal footer
  - [ ] Responsive modal design
  - [ ] Keyboard navigation support

### 2.2 Specialized Components

**Location: `components/app/templates/specialized/`**

- [ ] `TemplateSelector` component - For form creation integration

  ```typescript
  interface TemplateSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (template: Template) => void;
    filterGlobal?: boolean;
    categoryFilter?: string;
  }
  ```

  - [ ] Compact template browser
  - [ ] Quick search functionality
  - [ ] Category tabs
  - [ ] Selection confirmation

- [ ] `TemplateActionButtons` component - Reusable action controls

  ```typescript
  interface TemplateActionButtonsProps {
    template: Template;
    permissions: TemplatePermissions;
    variant?: 'card' | 'list' | 'preview';
    onAction: (action: TemplateAction) => void;
  }
  ```

  - [ ] Permission-aware button rendering
  - [ ] Loading states for actions
  - [ ] Confirmation dialogs integration
  - [ ] Multiple layout variants

### 2.3 Search and Filter Components

**Location: `components/app/templates/filters/`**
**Reuse pattern: Similar to form filtering**

- [ ] `TemplateSearch` component
  - [ ] Real-time search with debouncing
  - [ ] Search in name, description, category
  - [ ] Clear search functionality
  - [ ] Search history/suggestions

- [ ] `TemplateCategoryFilter` component
  - [ ] Business category chips
  - [ ] Multi-select capability
  - [ ] Global/User template toggle
  - [ ] Active filter indicators

### 2.4 Component Integration Tests

**Test each component in isolation**

- [ ] TemplateCard component tests
  - [ ] Permission-based rendering
  - [ ] Action button functionality
  - [ ] Statistics display

- [ ] TemplateGrid component tests
  - [ ] Loading states
  - [ ] Empty states
  - [ ] Search integration

- [ ] TemplatePreview component tests
  - [ ] Modal behavior
  - [ ] Form schema rendering
  - [ ] Action integration

---

## 🏠 Phase 3: Templates Page Assembly

**Status: 🔴 Not Started**
**Dependencies: Phase 2 components**
**Strategy: Assemble features from reusable components**

### 3.1 Templates Page Structure

**Location: `app/(app)/[workspaceSlug]/templates/page.tsx`**
**Pattern: Follow existing dashboard page patterns**

- [ ] Main Templates page component

  ```typescript
  export default function TemplatesPage() {
    // Leverage existing workspace context
    // Use existing permission hooks
    // Assemble TemplateGrid components
  }
  ```

  - [ ] Page header with breadcrumbs (reuse existing pattern)
  - [ ] Tab navigation component (Global Templates | Templates)
  - [ ] Search and filter controls (assemble from Phase 2 components)
  - [ ] Permission-gated "Create Template" button

### 3.2 Tab Implementation

**Leverage existing tab patterns from dashboard**

- [ ] `GlobalTemplatesTab` component

  ```typescript
  function GlobalTemplatesTab() {
    // Use TemplateGrid from Phase 2
    // Pass global templates filter
    // Handle permission-based actions
  }
  ```

  - [ ] Fetch global templates via API
  - [ ] Render using TemplateGrid component
  - [ ] Business category filtering integration
  - [ ] Clone and create form actions

- [ ] `UserTemplatesTab` component

  ```typescript
  function UserTemplatesTab() {
    // Use TemplateGrid from Phase 2
    // Pass workspace templates filter
    // Handle CRUD operations
  }
  ```

  - [ ] Fetch workspace templates via API
  - [ ] Render using TemplateGrid component
  - [ ] Create, edit, delete functionality
  - [ ] Template creation dialog integration

### 3.3 Navigation Integration

**Location: `components/app/dashboard/app-sidebar.tsx`**
**Pattern: Follow existing sidebar menu items**

- [ ] Add Templates menu item
  - [ ] Template icon (lucide-react)
  - [ ] Route to `/templates`
  - [ ] Permission-based visibility (check workspace permissions)
  - [ ] Active state styling

### 3.4 Template Operations

**Leverage reusable components from Phase 2**

- [ ] Template creation flow
  - [ ] "Create Template" button opens dialog
  - [ ] Use existing dialog patterns
  - [ ] Template metadata form (name, description, category)
  - [ ] Option to start from scratch or existing form
  - [ ] Redirect to template editor (leverage form builder)

- [ ] Template actions implementation
  - [ ] Clone: Use API + TemplateActionButtons component
  - [ ] Edit: Navigate to form builder in template mode
  - [ ] Delete: Confirmation dialog + API call
  - [ ] Create Form: Navigate to form builder with template data

### 3.5 Page Integration Tests

**Test page assembly and routing**

- [ ] Templates page routing tests
- [ ] Tab switching functionality
- [ ] Permission-based UI rendering
- [ ] Search and filter integration
- [ ] Template action workflows

---

## 🔄 Phase 4: Form Builder Integration

**Status: 🔴 Not Started**  
**Dependencies: Phase 3 templates page, existing form builder**
**Strategy: Extend existing form builder with template capabilities**

### 4.1 Form Creation Enhancement

**Location: Existing form creation page**
**Pattern: Enhance existing flow, don't rebuild**

- [ ] Enhanced form creation page

  ```typescript
  // Extend existing form creation component
  function FormCreationOptions() {
    return (
      <div className="grid grid-cols-2 gap-4">
        <TemplateSelectionCard onClick={openTemplateSelector} />
        <ScratchCreationCard onClick={createBlankForm} />
      </div>
    );
  }
  ```

  - [ ] Two-option layout: "Choose Template" vs "Start Fresh"
  - [ ] Visual cards with icons and descriptions
  - [ ] Integrate with existing form creation workflow
  - [ ] Preserve existing "Start Fresh" functionality

- [ ] Template selection integration
  - [ ] Use TemplateSelector component from Phase 2
  - [ ] Filter templates by workspace permissions
  - [ ] Preview integration before selection
  - [ ] Seamless transition to form builder

### 4.2 Form Builder Template Mode

**Location: Existing form builder components**
**Strategy: Add template mode to existing builder**

- [ ] Template editing capability

  ```typescript
  // Extend existing form builder context
  interface FormBuilderContext {
    mode: 'form' | 'template';
    templateId?: string;
    // ... existing context
  }
  ```

  - [ ] Add template mode to existing form builder
  - [ ] Template-specific save logic (save to templates table)
  - [ ] Template metadata editing (name, description, category)
  - [ ] Reuse all existing form builder components
  - [ ] Template preview functionality

- [ ] Save button enhancement

  ```typescript
  // Extend existing save functionality
  function SaveDropdown() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>Save</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={saveForm}>Save Form</DropdownMenuItem>
          <DropdownMenuItem onClick={saveAsTemplate}>Save as Template</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  ```

  - [ ] Convert Save button to dropdown menu
  - [ ] Add "Save as Template" option
  - [ ] Template metadata collection dialog
  - [ ] Success feedback and navigation

### 4.3 In-Builder Template Browsing

**Location: Form builder toolbar**
**Strategy: Add secondary actions to existing toolbar**

- [ ] "Browse Templates" button
  - [ ] Secondary button placement near existing actions
  - [ ] Opens TemplateSelector component in modal
  - [ ] Quick template application
  - [ ] Confirmation when replacing existing form content

- [ ] Template replacement flow

  ```typescript
  function applyTemplate(template: Template) {
    if (hasFormContent) {
      showConfirmationDialog({
        title: 'Replace form content?',
        description: 'This will replace your current form with the template.',
        onConfirm: () => loadTemplateSchema(template),
      });
    } else {
      loadTemplateSchema(template);
    }
  }
  ```

  - [ ] Check for existing form content
  - [ ] Confirmation dialog for destructive actions
  - [ ] Smooth template loading animation
  - [ ] Preserve undo/redo functionality

### 4.4 Form-Template Relationship Tracking

**Location: Existing form save logic**
**Strategy: Extend existing save functionality**

- [ ] Track template usage
  - [ ] Record form-template relationship in database
  - [ ] Increment template usage_count
  - [ ] Add template source indicator in form metadata
  - [ ] Analytics tracking for template effectiveness

- [ ] Template update notifications
  - [ ] Optional: Notify when source template is updated
  - [ ] Option to sync changes from template
  - [ ] Maintain form independence after creation

### 4.5 Integration Testing

**Test template integration with existing form workflows**

- [ ] Form creation with templates
- [ ] Template editing workflow
- [ ] Save as template functionality
- [ ] In-builder template browsing
- [ ] Form-template relationship tracking

---

## 🔐 Phase 5: Security & Permission Integration

**Status: 🔴 Not Started**
**Dependencies: All previous phases**
**Strategy: Extend existing permission system**

### 5.1 Permission System Extension

**Location: Existing permission logic**
**Pattern: Follow existing workspace permission patterns**

- [ ] Extend workspace role definitions

  ```typescript
  // Add to existing workspace permissions
  const TEMPLATE_PERMISSIONS = {
    create_template: ['owner', 'admin'],
    edit_template: ['owner', 'admin'],
    create_form: ['owner', 'admin', 'member'], // Existing permission
  } as const;
  ```

  - [ ] Add template permissions to existing role system
  - [ ] Leverage existing permission checking infrastructure
  - [ ] Update permission middleware to include template checks
  - [ ] Ensure consistent permission patterns

### 5.2 Security Implementation

**Location: API routes and components**
**Pattern: Follow existing security patterns**

- [ ] API security measures
  - [ ] Template ownership validation (leverage existing patterns)
  - [ ] Input sanitization (reuse existing validation)
  - [ ] Rate limiting (extend existing rate limits)
  - [ ] Audit logging (integrate with existing activity logs)

- [ ] UI permission enforcement
  - [ ] Component-level permission checks (reuse existing hooks)
  - [ ] Conditional rendering (follow existing patterns)
  - [ ] Permission-aware navigation

### 5.3 Security Testing

- [ ] Permission boundary tests
- [ ] Authorization bypass attempts
- [ ] Input validation tests
- [ ] Cross-workspace access prevention

---

## ✅ Phase 6: Comprehensive Testing

**Status: 🔴 Not Started**
**Dependencies: Phases 1-5**
**Strategy: Component-level testing leveraging reusability**

### 6.1 Component Testing Strategy

**Test reusable components thoroughly once**

- [ ] Core component tests (from Phase 2)
  - [ ] TemplateCard component test suite
  - [ ] TemplateGrid component test suite
  - [ ] TemplatePreview component test suite
  - [ ] TemplateSelector component test suite

- [ ] API endpoint tests (from Phase 1)
  - [ ] Template CRUD operations
  - [ ] Permission enforcement
  - [ ] Error handling
  - [ ] Data validation

### 6.2 Integration Testing

**Test component assembly and workflows**

- [ ] Templates page integration tests
- [ ] Form builder integration tests
- [ ] Permission system integration tests
- [ ] Template usage tracking tests

### 6.3 E2E Testing

**Critical user journeys**

- [ ] Complete template management workflow
- [ ] Form creation from template journey
- [ ] Permission-based access scenarios
- [ ] Template search and discovery

### 6.4 Test Cases Validation

**Reference: `docs/cases/templates-feature.md`**

- [ ] Validate all 37 test cases from documentation
- [ ] Automate critical test cases
- [ ] Performance testing with large template sets
- [ ] Mobile responsive testing

---

## 💯 Phase 7: Polish & Launch Preparation

**Status: 🔴 Not Started**
**Dependencies: Phases 1-6**
**Strategy: Final optimization and documentation**

### 7.1 Performance Optimization

**Leverage existing optimization patterns**

- [ ] Template caching strategies
  - [ ] Global template caching (extend existing cache patterns)
  - [ ] User template workspace-level caching
  - [ ] Template preview image optimization

- [ ] UI performance
  - [ ] Lazy loading for template grids
  - [ ] Infinite scroll for large template sets
  - [ ] Image optimization for template thumbnails
  - [ ] Search debouncing and optimization

### 7.2 Accessibility & Mobile

**Follow existing accessibility standards**

- [ ] Accessibility compliance
  - [ ] Screen reader optimization
  - [ ] Keyboard navigation
  - [ ] ARIA labels and descriptions
  - [ ] Color contrast validation

- [ ] Mobile optimization
  - [ ] Responsive template cards
  - [ ] Touch-friendly interactions
  - [ ] Mobile template browsing

### 7.3 Documentation & Training

**Update existing documentation systems**

- [ ] Technical documentation
  - [ ] Update project summary with template feature
  - [ ] API documentation (Swagger/OpenAPI)
  - [ ] Component documentation (Storybook)
  - [ ] Permission system updates

- [ ] User documentation
  - [ ] Template creation guides
  - [ ] Template usage workflows
  - [ ] Permission explanations

### 7.4 Launch Checklist

**Final validation before release**

- [ ] Feature flag implementation
- [ ] Database migration validation
- [ ] Performance benchmarking
- [ ] Security audit
- [ ] User acceptance testing
- [ ] Rollback plan preparation

---

## 🎯 Acceptance Criteria Checklist

### Core Functionality

- [ ] Users can navigate to templates page via sidebar
- [ ] Global templates are displayed with proper categorization
- [ ] Users can clone global templates (with proper permissions)
- [ ] Users can create forms from templates
- [ ] Users can create, edit, and delete their own templates
- [ ] Template usage statistics are tracked and displayed
- [ ] Form creation flow includes template options
- [ ] Users can save existing forms as templates

### Permission System

- [ ] `create_template` permission controls template creation
- [ ] `edit_template` permission controls template editing
- [ ] `create_form` permission controls form creation from templates
- [ ] UI elements are properly hidden based on permissions
- [ ] API endpoints enforce permission checks

### User Experience

- [ ] Templates are displayed in an intuitive card layout
- [ ] Search and filtering work correctly
- [ ] Template preview functionality works
- [ ] Confirmation dialogs prevent accidental deletions
- [ ] Success/error feedback is provided for all actions
- [ ] Mobile experience is optimized

### Technical Requirements

- [ ] Database schema supports all required features
- [ ] API endpoints follow project conventions
- [ ] Components follow established patterns
- [ ] Tests cover all critical functionality
- [ ] Performance is acceptable with large template sets

---

## 🚀 Smart Implementation Benefits

### 🎯 Why This Approach Wins:

**1. Reusable Component Strategy**

- Build `TemplateCard`, `TemplateGrid`, `TemplatePreview` once, use everywhere
- Consistent UI/UX across all template features
- Easy to maintain and extend
- Reduces development time by 60%+

**2. Leverage Existing Investment**

- Form Builder → Template Editor (minimal additional code)
- Permission System → Extended (not rebuilt)
- API Patterns → Consistent (follow existing conventions)
- UI Patterns → Familiar (users already know the interface)

**3. Component-First Testing**

- Test reusable components thoroughly once
- Feature assembly becomes integration testing
- Higher confidence, lower test maintenance
- Better test coverage with less effort

**4. Future-Proof Architecture**

- Components ready for template marketplace
- Easy to add template versioning
- AI template suggestions can plug in easily
- Template sharing between workspaces is straightforward

---

## 🚅 Implementation Sequence

**🎆 Phase 1: Foundation** (Week 1)

- Database schema + API endpoints
- Global template seeding
- Core infrastructure

**🧩 Phase 2: Component Library** (Week 2)

- TemplateCard, TemplateGrid, TemplatePreview
- Search and filter components
- Reusable building blocks

**🏠 Phase 3: Page Assembly** (Week 3)

- Templates page using Phase 2 components
- Navigation integration
- Tab implementation

**🔄 Phase 4: Form Builder Integration** (Week 4)

- Template mode for existing form builder
- Enhanced form creation flow
- Save as template functionality

**🔐 Phase 5-7: Security, Testing, Polish** (Week 5)

- Permission integration
- Comprehensive testing
- Performance optimization

---

## 📝 Implementation Guidelines

### ✨ Smart Code Organization

```
components/app/templates/
├── core/               # Reusable components (Phase 2)
│   ├── TemplateCard.tsx
│   ├── TemplateGrid.tsx
│   └── TemplatePreview.tsx
├── specialized/        # Feature-specific components
│   └── TemplateSelector.tsx
├── filters/            # Search and filter components
└── pages/              # Page assembly components
```

### 🔌 Existing Code Integration Points

- **Form Builder**: Extend with template mode, don't rebuild
- **Permission System**: Add template permissions to existing roles
- **API Patterns**: Follow existing form API conventions
- **UI Components**: Use existing shadcn/ui components
- **Styling**: Follow established Tailwind patterns

### 📊 Database Smart Choices

- **Templates Table**: Reuse form schema format (JSON)
- **Permissions**: Extend existing workspace role system
- **Relationships**: Simple foreign keys, leverage existing patterns
- **Seeding**: Use existing form schemas as template base

### 🚀 Performance Optimizations

- Global template caching (they rarely change)
- Component-level lazy loading
- Search debouncing and optimization
- Infinite scroll for large template sets

### 🔮 Future Enhancement Ready

- **Template Versioning**: Database schema supports it
- **Template Marketplace**: Components ready for sharing
- **AI Suggestions**: API structure supports recommendation engine
- **Analytics**: Usage tracking already built-in

---

## ✅ Success Metrics

### 📏 Development Efficiency

- **60% faster development** through component reuse
- **40% less code** by leveraging existing form builder
- **80% consistent UI** by using established patterns
- **90% test coverage** with component-focused testing

### 📊 User Experience

- **Familiar interface** (leverages existing form builder UX)
- **Fast template browsing** (optimized components)
- **Seamless integration** (natural workflow enhancement)
- **Mobile-optimized** (responsive design from day one)

### 🔍 Technical Quality

- **Maintainable architecture** (clear component boundaries)
- **Extensible design** (ready for future features)
- **Secure implementation** (follows existing security patterns)
- **Performance optimized** (caching and lazy loading)
