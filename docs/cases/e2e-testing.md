# E2E Testing Test Cases

**Status**: 🔧 Setup Complete, Implementation In Progress

## Test Case 1: Complete User Signup and Onboarding Flow
### When
- New user visits marketing site and clicks "Get Started"
- Completes signup form with valid credentials
- Navigates through onboarding process

### Then
- Account created successfully in Clerk
- User redirected to onboarding page
- Workspace creation form appears
- After workspace creation, redirected to dashboard

### Verify
- [ ] Email validation prevents invalid formats
- [ ] Password requirements enforced (min 8 chars, complexity)
- [ ] User record synced to database with correct Clerk ID
- [ ] Workspace slug validation (lowercase, hyphens only)
- [ ] Duplicate slug prevention works
- [ ] Owner role assigned correctly to new workspace
- [ ] Dashboard loads with workspace name and user menu visible
- [ ] "Create Form" button is accessible

## Test Case 2: Subdomain Context Detection and Navigation
### When
- User navigates between different subdomain contexts
- Marketing (convo.ai) → App (app.convo.ai) → Forms (forms.convo.ai)

### Then
- Correct context detected and appropriate layout rendered
- Authentication state maintained across contexts
- URLs generated correctly for environment

### Verify
- [ ] Marketing context shows hero section and signup CTAs
- [ ] App context shows dashboard or login (if unauthenticated)
- [ ] Forms context shows public form without app navigation
- [ ] Development mode uses query parameters correctly
- [ ] Production mode uses actual subdomains
- [ ] Cross-context navigation preserves auth state
- [ ] Deep links work correctly with proper redirects
- [ ] Context-appropriate 404 pages shown

## Test Case 3: AI-Powered Form Creation
### When
- Authenticated user clicks "Create Form"
- Enters natural language prompt in AI generator
- Clicks "Generate Form"

### Then
- AI generates appropriate form schema
- Form preview shows generated fields
- User can save and edit the generated form

### Verify
- [ ] AI prompt accepts natural language input
- [ ] Generated form has appropriate field types
- [ ] Field labels are human-readable and relevant
- [ ] Required fields marked correctly
- [ ] Validation rules applied appropriately
- [ ] Form preview renders correctly
- [ ] Save functionality works and redirects to editor
- [ ] Generated form appears in workspace forms list

## Test Case 4: Manual Form Building with Drag and Drop
### When
- User chooses manual form builder
- Adds fields using drag and drop interface
- Configures field properties and validation

### Then
- Fields added in correct order
- Properties saved correctly
- Form preview updates in real-time

### Verify
- [ ] Field type selection works (text, email, select, etc.)
- [ ] Drag and drop reordering functions
- [ ] Field properties panel updates correctly
- [ ] Required field toggle works
- [ ] Placeholder text and help text saved
- [ ] Validation rules applied correctly
- [ ] Real-time preview shows changes
- [ ] Save and publish functionality works

## Test Case 5: Static Form Submission Flow
### When
- User accesses public form via forms.convo.ai URL
- Fills out form fields in static mode
- Submits form

### Then
- Form validation enforced
- Submission saved to database
- Success message displayed

### Verify
- [ ] Form loads correctly in public context
- [ ] Required field validation prevents submission
- [ ] Field type validation works (email format, etc.)
- [ ] File upload functionality works
- [ ] Form submission creates database record
- [ ] Success message appears after submission
- [ ] Thank you page or message displayed
- [ ] No authentication required for submission

## Test Case 6: Conversational Form Submission Flow
### When
- User accesses form with conversational mode enabled
- Interacts with chat-like interface
- Answers questions sequentially

### Then
- Questions presented one at a time
- User responses captured correctly
- Conversation flows naturally to completion

### Verify
- [ ] Chat interface loads correctly
- [ ] First question appears automatically
- [ ] User input captured for each question
- [ ] "Continue" or "Next" progression works
- [ ] Skip logic works for optional fields
- [ ] Multiple choice questions display properly
- [ ] File uploads work in conversational mode
- [ ] Completion message shown at end
- [ ] Data saved identically to static form

## Test Case 7: Form Mode Toggle and Preview
### When
- Form creator toggles between static and conversational modes
- Uses preview functionality to test both modes
- Makes adjustments and re-previews

### Then
- Mode toggle updates form configuration
- Preview accurately represents user experience
- Changes reflected in real-time

### Verify
- [ ] Toggle switch changes form mode setting
- [ ] Static preview shows traditional form layout
- [ ] Conversational preview shows chat interface
- [ ] Preview modal opens and closes correctly
- [ ] Form behavior matches preview in actual submission
- [ ] Mode setting persists when form is saved
- [ ] Public form reflects selected mode
- [ ] Mobile preview works for both modes

## Test Case 8: Form Analytics and Response Management
### When
- Form receives multiple submissions
- User navigates to form analytics page
- Views individual responses and exports data

### Then
- Analytics dashboard shows accurate metrics
- Response data displayed correctly
- Export functionality works

### Verify
- [ ] Response count updates accurately
- [ ] Completion rate calculation correct
- [ ] Individual responses viewable in table
- [ ] Response data matches original submission
- [ ] CSV export contains all responses
- [ ] JSON export format is valid
- [ ] Date/time stamps accurate
- [ ] Filtering and searching responses works
- [ ] Analytics update in reasonable time

