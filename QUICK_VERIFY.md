# Quick Verification - Before Testing

## ✅ Step 1: Verify Environment Variables in Render

Based on your Render dashboard, check you have:

### ✅ Already Set (I can see these):
- [x] `DATABASE_URL` ✅
- [x] `NODE_ENV` ✅
- [x] `PORT` ✅
- [x] `RESEND_API_KEY` ✅
- [x] `WEBFLOW_WEBHOOK_SECRET` ✅

### ⚠️ Need to Add (if using WhatsApp):

**For Email (Already have RESEND_API_KEY, but verify these):**
- [ ] `NOTIFICATION_FROM_EMAIL` - Should be: `noreply@mimmarketplace.com` (or your verified domain)
- [ ] `NOTIFICATION_FROM_NAME` - Should be: `MIM Marketplace`

**For WhatsApp (Choose ONE):**
- [ ] `WHATSAPP_WEBHOOK_URL` - If using Make.com/Zapier webhook
- [ ] OR `CHATAPI_URL`, `CHATAPI_INSTANCE_ID`, `CHATAPI_TOKEN` - If using ChatAPI
- [ ] OR `EVOLUTION_API_URL`, `EVOLUTION_INSTANCE_NAME` - If using Evolution API
- [ ] `WHATSAPP_DEFAULT_COUNTRY_CODE` - Should be: `+212`

## ✅ Step 2: Verify Service is Running

1. Go to Render Dashboard → Your Service
2. Check status is **"Live"** (green dot)
3. Check logs for errors:
   - Should see: `Email notifications enabled via Resend`
   - Should NOT see: `Can't reach database server`

## ✅ Step 3: Get a Test Application ID

You need an application with:
- Valid email address
- Valid phone/WhatsApp number

**Get Application ID:**
```bash
curl "https://mimmarketplace.onrender.com/applications"
```

Or check in your admin dashboard: `https://mimmarketplace.onrender.com/admin`

## ✅ Step 4: Test Email First (Easiest)

```bash
# Replace <APP_ID> with real ID from Step 3
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"needs_info\",\"notes\":\"Test notification\"}"
```

**Check:**
1. Render Logs → Should see: `Email notification sent to...`
2. Check the application's email inbox
3. Check spam folder if not received

## ✅ Step 5: Test WhatsApp (If Configured)

Same command as Step 4, but check:
1. Render Logs → Should see: `WhatsApp notification sent via...`
2. Check WhatsApp on the phone number from application

## 🐛 Quick Fixes

### If Email Not Sending:
- Verify `RESEND_API_KEY` is correct (starts with `re_`)
- Check Resend dashboard: [https://resend.com/emails](https://resend.com/emails)
- Verify `NOTIFICATION_FROM_EMAIL` is set

### If WhatsApp Not Sending:
- Verify at least ONE WhatsApp service is configured
- Check webhook is active (if using webhook)
- Verify phone number format: `+212612345678`

### If Service Won't Start:
- Check all required env vars are set
- Check logs for specific error messages
- Verify database connection

## 🎯 Ready to Test Checklist

- [ ] Service is "Live" in Render
- [ ] No errors in Render logs
- [ ] `RESEND_API_KEY` is set and valid
- [ ] `NOTIFICATION_FROM_EMAIL` is set
- [ ] At least ONE WhatsApp service configured (if testing WhatsApp)
- [ ] Have a test application ID ready
- [ ] Test application has valid email and phone

## 🚀 Test Now!

Once all checked, run the test command above!

