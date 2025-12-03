# Quick Fix: Email Domain Error

## ❌ Problem
Resend error: `"The mimmarketplace.com domain is not verified"` - Status 403

## ✅ Quick Fix (2 minutes)

I've updated `render.yaml` to use Resend's test domain. Now you need to:

### Option 1: Update in Render Dashboard (Recommended)

1. Go to Render Dashboard → Your Service → Environment
2. Find `NOTIFICATION_FROM_EMAIL`
3. Change value to: `onboarding@resend.dev`
4. Click **"Save Changes"**
5. Service will auto-redeploy

### Option 2: Push Updated Code

The `render.yaml` is already updated. Just push to GitHub:

```bash
git add render.yaml
git commit -m "fix: use Resend test domain for email notifications"
git push origin main
```

## ✅ After Fixing

**Test email again:**
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"needs_info\"}"
```

**Check Resend Logs:**
- Go to [https://resend.com/logs](https://resend.com/logs)
- Should see **200 OK** instead of 403 ✅
- Email should be sent successfully

**Check Your Email:**
- Email will come from: `onboarding@resend.dev`
- Should arrive in inbox (check spam if not)

## 🎯 For Production Later

When ready for production:
1. Verify your domain in Resend: [https://resend.com/domains](https://resend.com/domains)
2. Add DNS records Resend provides
3. Wait for verification
4. Change `NOTIFICATION_FROM_EMAIL` back to: `noreply@mimmarketplace.com`

## 🚀 Ready!

After updating `NOTIFICATION_FROM_EMAIL` to `onboarding@resend.dev`, emails will work immediately!

