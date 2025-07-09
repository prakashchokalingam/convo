import { FullConfig } from '@playwright/test';

/**
 * Global teardown that runs once after all tests
 * This handles:
 * - Test data cleanup
 * - Resource cleanup
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting E2E test cleanup...');

  try {
    // Clean up test data if needed
    // Note: In development, we might want to keep test data for debugging
    // In CI, we should clean up everything

    if (process.env.CI) {
      const { db } = await import('../../lib/db');

      // Clean up test workspaces and related data
      // This should only delete data created during tests
      console.log('🗑️ Cleaning up test data (CI mode)...');

      // Add cleanup queries here when we have test data patterns
      // Example:
      // await db.delete(workspaces).where(like(workspaces.slug, 'test-%'));
    }

    console.log('✅ E2E test cleanup completed');
  } catch (error) {
    console.error('❌ E2E test cleanup failed:', error);
    // Don't throw error in cleanup to avoid masking test failures
  }
}

export default globalTeardown;
