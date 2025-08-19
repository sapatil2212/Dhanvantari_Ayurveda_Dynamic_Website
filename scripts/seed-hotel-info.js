const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedHotelInfo() {
  try {
    console.log('🌱 Seeding hotel information...');

    // Check if hotel info already exists
    const existingHotelInfo = await prisma.hotelInfo.findFirst();
    
    if (existingHotelInfo) {
      console.log('✅ Hotel information already exists, skipping...');
      return;
    }

    // Create default hotel information
    const hotelInfo = await prisma.hotelInfo.create({
      data: {
        name: "Dhanvantari Ayurvedic Clinic",
        tagline: "Authentic Ayurvedic Healing",
        description: "Traditional Panchkarma treatments and personalized wellness solutions in the heart of Nashik.",
        phone: "+91 99211 18724",
        email: "dhanvantariayurvedansk@gmail.com",
        website: "https://dhanvantariayurveda.com",
        address: "Dhanvantari Ayurveda Building",
        city: "Ojhar",
        state: "Maharashtra",
        pincode: "422206",
        landmark: "Saikheda Phata, near Khanderao mandir",
        workingHours: "Monday - Saturday: 9:00 AM - 7:00 PM\nSunday: 10:00 AM - 2:00 PM",
        emergencyContact: "+91 99211 18724",
        facebook: "https://facebook.com/dhanvantariayurveda",
        instagram: "https://instagram.com/dhanvantariayurveda",
        twitter: "https://twitter.com/dhanvantariayur",
        youtube: "https://youtube.com/@dhanvantariayurveda",
        headerLogo: "/assets/logo/logo.png",
        footerLogo: "/assets/logo/logo.png",
        favicon: "/assets/logo/logo.png",
        metaTitle: "Dhanvantari Ayurvedic Clinic - Authentic Ayurvedic Healing in Nashik",
        metaDescription: "Experience authentic Ayurvedic healing through traditional Panchkarma treatments and personalized wellness solutions at Dhanvantari Ayurvedic Clinic in Nashik.",
        metaKeywords: "ayurvedic clinic, panchkarma, nashik, ayurvedic treatment, wellness, traditional healing",
        gstNumber: "27AABCD1234Z1Z5",
        licenseNumber: "MAH/AYUR/2023/001",
        registrationNumber: "REG123456789"
      }
    });

    console.log('✅ Hotel information seeded successfully!');
    console.log('📋 Created hotel info with ID:', hotelInfo.id);
    console.log('🏥 Clinic Name:', hotelInfo.name);
    console.log('📞 Phone:', hotelInfo.phone);
    console.log('📧 Email:', hotelInfo.email);

  } catch (error) {
    console.error('❌ Error seeding hotel information:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedHotelInfo();
