# Authentication Test Cases

**Status**: 🚧 Implemented, Needs Testing

## Test Case 1: User Registration Flow

### When

- User visits `app.convo.ai/signup`
- Clicks "Sign up" and provides valid email/password

### Then

- Account created in Clerk
- User record synced to database
- Automatically redirected to `/onboarding`

### Verify

- [ ] Email validation prevents invalid formats
- [ ] Password meets security requirements (min 8 chars)
- [ ] User record created in `users` table with correct Clerk ID
- [ ] No duplicate accounts with same email
- [ ] Redirect works with subdomain context

## Test Case 2: User Login Flow

### When

- Existing user visits `app.convo.ai/login`
- Provides correct credentials

### Then

- Successfully authenticated via Clerk
- Redirected to appropriate workspace dashboard
- Session persists across page refreshes

### Verify

- [ ] Invalid credentials show proper error message
- [ ] "Remember me" functionality works
- [ ] Redirects to last visited workspace if multiple exist
- [ ] Session timeout works as expected

## Test Case 3: Onboarding Workspace Creation

### When

- New user completes signup
- Reaches `/onboarding` page
- Creates first workspace with unique slug

### Then

- Workspace record created in database
- User assigned as owner role
- Redirected to `app.convo.ai/{workspace-slug}`

### Verify

- [ ] Workspace slug validation (lowercase, hyphens only)
- [ ] Duplicate slug prevention
- [ ] Owner role assigned correctly
- [ ] Default workspace settings applied
- [ ] Cannot skip onboarding without creating workspace

## Test Case 4: Authentication Context Protection

### When

- Unauthenticated user tries to access `app.convo.ai/*` routes
- Authenticated user accesses public form routes

### Then

- Proper redirects based on authentication state
- Context-aware URL handling

### Verify

- [ ] Protected routes redirect to login
- [ ] Public routes accessible without auth
- [ ] Proper subdomain context maintained during redirects
- [ ] No authentication loops or redirect cycles

## Test Case 5: Logout and Session Management

### When

- Authenticated user clicks logout
- Session expires naturally

### Then

- User logged out of Clerk
- Redirected to marketing site
- All sensitive data cleared

### Verify

- [ ] Complete logout from all tabs/windows
- [ ] localStorage/sessionStorage cleared
- [ ] Cannot access protected routes after logout
- [ ] Login state properly reset
