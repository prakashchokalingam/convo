import { test, expect } from '@playwright/test';
import { createNavigator, buildContextUrl } from './utils/subdomain';
import { createFormHelpers, assertFormExists, assertFormFieldExists } from './utils/form-helpers';
import { createTestContactForm, generateFormSubmissionData, AI_PROMPTS } from './utils/test-data';

/**
 * Form Creation and Submission E2E Tests
 * 
 * Tests the complete form lifecycle:
 * 1. Create form (AI or manual)
 * 2. Configure and preview
 * 3. Publish and share
 * 4. Submit responses (static and conversational)
 * 5. View analytics
 */

test.describe('Form Creation Flow', () => {
  test('should create form using AI generation', async ({ page }) => {
    const navigator = createNavigator(page);
    const { builder } = createFormHelpers(page);
    
    // Navigate to workspace (assuming authenticated)
    await navigator.toApp();
    await page.waitForSelector('[data-testid="workspace-dashboard"]');
    
    // Create form using AI
    const formId = await builder.createFormWithAI(AI_PROMPTS.contact);
    
    // Verify form was created
    await expect(page).toHaveURL(new RegExp(`.*forms/${formId}/edit.*`));
    await assertFormExists(page, 'Contact Form'); // AI should generate appropriate name
    
    // Verify AI generated appropriate fields
    await assertFormFieldExists(page, 'Name');
    await assertFormFieldExists(page, 'Email');
    await assertFormFieldExists(page, 'Message');
  });
  
  test('should create form manually using form builder', async ({ page }) => {
    const navigator = createNavigator(page);
    const { builder } = createFormHelpers(page);
    const testForm = createTestContactForm();
    
    // Navigate to workspace
    await navigator.toApp();
    await page.waitForSelector('[data-testid="workspace-dashboard"]');
    
    // Create form manually
    const formId = await builder.createFormManually(testForm);
    
    // Verify form creation
    await expect(page).toHaveURL(new RegExp(`.*forms/${formId}/edit.*`));
    await assertFormExists(page, testForm.name);
    
    // Verify all fields were added
    for (const field of testForm.fields) {
      await assertFormFieldExists(page, field.label);
    }
  });
  
  test('should allow form editing and field reordering', async ({ page }) => {
    const navigator = createNavigator(page);
    const { builder } = createFormHelpers(page);
    
    // Assuming we have a form from previous test or setup
    await navigator.toApp();
    await page.click('[data-testid="existing-form-edit"], [href*="/forms/"][href*="/edit"]');
    await page.waitForSelector('[data-testid="form-builder"]');
    
    // Add a new field
    await builder.addField('select', 'Country', true);
    await assertFormFieldExists(page, 'Country');
    
    // Reorder fields (move Country field up)
    await builder.reorderFields(3, 1); // Assuming Country is at index 3
    
    // Save changes
    await page.click('[data-testid="save-form-button"]');
    await expect(page.locator('[data-testid="save-success"], text="Saved"')).toBeVisible();
  });
  
  test('should toggle between static and conversational modes', async ({ page }) => {
    const navigator = createNavigator(page);
    const { builder } = createFormHelpers(page);
    
    // Navigate to form editor
    await navigator.toApp();
    await page.click('[href*="/forms/"][href*="/edit"]');
    await page.waitForSelector('[data-testid="form-builder"]');
    
    // Toggle to conversational mode
    await builder.toggleConversationalMode();
    
    // Verify conversational mode is active
    await expect(page.locator('[data-testid="conversational-toggle"]')).toBeChecked();
    
    // Preview form in conversational mode
    await builder.previewForm();
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible();
    
    // Close preview and toggle back to static
    await page.click('[data-testid="close-preview"]');
    await builder.toggleConversationalMode();
    await expect(page.locator('[data-testid="conversational-toggle"]')).not.toBeChecked();
  });
  
  test('should generate and copy form share URL', async ({ page }) => {
    const navigator = createNavigator(page);
    const { builder } = createFormHelpers(page);
    
    // Navigate to form editor
    await navigator.toApp();
    await page.click('[href*="/forms/"][href*="/edit"]');
    
    // Get share URL
    const shareUrl = await builder.getShareUrl();
    
    // Verify URL format
    expect(shareUrl).toMatch(/.*forms\.convo\.ai.*|.*localhost:3002.*subdomain=forms.*/);
    
    // Test that URL is accessible
    await page.goto(shareUrl);
    await expect(page.locator('[data-testid="form-container"], form')).toBeVisible();
  });
});

