# API Test Commands - Email & WhatsApp Notifications

## 🧪 Test Email Notifications

### Test 1: Direct Email Test (No Application Needed)

**Test "Application Received" notification:**
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"received\"}"
```

**Test "Needs Info" notification:**
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"needs_info\"}"
```

**Test "Qualified" notification:**
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"qualified\"}"
```

**Test "Rejected" notification:**
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"rejected\"}"
```

**Test "Badge Activated" notification:**
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"badge_activated\"}"
```

### Test 2: Real Application Status Change

**First, get an application ID:**
```bash
curl "https://mimmarketplace.onrender.com/applications"
```

**Then change status (triggers both email AND WhatsApp):**
```bash
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"needs_info\",\"notes\":\"اذكر لنا رقم الطلب\"}"
```

Replace `<APP_ID>` with actual ID from the list above.

## ✅ Expected Responses

### Test Notification Endpoint Response:
```json
{
  "success": true,
  "message": "Test needs_info notification sent to salihalammari91@gmail.com",
  "email": "salihalammari91@gmail.com",
  "type": "needs_info"
}
```

### Status Change Response:
```json
{
  "id": "...",
  "email": "...",
  "status": "needs_info",
  ...
}
```

## 🔍 Verify Notifications Sent

### Check Render Logs:
1. Go to Render Dashboard → Your Service → **Logs**
2. Look for:
   - ✅ `Email notification sent to salihalammari91@gmail.com`
   - ✅ `WhatsApp notification sent via webhook to +212...` (if WhatsApp configured)

### Check Email:
1. Go to: `salihalammari91@gmail.com`
2. Check **Inbox**
3. Check **Spam/Junk** folder
4. Look for email from "MIM Marketplace"

### Check WhatsApp:
1. Check the phone number from the application
2. Should receive WhatsApp message
3. Check Make.com execution logs if using webhook

## 🎯 Quick Test Script

Save this as `test-all.sh`:

```bash
#!/bin/bash

EMAIL="salihalammari91@gmail.com"
API_URL="https://mimmarketplace.onrender.com"

echo "🧪 Testing Email Notifications..."
echo ""

echo "1. Testing 'received' notification..."
curl -X POST "$API_URL/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"type\":\"received\"}"
echo ""
echo ""

echo "2. Testing 'needs_info' notification..."
curl -X POST "$API_URL/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"type\":\"needs_info\"}"
echo ""
echo ""

echo "3. Testing 'qualified' notification..."
curl -X POST "$API_URL/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"type\":\"qualified\"}"
echo ""
echo ""

echo "✅ Tests completed!"
echo "Check your email: $EMAIL"
echo "Check Render logs for confirmation"
```

Run: `bash test-all.sh`

## 🐛 Troubleshooting

### "Cannot POST /applications/test-notification"
- Service not deployed yet
- Wait for Render deployment to complete
- Check service status is "Live"

### "Email notifications are disabled"
- Check `RESEND_API_KEY` is set in Render
- Verify API key is valid
- Redeploy service

### "WhatsApp not sending"
- Check `WHATSAPP_WEBHOOK_URL` is set
- Verify Make.com scenario is ON
- Check Make.com execution logs

## ✅ Success Checklist

- [ ] Test endpoint returns `"success": true`
- [ ] Render logs show "Email notification sent"
- [ ] Email received in inbox
- [ ] WhatsApp sent (if configured)
- [ ] All notification types work

## 🚀 Ready to Test!

Run the commands above to test your notifications!

