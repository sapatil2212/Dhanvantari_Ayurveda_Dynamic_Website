async function testRegistrationAPI() {
  console.log('🧪 Testing Registration API with PSK...\n');

  const baseUrl = 'http://localhost:3000';
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPass123',
    role: 'OTHER'
  };

  // Test 1: Correct PSK
  console.log('1. Testing with CORRECT PSK (dhan2212):');
  try {
    const response1 = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...testData,
        psk: 'dhan2212'
      })
    });

    const data1 = await response1.json();
    console.log(`   Status: ${response1.status}`);
    console.log(`   Response: ${JSON.stringify(data1, null, 2)}`);
    
    if (response1.status === 200) {
      console.log('   ✅ SUCCESS: Registration with correct PSK works!');
    } else {
      console.log('   ❌ FAILED: Registration with correct PSK failed');
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }

  console.log('\n2. Testing with INCORRECT PSK (wrongkey):');
  try {
    const response2 = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...testData,
        psk: 'wrongkey'
      })
    });

    const data2 = await response2.json();
    console.log(`   Status: ${response2.status}`);
    console.log(`   Response: ${JSON.stringify(data2, null, 2)}`);
    
    if (response2.status === 403) {
      console.log('   ✅ SUCCESS: Registration with incorrect PSK properly rejected!');
    } else {
      console.log('   ❌ FAILED: Registration with incorrect PSK was not rejected');
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }

  console.log('\n3. Testing with MISSING PSK:');
  try {
    const response3 = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData) // No PSK field
    });

    const data3 = await response3.json();
    console.log(`   Status: ${response3.status}`);
    console.log(`   Response: ${JSON.stringify(data3, null, 2)}`);
    
    if (response3.status === 400) {
      console.log('   ✅ SUCCESS: Registration without PSK properly rejected!');
    } else {
      console.log('   ❌ FAILED: Registration without PSK was not rejected');
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }

  console.log('\n🎉 API Testing Complete!');
  console.log('\n📝 Summary:');
  console.log('   - 403 errors are EXPECTED for invalid PSK');
  console.log('   - 200 status means PSK validation passed');
  console.log('   - 400 status means missing required fields');
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/session');
    if (response.ok) {
      console.log('✅ Server is running on http://localhost:3000');
      await testRegistrationAPI();
    } else {
      console.log('❌ Server responded but with error status');
    }
  } catch (error) {
    console.log('❌ Server is not running. Please start with: npm run dev');
    console.log('Then run this test again.');
  }
}

checkServer();
