// Script to check if Render can connect to database
const API_URL = 'https://mimmarketplace.onrender.com';

async function checkConnection() {
  console.log('🔍 Checking Render Service Connection...\n');
  
  // Test 1: Health check
  console.log('1. Testing /health endpoint...');
  try {
    const healthRes = await fetch(`${API_URL}/health`);
    const health = await healthRes.json();
    console.log('✅ Health check:', health);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return;
  }
  
  // Test 2: Database connection (applications endpoint)
  console.log('\n2. Testing database connection via /applications...');
  try {
    const appsRes = await fetch(`${API_URL}/applications`);
    if (appsRes.ok) {
      const apps = await appsRes.json();
      console.log('✅ Database connected!');
      console.log(`   Found ${apps.length} application(s) in database`);
      if (apps.length > 0) {
        console.log(`   Latest: ${apps[0].seller_name} (${apps[0].email})`);
      }
    } else {
      const error = await appsRes.text();
      console.error('❌ Database connection failed!');
      console.error(`   Status: ${appsRes.status}`);
      console.error(`   Error: ${error.substring(0, 200)}`);
      console.log('\n💡 Solution:');
      console.log('   1. Go to Render Dashboard → mimmarketplace → Environment');
      console.log('   2. Update DATABASE_URL to:');
      console.log('      postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_FULL_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require');
      console.log('   3. Make sure to use:');
      console.log('      - db.tjxotorfwaqzcvtoealh.supabase.co (NOT pooler)');
      console.log('      - Port 5432 (NOT 6543)');
      console.log('      - Complete password (no ...)');
      console.log('   4. Click Save Changes');
      console.log('   5. Go to Manual Deploy and deploy again');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  // Test 3: Stats endpoint
  console.log('\n3. Testing /applications/stats...');
  try {
    const statsRes = await fetch(`${API_URL}/applications/stats`);
    if (statsRes.ok) {
      const stats = await statsRes.json();
      console.log('✅ Stats endpoint works!');
      console.log('   Stats:', stats);
    } else {
      console.error('❌ Stats endpoint failed:', statsRes.status);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  // Test 4: Webhook endpoint
  console.log('\n4. Testing /webhooks/webflow/test...');
  try {
    const webhookRes = await fetch(`${API_URL}/webhooks/webflow/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' }),
    });
    const webhook = await webhookRes.json();
    console.log('✅ Webhook endpoint works!');
    console.log('   Response:', webhook);
  } catch (error) {
    console.error('❌ Webhook test failed:', error.message);
  }
}

checkConnection();

