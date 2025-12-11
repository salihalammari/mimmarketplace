# 🔍 Debug: Email Not Received

## ✅ API Response
The test endpoint returned:
```json
{
  "success": true,
  "message": "Test needs_info notification sent to salihalammari91@gmail.com",
  "email": "salihalammari91@gmail.com",
  "type": "needs_info"
}
```

**This means the API accepted the request, but the email might not have been sent successfully.**

## 🔍 Check Render Logs

**IMPORTANT:** Check Render logs to see what actually happened:

1. Go to: **Render Dashboard → mimmarketplace → Logs**
2. Look for recent logs with `[EMAIL]` tags
3. You should see one of these:

**✅ Success:**
```
[EMAIL] ✅ Email notification sent successfully to salihalammari91@gmail.com...
```

**❌ Failure:**
```
[EMAIL] ❌ Failed to send email notification via Resend/Gmail...
```

## 🎯 Common Issues & Fixes

### Issue 1: Email in Spam Folder
**Check your spam/junk folder** - Emails from `noreply@mimmarketplace.com` might be filtered.

**Fix:**
- Check spam folder
- Mark as "Not Spam" if found
- Add sender to contacts

### Issue 2: Resend Domain Not Verified
If using Resend, the domain `mimmarketplace.com` must be verified.

**Check:**
- Go to: https://resend.com/domains
- Check if `mimmarketplace.com` is verified

**Fix:**
- If not verified, change `NOTIFICATION_FROM_EMAIL` in Render to:
  ```
  onboarding@resend.dev
  ```
- Or verify your domain in Resend

### Issue 3: Gmail App Password Wrong
If using Gmail, the App Password might be incorrect.

**Check:**
- Render Dashboard → Environment → `GMAIL_APP_PASSWORD`
- Should be a 16-character password (no spaces)

**Fix:**
1. Go to: https://myaccount.google.com/apppasswords
2. Generate a new App Password
3. Update `GMAIL_APP_PASSWORD` in Render
4. Manual Deploy

### Issue 4: Email Provider Not Configured
Check which provider is being used.

**Check:**
```bash
curl "https://mimmarketplace.onrender.com/notifications/config"
```

**Look for:**
- `"email": { "provider": "resend" }` or `"gmail"`
- `"enabled": true`

**Fix:**
- If `"enabled": false`, configure either:
  - `RESEND_API_KEY` in Render, OR
  - `GMAIL_USER` and `GMAIL_APP_PASSWORD` in Render

### Issue 5: Email Address Typo
Verify the email address is correct.

**Check:**
- The email in the test: `salihalammari91@gmail.com`
- Make sure it's the correct address

## 🔧 Step-by-Step Debugging

### Step 1: Check Render Logs
1. **Render Dashboard → mimmarketplace → Logs**
2. Scroll to recent entries
3. Search for `[EMAIL]`
4. Look for success (`✅`) or failure (`❌`) messages

### Step 2: Check Email Configuration
```bash
curl "https://mimmarketplace.onrender.com/notifications/config"
```

Verify:
- Email provider is enabled
- `fromEmail` is set correctly
- API keys are configured

### Step 3: Test with Different Email
Try sending to a different email address to rule out address-specific issues:

```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d '{"email":"your-other-email@gmail.com","type":"needs_info"}'
```

### Step 4: Check Spam Folder
- Check spam/junk folder in Gmail
- Check "All Mail" folder
- Check "Promotions" tab (if using Gmail)

### Step 5: Verify Resend Domain (If Using Resend)
1. Go to: https://resend.com/domains
2. Check if `mimmarketplace.com` is verified
3. If not, either:
   - Verify the domain, OR
   - Change `NOTIFICATION_FROM_EMAIL` to `onboarding@resend.dev`

## 📋 Quick Checklist

- [ ] ✅ Check Render logs for `[EMAIL]` messages
- [ ] ✅ Check spam/junk folder
- [ ] ✅ Verify email configuration: `curl "https://mimmarketplace.onrender.com/notifications/config"`
- [ ] ✅ Check if Resend domain is verified (if using Resend)
- [ ] ✅ Verify Gmail App Password is correct (if using Gmail)
- [ ] ✅ Test with different email address
- [ ] ✅ Check "All Mail" and "Promotions" tabs in Gmail

## 🎯 Most Likely Issues

1. **Email in spam folder** (40%)
2. **Resend domain not verified** (30%)
3. **Gmail App Password wrong** (20%)
4. **Email provider not configured** (10%)

## 💡 Next Steps

1. **Check Render logs first** - This will tell you exactly what happened
2. **Check spam folder** - Most common issue
3. **Verify email configuration** - Make sure provider is enabled
4. **Check domain verification** - If using Resend, domain must be verified

**Start by checking Render logs - they will show the exact error or success message!**

