# Fix Webflow Webhook Setup

## 🔴 Current Issues Found

### Issue 1: Wrong Webhook URL in Webflow
Your Webflow webhook is pointing to:
```
https://api.render.com/deploy/srv-d47lpui4d50c73893so0?key=vbTc485AloE
```
❌ This is a **Render deploy hook** (for triggering deployments), NOT for receiving form data!

### Issue 2: Render Settings Need Updates
- Build Command: Currently `$ npm install; npm run build` (missing Prisma generate)
- Start Command: Currently `$ npm run start` (should be production command with migrations)
- Health Check: Currently `/healthz` (should be `/health`)

## ✅ Step-by-Step Fix

### Step 1: Fix Webflow Webhook URL

1. Go to **Webflow Dashboard** → Your Site → **Integrations** → **Webhooks**
2. Click on your existing webhook (the one showing the Render deploy URL)
3. **Edit the URL** and change it to:
   ```
   https://mimmarketplace.onrender.com/webhooks/webflow
   ```
4. Make sure:
   - Trigger: **Form submission: API V2**
   - Method: **POST**
5. Click **Save**

### Step 2: Add Webhook Secret to Render

1. Go to **Render Dashboard** → Your Service (`mimmarketplace`)
2. Click **Environment** tab (in the left sidebar under MANAGE)
3. Click **+ Add Environment Variable**
4. Add:
   - **Key**: `WEBFLOW_WEBHOOK_SECRET`
   - **Value**: `3416419d557dbfec4e41eda70237529271fbc78c11089e480ad3c0c6d9070188`
5. Click **Save Changes**

### Step 3: Update Render Build & Deploy Settings

1. In Render Dashboard → Your Service → **Settings** tab
2. Scroll to **Build & Deploy** section
3. Update these fields:

   **Build Command:**
   ```
   npm install && npx prisma generate && npm run build
   ```

   **Start Command:**
   ```
   npx prisma migrate deploy && npm run start:prod
   ```

   **Health Check Path:**
   ```
   /health
   ```
   (Change from `/healthz` to `/health`)

4. Click **Save Changes** at the top
5. Click **Manual Deploy** → **Deploy latest commit**

## ✅ Verification Checklist

After making these changes:

- [ ] Webflow webhook URL is: `https://mimmarketplace.onrender.com/webhooks/webflow`
- [ ] Render has `WEBFLOW_WEBHOOK_SECRET` environment variable set
- [ ] Render build command includes `npx prisma generate`
- [ ] Render start command includes migrations and uses `start:prod`
- [ ] Health check path is `/health`
- [ ] Service has been redeployed after changes

## 🧪 Test the Setup

1. **Submit a test form** on your Webflow site (`mimmarketplace.com/application-form`)
2. **Check Render logs**:
   - Go to Render Dashboard → Your Service → **Logs**
   - Look for: "Received Webflow webhook"
   - Look for: "Webhook signature verified successfully"
   - Look for: "Application created with ID: ..."
3. **Check Admin Dashboard**:
   - Go to: `https://mimmarketplace.onrender.com/`
   - New application should appear in the list
   - Click "View" to see all form data

## 📊 Data Flow

```
User fills form on mimmarketplace.com/application-form
    ↓
User clicks Submit
    ↓
Webflow sends webhook POST to: https://mimmarketplace.onrender.com/webhooks/webflow
    ↓
Backend verifies signature (using WEBFLOW_WEBHOOK_SECRET)
    ↓
Backend processes form data
    ↓
Saves to database (applications table)
    ↓
Returns success response
    ↓
Admin Dashboard shows new application (auto-refreshes every 30 seconds)
```

## 🔍 Troubleshooting

### If webhook still doesn't work:

1. **Check Render Logs** for errors
2. **Test webhook endpoint**:
   ```bash
   curl -X POST https://mimmarketplace.onrender.com/webhooks/webflow/test
   ```
3. **Verify environment variable** is set correctly in Render
4. **Check Webflow webhook** shows "Last used" timestamp after form submission

### If data doesn't appear in dashboard:

1. **Check API directly**:
   ```bash
   curl https://mimmarketplace.onrender.com/applications
   ```
2. **Refresh admin dashboard** (auto-refreshes every 30 seconds)
3. **Check database** via Prisma Studio or direct query

## 📝 Summary

**What to change:**
1. ✅ Webflow webhook URL → `https://mimmarketplace.onrender.com/webhooks/webflow`
2. ✅ Add `WEBFLOW_WEBHOOK_SECRET` to Render environment
3. ✅ Update Render build/start commands
4. ✅ Update health check path to `/health`
5. ✅ Redeploy service

After these changes, form submissions will automatically save to your database and appear in the admin dashboard!

