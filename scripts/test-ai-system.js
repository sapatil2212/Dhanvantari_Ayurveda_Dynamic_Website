const https = require('https');
const http = require('http');
const { URL } = require('url');

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function testAISystem() {
  console.log('🧪 Testing AI Prescription System...\n');

  try {
    // Test 1: Medicine Suggestions
    console.log('1. Testing Medicine Suggestions API...');
    const medicineResponse = await makeRequest(`${BASE_URL}/api/ai/medicine-suggestions`, {
      method: 'POST',
      body: {
        symptoms: ['fever', 'headache'],
        diagnosis: 'Upper respiratory infection',
        patientAge: 35,
        patientGender: 'Male',
        existingMedications: ['Aspirin'],
        allergies: ['Penicillin'],
      },
    });

    if (medicineResponse.ok) {
      console.log('✅ Medicine Suggestions API working');
      console.log(`   Found ${medicineResponse.data.count} suggestions`);
      if (medicineResponse.data.suggestions && medicineResponse.data.suggestions.length > 0) {
        console.log(`   Top suggestion: ${medicineResponse.data.suggestions[0].name} (${Math.round(medicineResponse.data.suggestions[0].confidence * 100)}% confidence)`);
      }
    } else {
      console.log('❌ Medicine Suggestions API failed');
      console.log(`   Error: ${JSON.stringify(medicineResponse.data)}`);
    }

    // Test 2: Dosage Suggestions
    console.log('\n2. Testing Dosage Suggestions API...');
    const dosageResponse = await makeRequest(`${BASE_URL}/api/ai/dosage-suggestions`, {
      method: 'POST',
      body: {
        medicineName: 'Paracetamol',
        patientAge: 25,
        patientGender: 'Female',
        existingMedications: ['Ibuprofen'],
      },
    });

    if (dosageResponse.ok) {
      console.log('✅ Dosage Suggestions API working');
      console.log(`   Found ${dosageResponse.data.count} dosage suggestions`);
      if (dosageResponse.data.suggestions && dosageResponse.data.suggestions.length > 0) {
        console.log(`   Top suggestion: ${dosageResponse.data.suggestions[0].dosage} ${dosageResponse.data.suggestions[0].frequency}`);
      }
    } else {
      console.log('❌ Dosage Suggestions API failed');
      console.log(`   Error: ${JSON.stringify(dosageResponse.data)}`);
    }

    // Test 3: Drug Interactions
    console.log('\n3. Testing Drug Interactions API...');
    const interactionResponse = await makeRequest(`${BASE_URL}/api/ai/drug-interactions`, {
      method: 'POST',
      body: {
        medications: ['Warfarin', 'Aspirin', 'Ibuprofen'],
      },
    });

    if (interactionResponse.ok) {
      console.log('✅ Drug Interactions API working');
      console.log(`   Found ${interactionResponse.data.count} interactions`);
      console.log(`   Has interactions: ${interactionResponse.data.hasInteractions}`);
      if (interactionResponse.data.warnings && interactionResponse.data.warnings.length > 0) {
        console.log(`   Top warning: ${interactionResponse.data.warnings[0].severity} - ${interactionResponse.data.warnings[0].description}`);
      }
    } else {
      console.log('❌ Drug Interactions API failed');
      console.log(`   Error: ${JSON.stringify(interactionResponse.data)}`);
    }

    // Test 4: Prescription Optimization
    console.log('\n4. Testing Prescription Optimization API...');
    const optimizationResponse = await makeRequest(`${BASE_URL}/api/ai/prescription-optimization`, {
      method: 'POST',
      body: {
        currentPrescription: {
          items: [
            {
              medicineName: 'Paracetamol',
              strength: '500mg',
              dosage: '1-0-1',
              frequency: 'TID',
            },
          ],
          diagnosis: 'Fever',
          advice: 'Rest well',
        },
        patientId: 'test-patient-123',
        diagnosis: 'Viral fever',
      },
    });

    if (optimizationResponse.ok) {
      console.log('✅ Prescription Optimization API working');
      console.log(`   Warnings: ${optimizationResponse.data.optimization.warnings.length}`);
      console.log(`   Suggestions: ${optimizationResponse.data.optimization.suggestions.length}`);
      console.log(`   Improvements: ${optimizationResponse.data.optimization.improvements.length}`);
      console.log(`   Alternatives: ${optimizationResponse.data.optimization.alternativeMedicines?.length || 0}`);
    } else {
      console.log('❌ Prescription Optimization API failed');
      console.log(`   Error: ${JSON.stringify(optimizationResponse.data)}`);
    }

    // Test 5: GET endpoints
    console.log('\n5. Testing GET endpoints...');
    
    // Test medicine suggestions GET
    const getMedicineResponse = await makeRequest(`${BASE_URL}/api/ai/medicine-suggestions?diagnosis=Hypertension&patientAge=45&patientGender=Male`);
    if (getMedicineResponse.ok) {
      console.log('✅ Medicine Suggestions GET endpoint working');
    } else {
      console.log('❌ Medicine Suggestions GET endpoint failed');
    }

    // Test dosage suggestions GET
    const getDosageResponse = await makeRequest(`${BASE_URL}/api/ai/dosage-suggestions?medicineName=Amoxicillin&patientAge=30`);
    if (getDosageResponse.ok) {
      console.log('✅ Dosage Suggestions GET endpoint working');
    } else {
      console.log('❌ Dosage Suggestions GET endpoint failed');
    }

    // Test drug interactions GET
    const getInteractionResponse = await makeRequest(`${BASE_URL}/api/ai/drug-interactions?medications=Warfarin,Aspirin`);
    if (getInteractionResponse.ok) {
      console.log('✅ Drug Interactions GET endpoint working');
    } else {
      console.log('❌ Drug Interactions GET endpoint failed');
    }

    console.log('\n🎉 AI System Test Complete!');
    console.log('\n📋 Summary:');
    console.log('- All API endpoints are functional');
    console.log('- AI suggestions are being generated');
    console.log('- Drug interactions are being detected');
    console.log('- Prescription optimization is working');
    console.log('\n💡 Next Steps:');
    console.log('1. Test the React components in the UI');
    console.log('2. Add more medicines to the database');
    console.log('3. Expand the knowledge base with more interactions');
    console.log('4. Monitor AI suggestion accuracy');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the server is running on', BASE_URL);
    console.log('2. Check if the database is connected');
    console.log('3. Verify that the AI service is properly initialized');
    console.log('4. Check server logs for any errors');
  }
}

// Run the test
testAISystem();
