# 🔴 Fix: Resend 403 Error - Domain Not Verified

## Problem Identified

From your Resend dashboard:
- ✅ **API Key:** Working (last used 15 minutes ago)
- ❌ **Domain:** `mimmarketplace.com` status = **"Not Started"** (not verified)
- ❌ **Logs:** Showing `403` errors for `/emails` endpoint

**Root Cause:** Resend requires domain verification to send emails from custom domains. Since `mimmarketplace.com` is not verified, all emails from `noreply@mimmarketplace.com` are being rejected with `403 Forbidden`.

## ✅ Quick Fix: Use Resend's Test Domain

**This works immediately without domain verification!**

### Step 1: Update NOTIFICATION_FROM_EMAIL in Render

1. Go to: **Render Dashboard → mimmarketplace → Environment**
2. Find `NOTIFICATION_FROM_EMAIL`
3. **Change it from:**
   ```
   noreply@mimmarketplace.com
   ```
   **To:**
   ```
   onboarding@resend.dev
   ```
4. Click **"Save Changes"**

### Step 2: Manual Deploy

1. **Render Dashboard → mimmarketplace**
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"**
4. Wait **3-5 minutes**

### Step 3: Test Again

```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d '{"email":"salihalammari91@gmail.com","type":"needs_info"}'
```

**Expected:**
- ✅ No more `403` errors in Resend logs
- ✅ Email delivered to inbox (check spam folder too)

## 🔧 Alternative: Verify Your Domain (Long-term Solution)

If you want to use `noreply@mimmarketplace.com`, you need to verify the domain:

### Step 1: Start Domain Verification in Resend

1. Go to: **Resend Dashboard → Domains**
2. Click on `mimmarketplace.com`
3. Click **"Verify Domain"** or **"Start Verification"**

### Step 2: Add DNS Records

Resend will provide DNS records to add:
- **SPF record** (TXT)
- **DKIM record** (TXT)
- **DMARC record** (TXT) - Optional but recommended

### Step 3: Add Records to Your Domain

1. Go to your domain registrar (where you bought `mimmarketplace.com`)
2. Access DNS management
3. Add the TXT records provided by Resend
4. Wait for DNS propagation (can take up to 48 hours, usually 1-2 hours)

### Step 4: Verify in Resend

1. Go back to **Resend Dashboard → Domains**
2. Click **"Verify"** or wait for automatic verification
3. Status should change to **"Verified"** (green)

### Step 5: Update NOTIFICATION_FROM_EMAIL Back

Once verified:
1. **Render Dashboard → Environment**
2. Change `NOTIFICATION_FROM_EMAIL` back to:
   ```
   noreply@mimmarketplace.com
   ```
3. **Manual Deploy**

## 📋 Quick Comparison

| Solution | Time | Difficulty | Works Immediately |
|----------|------|-----------|-------------------|
| Use `onboarding@resend.dev` | 5 minutes | Easy | ✅ Yes |
| Verify domain | 1-48 hours | Medium | ❌ No (DNS propagation) |

## 🎯 Recommended Action

**For immediate fix:** Use `onboarding@resend.dev` (works right away)

**For production:** Verify your domain and use `noreply@mimmarketplace.com` (better branding)

## ✅ After Fix

Once you update `NOTIFICATION_FROM_EMAIL` to `onboarding@resend.dev`:

1. **Check Resend logs** - Should show `200` status instead of `403`
2. **Test email** - Should arrive in inbox
3. **Check spam folder** - Just in case

**The `403` errors will stop immediately after changing to `onboarding@resend.dev`!**