## Test Case 9: Workspace Management and Team Collaboration
### When
- Workspace owner invites team members
- Members access shared workspace
- Multiple users work on forms simultaneously

### Then
- Invitations sent and accepted correctly
- Role-based permissions enforced
- Collaborative features work properly

### Verify
- [ ] Team member invitation email sent
- [ ] Invitation link works and assigns correct role
- [ ] Role permissions enforced (owner/admin/member/viewer)
- [ ] Workspace appears in member's workspace list
- [ ] Form editing permissions respect roles
- [ ] Activity log tracks user actions
- [ ] Real-time collaboration indicators work
- [ ] Conflict resolution for simultaneous edits

## Test Case 10: Mobile Responsiveness Across All Contexts
### When
- User accesses ConvoForms on mobile device
- Navigates through marketing, app, and forms contexts
- Performs core actions on mobile

### Then
- All interfaces adapt correctly to mobile viewport
- Touch interactions work properly
- Mobile-specific features function

### Verify
- [ ] Marketing site responsive on mobile
- [ ] Mobile menu/hamburger navigation works
- [ ] App dashboard usable on mobile
- [ ] Form builder functional on touch devices
- [ ] Mobile form submission works (static mode)
- [ ] Conversational forms optimized for mobile
- [ ] Touch keyboard triggers correctly (email, tel, etc.)
- [ ] Mobile-specific validation and error messages
- [ ] File upload works on mobile browsers

## Test Case 11: Error Handling and Network Resilience
### When
- Network interruptions occur during critical operations
- API endpoints return errors
- Invalid data submitted to forms

### Then
- Appropriate error messages displayed
- Recovery mechanisms available
- Data integrity maintained

### Verify
- [ ] Network errors show user-friendly messages
- [ ] Retry mechanisms work for failed operations
- [ ] Form submission failures handled gracefully
- [ ] Offline capability (if implemented)
- [ ] API timeout handling
- [ ] Invalid form data rejection with clear errors
- [ ] Database constraint errors handled properly
- [ ] Authentication errors redirect appropriately

## Test Case 12: Performance and Load Testing
### When
- Multiple users access the platform simultaneously
- Large forms with many fields created
- High volume of form submissions

### Then
- Platform remains responsive
- No data loss or corruption
- Reasonable load times maintained

### Verify
- [ ] Page load times under 3 seconds
- [ ] Form submission response time acceptable
- [ ] Concurrent user handling without degradation
- [ ] Large forms (50+ fields) perform well
- [ ] File upload performance reasonable
- [ ] Database queries optimized
- [ ] CDN assets cached properly
- [ ] Memory usage remains stable

## Test Case 13: Security and Data Protection
### When
- Unauthorized access attempts made
- Form submissions contain sensitive data
- User attempts to access others' workspaces

### Then
- Security measures prevent unauthorized access
- Data encryption and protection working
- Audit trails maintained

### Verify
- [ ] Authentication required for protected routes
- [ ] Authorization enforced for workspace access
- [ ] Form submissions encrypted in transit
- [ ] Sensitive data masked in logs
- [ ] CSRF protection active
- [ ] Input sanitization prevents XSS
- [ ] SQL injection protection verified
- [ ] Rate limiting prevents abuse

## Test Case 14: Integration and Embedding
### When
- Forms embedded in external websites
- Third-party integrations configured
- Webhook notifications set up

### Then
- Embedded forms function correctly
- Integration data flows properly
- Notifications sent reliably

### Verify
- [ ] Iframe embedding works without issues
- [ ] CORS configuration allows embedding
- [ ] Embedded forms submit correctly
- [ ] Responsive behavior in iframe
- [ ] Third-party service integrations work
- [ ] Webhook payload format correct
- [ ] Email notifications sent properly
- [ ] API endpoints return expected data

## Test Case 15: Data Migration and Backup
### When
- Form data exported for migration
- Backup and restore procedures executed
- Data integrity checks performed

### Then
- Complete data export achieved
- Restore process works correctly
- No data loss or corruption

### Verify
- [ ] Complete workspace export functionality
- [ ] Form schema export/import works
- [ ] Response data migration successful
- [ ] User data integrity maintained
- [ ] Backup files are valid and complete
- [ ] Restore process recreates exact state
- [ ] Database constraints preserved
- [ ] File uploads included in backup

## Automation Priority

### High Priority (Implement First)
- Test Cases 1-8: Core user journeys
- These cover the essential functionality and user experience

### Medium Priority (Implement Second)
- Test Cases 9-11: Team features and error handling
- Important for production stability

### Low Priority (Implement Last)
- Test Cases 12-15: Performance, security, and advanced features
- Important but not blocking for initial release

## Test Data Management

### Test User Accounts
- Generate unique test users for each test run
- Use timestamp-based identifiers to avoid conflicts
- Clean up test accounts after test completion

### Test Workspaces
- Create isolated test workspaces
- Use predictable naming patterns for easier cleanup
- Ensure workspace slugs don't conflict

### Test Forms
- Pre-create common form templates
- Use AI prompts for consistent form generation
- Test both simple and complex form structures

### Test Responses
- Generate realistic test submission data
- Test edge cases (empty fields, long text, special characters)
- Verify data integrity throughout the pipeline

This comprehensive test suite ensures ConvoForms works correctly across all user scenarios and contexts, providing confidence in the platform's reliability and user experience.
