# Deploy and Test Email Notifications

## 🚀 Step 1: Push to GitHub

The code is committed. Now push to GitHub:

```bash
git push origin main
```

**When prompted:**
- Username: `salihalammari`
- Password: Use your GitHub Personal Access Token (not your password)

**Don't have a token?** See `FIX_GITHUB_AUTH.md` for instructions.

## ⏳ Step 2: Wait for Render to Deploy

1. Go to Render Dashboard → Your Service
2. You'll see a new deployment starting
3. Wait for status to change to **"Live"** (green)
4. Usually takes 2-5 minutes

## ✅ Step 3: Verify Deployment

Check Render logs for:
- `Email notifications enabled via Resend` ✅
- No errors about the new endpoint

## 🧪 Step 4: Test Email Notification

Once deployed, test with:

```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"needs_info\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Test needs_info notification sent to salihalammari91@gmail.com",
  "email": "salihalammari91@gmail.com",
  "type": "needs_info"
}
```

## ✅ Step 5: Verify Email Sent

1. **Check Render Logs:**
   - Look for: `Email notification sent to salihalammari91@gmail.com`

2. **Check Your Email:**
   - Go to: `salihalammari91@gmail.com`
   - Check inbox and spam folder
   - Look for email from "MIM Marketplace"
   - Subject: `معلومات إضافية مطلوبة - MIM Marketplace`

## 🎯 Test All Notification Types

```bash
# Application Received
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"received\"}"

# Qualified
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"qualified\"}"

# Rejected
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"rejected\"}"

# Badge Activated
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"badge_activated\"}"
```

## 🐛 If Still Getting 404

**Check:**
1. Service is "Live" in Render
2. Latest deployment completed successfully
3. No errors in Render logs
4. Wait a few more minutes (deployment might still be in progress)

**Verify endpoint exists:**
```bash
# Check if service is running
curl "https://mimmarketplace.onrender.com/health"
```

Should return: `{"status":"ok",...}`

## ✅ Success Checklist

- [ ] Code pushed to GitHub
- [ ] Render deployment completed
- [ ] Service status is "Live"
- [ ] Test endpoint returns success
- [ ] Email received in inbox
- [ ] Email content is correct (Arabic)

## 🎉 Ready!

Once deployed, the test endpoint will work and you can test email notifications directly!
