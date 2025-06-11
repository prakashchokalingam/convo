import { Page, expect, Locator } from '@playwright/test';
import { TestForm, generateFormSubmissionData } from './test-data';

/**
 * Form testing utilities for E2E tests
 * Handles form creation, editing, and submission testing
 */

export interface FormField {
  type: string;
  label: string;
  value?: string;
  required?: boolean;
}

export interface SubmissionData {
  [fieldLabel: string]: string | boolean | string[];
}

/**
 * Form builder helper class
 */
export class FormBuilder {
  constructor(private page: Page) {}
  
  /**
   * Create a new form using AI generation
   */
  async createFormWithAI(prompt: string): Promise<string> {
    // Navigate to new form page
    await this.page.click('[data-testid="create-form-button"], [href*="/forms/new"]');
    await this.page.waitForSelector('[data-testid="ai-form-generator"], [placeholder*="describe"]');
    
    // Enter AI prompt
    await this.page.fill('[data-testid="ai-prompt-input"], [placeholder*="describe"]', prompt);
    
    // Click generate button
    await this.page.click('[data-testid="generate-form-button"], button >> text="Generate"');
    
    // Wait for form to be generated
    await this.page.waitForSelector('[data-testid="form-preview"], [data-testid="form-fields"]', { timeout: 30000 });
    
    // Save the form
    await this.page.click('[data-testid="save-form-button"], button >> text="Save"');
    
    // Wait for redirect to form details page
    await this.page.waitForURL('**/forms/**/edit', { timeout: 15000 });
    
    // Extract form ID from URL
    const url = this.page.url();
    const formId = url.match(/\/forms\/([^\/]+)\/edit/)?.[1];
    
    if (!formId) {
      throw new Error('Could not extract form ID from URL: ' + url);
    }
    
    return formId;
  }
  
  /**
   * Create a form manually using the form builder
   */
  async createFormManually(formData: TestForm): Promise<string> {
    // Navigate to new form page
    await this.page.click('[data-testid="create-form-button"]');
    await this.page.waitForSelector('[data-testid="form-builder"]');
    
    // Set form name and description
    await this.page.fill('[data-testid="form-name-input"], [name="name"]', formData.name);
    if (formData.description) {
      await this.page.fill('[data-testid="form-description-input"], [name="description"]', formData.description);
    }
    
    // Add fields
    for (const field of formData.fields) {
      await this.addField(field.type, field.label, field.required);
    }
    
    // Save the form
    await this.page.click('[data-testid="save-form-button"]');
    await this.page.waitForURL('**/forms/**/edit');
    
    // Extract form ID
    const url = this.page.url();
    const formId = url.match(/\/forms\/([^\/]+)\/edit/)?.[1];
    
    if (!formId) {
      throw new Error('Could not extract form ID from URL: ' + url);
    }
    
    return formId;
  }
  
  /**
   * Add a field to the form builder
   */
  async addField(fieldType: string, label: string, required: boolean = false) {
    // Click add field button
    await this.page.click('[data-testid="add-field-button"]');
    
    // Select field type
    await this.page.click(`[data-testid="field-type-${fieldType}"], [data-value="${fieldType}"]`);
    
    // Configure field properties
    await this.page.fill('[data-testid="field-label-input"], [name="label"]', label);
    
    if (required) {
      await this.page.check('[data-testid="field-required-checkbox"], [name="required"]');
    }
    
    // Save field
    await this.page.click('[data-testid="save-field-button"], button >> text="Save"');
    
    // Wait for field to appear in the builder
    await this.page.waitForSelector(`[data-testid="field-${label}"], [data-field-label="${label}"]`);
  }
  
  /**
   * Reorder fields using drag and drop
   */
  async reorderFields(fromIndex: number, toIndex: number) {
    const fields = await this.page.locator('[data-testid^="field-"]').all();
    
    if (fromIndex >= fields.length || toIndex >= fields.length) {
      throw new Error('Field index out of range');
    }
    
    const sourceField = fields[fromIndex];
    const targetField = fields[toIndex];
    
    // Perform drag and drop
    await sourceField.dragTo(targetField);
    
    // Wait for reorder to complete
    await this.page.waitForTimeout(1000);
  }
  
  /**
   * Toggle between static and conversational mode
   */
  async toggleConversationalMode() {
    await this.page.click('[data-testid="conversational-toggle"], [data-testid="form-mode-toggle"]');
    await this.page.waitForTimeout(500); // Wait for UI update
  }
  
  /**
   * Preview the form
   */
  async previewForm() {
    await this.page.click('[data-testid="preview-form-button"], button >> text="Preview"');
    await this.page.waitForSelector('[data-testid="form-preview-modal"], [data-testid="form-preview"]');
  }
  
  /**
   * Get form share URL
   */
  async getShareUrl(): Promise<string> {
    await this.page.click('[data-testid="share-form-button"], button >> text="Share"');
    await this.page.waitForSelector('[data-testid="share-url-input"], [data-testid="form-url"]');
    
    const urlInput = this.page.locator('[data-testid="share-url-input"], [data-testid="form-url"]');
    const shareUrl = await urlInput.inputValue();
    
    return shareUrl;
  }
}

/**
 * Form submission helper class
 */
export class FormSubmitter {
  constructor(private page: Page) {}
  