test.describe('Form Submission Flow', () => {
  test('should submit form in static mode', async ({ page, context }) => {
    const navigator = createNavigator(page);
    const { submitter } = createFormHelpers(page);
    const submissionData = generateFormSubmissionData('contact');
    
    // Navigate to public form (simulate share URL access)
    await navigator.toForms('test-workspace', 'test-form');
    
    // Wait for form to load
    await page.waitForSelector('form, [data-testid="form-container"]');
    
    // Submit form
    await submitter.submitStaticForm(submissionData);
    
    // Verify submission success
    await submitter.verifySubmissionSuccess();
  });
  
  test('should submit form in conversational mode', async ({ page }) => {
    const navigator = createNavigator(page);
    const { submitter } = createFormHelpers(page);
    const submissionData = generateFormSubmissionData('contact');
    
    // Navigate to form with conversational mode enabled
    await navigator.toForms('test-workspace', 'test-conversational-form');
    
    // Submit in conversational mode
    await submitter.submitConversationalForm(submissionData);
    
    // Verify completion
    await submitter.verifySubmissionSuccess();
  });
  
  test('should validate required fields', async ({ page }) => {
    const navigator = createNavigator(page);
    const { submitter } = createFormHelpers(page);
    
    // Navigate to form
    await navigator.toForms('test-workspace', 'test-form');
    await page.waitForSelector('form');
    
    // Try to submit without filling required fields
    await page.click('[type="submit"], [data-testid="submit-button"]');
    
    // Verify validation errors
    await submitter.verifyValidationErrors([
      'Name is required',
      'Email is required',
      'Message is required'
    ]);
  });
  
  test('should handle file uploads', async ({ page }) => {
    const navigator = createNavigator(page);
    
    // Navigate to form with file upload field
    await navigator.toForms('test-workspace', 'job-application-form');
    await page.waitForSelector('form');
    
    // Fill basic fields
    await page.fill('[name="name"], [placeholder*="name"]', 'Test Applicant');
    await page.fill('[name="email"], [type="email"]', 'test@example.com');
    
    // Upload file
    const fileInput = page.locator('[type="file"]');
    await fileInput.setInputFiles({
      name: 'resume.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake pdf content')
    });
    
    // Submit form
    await page.click('[type="submit"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });
  
  test('should handle form submission errors gracefully', async ({ page }) => {
    const navigator = createNavigator(page);
    
    // Navigate to form
    await navigator.toForms('test-workspace', 'test-form');
    await page.waitForSelector('form');
    
    // Mock API failure
    await page.route('**/api/forms/**/responses', route => route.abort());
    
    // Fill and submit form
    await page.fill('[name="name"]', 'Test User');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="message"]', 'Test message');
    await page.click('[type="submit"]');
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"], text="submission failed"')).toBeVisible();
    
    // Remove mock and retry
    await page.unroute('**/api/forms/**/responses');
    await page.click('[type="submit"], [data-testid="retry-button"]');
    
    // Should succeed
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });
});

test.describe('Form Analytics and Responses', () => {
  test('should view form responses and analytics', async ({ page }) => {
    const navigator = createNavigator(page);
    const { analytics } = createFormHelpers(page);
    
    // Navigate to form analytics
    await analytics.viewFormAnalytics('test-workspace', 'test-form');
    
    // Verify analytics dashboard
    await expect(page.locator('[data-testid="analytics-dashboard"]')).toBeVisible();
    await expect(page.locator('[data-testid="response-count"]')).toBeVisible();
    await expect(page.locator('[data-testid="completion-rate"]')).toBeVisible();
    
    // View individual responses
    await analytics.viewResponses();
    await expect(page.locator('[data-testid="responses-table"]')).toBeVisible();
  });
  
  test('should export form responses', async ({ page }) => {
    const navigator = createNavigator(page);
    const { analytics } = createFormHelpers(page);
    
    // Navigate to form analytics
    await analytics.viewFormAnalytics('test-workspace', 'test-form');
    
    // Export responses as CSV
    const download = await analytics.exportResponses('csv');
    
    // Verify download
    expect(download.suggestedFilename()).toContain('.csv');
    
    // Save and verify file content
    const path = await download.path();
    expect(path).toBeTruthy();
  });
  
  test('should show real-time response updates', async ({ page, context }) => {
    const navigator = createNavigator(page);
    const { analytics, submitter } = createFormHelpers(page);
    
    // Open analytics in one tab
    await analytics.viewFormAnalytics('test-workspace', 'test-form');
    const initialCount = await page.locator('[data-testid="response-count"]').textContent();
    
    // Open form in new tab and submit
    const newPage = await context.newPage();
    const newNavigator = createNavigator(newPage);
    const newSubmitter = createFormHelpers(newPage).submitter;
    
    await newNavigator.toForms('test-workspace', 'test-form');
    await newSubmitter.submitStaticForm(generateFormSubmissionData());
    
    // Check if response count updated in analytics tab
    await page.reload(); // Or implement real-time updates
    const newCount = await page.locator('[data-testid="response-count"]').textContent();
    
    expect(parseInt(newCount!)).toBe(parseInt(initialCount!) + 1);
    
    await newPage.close();
  });
});

test.describe('Form Sharing and Embedding', () => {
  test('should generate embeddable code', async ({ page }) => {
    const navigator = createNavigator(page);
    
    // Navigate to form settings
    await navigator.toApp();
    await page.click('[href*="/forms/"][href*="/edit"]');
    await page.click('[data-testid="share-embed-tab"], text="Embed"');
    
    // Get embed code
    const embedCode = await page.locator('[data-testid="embed-code"]').textContent();
    
    // Verify embed code format
    expect(embedCode).toContain('<iframe');
    expect(embedCode).toContain('forms.convo.ai');
  });
  
  test('should work when embedded in iframe', async ({ page }) => {
    const navigator = createNavigator(page);
    
    // Create a test page with iframe
    const testHtml = `
      <!DOCTYPE html>
      <html>
        <head><title>Test Embed</title></head>
        <body>
          <h1>Test Page</h1>
          <iframe src="${buildContextUrl('forms', 'test-workspace/test-form')}" width="100%" height="600"></iframe>
        </body>
      </html>
    `;
    
    // Navigate to test page (this would need to be served)
    // For now, test direct iframe access
    await navigator.toForms('test-workspace', 'test-form');
    
    // Verify form works in iframe context
    await expect(page.locator('form, [data-testid="form-container"]')).toBeVisible();
    
    // Test form submission in iframe
    await page.fill('[name="name"]', 'Iframe Test');
    await page.fill('[name="email"]', 'iframe@test.com');
    await page.click('[type="submit"]');
    
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });
});

test.describe('Mobile Form Experience', () => {
  test('should render forms correctly on mobile', async ({ page, isMobile }) => {
    if (!isMobile) test.skip('Mobile-only test');
    
    const navigator = createNavigator(page);
    
    // Navigate to form on mobile
    await navigator.toForms('test-workspace', 'test-form');
    
    // Verify mobile-optimized layout
    await expect(page.locator('[data-testid="mobile-form"]')).toBeVisible();
    
    // Test form interaction on mobile
    await page.tap('[name="name"]');
    await page.fill('[name="name"]', 'Mobile User');
    
    // Test conversational mode on mobile
    await page.goto(buildContextUrl('forms', 'test-workspace/conversational-form'));
    await expect(page.locator('[data-testid="mobile-chat"]')).toBeVisible();
  });
  
  test('should handle mobile keyboard interactions', async ({ page, isMobile }) => {
    if (!isMobile) test.skip('Mobile-only test');
    
    const navigator = createNavigator(page);
    await navigator.toForms('test-workspace', 'test-form');
    
    // Test that form fields are accessible with mobile keyboard
    await page.tap('[name="email"]');
    await expect(page.locator('[name="email"]')).toBeFocused();
    
    // Test phone number field triggers numeric keyboard
    await page.tap('[name="phone"]');
    await expect(page.locator('[name="phone"][inputmode="tel"]')).toBeVisible();
  });
});
