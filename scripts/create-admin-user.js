const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('👤 Creating default admin user and system settings...');
    
    // Connect to database
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Create default admin user if no users exist
    console.log('👤 Checking for existing users...');
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
    
    console.log('🎉 Admin user and settings setup completed successfully!');
    console.log('\n📋 Default admin credentials:');
    console.log('Email: admin@dhanvantari.com');
    console.log('Password: admin123');
    console.log('\n⚠️  Remember to change these credentials after first login!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
createAdminUser();