  /**
   * Submit a form in static mode
   */
  async submitStaticForm(submissionData: SubmissionData) {
    // Wait for form to load
    await this.page.waitForSelector('form, [data-testid="form-container"]');
    
    // Fill in all fields
    for (const [label, value] of Object.entries(submissionData)) {
      await this.fillField(label, value);
    }
    
    // Submit the form
    await this.page.click('[type="submit"], [data-testid="submit-button"], button >> text="Submit"');
    
    // Wait for success message or redirect
    await Promise.race([
      this.page.waitForSelector('[data-testid="success-message"], .success'),
      this.page.waitForURL('**/thank-you*'),
      this.page.waitForSelector('text="Thank you"')
    ]);
  }
  
  /**
   * Submit a form in conversational mode
   */
  async submitConversationalForm(submissionData: SubmissionData) {
    // Wait for conversational interface
    await this.page.waitForSelector('[data-testid="chat-interface"], [data-testid="conversation-form"]');
    
    // Answer each question in sequence
    for (const [label, value] of Object.entries(submissionData)) {
      // Wait for the question to appear
      await this.page.waitForSelector(`text="${label}", [data-question*="${label}"]`);
      
      // Fill the current answer
      await this.fillCurrentConversationalField(value);
      
      // Continue to next question
      await this.page.click('[data-testid="continue-button"], button >> text="Continue"');
      
      // Wait for next question or completion
      await this.page.waitForTimeout(1000);
    }
    
    // Wait for completion
    await this.page.waitForSelector('[data-testid="conversation-complete"], text="Thank you"');
  }
  
  /**
   * Fill a field by label
   */
  private async fillField(label: string, value: string | boolean | string[]) {
    // Find field by label
    const field = this.page.locator(`label:has-text("${label}") + input, label:has-text("${label}") + textarea, label:has-text("${label}") + select`);
    
    if (typeof value === 'boolean') {
      if (value) {
        await field.check();
      } else {
        await field.uncheck();
      }
    } else if (Array.isArray(value)) {
      // Handle multi-select
      for (const option of value) {
        await field.selectOption(option);
      }
    } else {
      await field.fill(value);
    }
  }
  
  /**
   * Fill current field in conversational mode
   */
  private async fillCurrentConversationalField(value: string | boolean | string[]) {
    // Look for active input field
    const activeInput = this.page.locator('[data-testid="current-input"], .active input, .current input').first();
    
    if (typeof value === 'boolean') {
      const option = value ? 'Yes' : 'No';
      await this.page.click(`button >> text="${option}", [data-value="${option}"]`);
    } else if (Array.isArray(value)) {
      // Handle multiple choice
      for (const option of value) {
        await this.page.click(`button >> text="${option}", [data-value="${option}"]`);
      }
    } else {
      await activeInput.fill(value);
    }
  }
  
  /**
   * Verify form submission success
   */
  async verifySubmissionSuccess() {
    await expect(this.page.locator('[data-testid="success-message"], text="Thank you", text="submitted successfully"')).toBeVisible();
  }
  
  /**
   * Verify validation errors
   */
  async verifyValidationErrors(expectedErrors: string[]) {
    for (const error of expectedErrors) {
      await expect(this.page.locator(`text="${error}", [data-testid="error-message"]`)).toBeVisible();
    }
  }
}

/**
 * Form analytics helper class
 */
export class FormAnalytics {
  constructor(private page: Page) {}
  
  /**
   * Navigate to form analytics
   */
  async viewFormAnalytics(workspaceSlug: string, formId: string) {
    await this.page.goto(`/${workspaceSlug}/forms/${formId}/analytics?subdomain=app`);
    await this.page.waitForSelector('[data-testid="analytics-dashboard"]');
  }
  
  /**
   * Verify response count
   */
  async verifyResponseCount(expectedCount: number) {
    const responseCount = this.page.locator('[data-testid="response-count"]');
    await expect(responseCount).toContainText(expectedCount.toString());
  }
  
  /**
   * View form responses
   */
  async viewResponses() {
    await this.page.click('[data-testid="view-responses-button"], button >> text="Responses"');
    await this.page.waitForSelector('[data-testid="responses-table"]');
  }
  
  /**
   * Export responses
   */
  async exportResponses(format: 'csv' | 'json' = 'csv') {
    await this.page.click('[data-testid="export-button"], button >> text="Export"');
    await this.page.click(`[data-testid="export-${format}"], button >> text="${format.toUpperCase()}"`);
    
    // Wait for download to start
    const downloadPromise = this.page.waitForEvent('download');
    await this.page.click('[data-testid="confirm-export"], button >> text="Download"');
    const download = await downloadPromise;
    
    return download;
  }
}

/**
 * Create form testing helpers
 */
export function createFormHelpers(page: Page) {
  return {
    builder: new FormBuilder(page),
    submitter: new FormSubmitter(page),
    analytics: new FormAnalytics(page)
  };
}

/**
 * Common form testing assertions
 */
export async function assertFormExists(page: Page, formName: string) {
  await expect(page.locator(`text="${formName}", [data-testid="form-${formName}"]`)).toBeVisible();
}

export async function assertFormFieldExists(page: Page, fieldLabel: string) {
  await expect(page.locator(`label:has-text("${fieldLabel}"), [data-field-label="${fieldLabel}"]`)).toBeVisible();
}

export async function assertFormModeToggle(page: Page, mode: 'static' | 'conversational') {
  const toggle = page.locator('[data-testid="form-mode-toggle"], [data-testid="conversational-toggle"]');
  if (mode === 'conversational') {
    await expect(toggle).toBeChecked();
  } else {
    await expect(toggle).not.toBeChecked();
  }
}
