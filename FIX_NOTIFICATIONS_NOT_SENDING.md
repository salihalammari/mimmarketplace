# Fix: Notifications Not Sending

## 🔍 Problem
Status changes are being saved to the database (you can see them in `audit_logs`), but **email and WhatsApp notifications are not being sent**.

## ✅ What I Fixed

### 1. **Enhanced Logging**
Added detailed logging to track:
- When status updates happen
- When notifications are triggered
- Email sending attempts
- WhatsApp sending attempts
- Any errors that occur

### 2. **Better Error Handling**
- Errors are now logged with full stack traces
- Notifications won't silently fail
- You'll see exactly what's happening in Render logs

### 3. **Diagnostic Endpoint**
Added a new endpoint to check notification status for any application.

## 🧪 How to Debug

### Step 1: Check Render Logs

After deploying, when you change a status, check Render logs:

1. Go to Render Dashboard → Your Service → Logs
2. Look for messages like:
   - `Updating status for application...`
   - `Status X requires notification. Sending to...`
   - `Email notification sent successfully...`
   - `WhatsApp notification sent via...`

### Step 2: Test Notification Status

Check if an application should receive notifications:

```bash
curl "https://mimmarketplace.onrender.com/applications/notification-status/<APPLICATION_ID>"
```

Replace `<APPLICATION_ID>` with an actual application ID.

**Expected Response:**
```json
{
  "applicationId": "...",
  "status": "qualified",
  "email": "user@example.com",
  "phone": "+212612345678",
  "whatsappNumber": "+212612345678",
  "shouldSendNotification": true,
  "notificationStatus": "Will send on next status change"
}
```

### Step 3: Verify Configuration

**Check Email Configuration:**
```bash
# In Render Dashboard → Environment, verify:
RESEND_API_KEY=re_... (should be set)
NOTIFICATION_FROM_EMAIL=onboarding@resend.dev (or your verified domain)
NOTIFICATION_FROM_NAME=MIM Marketplace
```

**Check WhatsApp Configuration:**
```bash
# At least ONE of these should be set:
WHATSAPP_WEBHOOK_URL=https://hook.integromat.com/... (Make.com webhook)
# OR
EVOLUTION_API_URL=...
EVOLUTION_API_KEY=...
EVOLUTION_INSTANCE_NAME=...
# OR
CHATAPI_URL=...
CHATAPI_INSTANCE_ID=...
CHATAPI_TOKEN=...
```

### Step 4: Test Direct Notification

Test if notifications work directly:

```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"your-email@example.com\",\"type\":\"qualified\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Test qualified notification sent to your-email@example.com",
  "email": "your-email@example.com",
  "type": "qualified"
}
```

## 🐛 Common Issues

### Issue 1: Status Doesn't Trigger Notification

**Problem:** Status is not one of: `needs_info`, `qualified`, `rejected`, `badge_activated`

**Solution:** Only these statuses trigger notifications. If you're using a different status, change it to one of these.

**Check in logs:**
```
Status pending does not require notification (only: needs_info, qualified, rejected, badge_activated)
```

### Issue 2: Email Not Sending

**Possible Causes:**
1. **Resend API Key Missing**
   - Check: `RESEND_API_KEY` in Render environment
   - Logs will show: `RESEND_API_KEY missing. Email notifications are disabled.`

2. **Domain Not Verified**
   - If using `noreply@mimmarketplace.com`, domain must be verified in Resend
   - Use `onboarding@resend.dev` for testing (no verification needed)
   - Logs will show: `403 Forbidden` or domain verification error

3. **Invalid Email Address**
   - Check application has valid email
   - Logs will show: `No email address found. Email notification skipped...`

### Issue 3: WhatsApp Not Sending

**Possible Causes:**
1. **No Phone Number**
   - Application must have `phone` or `whatsapp_number`
   - Logs will show: `Skipping WhatsApp notification... no phone number`

2. **No WhatsApp Provider Configured**
   - At least one WhatsApp service must be configured
   - Logs will show: `WhatsApp message prepared... (no service configured)`

3. **Webhook/API Not Working**
   - Check webhook URL is correct
   - Check API credentials are valid
   - Logs will show: `WhatsApp webhook failed...` or `Evolution API failed...`

## 🔧 Quick Fixes

### Fix 1: Use Test Email Domain

If domain verification is the issue:

1. Render Dashboard → Environment
2. Change `NOTIFICATION_FROM_EMAIL` to: `onboarding@resend.dev`
3. Save and redeploy

### Fix 2: Add WhatsApp Webhook

If WhatsApp not configured:

1. Go to Make.com (or Zapier)
2. Create a webhook
3. Copy webhook URL
4. Render Dashboard → Environment
5. Add: `WHATSAPP_WEBHOOK_URL=https://hook.integromat.com/your-webhook-id`
6. Save and redeploy

### Fix 3: Verify Application Has Contact Info

Make sure applications have:
- Valid email address
- Phone number or WhatsApp number

## 📊 Check Logs After Status Change

After changing a status in admin dashboard, check Render logs for:

**✅ Success:**
```
[ApplicationsService] Updating status for application abc123 to qualified
[ApplicationsService] Status qualified requires notification. Sending to user@example.com (phone: +212612345678)
[NotificationsService] Preparing notifications for application abc123 (template: qualified, email: user@example.com)
[NotificationsService] Sending email to user@example.com via Resend...
[NotificationsService] Email notification sent successfully to user@example.com for application abc123. Resend ID: re_...
[NotificationsService] Sending WhatsApp message for application abc123...
[NotificationsService] WhatsApp notification sent via webhook to +212612345678 for application abc123
[ApplicationsService] Notification sent successfully for application abc123 (status: qualified)
```

**❌ Failure Examples:**
```
[NotificationsService] RESEND_API_KEY missing. Email notifications are disabled.
[NotificationsService] Skipping WhatsApp notification for application abc123: no phone number
[NotificationsService] WhatsApp webhook failed for +212612345678: 404 Not Found
```

## 🚀 Next Steps

1. **Deploy the updated code** (with enhanced logging)
2. **Change a status** in admin dashboard
3. **Check Render logs** immediately
4. **Look for the log messages** above
5. **Fix any issues** you see in the logs

## 📝 Summary

The code now:
- ✅ Logs every step of the notification process
- ✅ Shows exactly why notifications fail
- ✅ Provides diagnostic endpoint
- ✅ Handles errors gracefully

**Deploy and check logs to see what's happening!**

