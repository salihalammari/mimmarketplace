// Test webhook endpoint
const API_URL = 'https://mimmarketplace.onrender.com';

async function testWebhook() {
  console.log('Testing webhook endpoint...\n');

  // Test 1: Test endpoint
  console.log('1. Testing /webhooks/webflow/test...');
  try {
    const testResponse = await fetch(`${API_URL}/webhooks/webflow/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' }),
    });
    const testResult = await testResponse.json();
    console.log('✅ Test endpoint works:', testResult);
  } catch (error) {
    console.error('❌ Test endpoint failed:', error.message);
  }

  console.log('\n2. Testing /webhooks/webflow with sample data...');
  const sampleData = {
    name: 'Application Form',
    site: 'mimmarketplace.com',
    data: {
      'full-name': 'Test Seller',
      email: `test.${Date.now()}@example.com`,
      phone: '+212612345678',
      category: 'electronics',
      language: 'ar',
      city: 'Casablanca',
      'main-sales-page': 'https://example.com/shop',
    },
    submittedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(`${API_URL}/webhooks/webflow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Webhook successful!');
      console.log('Response:', result);
      console.log('\n3. Checking if data was saved...');
      
      // Check if application was created
      const appsResponse = await fetch(`${API_URL}/applications`);
      const apps = await appsResponse.json();
      const createdApp = apps.find(a => a.email === sampleData.data.email);
      
      if (createdApp) {
        console.log('✅ Application saved to database!');
        console.log('Application ID:', createdApp.id);
        console.log('Seller Name:', createdApp.seller_name);
        console.log('Email:', createdApp.email);
      } else {
        console.log('⚠️ Application not found in database');
      }
    } else {
      const error = await response.json();
      console.error('❌ Webhook failed:', error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  console.log('\n4. Getting all applications...');
  try {
    const appsResponse = await fetch(`${API_URL}/applications`);
    const apps = await appsResponse.json();
    console.log(`✅ Found ${apps.length} applications in database`);
    if (apps.length > 0) {
      console.log('Latest application:', {
        id: apps[0].id,
        seller_name: apps[0].seller_name,
        email: apps[0].email,
        status: apps[0].status,
        created_at: apps[0].created_at,
      });
    }
  } catch (error) {
    console.error('❌ Error fetching applications:', error.message);
  }
}

testWebhook();

