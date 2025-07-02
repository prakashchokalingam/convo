import { test as baseTest } from '@playwright/test';
import { clerkSetup } from '@clerk/testing/playwright';

// Extend base test with Clerk-specific setup.
// This new 'test' object will have the 'clerk' fixture.
export const test = baseTest.extend(clerkSetup);

// Export expect as well, so tests can import it from here.
export { expect } from '@playwright/test';
