const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateUserRole() {
  try {
    // Update the current user's role to ADMIN
    const updatedUser = await prisma.user.update({
      where: {
        email: 'swapnilpatil221298@gmail.com'
      },
      data: {
        role: 'ADMIN'
      }
    });

    console.log('✅ User role updated successfully!');
    console.log(`Name: ${updatedUser.name}`);
    console.log(`Email: ${updatedUser.email}`);
    console.log(`New Role: ${updatedUser.role}`);

  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserRole();
