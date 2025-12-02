# Test Email Notifications via API - Ready to Go!

## 🧪 Test Email Notification Directly

### Quick Test Command

Replace with your email address:

```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"needs_info\"}"
```

### Windows CMD Version

```cmd
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"needs_info\"}"
```

### PowerShell Version

```powershell
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"salihalammari91@gmail.com\",\"type\":\"needs_info\"}'
```

## ✅ Expected Response

If successful, you'll get:
```json
{
  "success": true,
  "message": "Test needs_info notification sent to salihalammari91@gmail.com",
  "email": "salihalammari91@gmail.com",
  "type": "needs_info"
}
```

## 🧪 Test All Notification Types

### 1. Application Received
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"received\"}"
```

### 2. Needs Info
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"needs_info\"}"
```

### 3. Qualified
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"qualified\"}"
```

### 4. Rejected
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"rejected\"}"
```

### 5. Badge Activated
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"badge_activated\"}"
```

## ✅ Verify It Worked

### 1. Check API Response
- Should return: `{"success": true, ...}`
- If `success: false`, check the error message

### 2. Check Render Logs
1. Go to Render Dashboard → Your Service → **Logs**
2. Look for: `Email notification sent to salihalammari91@gmail.com`
3. If you see this, email was sent! ✅

### 3. Check Your Email
1. Go to: `salihalammari91@gmail.com`
2. Check **Inbox**
3. Check **Spam/Junk** folder
4. Look for email from "MIM Marketplace"
5. Subject should be in Arabic (e.g., `معلومات إضافية مطلوبة - MIM Marketplace`)

### 4. Check Resend Dashboard (Optional)
1. Go to: [https://resend.com/emails](https://resend.com/emails)
2. See all sent emails
3. Check delivery status
4. View email content

## 🐛 Troubleshooting

### Issue: "Cannot POST /applications/test-notification"
**Fix:**
- Service might not be deployed yet
- Wait for Render deployment to complete
- Check service status is "Live"

### Issue: "Email notifications are disabled"
**Fix:**
- Check `RESEND_API_KEY` is set in Render
- Verify API key is valid
- Check Render logs for initialization

### Issue: "Email not received"
**Fix:**
- Check spam/junk folder
- Verify email address is correct
- Check Resend dashboard for delivery status
- Verify `NOTIFICATION_FROM_EMAIL` is set

### Issue: "success: false"
**Fix:**
- Check the error message in response
- Check Render logs for details
- Verify Resend API key is correct

## 🎯 Quick Test Script

Save this as `test-email.bat` (Windows) or `test-email.sh` (Linux/Mac):

**Windows (test-email.bat):**
```batch
@echo off
echo Testing email notification...
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"needs_info\"}"
echo.
echo Check your email inbox!
pause
```

**Linux/Mac (test-email.sh):**
```bash
#!/bin/bash
echo "Testing email notification..."
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d '{"email":"salihalammari91@gmail.com","type":"needs_info"}'
echo ""
echo "Check your email inbox!"
```

## ✅ Success Checklist

- [ ] API returns `{"success": true}`
- [ ] Render logs show: `Email notification sent to...`
- [ ] Email received in inbox
- [ ] Email content is in Arabic
- [ ] Email subject is correct

## 🎉 Ready to Test!

Run the command above and check your email!

