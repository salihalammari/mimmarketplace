# Final Test Guide - Email & WhatsApp

## ✅ What's Configured

- ✅ Resend API Key: `re_ALNnZkL4...` (Mim API)
- ✅ WhatsApp Business Cloud: Connected and Verified
- ✅ Make.com: Ready

## 🧪 Test Email Notifications

### Test 1: Direct Email Test (Easiest)

**Test "Needs Info" notification:**
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"needs_info\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Test needs_info notification sent to salihalammari91@gmail.com",
  "email": "salihalammari91@gmail.com",
  "type": "needs_info"
}
```

**Verify:**
- ✅ Check Render logs: `Email notification sent to salihalammari91@gmail.com`
- ✅ Check email inbox: `salihalammari91@gmail.com`
- ✅ Check spam folder if not in inbox

### Test 2: Test All Email Types

```bash
# Application Received
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"received\"}"

# Qualified
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"qualified\"}"

# Rejected
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"rejected\"}"

# Badge Activated
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"badge_activated\"}"
```

## 📱 Test WhatsApp Notifications

### Step 1: Make Sure Webhook is Configured

1. Go to Make.com → Your Scenario
2. Make sure "Custom webhook" is the trigger
3. Make sure "WhatsApp Business Cloud" is the action
4. Scenario is **turned ON** (green toggle)

### Step 2: Get Webhook URL

1. In Make.com scenario, click on "Custom webhook" module
2. Copy the webhook URL (looks like: `https://hook.integromat.com/xxxxx`)
3. Add to Render: `WHATSAPP_WEBHOOK_URL` = your webhook URL

### Step 3: Test WhatsApp

**Option A: Test with Real Application (Best)**
```bash
# Get application ID
curl "https://mimmarketplace.onrender.com/applications"

# Change status (sends both email AND WhatsApp)
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"qualified\"}"
```

**Option B: Test Webhook Directly**
```bash
# Test if webhook receives data
curl -X POST "https://your-webhook-url-from-make.com" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"+212612345678\",\"message\":\"Test WhatsApp message\",\"applicationId\":\"test\",\"applicationName\":\"Test User\"}"
```

**Verify:**
- ✅ Check Render logs: `WhatsApp notification sent via webhook to +212...`
- ✅ Check Make.com → Scenarios → Your scenario → "Runs" tab
- ✅ Check WhatsApp on the phone number

## 🎯 Complete Test Flow

### Test Everything at Once:

1. **Get an application with phone number:**
   ```bash
   curl "https://mimmarketplace.onrender.com/applications"
   ```
   Find one with a phone number like `+212612345678`

2. **Change status (triggers BOTH email and WhatsApp):**
   ```bash
   curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
     -H "Content-Type: application/json" \
     -d "{\"status\":\"qualified\",\"notes\":\"Test notification\"}"
   ```

3. **Verify both sent:**
   - ✅ Email: Check `salihalammari91@gmail.com`
   - ✅ WhatsApp: Check the phone number from application
   - ✅ Render logs: Both should show "sent"

## ✅ Success Checklist

### Email:
- [ ] Test endpoint returns `"success": true`
- [ ] Render logs show: `Email notification sent to...`
- [ ] Email received in inbox
- [ ] Email content is in Arabic
- [ ] All notification types work

### WhatsApp:
- [ ] `WHATSAPP_WEBHOOK_URL` is set in Render
- [ ] Make.com scenario is ON
- [ ] Render logs show: `WhatsApp notification sent via webhook...`
- [ ] Make.com shows successful execution
- [ ] WhatsApp message received on phone

## 🐛 Quick Troubleshooting

**Email not sending:**
- Check `RESEND_API_KEY` is `re_ALNnZkL4...` (your key)
- Check Resend dashboard: [https://resend.com/emails](https://resend.com/emails)

**WhatsApp not sending:**
- Verify `WHATSAPP_WEBHOOK_URL` is set in Render
- Check Make.com scenario is ON
- Check Make.com execution logs for errors
- Verify WhatsApp Business connection is "Verified" (green checkmark)

## 🚀 Ready to Test!

Run the test commands above and verify both email and WhatsApp work!

