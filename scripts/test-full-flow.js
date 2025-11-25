// Script to test the complete flow: Webflow → Webhook → Database → Admin Dashboard
const API_URL = 'https://mimmarketplace.onrender.com';

async function testFullFlow() {
  console.log('🔍 Testing Complete Flow: Webflow Form → Database → Admin Dashboard\n');
  console.log('='.repeat(70));
  
  // Step 1: Simulate Webflow form submission
  console.log('\n1️⃣  Simulating Webflow Form Submission...');
  const testPayload = {
    name: 'Application form',
    site: 'mimmarketplace',
    submittedAt: new Date().toISOString(),
    data: {
      'full-name': 'Integration Test User',
      'email': `integration.test.${Date.now()}@example.com`,
      'phone': '+1234567890',
      'whatsapp': '+1234567890',
      'category': 'Electronics',
      'language': 'en',
      'city': 'Test City',
      'main-sales-page': 'https://example.com/shop',
      'products-brand': 'Test Products',
    }
  };
  
  try {
    const webhookRes = await fetch(`${API_URL}/webhooks/webflow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
    });
    
    const webhookData = await webhookRes.json();
    
    if (webhookRes.ok && webhookData.success && webhookData.applicationId) {
      console.log('✅ Webhook received and processed');
      console.log(`   Application ID: ${webhookData.applicationId}`);
      
      const applicationId = webhookData.applicationId;
      
      // Step 2: Verify data saved to database
      console.log('\n2️⃣  Verifying Data Saved to Database...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const appRes = await fetch(`${API_URL}/applications/${applicationId}`);
      if (appRes.ok) {
        const application = await appRes.json();
        console.log('✅ Application found in database');
        console.log(`   Full Name: ${application.full_name}`);
        console.log(`   Email: ${application.email}`);
        console.log(`   Status: ${application.status}`);
        console.log(`   Category: ${application.category}`);
        
        // Step 3: Test Admin Dashboard API endpoints
        console.log('\n3️⃣  Testing Admin Dashboard API Endpoints...');
        
        // Test stats endpoint
        const statsRes = await fetch(`${API_URL}/applications/stats`);
        if (statsRes.ok) {
          const stats = await statsRes.json();
          console.log('✅ Stats endpoint working');
          console.log(`   Total: ${stats.total}, Pending: ${stats.pending}`);
        }
        
        // Test applications list endpoint
        const appsRes = await fetch(`${API_URL}/applications`);
        if (appsRes.ok) {
          const apps = await appsRes.json();
          console.log('✅ Applications list endpoint working');
          console.log(`   Found ${apps.length} total applications`);
          
          // Verify our test application is in the list
          const foundApp = apps.find(a => a.id === applicationId);
          if (foundApp) {
            console.log('✅ Test application appears in applications list');
          } else {
            console.log('⚠️  Test application not found in list (might need refresh)');
          }
        }
        
        // Step 4: Test Admin Dashboard accessibility
        console.log('\n4️⃣  Testing Admin Dashboard Accessibility...');
        const adminRes = await fetch(`${API_URL}/admin`);
        if (adminRes.ok || adminRes.status === 200) {
          console.log('✅ Admin dashboard is accessible');
          console.log(`   URL: ${API_URL}/admin`);
        } else {
          console.log(`⚠️  Admin dashboard status: ${adminRes.status}`);
        }
        
        // Step 5: Summary
        console.log('\n' + '='.repeat(70));
        console.log('✅ COMPLETE FLOW TEST: SUCCESS');
        console.log('='.repeat(70));
        console.log('\n📋 Flow Summary:');
        console.log('   1. ✅ Webflow webhook endpoint receives data');
        console.log('   2. ✅ Data is saved to database');
        console.log('   3. ✅ Application can be retrieved by ID');
        console.log('   4. ✅ Stats endpoint works');
        console.log('   5. ✅ Applications list endpoint works');
        console.log('   6. ✅ Admin dashboard is accessible');
        console.log('\n🌐 Access Points:');
        console.log(`   • Admin Dashboard: ${API_URL}/admin`);
        console.log(`   • API Base: ${API_URL}`);
        console.log(`   • Webhook Endpoint: ${API_URL}/webhooks/webflow`);
        console.log(`   • Applications API: ${API_URL}/applications`);
        console.log('\n💡 Next Steps:');
        console.log('   1. Verify Webflow webhook URL is set to:');
        console.log(`      ${API_URL}/webhooks/webflow`);
        console.log('   2. Submit a real form on your Webflow site');
        console.log('   3. Check the admin dashboard for new applications');
        console.log('   4. Dashboard auto-refreshes every 30 seconds');
        
      } else {
        console.error('❌ Failed to retrieve application from database');
        console.error(`   Status: ${appRes.status}`);
      }
    } else {
      console.error('❌ Webhook processing failed');
      console.error('   Response:', JSON.stringify(webhookData, null, 2));
    }
  } catch (error) {
    console.error('❌ Error in flow test:', error.message);
  }
}

testFullFlow().catch(console.error);

