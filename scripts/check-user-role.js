const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserRole() {
  try {
    // Get all users with their roles
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    console.log('Current users and their roles:');
    console.log('================================');
    
    users.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Active: ${user.isActive}`);
      console.log('---');
    });

    // Check if there are any users with ADMIN role
    const adminUsers = users.filter(user => user.role === 'ADMIN');
    if (adminUsers.length === 0) {
      console.log('\n⚠️  No ADMIN users found!');
      console.log('Creating a default ADMIN user...');
      
      const adminUser = await prisma.user.create({
        data: {
          name: 'System Administrator',
          email: 'admin@dhanvantari.com',
          passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', // password: admin123
          role: 'ADMIN',
          isActive: true,
          emailVerified: new Date()
        }
      });
      
      console.log('✅ Admin user created successfully!');
      console.log(`Email: ${adminUser.email}`);
      console.log('Password: admin123');
    } else {
      console.log(`\n✅ Found ${adminUsers.length} ADMIN user(s)`);
    }

  } catch (error) {
    console.error('Error checking user roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserRole();
