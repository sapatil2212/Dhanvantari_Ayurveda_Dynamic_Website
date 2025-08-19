const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSocialMediaFields() {
  try {
    console.log('Adding LinkedIn and Pinterest fields to HotelInfo table...');
    
    // Add the new columns using raw SQL
    await prisma.$executeRaw`ALTER TABLE HotelInfo ADD COLUMN linkedin VARCHAR(191) NULL`;
    await prisma.$executeRaw`ALTER TABLE HotelInfo ADD COLUMN pinterest VARCHAR(191) NULL`;
    
    console.log('✅ Successfully added LinkedIn and Pinterest fields to HotelInfo table');
    
    // Verify the changes by fetching hotel info
    const hotelInfo = await prisma.hotelInfo.findFirst();
    console.log('Current hotel info fields:', Object.keys(hotelInfo || {}));
    
  } catch (error) {
    console.error('❌ Error adding social media fields:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSocialMediaFields();
