# Switch to Resend for Email Notifications

## 🚀 Why Resend?

- ✅ More reliable than Gmail SMTP
- ✅ Better for production applications
- ✅ Free tier: 3,000 emails/month
- ✅ No App Password needed
- ✅ Better deliverability
- ✅ Detailed logs and analytics

## 📋 Step-by-Step Setup

### Step 1: Sign Up for Resend

1. Go to [Resend.com](https://resend.com)
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with your email (or use GitHub/Google)
4. Verify your email address

### Step 2: Get Your API Key

1. After signing in, go to **API Keys** (in left sidebar)
2. Click **"Create API Key"**
3. Give it a name: `MIM Marketplace Production`
4. Select permissions: **"Full Access"** (or just "Send Emails")
5. Click **"Add"**
6. **Copy the API key** - it starts with `re_`
   - ⚠️ **Important:** This is shown only once! Save it securely.

### Step 3: Update Render Environment Variables

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select **mimmarketplace** service
3. Go to **Environment** tab
4. Update these variables:

**Add/Update:**
- `RESEND_API_KEY` = `re_...` (your Resend API key)
- `NOTIFICATION_FROM_EMAIL` = `onboarding@resend.dev` (for testing)

**Optional (can leave or remove):**
- `GMAIL_USER` - Can leave it (Resend takes priority)
- `GMAIL_APP_PASSWORD` - Can leave it (Resend takes priority)

**Keep:**
- `NOTIFICATION_FROM_NAME` = `MIM Marketplace`

### Step 4: Save and Redeploy

1. Click **"Save Changes"** in Render
2. Go to **Manual Deploy** button (top right)
3. Select **"Deploy latest commit"**
4. Wait 3-5 minutes for deployment

### Step 5: Verify Configuration

After deployment, check:

```bash
curl "https://mimmarketplace.onrender.com/notifications/config"
```

**Should show:**
```json
{
  "email": {
    "provider": "resend",
    "enabled": true,
    "fromEmail": "onboarding@resend.dev",
    "resend": {
      "enabled": true,
      "apiKeySet": true
    }
  }
}
```

### Step 6: Test Email Sending

```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d '{"email":"salihalammari91@gmail.com","type":"needs_info"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Test needs_info notification sent to salihalammari91@gmail.com"
}
```

### Step 7: Check Render Logs

Go to Render Dashboard → Logs and look for:

**✅ Success:**
```
[EMAIL] Attempting to send email to salihalammari91@gmail.com via Resend...
[EMAIL] ✅ Email notification sent successfully to salihalammari91@gmail.com... Resend ID: re_...
```

**❌ Error:**
```
[EMAIL] ❌ Failed to send email notification via Resend...
```

### Step 8: Check Your Email

1. Check inbox: `salihalammari91@gmail.com`
2. Check spam folder (shouldn't be there with Resend)
3. Email should arrive within seconds

## 🎯 How It Works

The system checks email providers in this order:
1. **Gmail** (if `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set)
2. **Resend** (if `RESEND_API_KEY` is set) ← Takes priority if both are set
3. **None** (if neither is configured)

Since Resend is more reliable, it's recommended to use Resend for production.

## 📊 Resend Dashboard

After sending emails, you can:
1. Go to [Resend Dashboard](https://resend.com/emails)
2. See all sent emails
3. Check delivery status
4. View email content
5. See any errors

## 🔧 Troubleshooting

### If Email Not Sending:

1. **Check API Key:**
   - Make sure it starts with `re_`
   - No spaces or extra characters
   - Copy the full key

2. **Check Render Logs:**
   - Look for `[EMAIL]` messages
   - Check for error messages

3. **Verify Configuration:**
   ```bash
   curl "https://mimmarketplace.onrender.com/notifications/config"
   ```
   - Should show `"provider": "resend"`
   - Should show `"enabled": true`

4. **Check Resend Dashboard:**
   - Go to Resend → Emails
   - See if email was attempted
   - Check for errors

### If You See "Domain not verified":

For testing, `onboarding@resend.dev` works immediately.

For production with your own domain:
1. Go to Resend → Domains
2. Add your domain
3. Add DNS records
4. Wait for verification
5. Update `NOTIFICATION_FROM_EMAIL` to `noreply@yourdomain.com`

## ✅ Summary

**Steps:**
1. ✅ Sign up at Resend.com
2. ✅ Get API key
3. ✅ Set `RESEND_API_KEY` in Render
4. ✅ Set `NOTIFICATION_FROM_EMAIL` = `onboarding@resend.dev`
5. ✅ Redeploy
6. ✅ Test

**Benefits:**
- ✅ More reliable than Gmail
- ✅ Better for production
- ✅ Free tier: 3,000 emails/month
- ✅ No App Password needed
- ✅ Better deliverability

**You're all set!** Resend will handle your email notifications reliably. 🎉

