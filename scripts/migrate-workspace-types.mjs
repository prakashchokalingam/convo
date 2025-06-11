import { db } from './drizzle/db.js';
import { sql } from 'drizzle-orm';

async function runMigration() {
  try {
    console.log('Starting workspace type migration...');
    
    // Step 1: Update existing 'personal' workspaces to 'default'
    console.log('1. Updating existing personal workspaces to default...');
    const updateResult = await db.execute(
      sql`UPDATE workspaces SET type = 'default' WHERE type = 'personal'`
    );
    console.log(`✅ Updated ${updateResult.rowCount || 0} workspaces from 'personal' to 'default'`);
    
    // Step 2: Create unique index to ensure only one default workspace per user
    console.log('2. Creating unique index for default workspaces...');
    try {
      await db.execute(
        sql`CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_workspaces_owner_default 
            ON workspaces (owner_id) 
            WHERE type = 'default'`
      );
      console.log('✅ Created unique index for default workspaces');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ Unique index already exists');
      } else {
        throw error;
      }
    }
    
    // Step 3: Verify the migration
    console.log('3. Verifying migration...');
    const defaultCount = await db.execute(
      sql`SELECT COUNT(*) as count FROM workspaces WHERE type = 'default'`
    );
    const personalCount = await db.execute(
      sql`SELECT COUNT(*) as count FROM workspaces WHERE type = 'personal'`
    );
    
    console.log(`✅ Default workspaces: ${defaultCount.rows[0].count}`);
    console.log(`✅ Personal workspaces remaining: ${personalCount.rows[0].count}`);
    
    // Check for duplicate default workspaces per user
    const duplicateCheck = await db.execute(
      sql`SELECT owner_id, COUNT(*) as count 
          FROM workspaces 
          WHERE type = 'default' 
          GROUP BY owner_id 
          HAVING COUNT(*) > 1`
    );
    
    if (duplicateCheck.rows.length > 0) {
      console.warn('⚠️ Found users with multiple default workspaces:', duplicateCheck.rows);
    } else {
      console.log('✅ No duplicate default workspaces found');
    }
    
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
