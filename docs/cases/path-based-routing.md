# Path-Based Routing Test Cases

**Status**: 🚧 To Be Implemented  
**Migration**: From subdomain query parameters to clean path-based routing

## Overview

Convo is migrating from complex subdomain simulation (using query parameters in dev) to clean path-based routing that's consistent across environments.

### URL Structure

```
Development & Production:
├── /marketing/*           # Marketing site (landing, pricing, about)
├── /app/*                # SaaS Application (auth required)
└── /forms/*              # Public Forms (no auth)

Production Rewrites:
├── convo.ai → /marketing
├── app.convo.ai → /app
└── forms.convo.ai → /forms
```

---

## Test Case 1: Marketing Context Routes

### When

- User visits `/marketing` or root `/` (redirects to `/marketing`)
- Marketing pages: `/marketing/pricing`, `/marketing/about`, etc.

### Then

- Marketing site loads without authentication
- Clean URLs with no query parameters
- SEO-optimized marketing content

### Verify

- [ ] `/` redirects to `/marketing`
- [ ] `/marketing` loads homepage
- [ ] `/marketing/pricing` loads pricing page
- [ ] `/marketing/v2-sparrow-jot` loads new landing page
- [ ] No authentication checks on marketing routes
- [ ] SEO meta tags present
- [ ] Mobile responsive design
- [ ] Fast loading times

---

## Test Case 2: App Context Routes

### When

- User visits `/app/*` routes
- Authentication required for most app routes
- Workspace-specific functionality

### Then

- App layout with header/sidebar loads
- Authentication middleware enforced
- Workspace routing functions correctly

### Verify

- [ ] `/app/login` loads login page (no auth required)
- [ ] `/app/signup` loads signup page (no auth required)
- [ ] `/app/onboarding` requires auth, creates workspace
- [ ] `/app/{workspaceSlug}` loads workspace dashboard
- [ ] `/app/{workspaceSlug}/forms` loads forms list
- [ ] `/app/{workspaceSlug}/settings` loads workspace settings
- [ ] Unauthenticated users redirected to `/app/login`
- [ ] Invalid workspace slugs handled gracefully

---

## Test Case 3: Forms Context Routes

### When

- User visits `/forms/*` for public form submissions
- No authentication required
- Optimized for form submission UX

### Then

- Clean form interface loads
- No app navigation/header shown
- Optimized for mobile and conversions

### Verify

- [ ] `/forms/{workspaceSlug}/{formId}` loads public form
- [ ] Form submissions work without authentication
- [ ] Mobile-optimized form interface
- [ ] Invalid form IDs show appropriate 404
- [ ] Form analytics tracked correctly
- [ ] Loading states and error handling work
- [ ] Conversational mode toggle functions

---

## Test Case 4: Production Subdomain Rewrites

### When

- User visits production subdomains
- Middleware rewrites to internal paths

### Then

- Seamless subdomain to path mapping
- No visible URL changes to users
- Same functionality as development

### Verify

- [ ] `convo.ai` → internally routes to `/marketing`
- [ ] `app.convo.ai/login` → internally routes to `/app/login`
- [ ] `forms.convo.ai/w/f123` → internally routes to `/forms/w/f123`
- [ ] URLs in browser stay as subdomains
- [ ] Internal routing uses path structure
- [ ] Context detection works correctly

---

## Test Case 5: URL Helper Functions

### When

- Application generates URLs using helper functions
- Consistent URL generation across app

### Then

- Simple, environment-agnostic URL generation
- No complex context switching logic needed

### Verify

- [ ] `getLoginUrl()` returns `/app/login`
- [ ] `getWorkspaceUrl(slug)` returns `/app/${slug}`
- [ ] `getPublicFormUrl(workspace, formId)` returns `/forms/${workspace}/${formId}`
- [ ] `getMarketingUrl(path)` returns `/marketing${path}`
- [ ] All generated URLs work in both dev and prod
- [ ] No environment-specific logic needed

---

## Test Case 6: Context Detection Simplification

### When

