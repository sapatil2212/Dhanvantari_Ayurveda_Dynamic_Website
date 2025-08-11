const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function vercelBuild() {
  try {
    console.log('🚀 Starting Vercel build process...');
    
    // Step 1: Generate Prisma client
    console.log('🔧 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated');
    
    // Step 2: Test database connection
    console.log('📡 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Step 3: Try to deploy migrations
    console.log('🔄 Deploying database migrations...');
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Migrations deployed successfully');
    } catch (migrationError) {
      console.log('⚠️  Migration deployment failed, attempting to resolve...');
      
      // Try to resolve the failed migration
      try {
        execSync('node scripts/resolve-migration.js', { stdio: 'inherit' });
        console.log('✅ Migration resolved, retrying deployment...');
        
        // Retry migration deployment
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        console.log('✅ Migrations deployed successfully after resolution');
      } catch (resolveError) {
        console.log('❌ Could not resolve migration automatically');
        console.log('💡 Attempting manual resolution...');
        
        // Manual resolution: check if tables exist and mark migration as applied
        try {
          const tables = await prisma.$queryRaw`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = 'dhanvantari'
          `;
          
          if (tables.length > 0) {
            console.log('📋 Tables exist, marking failed migration as applied...');
            execSync('npx prisma migrate resolve --applied 20250810110029_enhanced_professional_system', { stdio: 'inherit' });
            console.log('✅ Migration marked as applied');
          } else {
            console.log('📋 No tables exist, resetting migrations...');
            execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
            console.log('✅ Migrations reset and applied');
          }
        } catch (manualError) {
          console.error('❌ Manual resolution failed:', manualError.message);
          throw manualError;
        }
      }
    }
    
    // Step 4: Build Next.js application
    console.log('🏗️  Building Next.js application...');
    execSync('next build', { stdio: 'inherit' });
    console.log('✅ Next.js build completed');
    
    console.log('🎉 Vercel build completed successfully!');
    
  } catch (error) {
    console.error('❌ Vercel build failed:', error.message);
    console.log('\n💡 Troubleshooting steps:');
    console.log('1. Check your DATABASE_URL environment variable');
    console.log('2. Ensure TiDB database is accessible');
    console.log('3. Run "npm run db:resolve-migration" to fix migration issues');
    console.log('4. Check Vercel build logs for specific errors');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the build
vercelBuild();
