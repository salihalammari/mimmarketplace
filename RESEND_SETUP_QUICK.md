# Quick Setup: Switch to Resend

## 🚀 Fast Setup (5 minutes)

### Step 1: Get Resend API Key

1. Go to [Resend.com](https://resend.com) and sign up
2. Go to **API Keys** → **Create API Key**
3. Name: `MIM Marketplace`
4. Copy the key (starts with `re_`)

### Step 2: Update Render Environment

Go to **Render Dashboard → mimmarketplace → Environment**:

**Add/Update:**
```
RESEND_API_KEY = re_... (your Resend API key)
NOTIFICATION_FROM_EMAIL = onboarding@resend.dev
```

**Optional (can leave as is):**
- `GMAIL_USER` - Leave it (Resend takes priority now)
- `GMAIL_APP_PASSWORD` - Leave it

### Step 3: Redeploy

1. Click **Save Changes**
2. Click **Manual Deploy** → **Deploy latest commit**
3. Wait 3-5 minutes

### Step 4: Test

```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d '{"email":"salihalammari91@gmail.com","type":"needs_info"}'
```

**Check:**
- ✅ Render logs: `[EMAIL] ✅ Email notification sent successfully via Resend...`
- ✅ Your inbox: Email should arrive within seconds

## ✅ Done!

Resend is now your email provider. It's more reliable than Gmail for production.

**Benefits:**
- ✅ 3,000 emails/month free
- ✅ Better deliverability
- ✅ No App Password needed
- ✅ Detailed logs in Resend dashboard

See `SWITCH_TO_RESEND.md` for detailed instructions.

