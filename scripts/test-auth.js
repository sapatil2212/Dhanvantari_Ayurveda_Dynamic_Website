const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Check if there are any users
    const userCount = await prisma.user.count();
    console.log(`📊 Total users in database: ${userCount}`);

    if (userCount === 0) {
      console.log('⚠️  No users found. Creating a test admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const testUser = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@example.com',
          passwordHash: hashedPassword,
          emailVerified: new Date(),
          role: 'ADMIN',
          isActive: true,
        }
      });
      
      console.log('✅ Test user created:', {
        id: testUser.id,
        email: testUser.email,
        role: testUser.role
      });
      console.log('🔑 Login credentials: admin@example.com / admin123');
    } else {
      // List existing users
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          isActive: true,
          lastLoginAt: true
        }
      });
      
      console.log('👥 Existing users:');
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.role}) - Verified: ${!!user.emailVerified} - Active: ${user.isActive}`);
      });
    }

    // Test password hashing
    console.log('\n🔐 Testing password hashing...');
    const testPassword = 'test123';
    const hashedTestPassword = await bcrypt.hash(testPassword, 12);
    const isMatch = await bcrypt.compare(testPassword, hashedTestPassword);
    console.log(`✅ Password hashing test: ${isMatch ? 'PASSED' : 'FAILED'}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
