# Subdomain Routing Test Cases

**Status**: 🚧 Implemented, Needs Testing

## Test Case 1: Marketing Site Context (Root Domain)
### When
- User visits `convo.ai` or `localhost:3002/`
- No subdomain specified

### Then
- Marketing site loads correctly
- Proper navigation and CTAs shown
- SEO optimization active

### Verify
- [ ] Homepage loads with marketing content
- [ ] Pricing page accessible
- [ ] About and contact pages work
- [ ] CTA buttons redirect to `app.convo.ai/signup`
- [ ] SEO meta tags present
- [ ] Mobile responsive layout

## Test Case 2: App Context Detection
### When
- User visits `app.convo.ai/*` or `localhost:3002/*?subdomain=app`
- App context should be detected

### Then
- App layout and components load
- Authentication required for protected routes
- Workspace routing functions

### Verify
- [ ] Context detected as 'app'
- [ ] App header and sidebar visible
- [ ] Authentication middleware active
- [ ] Workspace slug routing works
- [ ] Protected routes require login
- [ ] Public app routes (login/signup) accessible

## Test Case 3: Forms Context Detection
### When
- User visits `forms.convo.ai/{type}/{formId}` or `localhost:3002/{type}/{formId}?subdomain=forms`
- Forms context should be detected

### Then
- Forms layout loads
- No authentication required
- Form submission interface shown

### Verify
- [ ] Context detected as 'forms'
- [ ] Forms layout applied (no app navigation)
- [ ] Form renders correctly
- [ ] Submission works without authentication
- [ ] Mobile-optimized form display
- [ ] Proper error handling for invalid form IDs

## Test Case 4: Context URL Building
### When
- App needs to generate URLs for different contexts
- URL helpers used throughout codebase

### Then
- Correct URLs generated based on environment
- Context-appropriate domains used
- Development vs production handling

### Verify
- [ ] `buildContextUrl('app', '/path')` generates correct URL
- [ ] `getWorkspaceUrl(slug)` builds proper workspace URLs
- [ ] `getPublicFormUrl(type, formId)` creates valid form URLs
- [ ] Development mode uses query parameters
- [ ] Production mode uses actual subdomains

## Test Case 5: Cross-Context Navigation
### When
- User navigates between different contexts
- Authentication state preservation needed

### Then
- Smooth transitions between contexts
- Authentication state maintained
- Proper redirects and deep linking

### Verify
- [ ] Login redirects preserve intended destination
- [ ] Workspace switching maintains context
- [ ] Form editing opens in correct context
- [ ] Authentication persists across contexts
- [ ] Deep links work correctly

## Test Case 6: Development Environment Simulation
### When
- Developer tests subdomain routing locally
- Query parameters simulate subdomain contexts

### Then
- All contexts testable without DNS setup
- Production behavior accurately simulated
- Easy context switching for testing

### Verify
- [ ] `?subdomain=app` simulates app context
- [ ] `?subdomain=forms` simulates forms context
- [ ] No subdomain defaults to marketing
- [ ] Context detection logic identical to production
- [ ] Easy switching between contexts during development

## Test Case 7: Error Handling and Fallbacks
### When
- Invalid subdomain accessed
- Context detection fails

### Then
- Graceful fallback behavior
- Appropriate error pages shown
- User guided to correct context

### Verify
- [ ] Invalid subdomains redirect to marketing
- [ ] 404 pages context-appropriate
- [ ] Error boundaries prevent app crashes
- [ ] Clear error messages for users
- [ ] Proper logging for debugging

## Test Case 8: SEO and Social Media Optimization
### When
- Forms or marketing pages shared socially
- Search engines crawl the site

### Then
- Proper meta tags for each context
- Social media previews work correctly
- SEO optimization per context

### Verify
- [ ] Form pages have descriptive meta tags
- [ ] Marketing pages optimized for search
- [ ] Social sharing generates proper previews
- [ ] Open Graph tags context-appropriate
- [ ] Canonical URLs correctly set

## Test Case 9: Performance and Caching
### When
- Multiple contexts accessed frequently
- CDN and caching strategies applied

### Then
- Fast loading across all contexts
- Appropriate caching headers
- Optimal resource loading

### Verify
- [ ] Static assets cached appropriately
- [ ] Context-specific bundle splitting
- [ ] Fast context switching
- [ ] Minimal JavaScript for forms context
- [ ] Optimized images and fonts
