const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Dhanvantari Ayurveda - Initial Setup');
console.log('=====================================\n');

async function initialSetup() {
  try {
    // Step 1: Check if .env file exists
    console.log('1️⃣  Checking environment configuration...');
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
      console.log('⚠️  .env file not found. Please create one with the following variables:');
      console.log(`
DATABASE_URL="mysql://2eCzcoDvebHUdTd.root:U1pliZhGv35AskBG@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/dhanvantari?sslaccept=strict"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-change-this-in-production"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USERNAME="saptechnoeditors@gmail.com"
EMAIL_PASSWORD="uyqhyiptjkarfgdq"
UPLOAD_DIR="public/uploads"
MAX_FILE_SIZE="5242880"
AGENCY_PSK="swapnil2212"
      `);
      process.exit(1);
    }
    console.log('✅ Environment file found');

    // Step 2: Install dependencies
    console.log('\n2️⃣  Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed');

    // Step 3: Generate Prisma client
    console.log('\n3️⃣  Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated');

    // Step 4: Test database connection
    console.log('\n4️⃣  Testing database connection...');
    execSync('node scripts/test-db-connection.js', { stdio: 'inherit' });

    // Step 5: Setup database
    console.log('\n5️⃣  Setting up database...');
    execSync('node scripts/setup-database.js', { stdio: 'inherit' });

    console.log('\n🎉 Initial setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run "npm run dev" to start the development server');
    console.log('2. Open http://localhost:3000 in your browser');
    console.log('3. Login with admin@dhanvantari.com / admin123');
    console.log('4. Change the default admin password');
    console.log('5. Configure your clinic settings');
    console.log('\n🚀 For production deployment, follow the DEPLOYMENT.md guide');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check your DATABASE_URL in .env file');
    console.log('2. Ensure TiDB database is accessible');
    console.log('3. Verify all environment variables are set');
    process.exit(1);
  }
}

// Run the setup
initialSetup();
