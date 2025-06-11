import { createId } from '@paralleldrive/cuid2';

/**
 * Test data generation utilities for E2E tests
 */

export interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface TestWorkspace {
  name: string;
  slug: string;
  description?: string;
}

export interface TestForm {
  name: string;
  description: string;
  fields: Array<{
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
  }>;
}

/**
 * Generates a unique test user for authentication
 */
export function generateTestUser(): TestUser {
  const timestamp = Date.now();
  const uniqueId = createId();
  
  return {
    email: `test-user-${timestamp}-${uniqueId}@example.com`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User'
  };
}

/**
 * Creates a test workspace with unique slug
 */
export function createTestWorkspace(): TestWorkspace {
  const timestamp = Date.now();
  const uniqueId = createId().substring(0, 8);
  
  return {
    name: `Test Workspace ${timestamp}`,
    slug: `test-workspace-${timestamp}-${uniqueId}`,
    description: 'This is a test workspace created by E2E tests'
  };
}

/**
 * Creates a basic contact form for testing
 */
export function createTestContactForm(): TestForm {
  return {
    name: 'Test Contact Form',
    description: 'A simple contact form for E2E testing',
    fields: [
      {
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true
      },
      {
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        required: true
      },
      {
        type: 'phone',
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
        required: false
      },
      {
        type: 'textarea',
        label: 'Message',
        placeholder: 'Enter your message',
        required: true
      }
    ]
  };
}

/**
 * Creates a job application form for testing
 */
export function createTestJobForm(): TestForm {
  return {
    name: 'Test Job Application',
    description: 'A job application form for E2E testing',
    fields: [
      {
        type: 'text',
        label: 'Full Name',
        required: true
      },
      {
        type: 'email',
        label: 'Email',
        required: true
      },
      {
        type: 'phone',
        label: 'Phone Number',
        required: true
      },
      {
        type: 'select',
        label: 'Position Applied For',
        required: true
      },
      {
        type: 'file',
        label: 'Resume',
        required: true
      },
      {
        type: 'textarea',
        label: 'Cover Letter',
        required: false
      }
    ]
  };
}

/**
 * Generates test form submission data
 */
export function generateFormSubmissionData(formType: 'contact' | 'job' = 'contact') {
  const timestamp = Date.now();
  
  if (formType === 'contact') {
    return {
      'Full Name': `Test Submitter ${timestamp}`,
      'Email Address': `submitter-${timestamp}@example.com`,
      'Phone Number': '+1-555-0123',
      'Message': `This is a test submission created at ${new Date().toISOString()}`
    };
  }
  
  if (formType === 'job') {
    return {
      'Full Name': `Job Applicant ${timestamp}`,
      'Email': `applicant-${timestamp}@example.com`,
      'Phone Number': '+1-555-0456',
      'Position Applied For': 'Software Engineer',
      'Cover Letter': `This is a test job application submitted at ${new Date().toISOString()}`
    };
  }
  
  return {};
}

/**
 * AI prompt templates for testing form generation
 */
export const AI_PROMPTS = {
  contact: 'Create a contact form with name, email, phone, and message fields',
  feedback: 'Create a customer feedback form with rating, comments, and satisfaction survey',
  registration: 'Create an event registration form with personal details, dietary preferences, and emergency contact',
  survey: 'Create a product survey with multiple choice questions about user experience',
  booking: 'Create a consultation booking form with date/time selection and service type'
};

/**
 * Test data cleanup utilities
 */
export function isTestData(identifier: string): boolean {
  return identifier.includes('test-') || 
         identifier.includes('e2e-') ||
         identifier.startsWith('Test ');
}

export function generateCleanupPattern(): string {
  // Pattern to identify test data for cleanup
  return 'test-%';
}
