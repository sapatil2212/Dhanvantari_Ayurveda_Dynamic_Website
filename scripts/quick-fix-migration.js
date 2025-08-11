const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function quickFixMigration() {
  try {
    console.log('🔧 Quick fix for failed migration...');
    
    // Connect to database
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Check if the failed migration exists in the database
    console.log('🔍 Checking migration status...');
    const migrations = await prisma.$queryRaw`
      SELECT * FROM _prisma_migrations 
      WHERE migration_name = '20250810110029_enhanced_professional_system'
      ORDER BY finished_at DESC
    `;
    
    if (migrations.length > 0) {
      console.log('📋 Found migration record, attempting to fix...');
      
      // Try to mark it as applied
      try {
        execSync('npx prisma migrate resolve --applied 20250810110029_enhanced_professional_system', { stdio: 'inherit' });
        console.log('✅ Migration marked as applied');
      } catch (error) {
        console.log('⚠️  Could not mark as applied, trying to delete the record...');
        
        // Delete the failed migration record
        await prisma.$executeRaw`
          DELETE FROM _prisma_migrations 
          WHERE migration_name = '20250810110029_enhanced_professional_system' 
          AND finished_at IS NULL
        `;
        console.log('✅ Failed migration record deleted');
      }
    } else {
      console.log('📋 No failed migration record found');
    }
    
    // Now try to deploy migrations
    console.log('🔄 Deploying migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Migrations deployed successfully');
    
    console.log('🎉 Migration issue resolved!');
    
  } catch (error) {
    console.error('❌ Quick fix failed:', error.message);
    console.log('\n💡 Alternative manual fix:');
    console.log('1. Connect to your TiDB database');
    console.log('2. Run: DELETE FROM _prisma_migrations WHERE migration_name = "20250810110029_enhanced_professional_system" AND finished_at IS NULL;');
    console.log('3. Then run: npx prisma migrate deploy');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the quick fix
quickFixMigration();
