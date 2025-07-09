import { test as baseTest, expect } from '@playwright/test';

// Since clerkSetup() is called in global setup, we can use the standard test object
// The clerk helper functions are available through the @clerk/testing/playwright module
export const test = baseTest;
export { expect };