- App needs to detect current context
- Server and client-side detection

### Then

- Simple path-based context detection
- No complex header reading or hostname parsing

### Verify

- [ ] `getContext()` returns correct context based on pathname
- [ ] `/marketing/*` → 'marketing' context
- [ ] `/app/*` → 'app' context
- [ ] `/forms/*` → 'forms' context
- [ ] Works identically on client and server
- [ ] No complex environment checks needed

---

## Test Case 7: Authentication Flow

### When

- User authentication and workspace access
- Clean redirect flows

### Then

- Simple redirect URLs without query parameters
- Proper post-auth destination handling

### Verify

- [ ] Login redirects to `/app/onboarding` for new users
- [ ] Login redirects to `/app/{defaultWorkspace}` for existing users
- [ ] Signup flow: `/app/signup` → `/app/onboarding` → `/app/{workspace}`
- [ ] Logout redirects to `/marketing`
- [ ] Protected routes redirect to `/app/login` with return URL
- [ ] Authentication state persists across context switches

---

## Test Case 8: Migration Compatibility

### When

- Existing bookmarks and shared links need to work
- Gradual migration from old system

### Then

- Backwards compatibility maintained
- Automatic redirects from old URLs

### Verify

- [ ] Old `?subdomain=app` URLs are no longer actively processed by middleware (consider if redirects are needed for SEO/bookmarks).
- [ ] Old `?subdomain=forms` URLs are no longer actively processed by middleware (consider if redirects are needed for SEO/bookmarks).
- [ ] Shared form links (using new URL structure) continue working
- [ ] User bookmarks (if using old URLs) would need manual updating or specific redirect rules if implemented.
- [ ] Search engine indexed URLs redirect properly

---

## Test Case 9: Development Experience

### When

- Developers work on the application
- Testing different contexts

### Then

- Simple, intuitive development URLs
- Easy context switching for testing

### Verify

- [ ] `localhost:3002/marketing` works immediately
- [ ] `localhost:3002/app/login` accessible without setup
- [ ] `localhost:3002/forms/test/123` loads test form
- [ ] No complex middleware setup needed
- [ ] Easy debugging with clear URL paths
- [ ] Browser dev tools show clear routing

---

## Test Case 10: Performance & Bundle Optimization

### When

- Different contexts load
- Code splitting and optimization

### Then

- Context-specific bundle loading
- Optimal performance per context

### Verify

- [ ] Marketing bundle lightweight (no app code)
- [ ] App bundle includes full functionality
- [ ] Forms bundle minimal (just form components)
- [ ] No unnecessary code loading per context
- [ ] Fast initial page loads
- [ ] Efficient code splitting by route

---

## Implementation Checklist

### Phase 1: Documentation & Planning

- [x] Update routing test cases
- [x] Update project summary documentation
- [ ] Create migration plan
- [ ] Update API documentation

### Phase 2: Core Infrastructure

- [ ] Simplify middleware to path-based rewrites
- [ ] Update URL helper functions
- [ ] Update context detection logic
- [ ] Create new file structure

### Phase 3: Route Migration

- [ ] Move marketing routes to `/marketing/*`
- [ ] Move app routes to `/app/*`
- [ ] Move forms routes to `/forms/*`
- [ ] Update all internal links

### Phase 4: Testing & Verification

- [ ] Test all routes in development
- [ ] Verify production subdomain rewrites
- [ ] Test authentication flows
- [ ] Verify backwards compatibility
- [ ] Performance testing

### Phase 5: Deployment

- [ ] Deploy with feature flag
- [ ] Monitor error rates
- [ ] Gradual rollout
- [ ] Remove old routing code

---

## Migration Benefits

✅ **Simplified Development**: No more query parameter juggling  
✅ **Easier Testing**: Direct URL access to any context  
✅ **Better Performance**: Optimized bundle splitting  
✅ **Cleaner Code**: Removed complex context detection  
✅ **Better SEO**: Clean URL structure  
✅ **Easier Debugging**: Clear routing in dev tools
