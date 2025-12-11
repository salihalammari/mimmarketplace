# 🔗 Get Your Make.com Webhook URL

## Step 1: Get Webhook URL from Make.com

1. **Go to:** https://www.make.com
2. **Open your scenario** (or create a new one)
3. **Click on the "Webhooks" module** (the first module, usually the trigger)
4. **You'll see the webhook URL** - it looks like:
   ```
   https://hook.make.com/xxxxxxxxxxxxx
   ```
5. **Copy this URL** - you'll need it!

## Step 2: Test the Webhook Directly

Once you have your actual webhook URL, test it:

```bash
curl -X POST "https://hook.make.com/YOUR_ACTUAL_WEBHOOK_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+212664990829",
    "message": "Test message from backend"
  }'
```

**Replace `YOUR_ACTUAL_WEBHOOK_ID` with your actual webhook URL from Make.com!**

## Step 3: Check Make.com Scenario

1. **Go to your Make.com scenario**
2. **Turn it ON** (toggle switch at the top)
3. **Check the execution logs** - you should see the webhook received the data
4. **Check if WhatsApp message was sent**

## Step 4: Add to Render

Once the webhook works:

1. **Render Dashboard → mimmarketplace → Environment**
2. Find `WHATSAPP_WEBHOOK_URL`
3. **Set it to your Make.com webhook URL:**
   ```
   https://hook.make.com/YOUR_ACTUAL_WEBHOOK_ID
   ```
4. Click **"Save Changes"**

## Step 5: Manual Deploy

1. **Render Dashboard → mimmarketplace**
2. Click **"Manual Deploy"**
3. Wait **3-5 minutes**

## Step 6: Test from Backend

After deployment, test the full flow:

```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "salihalammari91@gmail.com",
    "type": "needs_info"
  }'
```

**Expected:**
- ✅ Check Render logs for `[WHATSAPP] ✅` messages
- ✅ Check Make.com scenario execution
- ✅ Check WhatsApp for the message

## 📋 Quick Checklist

- [ ] ✅ Make.com scenario created
- [ ] ✅ Webhook module added and URL copied
- [ ] ✅ WhatsApp Business API module configured
- [ ] ✅ Scenario turned ON
- [ ] ✅ Webhook tested directly (Step 2)
- [ ] ✅ `WHATSAPP_WEBHOOK_URL` set in Render
- [ ] ✅ Manual Deploy done
- [ ] ✅ Test notification sent from backend

## 🔍 How to Find Webhook URL in Make.com

1. **Open your scenario**
2. **Click on the first module** (usually "Webhooks" or "Custom webhook")
3. **Look for "Webhook URL"** or "Copy webhook URL" button
4. **Copy the URL** - it should start with `https://hook.make.com/`

## 💡 Example Webhook URL Format

Your webhook URL should look like:
```
https://hook.make.com/abc123def456ghi789
```

**NOT:**
- `YOUR_MAKECOM_WEBHOOK_URL` (placeholder)
- `https://make.com/webhook/...` (wrong format)
- `http://hook.make.com/...` (should be https)

## 🎯 Next Steps

1. **Get your actual webhook URL from Make.com**
2. **Test it with the curl command above** (replace the placeholder)
3. **Add it to Render** as `WHATSAPP_WEBHOOK_URL`
4. **Deploy and test**

**Once you have your actual webhook URL, replace `YOUR_MAKECOM_WEBHOOK_URL` in the curl command!**

