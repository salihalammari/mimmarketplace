# Pre-Test Checklist - Before Testing Notifications

## ✅ Environment Variables Check

Verify these are set in Render Dashboard → Environment:

### Required for Email (Resend):
- [ ] `RESEND_API_KEY` - Your Resend API key (starts with `re_`)
- [ ] `NOTIFICATION_FROM_EMAIL` - Email address (default: `noreply@mimmarketplace.com`)
- [ ] `NOTIFICATION_FROM_NAME` - Sender name (default: `MIM Marketplace`)

### Required for WhatsApp (Choose ONE option):

**Option A: Webhook (Make.com/Zapier) - EASIEST:**
- [ ] `WHATSAPP_WEBHOOK_URL` - Your webhook URL from Make.com/Zapier
- [ ] `WHATSAPP_DEFAULT_COUNTRY_CODE` - Default: `+212`

**Option B: ChatAPI:**
- [ ] `CHATAPI_URL` - Usually `https://api.chat-api.com`
- [ ] `CHATAPI_INSTANCE_ID` - Your ChatAPI instance ID
- [ ] `CHATAPI_TOKEN` - Your ChatAPI token
- [ ] `WHATSAPP_DEFAULT_COUNTRY_CODE` - Default: `+212`

**Option C: Evolution API:**
- [ ] `EVOLUTION_API_URL` - Your Evolution API URL
- [ ] `EVOLUTION_INSTANCE_NAME` - Your instance name
- [ ] `EVOLUTION_API_KEY` - (Optional) Your API key
- [ ] `WHATSAPP_DEFAULT_COUNTRY_CODE` - Default: `+212`

**Option D: WhatsApp Business API:**
- [ ] `WHATSAPP_BUSINESS_API_URL` - Usually `https://graph.facebook.com/v18.0`
- [ ] `WHATSAPP_BUSINESS_TOKEN` - Your access token
- [ ] `WHATSAPP_BUSINESS_PHONE_ID` - Your phone number ID
- [ ] `WHATSAPP_DEFAULT_COUNTRY_CODE` - Default: `+212`

### Database & General:
- [ ] `DATABASE_URL` - Your Supabase PostgreSQL connection string
- [ ] `NODE_ENV` - Should be `production`
- [ ] `PORT` - Should be `10000` (or your port)
- [ ] `WEBFLOW_WEBHOOK_SECRET` - (If using Webflow webhooks)

## 🔍 Verification Steps

### 1. Check Service is Running
- [ ] Go to Render Dashboard → Your Service
- [ ] Verify service status is **"Live"** (green)
- [ ] Check logs for any errors

### 2. Verify Environment Variables
- [ ] All required variables are set (see above)
- [ ] No typos in variable names
- [ ] Values are correct (especially API keys)

### 3. Test Database Connection
- [ ] Service starts without database errors
- [ ] Check logs: Should see "Database connection established" or similar
- [ ] No "Can't reach database server" errors

### 4. Verify Notification Service Initialization
Check Render logs for:
- [ ] `Email notifications enabled via Resend` (if RESEND_API_KEY is set)
- [ ] OR `RESEND_API_KEY missing. Email notifications are disabled.` (if not set)
- [ ] No errors about notification service

### 5. Prepare Test Application
- [ ] Have at least one application in database with:
  - Valid email address (for email test)
  - Valid phone/WhatsApp number (for WhatsApp test)
  - Format: `+212612345678` or `06612345678`

## 🧪 Testing Steps

### Step 1: Test Email Notification
```bash
# Replace <APP_ID> with a real application ID
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"needs_info\",\"notes\":\"Test message\"}"
```

**Check:**
- [ ] Render logs show: `Email notification sent to...`
- [ ] Email received in application's inbox
- [ ] Email content is correct (Arabic message)

### Step 2: Test WhatsApp Notification
```bash
# Same command as above
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"qualified\"}"
```

**Check:**
- [ ] Render logs show: `WhatsApp notification sent via...`
- [ ] WhatsApp message received on phone
- [ ] Message content is correct (Arabic)

### Step 3: Test All Notification Types
Test each status change:
- [ ] `pending` → `needs_info` (with notes)
- [ ] `needs_info` → `qualified`
- [ ] `qualified` → `rejected`
- [ ] `rejected` → `badge_activated`

## 🐛 Common Issues & Fixes

### Issue: "Email notifications are disabled"
**Fix:** 
- Check `RESEND_API_KEY` is set correctly
- Verify API key is valid (starts with `re_`)
- Check Resend dashboard for API key status

### Issue: "WhatsApp message prepared (no service configured)"
**Fix:**
- Set at least ONE WhatsApp service (webhook, ChatAPI, Evolution, or Business API)
- Verify environment variable names match exactly
- Redeploy service after adding variables

### Issue: "Can't reach database server"
**Fix:**
- Verify `DATABASE_URL` is correct
- Check Supabase database is running
- Ensure IP whitelist includes Render IPs (if required)

### Issue: "Instance not found" (Evolution API)
**Fix:**
- Verify `EVOLUTION_INSTANCE_NAME` matches exactly
- Check Evolution API instance exists and is connected
- Test Evolution API directly: `GET /instance/fetchInstances`

### Issue: "Webhook failed"
**Fix:**
- Verify webhook URL is correct
- Check webhook is active in Make.com/Zapier
- Test webhook manually with [webhook.site](https://webhook.site)

## 📋 Quick Test Commands

### Get Application ID:
```bash
curl "https://mimmarketplace.onrender.com/applications"
```

### Test Status Change:
```bash
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"needs_info\",\"notes\":\"Test\"}"
```

### Check Service Health:
```bash
curl "https://mimmarketplace.onrender.com/health"
```

## ✅ Final Checklist Before Testing

- [ ] All environment variables set in Render
- [ ] Service is deployed and running
- [ ] No errors in Render logs
- [ ] Test application exists with valid email and phone
- [ ] Resend API key is valid (for email)
- [ ] WhatsApp service is configured (webhook/ChatAPI/Evolution)
- [ ] Ready to test!

## 🚀 Ready to Test!

Once all checkboxes are ✅, you're ready to test notifications!

Start with email first (easiest), then test WhatsApp.

Good luck! 🎉

