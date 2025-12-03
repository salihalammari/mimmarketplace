# Fix Resend Domain Verification Error

## ❌ Problem

Resend is showing error:
```
"The mimmarketplace.com domain is not verified. Please, add and verify your domain on https://resend.co"
```

Status: **403 Forbidden**

## ✅ Solution: Two Options

### Option 1: Use Resend Test Domain (Quick Fix - 2 minutes)

**For testing, use Resend's test domain:**

1. Go to Render Dashboard → Your Service → Environment
2. Find `NOTIFICATION_FROM_EMAIL`
3. Change it to: `onboarding@resend.dev`
4. Save and redeploy

**This works immediately for testing!**

### Option 2: Verify Your Domain (Production - 10 minutes)

**For production, verify your domain:**

1. **Go to Resend Domains:**
   - [https://resend.com/domains](https://resend.com/domains)
   - Click **"Add Domain"**

2. **Enter Your Domain:**
   - Domain: `mimmarketplace.com` (or your actual domain)
   - Click **"Add"**

3. **Add DNS Records:**
   Resend will show you DNS records to add:
   - **SPF Record** (TXT)
   - **DKIM Record** (TXT)
   - **DMARC Record** (TXT) - Optional

4. **Add to Your Domain Provider:**
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Go to DNS settings
   - Add the TXT records Resend provides
   - Save changes

5. **Wait for Verification:**
   - Usually takes 5-10 minutes
   - Resend will verify automatically
   - Status will change to "Verified" ✅

6. **Update Render:**
   - Change `NOTIFICATION_FROM_EMAIL` to: `noreply@mimmarketplace.com`
   - Save and redeploy

## 🚀 Quick Fix (Use Test Domain Now)

**Immediate solution for testing:**

1. Render Dashboard → Environment
2. Change `NOTIFICATION_FROM_EMAIL` to: `onboarding@resend.dev`
3. Save
4. Redeploy (or wait for auto-deploy)

**Then test again:**
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"needs_info\"}"
```

## ✅ After Fixing

**Check Resend Logs:**
- Go to [https://resend.com/logs](https://resend.com/logs)
- Should see **200 OK** instead of 403
- Email should be sent successfully

**Check Your Email:**
- Email should arrive in inbox
- From: `onboarding@resend.dev` (if using test domain)
- Or: `noreply@mimmarketplace.com` (if domain verified)

## 🎯 Recommended

**For Now (Testing):**
- Use `onboarding@resend.dev` - Works immediately

**For Production:**
- Verify your domain in Resend
- Use `noreply@yourdomain.com`

## 🐛 Still Having Issues?

**If emails still not sending:**
- Check `RESEND_API_KEY` is correct
- Verify API key has proper permissions
- Check Resend account status
- Review Resend logs for other errors

