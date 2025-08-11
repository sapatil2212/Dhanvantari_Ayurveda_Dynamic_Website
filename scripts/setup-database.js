const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database...');
    
    // Check if database is accessible
    console.log('📡 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Run Prisma migrations
    console.log('🔄 Running database migrations...');
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Migrations completed successfully');
    } catch (error) {
      console.log('⚠️  Migration failed, trying to reset...');
      try {
        execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
        console.log('✅ Database reset and migrations completed');
      } catch (resetError) {
        console.error('❌ Database reset failed:', resetError.message);
        throw resetError;
      }
    }
    
    // Generate Prisma client
    console.log('🔧 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated');
    
    // Create default admin user if no users exist
    console.log('👤 Checking for default admin user...');
    const userCount = await prisma.user.count();
    
    if (userCount === 0) {
      console.log('👤 Creating default admin user...');
      const defaultUser = await prisma.user.create({
        data: {
          name: 'System Administrator',
          email: 'admin@dhanvantari.com',
          passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', // password: admin123
          role: 'SUPER_ADMIN',
          isActive: true,
        },
      });
      console.log('✅ Default admin user created:', defaultUser.email);
    } else {
      console.log('✅ Users already exist in database');
    }
    
    // Create default system settings
    console.log('⚙️  Setting up default system settings...');
    const settings = [
      { key: 'clinic_name', value: 'Dhanvantari Ayurveda', description: 'Clinic Name', category: 'general' },
      { key: 'clinic_address', value: 'Your Clinic Address', description: 'Clinic Address', category: 'general' },
      { key: 'clinic_phone', value: '+1234567890', description: 'Clinic Phone', category: 'general' },
      { key: 'clinic_email', value: 'info@dhanvantari.com', description: 'Clinic Email', category: 'general' },
      { key: 'appointment_duration', value: '30', description: 'Default appointment duration in minutes', category: 'appointments' },
      { key: 'currency', value: 'USD', description: 'Default currency', category: 'billing' },
      { key: 'tax_rate', value: '0.00', description: 'Default tax rate percentage', category: 'billing' },
    ];
    
    for (const setting of settings) {
      await prisma.systemSetting.upsert({
        where: { key: setting.key },
        update: {},
        create: setting,
      });
    }
    console.log('✅ Default system settings created');
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupDatabase();
