# Status Update Email Notification Guide

## ✅ How It Works

When you update an application status, the system **automatically sends an email** to the user.

### Statuses That Trigger Email Notifications:

1. **`needs_info`** - When admin requests more information
2. **`qualified`** - When application is approved
3. **`rejected`** - When application is rejected
4. **`badge_activated`** - When badge is activated

### Statuses That DON'T Trigger Notifications:

- `pending` - Initial status (no notification)
- Any other custom statuses

## 📧 Email Notification Flow

```
Admin Updates Status
    ↓
updateStatus() called
    ↓
Status saved to database
    ↓
Check: shouldSendStatusNotification(status)?
    ↓
YES → notifyStatusChange() called
    ↓
Email sent via Gmail (or Resend)
    ↓
User receives email ✅
```

## 🔧 Required Environment Variables

Make sure these are set in **Render Dashboard → Environment**:

### For Gmail (Recommended):
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
NOTIFICATION_FROM_EMAIL=your-email@gmail.com
NOTIFICATION_FROM_NAME=MIM Marketplace
```

### For Resend (Alternative):
```env
RESEND_API_KEY=re_...
NOTIFICATION_FROM_EMAIL=onboarding@resend.dev
NOTIFICATION_FROM_NAME=MIM Marketplace
```

## 🧪 Testing

### Test 1: Update Status via API

```bash
# Get an application ID first
curl "https://mimmarketplace.onrender.com/applications" | jq '.[0].id'

# Update status (triggers email)
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"qualified\"}"
```

### Test 2: Update Status via Admin Dashboard

1. Go to: `https://mimmarketplace.onrender.com/admin`
2. Find an application
3. Change status using dropdown
4. Click ✓ to confirm
5. **Email is sent automatically!**

### Test 3: Check Logs

After updating status, check **Render Dashboard → Logs**:

**✅ Success Logs:**
```
[ApplicationsService] Updating status for application abc123 to qualified
[ApplicationsService] Status qualified requires notification. Sending to user@example.com
[NOTIFICATION] Starting notifications for application abc123...
[EMAIL] Attempting to send email to user@example.com via Gmail...
[EMAIL] ✅ Email notification sent successfully to user@example.com...
[ApplicationsService] Notification sent successfully for application abc123
```

**❌ Error Logs:**
```
[EMAIL] ⚠️ No email provider configured...
[EMAIL] ❌ Failed to send email notification...
```

## 📝 Email Templates

Each status has a custom email template in Arabic:

### 1. `needs_info`
- Subject: "معلومات إضافية مطلوبة - MIM Marketplace"
- Includes admin notes if provided

### 2. `qualified`
- Subject: "مبروك! تم قبول طلبك - MIM Marketplace"
- Congratulations message

### 3. `rejected`
- Subject: "تحديث على طلبك - MIM Marketplace"
- Polite rejection with option to reapply

### 4. `badge_activated`
- Subject: "مبروك! شارتك الرقمية أصبحت فعالة - MIM Marketplace"
- Confirmation that badge is active

## 🔍 Verify Configuration

Check if email is properly configured:

```bash
curl "https://mimmarketplace.onrender.com/notifications/config"
```

**Expected Response:**
```json
{
  "email": {
    "provider": "gmail",
    "enabled": true,
    "fromEmail": "your-email@gmail.com",
    "fromName": "MIM Marketplace",
    "gmail": {
      "enabled": true,
      "user": "your-email@gmail.com",
      "appPasswordSet": true
    }
  }
}
```

## ⚠️ Troubleshooting

### Problem: Email not sending

**Check 1: Configuration**
```bash
curl "https://mimmarketplace.onrender.com/notifications/config"
```
- If `enabled: false` → Set Gmail or Resend env vars

**Check 2: Status Type**
- Only `needs_info`, `qualified`, `rejected`, `badge_activated` trigger emails
- Other statuses don't send notifications

**Check 3: Application Has Email**
- Application must have a valid `email` field
- Check: `curl ".../applications/<ID>"`

**Check 4: Render Logs**
- Look for `[EMAIL]` tags in logs
- Check for error messages

### Problem: Gmail authentication error

- Verify `GMAIL_APP_PASSWORD` is correct (16 characters, no spaces)
- Make sure 2-Step Verification is enabled
- Regenerate app password if needed

## ✅ Summary

**What happens when you update status:**

1. ✅ Status saved to database
2. ✅ Audit log created
3. ✅ **Email sent to user** (if status triggers notification)
4. ✅ WhatsApp sent to user (if configured)

**Required:**
- Gmail or Resend configured
- Status must be one of: `needs_info`, `qualified`, `rejected`, `badge_activated`
- Application must have valid email address

**That's it!** The system automatically sends emails when you update status. 🎉

