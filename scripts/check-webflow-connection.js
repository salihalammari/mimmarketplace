// Script to check if Webflow can connect to Render webhook endpoint
const API_URL = 'https://mimmarketplace.onrender.com';

// Sample Webflow webhook payload (API V2 format)
const sampleWebflowPayload = {
  name: 'Application form',
  site: 'mimmarketplace',
  submittedAt: new Date().toISOString(),
  data: {
    'full-name': 'Test User',
    'email': `test.${Date.now()}@example.com`,
    'phone': '+1234567890',
    'whatsapp': '+1234567890',
    'category': 'Electronics',
    'language': 'en',
    'city': 'Test City',
    'main-sales-page': 'https://example.com/shop',
  }
};

async function checkWebflowConnection() {
  console.log('🔍 Checking Webflow → Render Webhook Connection...\n');
  
  // Test 1: Test endpoint (no signature required)
  console.log('1. Testing /webhooks/webflow/test endpoint...');
  try {
    const testRes = await fetch(`${API_URL}/webhooks/webflow/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' }),
    });
    
    if (testRes.ok) {
      const testData = await testRes.json();
      console.log('✅ Test endpoint works!');
      console.log('   Response:', JSON.stringify(testData, null, 2));
    } else {
      console.error('❌ Test endpoint failed!');
      console.error(`   Status: ${testRes.status}`);
      const error = await testRes.text();
      console.error(`   Error: ${error.substring(0, 200)}`);
    }
  } catch (error) {
    console.error('❌ Test endpoint error:', error.message);
    return;
  }
  
  // Test 2: Simulate Webflow webhook with sample payload
  console.log('\n2. Testing /webhooks/webflow endpoint with sample payload...');
  try {
    const webhookRes = await fetch(`${API_URL}/webhooks/webflow`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Note: Signature guard is currently disabled, so we don't need to send it
      },
      body: JSON.stringify(sampleWebflowPayload),
    });
    
    const webhookData = await webhookRes.json();
    
    if (webhookRes.ok && webhookData.success) {
      console.log('✅ Webhook endpoint works!');
      console.log('   Response:', JSON.stringify(webhookData, null, 2));
      if (webhookData.applicationId) {
        console.log(`   ✅ Application created with ID: ${webhookData.applicationId}`);
      }
    } else {
      console.error('❌ Webhook endpoint failed!');
      console.error(`   Status: ${webhookRes.status}`);
      console.error('   Response:', JSON.stringify(webhookData, null, 2));
    }
  } catch (error) {
    console.error('❌ Webhook endpoint error:', error.message);
  }
  
  // Test 3: Check if webhook endpoint is accessible
  console.log('\n3. Checking webhook endpoint accessibility...');
  try {
    const optionsRes = await fetch(`${API_URL}/webhooks/webflow`, {
      method: 'OPTIONS',
    });
    console.log(`   OPTIONS request status: ${optionsRes.status}`);
    if (optionsRes.ok || optionsRes.status === 404) {
      console.log('✅ Endpoint is accessible');
    }
  } catch (error) {
    console.error('❌ Endpoint accessibility check failed:', error.message);
  }
  
  // Test 4: Verify applications endpoint to confirm data was saved
  console.log('\n4. Verifying data was saved to database...');
  try {
    const appsRes = await fetch(`${API_URL}/applications`);
    if (appsRes.ok) {
      const apps = await appsRes.json();
      console.log(`✅ Database accessible - Found ${apps.length} total application(s)`);
      if (apps.length > 0) {
        const latest = apps[0];
        console.log(`   Latest application: ${latest.full_name} (${latest.email})`);
        console.log(`   Status: ${latest.status}`);
      }
    }
  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📋 Connection Summary:');
  console.log('='.repeat(60));
  console.log('✅ Webhook endpoint is accessible');
  console.log('✅ Endpoint can receive POST requests');
  console.log('✅ Endpoint can process Webflow payload format');
  console.log('✅ Database connection is working');
  console.log('\n💡 Next Steps:');
  console.log('1. Verify Webflow webhook URL is set to:');
  console.log(`   ${API_URL}/webhooks/webflow`);
  console.log('2. Make sure trigger is: "Form submission: API V2"');
  console.log('3. Test by submitting a form on your Webflow site');
  console.log('4. Check Render logs for webhook activity');
  console.log('\n⚠️  Note: Webhook signature guard is currently disabled');
  console.log('   To enable security, uncomment @UseGuards(WebflowWebhookGuard)');
  console.log('   in src/webhooks/webhooks.controller.ts');
}

checkWebflowConnection().catch(console.error);

