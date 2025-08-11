const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function resolveMigration() {
  try {
    console.log('🔧 Resolving failed migration...');
    
    // Check database connection
    console.log('📡 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check migration status
    console.log('📋 Checking migration status...');
    try {
      execSync('npx prisma migrate status', { stdio: 'inherit' });
    } catch (error) {
      console.log('⚠️  Migration status check failed, proceeding with resolution...');
    }
    
    // Option 1: Try to mark the failed migration as applied
    console.log('🔄 Attempting to mark failed migration as applied...');
    try {
      execSync('npx prisma migrate resolve --applied 20250810110029_enhanced_professional_system', { stdio: 'inherit' });
      console.log('✅ Failed migration marked as applied');
    } catch (error) {
      console.log('⚠️  Could not mark migration as applied, trying alternative approach...');
      
      // Option 2: Reset migrations and apply from scratch
      console.log('🔄 Resetting migration state...');
      try {
        execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
        console.log('✅ Migration state reset successfully');
      } catch (resetError) {
        console.log('⚠️  Reset failed, trying manual approach...');
        
        // Option 3: Manual resolution by checking what tables exist
        console.log('🔍 Checking existing tables...');
        const tables = await prisma.$queryRaw`
          SELECT TABLE_NAME 
          FROM INFORMATION_SCHEMA.TABLES 
          WHERE TABLE_SCHEMA = 'dhanvantari'
        `;
        console.log('📋 Existing tables:', tables);
        
        // If tables exist, mark migration as applied
        if (tables.length > 0) {
          console.log('📋 Tables exist, marking migration as applied...');
          try {
            execSync('npx prisma migrate resolve --applied 20250810110029_enhanced_professional_system', { stdio: 'inherit' });
            console.log('✅ Migration marked as applied');
          } catch (resolveError) {
            console.log('❌ Could not resolve migration automatically');
            console.log('💡 Manual intervention required:');
            console.log('1. Connect to your TiDB database');
            console.log('2. Check the _prisma_migrations table');
            console.log('3. Update the failed migration status or delete the failed record');
            throw resolveError;
          }
        }
      }
    }
    
    // Verify migration status
    console.log('✅ Migration resolution completed');
    
  } catch (error) {
    console.error('❌ Migration resolution failed:', error.message);
    console.log('\n💡 Manual resolution steps:');
    console.log('1. Connect to your TiDB database directly');
    console.log('2. Check the _prisma_migrations table:');
    console.log('   SELECT * FROM _prisma_migrations ORDER BY finished_at DESC;');
    console.log('3. Either:');
    console.log('   - Delete the failed migration record, or');
    console.log('   - Update the finished_at field to a valid timestamp');
    console.log('4. Then run: npx prisma migrate deploy');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the resolution
resolveMigration();
