# End-to-End Testing with Playwright

## Overview

Convo uses Playwright for comprehensive end-to-end testing across the complex subdomain-based architecture. The E2E tests cover the complete user journey from marketing site to form submission.

## Quick Start

### 1. Install Dependencies
```bash
# Install Playwright
npm install

# Install browsers (first time only)
npx playwright install
```

### 2. Start Development Environment
```bash
# Start database
npm run db:up

# Start development server
npm run dev
```

### 3. Run Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode for debugging
npm run test:e2e:ui

# Run specific test file
npm run test:e2e auth-onboarding.spec.ts

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode (step through tests)
npm run test:e2e:debug
```

## Test Architecture

### Directory Structure
```
__tests__/e2e/
├── auth-onboarding.spec.ts        # Authentication and workspace creation
├── subdomain-routing.spec.ts      # Subdomain context switching
├── form-lifecycle.spec.ts         # Form creation and submission
├── utils/
│   ├── test-data.ts              # Test data generation
│   ├── subdomain.ts              # Subdomain navigation helpers
│   └── form-helpers.ts           # Form interaction utilities
├── auth.setup.ts                 # Authentication setup for tests
├── global-setup.ts               # Global test setup
└── global-teardown.ts            # Global test cleanup
```

### Test Categories

#### 1. Authentication Tests (`auth-onboarding.spec.ts`)
- User signup and login flows
- Workspace creation during onboarding
- Form validation and error handling
- Session management and logout

#### 2. Subdomain Routing Tests (`subdomain-routing.spec.ts`)
- Context detection (marketing, app, forms)
- Cross-context navigation
- URL building and deep linking
- Mobile responsiveness per context

#### 3. Form Lifecycle Tests (`form-lifecycle.spec.ts`)
- AI-powered form generation
- Manual form building
- Static vs conversational mode
- Form submission and validation
- Analytics and response management
- Form sharing and embedding

## Configuration

### Playwright Config (`playwright.config.ts`)
```typescript
// Key configuration options:
- baseURL: http://localhost:3002 (development)
- Multiple browsers: Chrome, Firefox, Safari
- Mobile testing: Pixel 5, iPhone 12
- Authentication state: .auth/user.json
- Parallel execution with retry logic
```

### Environment Variables
```bash
# Test environment
NODE_ENV=test
E2E_BASE_URL=http://localhost:3002

# Database (same as development)
DATABASE_URL=postgresql://...

# Authentication (same as development)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

## Subdomain Testing Strategy

Convo's subdomain architecture requires special handling in tests:

### Development Mode (Path-based)
Uses path prefixes to define contexts:
- Marketing: `http://localhost:3002/marketing` (e.g., `/marketing/pricing`)
- App: `http://localhost:3002/app` (e.g., `/app/workspace-slug/settings`)
- Forms: `http://localhost:3002/forms` (e.g., `/forms/workspace-slug/form-id`)

### Production Mode
Uses actual subdomains:
- Marketing: `convo.ai`
- App: `app.convo.ai`
- Forms: `forms.convo.ai`

### Navigation Utilities
```typescript
import { createNavigator } from './utils/subdomain';

const navigator = createNavigator(page);

// Navigate between contexts
await navigator.toMarketing();
await navigator.toApp('/workspace/my-workspace');
await navigator.toForms('workspace-slug', 'form-id');
```

## Authentication Setup

Tests use a shared authentication state to avoid repeated login:

### Initial Setup (`auth.setup.ts`)
1. Creates test user account
2. Completes onboarding flow
3. Creates test workspace
4. Saves authentication state to `.auth/user.json`

### Test Usage
```typescript
// Tests automatically use saved auth state
test('authenticated test', async ({ page }) => {
  // Already logged in
  await navigator.toApp();
  // User is authenticated
});
```

## Form Testing Utilities

