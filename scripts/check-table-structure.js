const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTableStructure() {
  try {
    console.log('Checking HotelInfo table structure...');
    
    // Get table structure using raw SQL
    const result = await prisma.$queryRaw`DESCRIBE HotelInfo`;
    console.log('Table structure:', result);
    
    // Try to fetch hotel info with the new fields
    const hotelInfo = await prisma.hotelInfo.findFirst({
      select: {
        id: true,
        name: true,
        facebook: true,
        instagram: true,
        twitter: true,
        linkedin: true,
        pinterest: true,
        youtube: true
      }
    });
    
    console.log('Hotel info with social media fields:', hotelInfo);
    
  } catch (error) {
    console.error('❌ Error checking table structure:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTableStructure();
