# Check Render Logs - Email Debugging

## ✅ Configuration is Correct

Your configuration shows:
- ✅ Gmail: **Enabled**
- ✅ User: `salihalammari91@gmail.com`
- ✅ App Password: **Set**

**But email not received!** The logs will tell us why.

## 🔍 Step 1: Check Render Logs (CRITICAL!)

1. Go to **Render Dashboard**
2. Select **mimmarketplace** service
3. Click **Logs** tab
4. Look for messages with `[EMAIL]` tag

### What to Look For:

**✅ Success (Email Sent):**
```
[EMAIL] Attempting to send email to salihalammari91@gmail.com via Gmail...
[EMAIL] ✅ Email notification sent successfully to salihalammari91@gmail.com...
```

**❌ Error (Email Failed):**
```
[EMAIL] Attempting to send email to salihalammari91@gmail.com via Gmail...
[EMAIL] ❌ Failed to send email notification via Gmail... Invalid login
```

**⚠️ Warning (Not Configured):**
```
[EMAIL] ⚠️ Resend client not initialized...
```

## 🔧 Common Issues Based on Logs

### If Logs Show "Invalid login" or "Authentication failed":

**Problem:** Gmail App Password is wrong

**Fix:**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Go to **App passwords**
3. Delete the old app password
4. Generate a new one for "Mail"
5. Copy the 16-character password (remove spaces)
6. Update in Render → Environment → `GMAIL_APP_PASSWORD`
7. **Manual Deploy** in Render
8. Test again

### If Logs Show "Email sent successfully" but no email:

**Problem:** Email might be in spam or delayed

**Fix:**
1. Check **Spam folder** in Gmail
2. Check **All Mail** folder
3. Wait 1-2 minutes (Gmail can be slow)
4. Search for: "معلومات إضافية مطلوبة" or "MIM Marketplace"

### If Logs Show No `[EMAIL]` Messages:

**Problem:** Service might not have redeployed after code changes

**Fix:**
1. Go to Render Dashboard
2. Click **Manual Deploy**
3. Wait for deployment
4. Test again

### If Logs Show "Connection timeout":

**Problem:** Network/firewall issue

**Fix:**
1. Check Supabase network settings
2. Verify Render can reach Gmail SMTP servers
3. Try using Resend instead (see below)

## 🧪 Test Again After Checking Logs

After identifying the issue from logs:

```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d '{"email":"salihalammari91@gmail.com","type":"needs_info"}'
```

Then immediately check Render logs again.

## 🔄 Alternative: Switch to Resend

If Gmail continues to have issues, you can use Resend instead:

1. Go to [Resend.com](https://resend.com)
2. Sign up (free tier: 3,000 emails/month)
3. Get API key
4. In Render → Environment:
   - Set `RESEND_API_KEY` = your Resend API key
   - Set `NOTIFICATION_FROM_EMAIL` = `onboarding@resend.dev` (for testing)
5. Remove or leave `GMAIL_USER` and `GMAIL_APP_PASSWORD` (Resend takes priority)
6. Redeploy
7. Test again

## 📋 Quick Action Items

1. **Check Render logs** (most important!)
2. **Look for `[EMAIL]` messages**
3. **Identify the error** from logs
4. **Fix based on error** (see above)
5. **Redeploy** if you changed env vars
6. **Test again**
7. **Check Spam folder**

## 🎯 Most Likely Issue

Based on your situation:
- ✅ Configuration is correct
- ✅ API returns success
- ❌ Email not received

**Most likely:** Gmail App Password is incorrect or email is in Spam folder.

**Action:** Check Render logs first - they will tell you exactly what's wrong!

