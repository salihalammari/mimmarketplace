# Troubleshooting: Form Not Saving to Database

## Current Issue

Form submissions are not being saved to the database. Here's how to diagnose and fix:

## Step 1: Check Service Status

```bash
# Check if service is running
curl https://mimmarketplace.onrender.com/health
```

Should return: `{"status":"ok","timestamp":"..."}`

## Step 2: Check Webflow Webhook Configuration

**Critical:** Your Webflow webhook URL must be:

```
https://mimmarketplace.onrender.com/webhooks/webflow
```

**NOT:**
```
https://api.render.com/deploy/...
```

### How to Fix:

1. Go to **Webflow Dashboard** → Your Site → **Integrations** → **Webhooks**
2. Click on your webhook
3. Change URL to: `https://mimmarketplace.onrender.com/webhooks/webflow`
4. Save

## Step 3: Check Render Logs

1. Go to **Render Dashboard** → Your Service → **Logs**
2. Submit a form
3. Look for:
   - ✅ "Received Webflow webhook"
   - ✅ "Application created with ID: ..."
   - ❌ Any error messages

## Step 4: Test Direct API (Bypass Webflow)

Test if the API works directly:

```javascript
// Run in browser console
fetch('https://mimmarketplace.onrender.com/applications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    full_name: 'Test Seller',
    email: 'test@example.com',
    category: 'electronics',
    language: 'ar'
  })
})
.then(r => r.json())
.then(console.log);
```

## Step 5: Verify Database Connection

Check if database is accessible:

1. Check Render environment variables
2. Verify `DATABASE_URL` is set correctly
3. Check Render logs for database connection errors

## Step 6: Redeploy with Latest Code

If you made changes, you need to:

1. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Fix webhook and add testing"
   git push origin main
   ```

2. **Or manually deploy in Render:**
   - Go to Render Dashboard → Your Service
   - Click **Manual Deploy** → **Deploy latest commit**

## Common Fixes

### Fix 1: Update Webflow Webhook URL

**Current (Wrong):**
```
https://api.render.com/deploy/srv-d47lpui4d50c73893so0?key=vbTc485AloE
```

**Should Be:**
```
https://mimmarketplace.onrender.com/webhooks/webflow
```

### Fix 2: Add Environment Variables in Render

1. Go to Render → Your Service → **Environment**
2. Add:
   - `WEBFLOW_WEBHOOK_SECRET` = `3416419d557dbfec4e41eda70237529271fbc78c11089e480ad3c0c6d9070188`
   - `DATABASE_URL` = (your Supabase connection string)
3. Save and redeploy

### Fix 3: Update Render Settings

In Render → Settings → Build & Deploy:

- **Build Command:** `npm install && npx prisma generate && npm run build`
- **Start Command:** `npx prisma migrate deploy && npm run start:prod`
- **Health Check:** `/health`

## Testing Checklist

- [ ] Service is running (health check works)
- [ ] Webflow webhook URL is correct
- [ ] Render has latest code deployed
- [ ] Database connection is working
- [ ] Form field names match expected names
- [ ] Render logs show webhook being received
- [ ] Admin dashboard shows applications

## Quick Test Commands

```bash
# Test health
curl https://mimmarketplace.onrender.com/health

# Test webhook endpoint
curl -X POST https://mimmarketplace.onrender.com/webhooks/webflow/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Test direct API
curl -X POST https://mimmarketplace.onrender.com/applications \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test","email":"test@test.com","category":"test","language":"en"}'

# Get all applications
curl https://mimmarketplace.onrender.com/applications
```

## Next Steps

1. ✅ Fix Webflow webhook URL
2. ✅ Redeploy service with latest code
3. ✅ Test form submission
4. ✅ Check Render logs
5. ✅ Verify data in admin dashboard

