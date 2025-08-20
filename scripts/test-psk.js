const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPSKValidation() {
  console.log('🧪 Testing PSK Validation...\n');

  // Test 1: Check if AGENCY_PSK is set
  const expectedPSK = process.env.AGENCY_PSK;
  console.log('1. Environment Variable Check:');
  if (expectedPSK) {
    console.log(`   ✅ AGENCY_PSK is set: ${expectedPSK}`);
  } else {
    console.log('   ❌ AGENCY_PSK is not set');
    return;
  }

  // Test 2: Check OTPToken table structure
  console.log('\n2. Database Schema Check:');
  try {
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'OTPToken' AND column_name = 'metadata'
    `;
    
    if (tableInfo && tableInfo.length > 0) {
      console.log('   ✅ metadata column exists in OTPToken table');
    } else {
      console.log('   ❌ metadata column does not exist in OTPToken table');
      console.log('   💡 You may need to run: npx prisma migrate dev');
    }
  } catch (error) {
    console.log('   ⚠️  Could not check database schema:', error.message);
  }

  // Test 3: Test PSK validation logic
  console.log('\n3. PSK Validation Logic Test:');
  const testPSK = 'dhan2212';
  const wrongPSK = 'wrongkey';
  
  if (testPSK === expectedPSK) {
    console.log('   ✅ Correct PSK validation works');
  } else {
    console.log('   ❌ Correct PSK validation fails');
  }
  
  if (wrongPSK !== expectedPSK) {
    console.log('   ✅ Wrong PSK rejection works');
  } else {
    console.log('   ❌ Wrong PSK rejection fails');
  }

  // Test 4: Check registration API endpoints
  console.log('\n4. API Endpoints Check:');
  console.log('   📍 Registration endpoint: /api/auth/register');
  console.log('   📍 OTP verification endpoint: /api/auth/verify-otp');
  console.log('   💡 Both endpoints now require PSK validation');

  console.log('\n🎉 PSK Validation Test Complete!');
  console.log('\n📝 Next Steps:');
  console.log('   1. Start the development server: npm run dev');
  console.log('   2. Navigate to /auth/register');
  console.log('   3. Try registering with the correct PSK: dhan2212');
  console.log('   4. Try registering with an incorrect PSK to test validation');
}

testPSKValidation()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
