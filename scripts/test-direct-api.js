// Test direct API endpoint (bypass webhook)
const API_URL = 'https://mimmarketplace.onrender.com';

async function testDirectAPI() {
  console.log('Testing direct API endpoint...\n');

  const testData = {
    full_name: 'Direct API Test',
    email: `direct.${Date.now()}@test.com`,
    phone: '+212612345678',
    category: 'electronics',
    language: 'ar',
    submitted_fields: {
      city: 'Casablanca',
      mainSalesPageLink: 'https://example.com/shop',
    },
  };

  console.log('1. Creating application via direct API...');
  try {
    const response = await fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Application created successfully!');
      console.log('Application ID:', result.id);
      console.log('Full Name:', result.full_name);
      console.log('Email:', result.email);
      
      console.log('\n2. Verifying data was saved...');
      const appsResponse = await fetch(`${API_URL}/applications`);
      const apps = await appsResponse.json();
      const found = apps.find(a => a.id === result.id);
      
      if (found) {
        console.log('✅ Application found in database!');
        console.log('Status:', found.status);
        console.log('Created:', found.created_at);
      } else {
        console.log('⚠️ Application not found in database');
      }
    } else {
      const error = await response.json();
      console.error('❌ Failed to create application:', error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  console.log('\n3. Getting all applications...');
  try {
    const appsResponse = await fetch(`${API_URL}/applications`);
    const apps = await appsResponse.json();
    console.log(`✅ Found ${apps.length} applications in database`);
    if (apps.length > 0) {
      console.log('\nLatest 3 applications:');
      apps.slice(0, 3).forEach((app, i) => {
        console.log(`${i + 1}. ${app.full_name} - ${app.email} - ${app.status} - ${new Date(app.created_at).toLocaleString()}`);
      });
    }
  } catch (error) {
    console.error('❌ Error fetching applications:', error.message);
  }
}

testDirectAPI();

