# Test Email Notification Directly - Quick Guide

## 🚀 Test Email Without Application ID

I've added a test endpoint so you can test email notifications directly!

### Step 1: Test Email Notification

**Send test email to your email address:**

```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"your-email@example.com\",\"type\":\"received\"}"
```

**Replace `your-email@example.com` with your actual email address.**

### Step 2: Test Different Notification Types

**Test "Application Received":**
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"your-email@example.com\",\"type\":\"received\"}"
```

**Test "Needs Info":**
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"your-email@example.com\",\"type\":\"needs_info\"}"
```

**Test "Qualified":**
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"your-email@example.com\",\"type\":\"qualified\"}"
```

**Test "Rejected":**
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"your-email@example.com\",\"type\":\"rejected\"}"
```

**Test "Badge Activated":**
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"your-email@example.com\",\"type\":\"badge_activated\"}"
```

## ✅ Verify Email Sent

### Check Response:
The API will return:
```json
{
  "success": true,
  "message": "Test received notification sent to your-email@example.com",
  "email": "your-email@example.com",
  "type": "received"
}
```

### Check Render Logs:
1. Go to Render Dashboard → Your Service → **Logs**
2. Look for: `Email notification sent to your-email@example.com`
3. If you see this, email was sent! ✅

### Check Your Email:
1. Go to your email inbox
2. Look for email from "MIM Marketplace"
3. Check **Spam/Junk** folder if not in inbox
4. Email should be in Arabic with the notification message

## 🎯 Quick Test (Windows CMD)

```cmd
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"your-email@example.com\",\"type\":\"received\"}"
```

## 🎯 Quick Test (PowerShell)

```powershell
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"your-email@example.com\",\"type\":\"received\"}'
```

## 🎯 Quick Test (Browser - Easiest!)

You can also test using your browser with a tool like:

1. **Postman** - Download from [postman.com](https://postman.com)
2. **Thunder Client** - VS Code extension
3. **Online tool** - [https://reqbin.com](https://reqbin.com)

**Request:**
- Method: `POST`
- URL: `https://mimmarketplace.onrender.com/applications/test-notification`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "email": "your-email@example.com",
  "type": "received"
}
```

## 🐛 Troubleshooting

### "Email notifications are disabled"
- Check `RESEND_API_KEY` is set in Render
- Verify API key is valid
- Check Render logs for initialization message

### "Email not received"
- Check spam/junk folder
- Verify email address is correct
- Check Resend dashboard: [https://resend.com/emails](https://resend.com/emails)

### "Failed to send test notification"
- Check Render logs for specific error
- Verify Resend API key is correct
- Check `NOTIFICATION_FROM_EMAIL` is set

## ✅ Success!

When it works, you'll:
- ✅ See success response from API
- ✅ See "Email notification sent" in Render logs
- ✅ Receive email in your inbox
- ✅ Email content in Arabic

## 🎉 Ready to Test!

Just replace `your-email@example.com` with your real email and run the command!

