# Templates Feature - Test Cases

## Feature Overview
Template system allowing users to create forms from pre-defined global templates or user-created workspace templates. Access and operations are controlled by granular, resource-based permissions (e.g., `create_template`, `edit_template`, `delete_template`) rather than broad roles, with usage tracking.

---

## 🔐 Permission-Based Test Cases

### [Case 1] User with `create_template` permission can access template creation
**Verify that a user possessing the `create_template` permission for a workspace can:**
- [ ] "Create Template" button is visible on Templates page
- [ ] User can click "Create Template" and open creation dialog
- [ ] User can successfully create a new template
- [ ] Created template appears in "Templates" tab
- [ ] Template is associated with user's workspace

### [Case 2] User without `create_template` permission cannot create templates
**Verify that a user lacking the `create_template` permission for a workspace:**
- [ ] "Create Template" button is hidden on Templates page
- [ ] API endpoint `/api/templates` POST returns 403 for unauthorized users
- [ ] User cannot access template creation dialog
- [ ] Error message is displayed if user tries to access creation via URL manipulation

### [Case 3] User with `edit_template` permission can modify templates
**Verify that a user possessing the `edit_template` permission for a workspace can:**
  - [ ] "Edit" button is visible on template cards within that workspace
  - [ ] User can access template edit dialog for workspace templates
  - [ ] User can successfully update template name, description, and form schema for workspace templates
- [ ] Changes are saved and reflected immediately
- [ ] Updated timestamp is refreshed

### [Case 4] User without `edit_template` permission cannot modify templates
**Verify that a user lacking the `edit_template` permission for a workspace:**
  - [ ] "Edit" button is hidden on template cards within that workspace
  - [ ] API endpoint `/api/templates/[id]` PUT returns 403 if the user lacks `edit_template` permission for the template's workspace
  - [ ] User cannot access edit functionality for workspace templates even with direct URL access
- [ ] Read-only view is maintained

### [Case 5] User with `create_form` permission can create forms from templates
**When enabled verify:**
- [ ] "Create Form" button is visible on template cards
- [ ] User can successfully create a form from a template
- [ ] Form builder opens with template schema pre-loaded
- [ ] Template usage count is incremented
- [ ] New form is created in user's workspace

### [Case 6] User without `create_form` permission cannot create forms from templates
**When disabled verify:**
- [ ] "Create Form" button is hidden on template cards
- [ ] API endpoint for form creation from templates returns 403
- [ ] User cannot access form creation functionality
- [ ] Template usage count remains unchanged

---

## 🌐 Global Templates Test Cases

### [Case 7] Global templates are visible to all users
**When enabled verify:**
- [ ] Global templates appear in "Global Templates" tab for all users
- [ ] Templates are categorized by business type (HR, Marketing, Support, etc.)
- [ ] Template cards show global indicator/badge
- [ ] Usage statistics are displayed correctly
- [ ] Templates cannot be edited by regular users

