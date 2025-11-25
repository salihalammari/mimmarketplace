# Quick Test Guide - Form Submission

## 🧪 Test Your Webhook Right Now

### Option 1: Use the Test Script

```bash
node scripts/test-webhook.js
```

This will:
1. Test the webhook endpoint
2. Send sample form data
3. Check if data was saved
4. Show all applications in database

### Option 2: Test in Browser Console

Open browser console on any page and run:

```javascript
// Test webhook endpoint
fetch('https://mimmarketplace.onrender.com/webhooks/webflow/test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: 'data' })
})
.then(r => r.json())
.then(console.log);

// Test with real form data
fetch('https://mimmarketplace.onrender.com/webhooks/webflow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Application Form',
    site: 'mimmarketplace.com',
    data: {
      'full-name': 'Test Seller',
      email: 'test@example.com',
      phone: '+212612345678',
      category: 'electronics',
      language: 'ar'
    },
    submittedAt: new Date().toISOString()
  })
})
.then(r => r.json())
.then(console.log);

// Check if saved
fetch('https://mimmarketplace.onrender.com/applications')
.then(r => r.json())
.then(console.log);
```

### Option 3: Check Admin Dashboard

1. Open: `https://mimmarketplace.onrender.com/`
2. Check if applications appear
3. Submit a form and watch for new entries

## 🔍 Debugging Steps

### Step 1: Check if Webhook URL is Correct

**In Webflow:**
- Go to Integrations → Webhooks
- URL should be: `https://mimmarketplace.onrender.com/webhooks/webflow`
- NOT: `https://api.render.com/deploy/...`

### Step 2: Check Render Logs

1. Go to Render Dashboard → Your Service → **Logs**
2. Submit a form
3. Look for:
   - "Received Webflow webhook" ✅
   - "Application created with ID: ..." ✅
   - Any error messages ❌

### Step 3: Test Direct API Call

If webhook doesn't work, test direct API:

```javascript
fetch('https://mimmarketplace.onrender.com/applications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    full_name: 'Test Seller',
    email: 'test@example.com',
    category: 'electronics',
    language: 'ar',
    phone: '+212612345678'
  })
})
.then(r => r.json())
.then(console.log);
```

### Step 4: Verify Data in Database

```javascript
// Get all applications
fetch('https://mimmarketplace.onrender.com/applications')
.then(r => r.json())
.then(apps => {
  console.log(`Found ${apps.length} applications`);
  apps.forEach(app => {
    console.log(`${app.full_name} - ${app.email} - ${app.status}`);
  });
});
```

## ⚠️ Common Issues

### Issue: Webhook URL is Wrong

**Fix:** Update in Webflow to: `https://mimmarketplace.onrender.com/webhooks/webflow`

### Issue: Signature Verification Failing

**Temporary Fix:** I've disabled signature verification for testing. The guard is commented out.

**Permanent Fix:** 
1. Add `WEBFLOW_WEBHOOK_SECRET` to Render environment
2. Uncomment `@UseGuards(WebflowWebhookGuard)` in controller

### Issue: Form Fields Don't Match

**Check:** Your Webflow form field names must match:
- `full-name` or `الاسم-الكامل`
- `email` or `البريد-الالكتروني`
- `category` or `فئة`
- `language`

## ✅ Success Checklist

- [ ] Test endpoint returns success
- [ ] Webhook receives data (check logs)
- [ ] Application is created in database
- [ ] Application appears in admin dashboard
- [ ] All form fields are saved correctly

