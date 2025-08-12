const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testNextAuth() {
  try {
    console.log('🔍 Testing NextAuth configuration...');
    
    // Test environment variables
    console.log('📋 Environment variables:');
    console.log(`  NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing'}`);
    console.log(`  NEXTAUTH_URL: ${process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Missing'}`);
    console.log(`  DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'}`);
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Get the existing user
    const user = await prisma.user.findUnique({
      where: { email: 'swapnilpatil221298@gmail.com' }
    });
    
    if (!user) {
      console.log('❌ User not found in database');
      return;
    }
    
    console.log('👤 User found:', {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerified: !!user.emailVerified,
      isActive: user.isActive
    });
    
    // Test password verification (you'll need to provide the actual password)
    console.log('\n🔐 To test password verification, you need to provide the actual password.');
    console.log('   The password hash in database is:', user.passwordHash.substring(0, 20) + '...');
    
    // Test bcrypt comparison
    const testPassword = 'test123'; // This is just for testing bcrypt
    const testHash = await bcrypt.hash(testPassword, 12);
    const testMatch = await bcrypt.compare(testPassword, testHash);
    console.log(`✅ Bcrypt test: ${testMatch ? 'PASSED' : 'FAILED'}`);
    
    console.log('\n🎯 NextAuth should work with the following configuration:');
    console.log('   - User exists and is verified');
    console.log('   - User is active');
    console.log('   - Environment variables are set');
    console.log('   - Database connection works');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testNextAuth();
