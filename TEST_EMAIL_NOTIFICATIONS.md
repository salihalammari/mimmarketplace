# Test Email Notifications - Step by Step

## ✅ Pre-Test Checklist

Before testing, make sure:

1. **Service is Deployed on Render:**
   - Go to Render Dashboard
   - Check your service status is **"Live"** (green)
   - Check logs for: `Email notifications enabled via Resend`

2. **Environment Variables Set:**
   - ✅ `RESEND_API_KEY` - Your Resend API key
   - ✅ `NOTIFICATION_FROM_EMAIL` - Email address (e.g., `noreply@mimmarketplace.com`)
   - ✅ `NOTIFICATION_FROM_NAME` - `MIM Marketplace`

3. **Have a Test Application:**
   - Application must exist in database
   - Must have a valid email address
   - Get the application ID

## 🧪 Step 1: Get Application ID

### Option A: Via Admin Dashboard
1. Go to: `https://mimmarketplace.onrender.com/admin`
2. Find an application in the table
3. Click **"View"** to see details
4. Copy the ID from the URL or details

### Option B: Via API
```bash
curl "https://mimmarketplace.onrender.com/applications"
```

Look for an application with a valid email address, copy its `id`.

## 🧪 Step 2: Test Email Notification

### Test Command (Windows CMD):
```cmd
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" ^
  -H "Content-Type: application/json" ^
  -d "{\"status\":\"needs_info\",\"notes\":\"Test email notification\"}"
```

**Replace `<APP_ID>` with the actual application ID from Step 1.**

### Test Command (PowerShell):
```powershell
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" `
  -H "Content-Type: application/json" `
  -d '{\"status\":\"needs_info\",\"notes\":\"Test email notification\"}'
```

### Test Command (Linux/Mac/WSL):
```bash
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d '{"status":"needs_info","notes":"Test email notification"}'
```

## ✅ Step 3: Verify Email Sent

### Check Render Logs:
1. Go to Render Dashboard → Your Service → **Logs**
2. Look for: `Email notification sent to [email] for application [id]`
3. If you see this, email was sent successfully! ✅

### Check Email Inbox:
1. Go to the email address from the application
2. Check **Inbox** for email from "MIM Marketplace"
3. Check **Spam/Junk** folder if not in inbox
4. Email subject should be: `معلومات إضافية مطلوبة - MIM Marketplace` (or similar in Arabic)

## 🧪 Step 4: Test Other Notification Types

### Test "Qualified" Status:
```bash
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d '{"status":"qualified"}'
```

Expected email subject: `مبروك! تم قبول طلبك - MIM Marketplace`

### Test "Rejected" Status:
```bash
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d '{"status":"rejected"}'
```

### Test "Badge Activated" Status:
```bash
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d '{"status":"badge_activated"}'
```

## 🐛 Troubleshooting

### Issue: "Email notifications are disabled"
**Check:**
- `RESEND_API_KEY` is set in Render
- API key is valid (starts with `re_`)
- Service was redeployed after adding env var

**Fix:**
1. Verify API key in Resend dashboard: [https://resend.com/api-keys](https://resend.com/api-keys)
2. Re-add `RESEND_API_KEY` in Render
3. Redeploy service

### Issue: "Email not received"
**Check:**
- Email address is correct in application
- Check spam/junk folder
- Check Resend dashboard for delivery status: [https://resend.com/emails](https://resend.com/emails)

**Fix:**
- Verify email address format
- Check Resend logs for bounce/delivery errors
- Try with a different email address

### Issue: "Failed to send email notification"
**Check Render Logs for:**
- Specific error message
- API key errors
- Network errors

**Fix:**
- Verify Resend API key is correct
- Check Resend account status
- Verify `NOTIFICATION_FROM_EMAIL` is set

### Issue: "Application not found"
**Check:**
- Application ID is correct
- Application exists in database

**Fix:**
- Get correct application ID from admin dashboard
- Verify application exists: `GET /applications`

## 📊 Check Resend Dashboard

1. Go to [https://resend.com/emails](https://resend.com/emails)
2. See all sent emails
3. Check delivery status
4. View email content
5. See any errors

## ✅ Success Indicators

You'll know it's working when:
- ✅ Render logs show: `Email notification sent to...`
- ✅ Email appears in inbox (or spam)
- ✅ Email content is in Arabic
- ✅ Email has correct subject line
- ✅ Resend dashboard shows successful delivery

## 🎉 Next Steps

Once email is working:
1. Test all notification types
2. Set up WhatsApp (if needed)
3. Monitor Resend dashboard for delivery rates
4. Check spam rates and adjust if needed

## 📝 Quick Test Script

Save this as `test-email.sh`:

```bash
#!/bin/bash
APP_ID="your-application-id-here"
API_URL="https://mimmarketplace.onrender.com"

echo "Testing email notification..."
curl -X PATCH "$API_URL/applications/$APP_ID/status" \
  -H "Content-Type: application/json" \
  -d '{"status":"needs_info","notes":"Test notification"}'

echo ""
echo "Check Render logs and email inbox!"
```

Run: `bash test-email.sh`