### [Case 8] Global templates can be cloned by users with `create_template` permission in the target workspace
**Verify that:**
- [ ] "Clone" button is visible on global template cards for users.
- [ ] User can initiate cloning and specify a target workspace.
- [ ] If the user has `create_template` permission in the *target workspace*, cloning succeeds.
- [ ] If the user lacks `create_template` permission in the *target workspace*, cloning is denied with a 403 error.
- [ ] Cloning creates a new, editable, workspace-specific template in the target workspace (it's not another global template).
- [ ] The new template appears in the "My Templates" (or equivalent) tab for the target workspace.
- [ ] Original global template's clone count is incremented.

### [Case 9] Global templates cannot be deleted or edited by users
**Verify that:**
  - [ ] "Edit" and "Delete" buttons are not visible on global template cards for any workspace user.
  - [ ] API endpoints for editing or deleting templates return 403 if a user attempts this on a global template ID.
  - [ ] Global templates maintain their original form and content.
  - [ ] (Assumption) Only system administrators (e.g., "Convo administrators") can manage global templates through a separate interface/process.

---

## 📝 Template Management Test Cases

### [Case 10] User can create templates from scratch
**When enabled verify:**
- [ ] "Create Template" opens an empty template creation dialog
- [ ] User can enter template name and description
- [ ] User can select business category
- [ ] User can build form schema using form builder
- [ ] Template is saved successfully with all metadata

### [Case 11] User can create templates from existing forms
**When enabled verify:**
- [ ] "Save as Template" option appears in form builder dropdown
- [ ] User can convert existing form to template
- [ ] Template inherits form schema, title, and description
- [ ] Original form remains unchanged
- [ ] New template appears in user's template list

### [Case 12] User can clone templates within workspace
**When enabled verify:**
- [ ] "Clone" button works for user-created templates
- [ ] Cloned template has unique name (e.g., "Template Name (Copy)")
- [ ] Cloned template can be independently edited
- [ ] Original template clone count is incremented
- [ ] Both templates exist independently

### [Case 13] User with `delete_template` permission can delete their workspace templates
**Verify that a user possessing the `delete_template` permission for a workspace can:**
- [ ] "Delete" button appears on workspace templates within that workspace.
- [ ] User can initiate deletion and a confirmation dialog appears.
- [ ] Template is permanently removed from the user's workspace upon confirmation.
- [ ] API endpoint `/api/templates/[id]` DELETE returns 403 if the user lacks `delete_template` permission for the template's workspace.
- [ ] Forms created from template are not affected
- [ ] Template no longer appears in lists

### [Case 14] User cannot delete templates with dependencies
**When enabled verify:**
- [ ] Warning appears if template has been used to create forms
- [ ] User is informed about dependent forms before deletion
- [ ] Option to proceed with deletion despite dependencies
- [ ] Deletion removes template but preserves created forms
- [ ] Form-template relationship is handled gracefully

---

## 🔍 Template Discovery & Usage Test Cases

### [Case 15] Template search functionality works correctly
**When enabled verify:**
- [ ] Search bar filters templates by name and description
- [ ] Search results update in real-time
- [ ] Search works across both Global and user Templates tabs
- [ ] Empty search results show appropriate message
- [ ] Search state is maintained when switching tabs

### [Case 16] Template filtering by category works
**When enabled verify:**
- [ ] Business category filters display correctly
- [ ] Selecting a category shows only relevant templates
- [ ] Multiple categories can be selected
- [ ] Filter state is maintained across page refreshes
- [ ] "Clear filters" option resets all filters

### [Case 17] Template usage statistics are accurate
**When enabled verify:**
- [ ] Usage count increments when form is created from template
- [ ] Clone count increments when template is cloned
- [ ] Statistics are displayed on template cards
- [ ] Statistics are updated in real-time
- [ ] Historical usage data is preserved

### [Case 18] Template preview functionality works
**When enabled verify:**
- [ ] Clicking template card opens preview modal
- [ ] Preview shows complete form structure
- [ ] All form fields and settings are visible
- [ ] Preview is read-only and cannot be edited
- [ ] Actions (Clone, Create Form) are available in preview

---

## 🔄 Form Creation Flow Test Cases

### [Case 19] Enhanced form creation page displays options
**When enabled verify:**
- [ ] Form creation page shows "Choose from Templates" and "Start from Scratch"
- [ ] Both options are visually distinct and clear
- [ ] Clicking "Choose from Templates" opens template selection
- [ ] Clicking "Start from Scratch" opens empty form builder
- [ ] Default selection can be configured

### [Case 20] Template selection modal works in form creation
**When enabled verify:**
- [ ] Template selection modal displays available templates
- [ ] Search and filter work within modal
- [ ] Template preview is available in modal
- [ ] Selecting template loads it into form builder
- [ ] Modal closes after template selection

### [Case 21] Browse templates button works in form builder
**When enabled verify:**
- [ ] "Browse Templates" button appears near Save button
- [ ] Clicking opens quick template browser modal
- [ ] User can preview and select templates
- [ ] Applying template shows confirmation if form has content
- [ ] Template application replaces current form schema

### [Case 22] Save as template works from form builder
**When enabled verify:**
- [ ] Save button becomes dropdown with template option
- [ ] "Save this form as template" opens template creation dialog
- [ ] Form schema is pre-loaded in template
- [ ] User can modify template metadata before saving
- [ ] Template is created without affecting original form

---

## 📱 Responsive & Accessibility Test Cases

### [Case 23] Templates page works on mobile devices
**When enabled verify:**
- [ ] Template cards stack properly on mobile
- [ ] Tab navigation is touch-friendly
- [ ] Search and filter controls are accessible
- [ ] Action buttons are appropriately sized
- [ ] Modals display correctly on small screens

### [Case 24] Keyboard navigation works throughout
**When enabled verify:**
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and consistent
- [ ] Modal dialogs can be navigated with keyboard
- [ ] Escape key closes modals appropriately
- [ ] Enter key activates primary actions

### [Case 25] Screen reader accessibility is maintained
**When enabled verify:**
- [ ] Template cards have appropriate ARIA labels
- [ ] Modal dialogs announce their purpose
- [ ] Form elements have proper labels
- [ ] Dynamic content changes are announced
- [ ] Focus management works in modals

---

## ⚡ Performance & Edge Cases

### [Case 26] Large template sets perform well
**When enabled verify:**
- [ ] Page loads quickly with 100+ templates
- [ ] Search and filtering remain responsive
- [ ] Pagination works if implemented
- [ ] Memory usage remains reasonable
- [ ] No significant lag in user interactions

### [Case 27] Network error handling works correctly
**When enabled verify:**
- [ ] Failed template loads show error messages
- [ ] Retry mechanisms work for failed requests
- [ ] Offline functionality gracefully degrades
- [ ] Loading states prevent multiple submissions
- [ ] User feedback is provided for all network operations

### [Case 28] Data validation prevents corruption
**When enabled verify:**
- [ ] Invalid template data is rejected
- [ ] Form schema validation prevents malformed templates
- [ ] SQL injection attempts are blocked
- [ ] XSS attempts in template content are sanitized
- [ ] File upload limits are enforced

### [Case 29] Concurrent access handling works
**When enabled verify:**
- [ ] Multiple users can access templates simultaneously
- [ ] Template modifications by one user don't affect others
- [ ] Usage statistics update correctly with concurrent access
- [ ] Race conditions don't cause data corruption
- [ ] Optimistic locking prevents conflicting updates

### [Case 30] Workspace isolation is maintained
**When enabled verify:**
- [ ] Users can only see templates from their workspace
- [ ] Global templates are shared across workspaces
- [ ] Template cloning respects workspace boundaries
- [ ] Switching workspaces shows correct template sets
- [ ] Cross-workspace template access is prevented

---

## 🔄 Integration Test Cases

### [Case 31] Template system integrates with existing form builder
**When enabled verify:**
- [ ] Form builder loads template schemas correctly
- [ ] All form field types are supported in templates
- [ ] Conditional logic in templates works
- [ ] Form validation rules are preserved
- [ ] Custom styling is maintained

### [Case 32] Template system integrates with workspace permissions
**When enabled verify:**
- [ ] Workspace role changes immediately affect template access
- [ ] Permission changes are reflected in UI without refresh
- [ ] API endpoints respect current workspace permissions
- [ ] Multi-workspace users see correct permissions per workspace
- [ ] Permission inheritance works correctly

### [Case 33] Template system integrates with audit logging
**When enabled verify:**
- [ ] Template creation events are logged
- [ ] Template usage events are tracked
- [ ] Permission-based actions are audited
- [ ] Workspace activity logs include template actions
- [ ] Audit logs maintain data integrity

---

## 📊 Analytics & Reporting Test Cases

### [Case 34] Template analytics provide valuable insights
**When enabled verify:**
- [ ] Most popular templates are identifiable
- [ ] Usage trends over time are tracked
- [ ] Template performance metrics are accurate
- [ ] Business category popularity is measured
- [ ] ROI of templates can be calculated

### [Case 35] Template reports are accessible to administrators
**When enabled verify:**
- [ ] Administrators can view usage reports
- [ ] Reports include both global and user templates
- [ ] Data export functionality works
- [ ] Report data is accurate and up-to-date
- [ ] Reports help inform template strategy

---

## 🚀 Deployment & Maintenance Test Cases

### [Case 36] Template system deploys without issues
**When enabled verify:**
- [ ] Database migrations run successfully
- [ ] Seed data for global templates loads correctly
- [ ] API endpoints are accessible after deployment
- [ ] No existing functionality is broken
- [ ] Performance benchmarks are met

### [Case 37] Template system supports future enhancements
**When enabled verify:**
- [ ] Database schema allows for versioning
- [ ] API structure supports additional features
- [ ] Component architecture is extensible
- [ ] Integration points are well-defined
- [ ] Documentation supports maintenance

---

## ✅ Acceptance Criteria Summary

**Critical Must-Have Cases:**
- Cases 1-6: Permission system works correctly
- Cases 7-9: Global templates function properly
- Cases 10-14: Template management works
- Cases 19-22: Enhanced form creation flow works

**Important Should-Have Cases:**
- Cases 15-18: Discovery and usage features
- Cases 23-25: Accessibility requirements
- Cases 31-33: Integration with existing systems

**Nice-to-Have Cases:**
- Cases 26-30: Performance and edge cases
- Cases 34-37: Analytics and future-proofing

**Test Coverage Goal:** 95%+ for critical cases, 85%+ for important cases, 70%+ for nice-to-have cases.