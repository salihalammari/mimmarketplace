# Make.com Setup - Step by Step

## 🎯 What to Configure

You're in the Webhooks section. Here's exactly what to do:

### Step 1: Add Trigger (Custom Webhook)

1. **Click on "Custom webhook"** (the pink icon in TRIGGERS section)
2. Click **"Add"** or drag it to the canvas
3. Click **"Save"** button (bottom left - floppy disk icon)
4. **IMPORTANT:** After saving, Make.com will show you a webhook URL
5. **Copy that URL** - it looks like:
   ```
   https://hook.integromat.com/xxxxxxxxxxxxxxxx
   ```
   OR
   ```
   https://hook.us1.make.com/xxxxxxxxxxxxxxxx
   ```

### Step 2: Add WhatsApp Action

1. Click the **"+"** button (next to the webhook module you just added)
2. Search for: **"ChatAPI"** or **"WhatsApp"**
3. Choose one:

   **Option A: ChatAPI (Recommended)**
   - Search: **"ChatAPI"**
   - Select: **"ChatAPI"** → **"Send a message"**
   - You'll need ChatAPI account (sign up at chat-api.com)

   **Option B: WhatsApp Business**
   - Search: **"WhatsApp Business"**
   - Select: **"WhatsApp Business"** → **"Send a message"**
   - Requires WhatsApp Business API setup

   **Option C: Simple HTTP Request (If you have another WhatsApp service)**
   - Search: **"HTTP"**
   - Select: **"HTTP"** → **"Make a request"**
   - Configure to call your WhatsApp API

### Step 3: Map the Data

In the WhatsApp module, you'll see fields:

1. **To/Phone Number:**
   - Click the field
   - Select: `{{phone}}` from the webhook data
   - OR type: `{{1.phone}}`

2. **Message/Text:**
   - Click the field
   - Select: `{{message}}` from the webhook data
   - OR type: `{{1.message}}`

3. Click **"OK"** to save

### Step 4: Save and Activate

1. Click **"Save"** button (bottom left - floppy disk icon)
2. Click **"Run once"** to test (optional)
3. **Turn ON the scenario** - Toggle the switch at bottom (should show "ON" in green)

### Step 5: Copy Webhook URL

Your webhook URL is now ready! Copy it from:
- The webhook module details
- Or click on the webhook module → "Show info"

It should look like:
```
https://hook.integromat.com/xxxxxxxxxxxxxxxx
```

### Step 6: Add to Render

1. Go to Render Dashboard → Your Service → Environment
2. Add new variable:
   - Key: `WHATSAPP_WEBHOOK_URL`
   - Value: Paste your webhook URL
3. Click **"Save Changes"**
4. **Redeploy** your service

## ✅ Quick Summary

**What you're configuring:**
1. ✅ **Custom webhook** (TRIGGER) - Receives data from your backend
2. ✅ **ChatAPI/WhatsApp** (ACTION) - Sends WhatsApp message

**Data flow:**
```
Your Backend → Webhook → Make.com → WhatsApp → User's Phone
```

## 🧪 Test It

After configuring:

1. **Test webhook first** (without WhatsApp):
   - Use [webhook.site](https://webhook.site) to test
   - Send test data to your webhook URL
   - See if Make.com receives it

2. **Then test with WhatsApp:**
   ```bash
   curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"test@example.com\",\"type\":\"qualified\"}"
   ```

## 🐛 Common Issues

**"Can't find WhatsApp module":**
- Search for "ChatAPI" instead
- Or use "HTTP" module to call WhatsApp API directly

**"Webhook not receiving data":**
- Make sure scenario is **turned ON**
- Check webhook URL is correct
- Verify your backend is sending to the correct URL

**"WhatsApp not sending":**
- Check WhatsApp module is configured correctly
- Verify phone number format: `+212612345678`
- Check Make.com execution logs for errors

## 💡 Pro Tip

**Start Simple:**
1. First, just add the webhook trigger
2. Test it with webhook.site
3. Then add WhatsApp action
4. Test the full flow

This way you can debug step by step!

