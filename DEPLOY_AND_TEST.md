# Deploy and Test Email Notifications

## 🚀 Step 1: Push to GitHub

You need to push the code first. Use a GitHub Personal Access Token:

### Create Token:
1. Go to: https://github.com/settings/tokens/new
2. Name: `MIM Marketplace Backend`
3. Check: `repo` permission
4. Generate and copy token (starts with `ghp_`)

### Push Code:
```bash
git push origin main
```

When prompted:
- Username: `salihalammari`
- Password: Paste your token (NOT your GitHub password)

## ⏳ Step 2: Wait for Render to Deploy

1. Go to Render Dashboard → Your Service
2. Watch for new deployment starting
3. Wait for status to be **"Live"** (green)
4. Check logs for: `Email notifications enabled via Resend`

## 🧪 Step 3: Test Email Notification

Once deployed, test with:

```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"salihalammari91@gmail.com\",\"type\":\"needs_info\"}"
```

## ✅ Step 4: Verify

1. **Check Response:** Should return `{"success": true, ...}`
2. **Check Render Logs:** Look for `Email notification sent to...`
3. **Check Email:** Check inbox and spam folder

## 🐛 If Still Getting 404

**After pushing and deploying:**
- Wait 1-2 minutes for deployment to complete
- Verify service is "Live" in Render
- Check Render logs for any errors
- Try the endpoint again

## 📝 Alternative: Test with Existing Application

If test endpoint isn't working yet, use existing application:

```bash
# Get application ID first
curl "https://mimmarketplace.onrender.com/applications"

# Then test (replace <APP_ID>)
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"needs_info\",\"notes\":\"Test email\"}"
```

