# Workspace Management Test Cases

**Status**: 🚧 Implemented, Needs Testing (Member invites ❌ Not Implemented)

## Test Case 1: Workspace Creation

### When

- User completes onboarding
- Provides workspace name and slug

### Then

- Workspace created with unique slug
- User assigned as owner
- Default settings applied

### Verify

- [ ] Workspace name validation (max 50 chars)
- [ ] Slug uniqueness enforced
- [ ] Slug formatting (lowercase, hyphens, no spaces)
- [ ] Owner role permissions granted
- [ ] Workspace appears in user's workspace list

## Test Case 2: Workspace Switching

### When

- User belongs to multiple workspaces
- Uses workspace switcher dropdown

### Then

- Seamless navigation between workspaces
- URL updates to correct workspace slug
- Context preserved appropriately

### Verify

- [ ] All accessible workspaces listed
- [ ] Current workspace highlighted
- [ ] Role indicators shown (Owner, Admin, Member)
- [ ] URL updates to `app.convo.ai/{new-workspace-slug}`
- [ ] No data leakage between workspaces

## Test Case 3: Member Invite Flow (⚠️ HIGH PRIORITY)

### When

- Workspace owner/admin invites new member
- Provides email address and role

### Then

- Invitation email sent via Resend
- Pending invitation tracked in database
- Invited user can accept and join workspace

### Verify

- [ ] Email validation before sending invite
- [ ] Role selection (Admin, Member, Viewer)
- [ ] Invitation expiry handling (7 days)
- [ ] Duplicate invite prevention
- [ ] Email template includes workspace context
- [ ] Acceptance flow creates proper member record

## Test Case 4: Member Role Management (RBAC)

### When

- Workspace owner manages member permissions
- Role changes are applied

### Then

- Access levels updated immediately
- UI reflects new permissions
- Database consistency maintained

### Verify

- [ ] **Owner**: Full access to all features and settings
- [ ] **Admin**: Manage forms, members (except owner changes)
- [ ] **Member**: Create/edit own forms, view shared forms
- [ ] **Viewer**: Read-only access to forms and responses
- [ ] Role changes take effect immediately
- [ ] Cannot remove last owner

## Test Case 5: Workspace Settings Management

### When

- Authorized user updates workspace settings
- Changes are saved

### Then

- Settings persist across sessions
- All members see updated settings
- Audit log tracks changes

### Verify

- [ ] Name and description updates
- [ ] Workspace slug modification (with impact validation)
- [ ] Member limits enforcement based on plan
- [ ] Settings sync across all members
- [ ] Activity log captures all changes

## Test Case 6: Workspace Deletion and Data Cleanup

### When

- Workspace owner initiates deletion
- Confirms destructive action

### Then

- All workspace data removed
- Members lose access
- Owner redirected appropriately

### Verify

- [ ] Confirmation dialog with workspace name typing
- [ ] All forms and responses deleted
- [ ] Member associations removed
- [ ] Audit log preserved for compliance
- [ ] Owner redirected to remaining workspace or onboarding

## Test Case 7: Workspace Plan Limits Enforcement

### When

- Workspace reaches plan limits
- User attempts to exceed limits

### Then

- Clear upgrade prompts shown
- Features gracefully degraded
- Billing integration triggered

### Verify

- [ ] Form count limits enforced
- [ ] Response volume limits tracked
- [ ] Member count restrictions
- [ ] Feature access based on plan tier
- [ ] Upgrade flow accessibility
