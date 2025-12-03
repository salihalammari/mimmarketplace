# Gmail Email Setup Guide

## 📧 Environment Variables for Gmail

To use Gmail for sending email notifications, you need these environment variables:

### Required Variables:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
NOTIFICATION_FROM_EMAIL=your-email@gmail.com
NOTIFICATION_FROM_NAME=MIM Marketplace
```

### Optional (Fallback to Resend):

If Gmail is not configured, the system will fallback to Resend:
```env
RESEND_API_KEY=re_...
```

## 🔐 How to Get Gmail App Password

**Important:** You cannot use your regular Gmail password. You need to create an **App Password**.

### Step 1: Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click **2-Step Verification**
3. Follow the steps to enable it (if not already enabled)

### Step 2: Generate App Password

1. Go back to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click **App passwords**
3. Select app: **Mail**
4. Select device: **Other (Custom name)**
5. Enter name: **MIM Marketplace Backend**
6. Click **Generate**
7. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

**⚠️ Important:** 
- Remove spaces when using it: `abcdefghijklmnop`
- This password is shown only once - save it securely!

### Step 3: Set Environment Variables

**In Render Dashboard:**

1. Go to **Render Dashboard → Your Service → Environment**
2. Add these variables:

```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
NOTIFICATION_FROM_EMAIL=your-email@gmail.com
NOTIFICATION_FROM_NAME=MIM Marketplace
```

3. Click **Save Changes**
4. Service will auto-redeploy

## ✅ Verify Configuration

After deploying, test the configuration:

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

## 🧪 Test Email Sending

Test sending an email:

```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"type\":\"needs_info\"}"
```

Check Render logs to see:
```
[EMAIL] Attempting to send email to test@example.com via Gmail...
[EMAIL] ✅ Email notification sent successfully...
```

## 🔄 How It Works

The system checks for Gmail configuration first:
1. **If Gmail is configured** (`GMAIL_USER` + `GMAIL_APP_PASSWORD`) → Uses Gmail
2. **If Gmail is not configured** → Falls back to Resend (if `RESEND_API_KEY` is set)
3. **If neither is configured** → Email notifications are disabled

## ⚠️ Important Notes

### Gmail Limits:
- **Daily sending limit:** 500 emails per day (for regular Gmail accounts)
- **Rate limit:** ~100 emails per hour
- For higher limits, consider using Google Workspace (business account)

### Security:
- **Never commit** `GMAIL_APP_PASSWORD` to Git
- Store it securely in Render environment variables
- If compromised, revoke the app password and generate a new one

### Troubleshooting:

**Error: "Invalid login"**
- Check that 2-Step Verification is enabled
- Verify the app password is correct (no spaces)
- Make sure you're using App Password, not regular password

**Error: "Less secure app access"**
- This is not needed with App Passwords
- App Passwords work even with 2-Step Verification enabled

**Emails going to spam:**
- This is normal for new senders
- Recipients may need to mark as "Not Spam"
- Consider using a custom domain with SPF/DKIM records

## 📝 Summary

**Required .env variables:**
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
NOTIFICATION_FROM_EMAIL=your-email@gmail.com
NOTIFICATION_FROM_NAME=MIM Marketplace
```

**Steps:**
1. Enable 2-Step Verification on Google Account
2. Generate App Password
3. Set environment variables in Render
4. Deploy and test

That's it! Your emails will now be sent via Gmail! 🎉

