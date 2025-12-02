# How to Get WhatsApp Webhook URL from Make.com

## 🎯 Step-by-Step Guide

### Step 1: Sign Up for Make.com (Free)

1. Go to [https://make.com](https://make.com)
2. Click **"Sign up"** (top right)
3. Choose **"Free"** plan (1,000 operations/month - perfect for testing!)
4. Sign up with:
   - Google account, OR
   - Email address
5. Verify your email if needed

### Step 2: Create a New Scenario

1. After logging in, you'll see the dashboard
2. Click the big **"+ Create a new scenario"** button (or the **"+"** icon)
3. You'll see a blank scenario canvas

### Step 3: Add Webhook Trigger

1. In the scenario canvas, click the **"+"** button or search for modules
2. Search for: **"Webhooks"**
3. Select: **"Webhooks"** → **"Custom webhook"**
4. Click **"Add"**

### Step 4: Configure Webhook

1. You'll see a webhook configuration screen
2. Click **"Save"** button (don't change anything yet)
3. **IMPORTANT:** After saving, Make.com will generate a webhook URL
4. **Copy the webhook URL** - it looks like:
   ```
   https://hook.integromat.com/xxxxxxxxxxxxxxxx
   ```
   OR
   ```
   https://hook.us1.make.com/xxxxxxxxxxxxxxxx
   ```

### Step 5: Add WhatsApp Action

1. Click the **"+"** button again (to add another module)
2. Search for: **"WhatsApp"** or **"ChatAPI"**
3. Choose one of these options:

   **Option A: ChatAPI (Recommended)**
   - Search: **"ChatAPI"**
   - Select: **"ChatAPI"** → **"Send a message"**
   - You'll need ChatAPI credentials (sign up at [chat-api.com](https://chat-api.com))

   **Option B: WhatsApp Business API**
   - Search: **"WhatsApp"**
   - Select: **"WhatsApp Business"** → **"Send a message"**
   - Requires WhatsApp Business API setup

   **Option C: Simple HTTP Request (If you have another WhatsApp service)**
   - Search: **"HTTP"**
   - Select: **"HTTP"** → **"Make a request"**
   - Configure to call your WhatsApp API

### Step 6: Map the Data

1. In the WhatsApp/ChatAPI module, you'll see fields to fill:
2. **To/Phone Number:** Click the field, then select `{{phone}}` from the webhook data
3. **Message/Text:** Click the field, then select `{{message}}` from the webhook data
4. Click **"OK"** to save

### Step 7: Save and Activate

1. Click **"Save"** button (top right)
2. Click **"Run once"** to test (optional)
3. **Turn on the scenario** - Toggle the switch at the bottom to **"ON"** (green)

### Step 8: Copy Your Webhook URL

Your webhook URL is now ready! It should look like:
```
https://hook.integromat.com/xxxxxxxxxxxxxxxx
```

OR (newer Make.com URLs):
```
https://hook.us1.make.com/xxxxxxxxxxxxxxxx
```

### Step 9: Add to Render

1. Go to Render Dashboard → Your Service → Environment
2. Click **"Add Environment Variable"**
3. Key: `WHATSAPP_WEBHOOK_URL`
4. Value: Paste your webhook URL (e.g., `https://hook.integromat.com/xxxxxxxxxxxxxxxx`)
5. Click **"Save Changes"**
6. **Redeploy** your service (or it will auto-redeploy)

## 📸 Visual Guide

### What You'll See in Make.com:

```
┌─────────────────────────────────────┐
│  Scenario: WhatsApp Notifications   │
├─────────────────────────────────────┤
│                                     │
│  [Webhooks] → [ChatAPI/WhatsApp]   │
│     ↓              ↓                │
│  Receives      Sends WhatsApp       │
│  webhook       message              │
│                                     │
└─────────────────────────────────────┘
```

## 🎯 Quick Alternative: Test Webhook First

If you want to test the webhook without WhatsApp first:

1. **Create webhook** (Steps 1-4 above)
2. **Add "HTTP" module** instead of WhatsApp
3. **Configure:** Method = POST, URL = `https://webhook.site/your-unique-url`
4. **Test:** Send a test request and see it on webhook.site
5. **Then replace** with WhatsApp module

## 🔍 Finding Your Webhook URL Later

If you need to find your webhook URL again:

1. Go to Make.com dashboard
2. Open your scenario
3. Click on the **Webhooks** module
4. The URL is shown in the module details
5. You can also click **"Show info"** to see the URL

## ✅ Verification

After adding the webhook URL to Render:

1. **Test it:**
   ```bash
   curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
     -H "Content-Type: application/json" \
     -d "{\"status\":\"qualified\"}"
   ```

2. **Check Make.com:**
   - Go to your scenario
   - Click **"Runs"** tab
   - You should see a new execution
   - Check if it succeeded

3. **Check WhatsApp:**
   - You should receive the message on the phone number from the application

## 🐛 Troubleshooting

**"Can't find Webhooks module":**
- Make sure you're on the free plan (webhooks are available)
- Search for "Webhooks" in the module search

**"Webhook URL not working":**
- Make sure scenario is **turned ON** (green toggle)
- Verify the URL is copied completely
- Check for typos in the URL

**"WhatsApp not sending":**
- Verify WhatsApp module is configured correctly
- Check phone number format in Make.com
- Review Make.com execution logs for errors

## 💡 Pro Tips

1. **Name your scenario:** "MIM Marketplace WhatsApp Notifications"
2. **Test first:** Use webhook.site to test before adding WhatsApp
3. **Monitor usage:** Free tier = 1,000 operations/month
4. **Add error handling:** Make.com can send you email alerts on failures

## 🎉 That's It!

Once you have the webhook URL, add it to Render and you're ready to test!