### Form Builder Helper
```typescript
import { createFormHelpers } from './utils/form-helpers';

const { builder, submitter, analytics } = createFormHelpers(page);

// Create form with AI
const formId = await builder.createFormWithAI('Create a contact form');

// Submit form
await submitter.submitStaticForm({
  'Name': 'Test User',
  'Email': 'test@example.com'
});

// View analytics
await analytics.viewFormAnalytics('workspace', formId);
```

### Test Data Generation
```typescript
import { generateTestUser, createTestWorkspace } from './utils/test-data';

const testUser = generateTestUser();
// { email: 'test-user-123@example.com', password: 'TestPassword123!' }

const testWorkspace = createTestWorkspace();
// { name: 'Test Workspace 123', slug: 'test-workspace-123' }
```

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Use unique test data (timestamps, IDs)
- Clean up test data when possible

### 2. Waiting Strategies
```typescript
// Wait for network to be idle
await page.waitForLoadState('networkidle');

// Wait for specific elements
await page.waitForSelector('[data-testid="workspace-dashboard"]');

// Wait for URL changes
await page.waitForURL('**/workspace/**');
```

### 3. Error Handling
```typescript
try {
  await page.click('[data-testid="button"]');
} catch (error) {
  // Take screenshot for debugging
  await page.screenshot({ path: 'error-screenshot.png' });
  throw error;
}
```

### 4. Mobile Testing
```typescript
test('mobile test', async ({ page, isMobile }) => {
  if (!isMobile) test.skip('Mobile-only test');
  
  // Mobile-specific assertions
  await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
});
```

## Debugging Tests

### 1. UI Mode (Recommended)
```bash
npm run test:e2e:ui
```
- Visual test runner
- Step-by-step execution
- Live preview
- Easy debugging

### 2. Headed Mode
```bash
npm run test:e2e:headed
```
- See browser while tests run
- Good for understanding flow
- Can pause execution

### 3. Debug Mode
```bash
npm run test:e2e:debug
```
- Starts with debugger
- Step through line by line
- Inspect page state

### 4. Screenshots and Videos
```typescript
// Automatic on failure
- Screenshots saved to test-results/
- Videos for failed tests
- Traces for debugging

// Manual screenshots
await page.screenshot({ path: 'debug.png', fullPage: true });
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run db:up
      - run: npm run test:e2e
```

### Parallel Execution
```typescript
// In CI, tests run in parallel across browsers
- Chrome (Desktop)
- Firefox (Desktop) 
- Safari (Desktop)
- Mobile Chrome
- Mobile Safari
```

## Common Issues and Solutions

### 1. Authentication Timeouts
```typescript
// Increase timeout for auth-heavy operations
await page.waitForURL('**/workspace/**', { timeout: 30000 });
```

### 2. Flaky Tests
```typescript
// Use retry logic
test.describe.configure({ retries: 2 });

// Better waiting strategies
await page.waitForFunction(() => window.dataLoaded);
```

### 3. Subdomain Routing
```typescript
// Always use navigation utilities
const navigator = createNavigator(page);
await navigator.toApp(); // Handles context correctly
```

### 4. Form Interactions
```typescript
// Wait for form to be ready
await page.waitForSelector('form');
await page.waitForLoadState('networkidle');

// Use data-testid for reliability
await page.click('[data-testid="submit-button"]');
```

## Monitoring and Reporting

### 1. HTML Reports
After test run, open `playwright-report/index.html`

### 2. JUnit Reports
Generated at `test-results/junit.xml` for CI integration

### 3. Coverage Integration
```bash
# Run with coverage
npm run test:coverage && npm run test:e2e
```

## Future Enhancements

### 1. Visual Regression Testing
```typescript
// Compare screenshots
await expect(page).toHaveScreenshot('homepage.png');
```

### 2. Performance Testing
```typescript
// Measure page load times
const metrics = await page.evaluate(() => performance.getEntriesByType('navigation'));
```

### 3. Accessibility Testing
```typescript
// Add axe-core integration
await expect(page).toPassAxeChecks();
```

This E2E testing setup ensures Convo works correctly across all user journeys and contexts, providing confidence in deployments and catching regressions early.
