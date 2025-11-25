# Testing Webhook - Form Submission to Database

## Quick Test Steps

### Step 1: Test the Webhook Endpoint Directly

Test if the endpoint is working:

```bash
# Test endpoint (no signature required)
curl -X POST https://mimmarketplace.onrender.com/webhooks/webflow/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Webhook endpoint is working",
  "receivedData": {"test": "data"}
}
```

### Step 2: Test with Sample Form Data

```bash
curl -X POST https://mimmarketplace.onrender.com/webhooks/webflow \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Application Form",
    "site": "mimmarketplace.com",
    "data": {
      "full-name": "Test Seller",
      "email": "test@example.com",
      "phone": "+212612345678",
      "category": "electronics",
      "language": "ar",
      "city": "Casablanca",
      "main-sales-page": "https://example.com/shop"
    },
    "submittedAt": "2025-11-12T16:00:00Z"
  }'
```

### Step 3: Check if Data Was Saved

```bash
# Get all applications
curl https://mimmarketplace.onrender.com/applications

# Or check in browser
# Open: https://mimmarketplace.onrender.com/
```

### Step 4: Check Render Logs

1. Go to Render Dashboard → Your Service → **Logs**
2. Look for:
   - "Received Webflow webhook"
   - "Application created with ID: ..."
   - Any error messages

## Common Issues & Solutions

### Issue 1: Webhook URL is Wrong

**Check:** In Webflow → Integrations → Webhooks

**Should be:**
```
https://mimmarketplace.onrender.com/webhooks/webflow
```

**NOT:**
```
https://api.render.com/deploy/...
```

### Issue 2: Webhook Not Being Called

**Check Render Logs:**
- If you don't see "Received Webflow webhook" in logs, Webflow isn't calling your endpoint
- Verify webhook URL in Webflow is correct
- Check if webhook is enabled in Webflow

### Issue 3: Signature Verification Failing

**Check:**
1. Is `WEBFLOW_WEBHOOK_SECRET` set in Render environment?
2. Does it match the secret from Webflow?
3. Check logs for "Invalid webhook signature" errors

**Solution:** Temporarily disable signature verification for testing:
- Remove `@UseGuards(WebflowWebhookGuard)` from webhook controller
- Or don't set `WEBFLOW_WEBHOOK_SECRET` (guard will skip verification)

### Issue 4: Data Not Saving

**Check:**
1. Database connection (check Render logs)
2. Required fields are present (full_name, email, category, language)
3. Check for validation errors in logs

## Debugging Steps

### 1. Enable Detailed Logging

The webhook controller already logs:
- "Received Webflow webhook"
- Full webhook data (in debug mode)
- "Application created with ID: ..."

### 2. Test Without Signature (Temporary)

To test if signature is the issue, temporarily remove the guard:

```typescript
// In src/webhooks/webhooks.controller.ts
// Comment out this line:
// @UseGuards(WebflowWebhookGuard)
```

### 3. Check Form Field Names

Make sure your Webflow form fields match these names:
- `full-name` or `الاسم-الكامل`
- `email` or `البريد-الالكتروني`
- `phone` or `whatsapp` or `رقم-الهاتف`
- `category` or `فئة`
- `language`

### 4. Verify Database Connection

```bash
# Check health endpoint
curl https://mimmarketplace.onrender.com/health

# Should return: {"status":"ok","timestamp":"..."}
```

## Step-by-Step Testing

### Test 1: Endpoint is Reachable
```bash
curl https://mimmarketplace.onrender.com/webhooks/webflow/test
```

### Test 2: Direct API Call (Bypass Webflow)
```bash
curl -X POST https://mimmarketplace.onrender.com/applications \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Direct Test",
    "email": "direct@test.com",
    "category": "test",
    "language": "en"
  }'
```

### Test 3: Check Database
```bash
curl https://mimmarketplace.onrender.com/applications
```

### Test 4: Submit Real Form
1. Go to: `mimmarketplace.com/application-form`
2. Fill out and submit form
3. Check Render logs immediately
4. Check admin dashboard: `https://mimmarketplace.onrender.com/`

## What to Look For

### In Render Logs:
✅ Good signs:
- "Received Webflow webhook"
- "Processing form submission: ..."
- "Application created with ID: ..."

❌ Bad signs:
- "Missing webhook signature"
- "Invalid webhook signature"
- "Error processing webhook"
- Database connection errors

### In Admin Dashboard:
✅ Good signs:
- New application appears in list
- Statistics update
- Can view application details

❌ Bad signs:
- No new applications
- Statistics don't change
- Error messages

## Quick Fix: Disable Signature Verification (For Testing)

If signature verification is blocking requests, temporarily disable it:

1. Edit `src/webhooks/webhooks.controller.ts`
2. Comment out: `@UseGuards(WebflowWebhookGuard)`
3. Rebuild and redeploy

This will allow webhooks to work without signature verification for testing.

