#!/usr/bin/env node

/**
 * Database Connection Diagnostic Tool
 * Tests connection string format and provides specific fixes
 */

const https = require('https');

const API_URL = 'https://mimmarketplace.onrender.com';

async function checkHealth() {
  return new Promise((resolve, reject) => {
    https.get(`${API_URL}/health`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function diagnose() {
  console.log('🔍 Database Connection Diagnostic Tool\n');
  console.log('=' .repeat(60));
  
  // Test 1: Health Check
  console.log('\n1️⃣  Testing Health Endpoint...');
  try {
    const health = await checkHealth();
    console.log('   ✅ Health endpoint responding');
    console.log(`   Status: ${health.status}`);
    console.log(`   Database: ${health.database}`);
    
    if (health.database === 'disconnected') {
      console.log(`   ❌ Error: ${health.error?.substring(0, 100)}...`);
      
      // Analyze the error
      const errorMsg = health.error || '';
      
      console.log('\n📋 DIAGNOSIS:');
      console.log('=' .repeat(60));
      
      if (errorMsg.includes("Can't reach database server")) {
        console.log('\n🔴 ISSUE: Cannot reach database server');
        console.log('\n   Most likely causes:');
        console.log('   1. ⚠️  Supabase project is PAUSED (90% of cases)');
        console.log('      → Go to https://app.supabase.com');
        console.log('      → Check if project shows "Paused" status');
        console.log('      → Click "Resume" or "Restore"');
        console.log('      → Wait 1-2 minutes for activation');
        console.log('');
        console.log('   2. 🔐 Database password is wrong/truncated');
        console.log('      → Supabase Dashboard → Settings → Database');
        console.log('      → Click "Reset Database Password"');
        console.log('      → Copy COMPLETE password (no ...)');
        console.log('      → Update DATABASE_URL in Render');
        console.log('');
        console.log('   3. 🌐 Network restrictions blocking Render');
        console.log('      → Supabase → Settings → Database');
        console.log('      → Disable IP restrictions temporarily');
        console.log('      → Or add Render IPs: 74.220.48.0/24, 74.220.56.0/24');
        console.log('');
        console.log('   4. 🔄 Service not redeployed after DATABASE_URL change');
        console.log('      → Render Dashboard → Manual Deploy');
        console.log('      → Select "Deploy latest commit"');
        console.log('      → Wait 3-5 minutes');
      } else if (errorMsg.includes('password authentication failed')) {
        console.log('\n🔴 ISSUE: Password authentication failed');
        console.log('\n   Fix:');
        console.log('   1. Supabase Dashboard → Settings → Database');
        console.log('   2. Click "Reset Database Password"');
        console.log('   3. Copy the NEW password (shown only once!)');
        console.log('   4. Update DATABASE_URL in Render with complete password');
        console.log('   5. Manual Deploy in Render');
      } else if (errorMsg.includes('timeout')) {
        console.log('\n🔴 ISSUE: Connection timeout');
        console.log('\n   Fix:');
        console.log('   1. Check if Supabase project is active');
        console.log('   2. Verify network connectivity');
        console.log('   3. Check firewall/network restrictions');
      }
      
      console.log('\n📝 VERIFY DATABASE_URL FORMAT:');
      console.log('=' .repeat(60));
      console.log('\n   ✅ CORRECT FORMAT:');
      console.log('   postgresql://postgres.tjxotorfwaqzcvtoealh:COMPLETE_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require');
      console.log('\n   ❌ WRONG - Pooler endpoint:');
      console.log('   postgresql://...@aws-1-us-east-2.pooler.supabase.com:5432/...');
      console.log('\n   ❌ WRONG - Missing SSL:');
      console.log('   postgresql://...@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres');
      console.log('\n   ❌ WRONG - Truncated password:');
      console.log('   postgresql://...:Sali2991...@...');
      
      console.log('\n✅ ACTION PLAN:');
      console.log('=' .repeat(60));
      console.log('\n   1. Check Supabase project status (Active/Paused)');
      console.log('   2. Get fresh connection string from Supabase');
      console.log('   3. Reset database password if needed');
      console.log('   4. Update DATABASE_URL in Render (verify format)');
      console.log('   5. Manual Deploy in Render');
      console.log('   6. Test again: curl "https://mimmarketplace.onrender.com/health"');
      
    } else if (health.database === 'connected') {
      console.log('\n✅ SUCCESS: Database is connected!');
      console.log('\n   All systems operational.');
    }
  } catch (error) {
    console.error('   ❌ Failed to check health:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 For detailed troubleshooting, see: URGENT_DATABASE_DIAGNOSTIC.md\n');
}

diagnose().catch(console.error);

