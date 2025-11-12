# Webflow Webhook Configuration Guide

## ⚠️ Important: Current Issue

Your Webflow webhook is currently pointing to:
```
https://api.render.com/deploy/srv-d47lpui4d50c73893so0?key=vbTc485AloE
```

This is a **Render deploy hook** (for triggering deployments), NOT the webhook endpoint for receiving form submissions.

## ✅ Correct Configuration

### Step 1: Update Webflow Webhook URL

1. Go to Webflow Dashboard → Your Site → **Integrations** → **Webhooks**
2. Click on your existing webhook (or create a new one)
3. Change the URL to:
   ```
   https://mimmarketplace.onrender.com/webhooks/webflow
   ```
4. Make sure trigger is: **Form submission: API V2**
5. Click **Save**

### Step 2: Add Webhook Secret to Render

1. Go to Render Dashboard → Your Service (`mimmarketplace`)
2. Go to **Environment** tab
3. Click **+ Add Environment Variable**
4. Add:
   - **Key**: `WEBFLOW_WEBHOOK_SECRET`
   - **Value**: `3416419d557dbfec4e41eda70237529271fbc78c11089e480ad3c0c6d9070188`
5. Click **Save Changes**
6. **Manual Deploy** to apply the changes

### Step 3: Verify Render Settings

Make sure your Render service has:

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

(Currently shows `/healthz` - update to `/health`)

## How It Works

```
User Submits Form on mimmarketplace.com/application-form
    ↓
Webflow sends webhook to: https://mimmarketplace.onrender.com/webhooks/webflow
    ↓
Backend verifies webhook signature (using WEBFLOW_WEBHOOK_SECRET)
    ↓
Backend processes form data
    ↓
Saves to database (applications table)
    ↓
Returns success response
    ↓
Admin Dashboard automatically shows new application (refreshes every 30 seconds)
```

## Testing

### Test the Webhook Endpoint

```bash
# Test endpoint (no signature required)
curl -X POST https://mimmarketplace.onrender.com/webhooks/webflow/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Test with Real Form Submission

1. Submit a test form on your Webflow site
2. Check Render logs for:
   - "Received Webflow webhook"
   - "Webhook signature verified successfully"
   - "Application created with ID: ..."
3. Check Admin Dashboard: `https://mimmarketplace.onrender.com/`
4. New application should appear in the list

## Troubleshooting

### Webhook not receiving data

1. **Check Webflow webhook URL** - Must be: `https://mimmarketplace.onrender.com/webhooks/webflow`
2. **Check Render logs** - Look for incoming requests
3. **Verify webhook secret** - Must match in Render environment variables
4. **Test endpoint** - Use `/webhooks/webflow/test` first

### Signature verification fails

1. **Check secret** - Must be exactly: `3416419d557dbfec4e41eda70237529271fbc78c11089e480ad3c0c6d9070188`
2. **Check Render environment** - Variable name must be: `WEBFLOW_WEBHOOK_SECRET`
3. **Redeploy** - After adding secret, manually deploy

### Data not appearing in dashboard

1. **Check database** - Verify data is saved
2. **Check API** - `GET https://mimmarketplace.onrender.com/applications`
3. **Refresh dashboard** - Auto-refreshes every 30 seconds, or refresh manually

## Form Field Names

Make sure your Webflow form fields use these names:

**Required:**
- `full-name` or `الاسم-الكامل`
- `email` or `البريد-الالكتروني`
- `phone` or `whatsapp` or `رقم-الهاتف`
- `category` or `فئة`
- `language` (should be `en` or `ar`)

**Optional:**
- `main-sales-page` or `رابط-صفحة-البيع`
- `city` or `المدينة`
- `products-brand` or `المنتجات-والبراند`
- And other fields as needed

## Next Steps

1. ✅ Update Webflow webhook URL
2. ✅ Add `WEBFLOW_WEBHOOK_SECRET` to Render
3. ✅ Update Render start command to `npm run start:prod`
4. ✅ Update health check path to `/health`
5. ✅ Test form submission
6. ✅ Verify data in admin dashboard

