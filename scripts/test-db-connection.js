const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test if tables exist
    console.log('📋 Checking database tables...');
    
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ User table exists with ${userCount} records`);
    } catch (error) {
      console.log('❌ User table does not exist or is not accessible');
    }
    
    try {
      const patientCount = await prisma.patient.count();
      console.log(`✅ Patient table exists with ${patientCount} records`);
    } catch (error) {
      console.log('❌ Patient table does not exist or is not accessible');
    }
    
    try {
      const appointmentCount = await prisma.appointment.count();
      console.log(`✅ Appointment table exists with ${appointmentCount} records`);
    } catch (error) {
      console.log('❌ Appointment table does not exist or is not accessible');
    }
    
    try {
      const inventoryCount = await prisma.inventoryItem.count();
      console.log(`✅ InventoryItem table exists with ${inventoryCount} records`);
    } catch (error) {
      console.log('❌ InventoryItem table does not exist or is not accessible');
    }
    
    console.log('\n🎉 Database connection test completed!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Check your DATABASE_URL environment variable');
    console.log('2. Ensure the database server is running');
    console.log('3. Verify network connectivity to the database');
    console.log('4. Check database credentials and permissions');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testConnection();
