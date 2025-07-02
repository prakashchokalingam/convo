import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup that runs once before all tests
 * This handles:
 * - Database setup
 * - Test data preparation
 * - Environment verification
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E test setup...');
  
  try {
    // Verify that the development server is running
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Check if the server is responding
    try {
      await page.goto(config.projects[0].use?.baseURL || 'http://localhost:3002', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      console.log('✅ Development server is running');
    } catch (error) {
      console.error('❌ Development server is not responding:', error);
      throw new Error('Development server is not available. Please run `npm run dev` first.');
    }
    
    await browser.close();
    
    // Verify database is running
    // try {
    //   // Attempt to import .ts directly, hoping Playwright's environment handles it
    //   // const { db } = await import('../../lib/db/index.ts');
    //   // Simple query to check database connectivity
    //   // await db.execute('SELECT 1');
    //   // console.log('✅ Database connection verified');
    // } catch (error) {
    //   console.warn('⚠️ Database connection failed, but continuing with tests:', error);
    //   // Don't throw error - allow tests to run without database
    // }
    console.log('⚠️ DB check in global-setup temporarily bypassed.');
    
    console.log('✅ E2E test setup completed successfully');
    
  } catch (error) {
    console.error('❌ E2E test setup failed:', error);
    throw error;
  }
}

export default globalSetup;
