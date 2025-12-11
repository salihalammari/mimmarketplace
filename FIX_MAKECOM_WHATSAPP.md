# 🔧 Fix Make.com WhatsApp - Not Receiving Messages

## 🔍 Issue Identified

From your Make.com scenario, I see:
- ✅ WhatsApp Business Cloud module (Send a Message) - **Correct**
- ❌ HTTP (legacy) module - **This is wrong!**

**Problem:** You're using an **HTTP module** (for making requests OUT), but you need a **Webhook module** (for receiving requests IN from your backend).

## ✅ Fix: Add Webhook Module as Trigger

### Step 1: Add Webhook Module to Make.com Scenario

1. **Go to your Make.com scenario**
2. **Delete or disable the HTTP module** (if it's the first module)
3. **Click "+" to add a new module**
4. **Search for "Webhooks"** → Select **"Custom webhook"**
5. **Click "Add"**
6. **Click "Save"** - This creates the webhook URL
7. **Copy the webhook URL** - It looks like:
   ```
   https://hook.make.com/xxxxxxxxxxxxx
   ```

### Step 2: Configure Webhook Module

The webhook module should be:
- **Position:** First module (trigger)
- **Type:** Custom webhook
- **Method:** POST (default)
- **Data structure:** JSON

### Step 3: Configure WhatsApp Module

Your WhatsApp Business Cloud module should receive data from the webhook:

1. **Click on the WhatsApp Business Cloud module**
2. **Configure the fields:**
   - **Phone Number ID:** Your WhatsApp Business phone number ID
   - **To:** `{{1.phone}}` (from webhook data)
   - **Message:** `{{1.message}}` (from webhook data)

### Step 4: Connect Modules

1. **Connect webhook module** → **WhatsApp module**
2. **Make sure data flows:** Webhook → WhatsApp

### Step 5: Add Webhook URL to Render

1. **Render Dashboard → mimmarketplace → Environment**
2. Find `WHATSAPP_WEBHOOK_URL`
3. **Set it to your Make.com webhook URL:**
   ```
   https://hook.make.com/YOUR_ACTUAL_WEBHOOK_ID
   ```
4. Click **"Save Changes"**

### Step 6: Turn On Scenario

1. **In Make.com scenario**
2. **Toggle "Active" to ON** (top right)
3. **Make sure it's saved**

### Step 7: Manual Deploy

1. **Render Dashboard → mimmarketplace**
2. Click **"Manual Deploy"**
3. Wait **3-5 minutes**

### Step 8: Test the Webhook Directly

Test if Make.com receives the data:

```bash
curl -X POST "https://hook.make.com/YOUR_ACTUAL_WEBHOOK_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+212664990829",
    "message": "Test message from backend"
  }'
```

**Check Make.com:**
- ✅ Go to scenario → Check execution history
- ✅ Should see a new execution
- ✅ Check if WhatsApp message was sent

### Step 9: Test from Backend

After webhook is configured:

```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "salihalammari91@gmail.com",
    "type": "needs_info"
  }'
```

**Check:**
- ✅ Render logs for `[WHATSAPP] ✅` messages
- ✅ Make.com scenario execution
- ✅ WhatsApp for the message

## 🔍 Current Scenario Structure (Wrong)

```
HTTP Module → WhatsApp Module
```

**Problem:** HTTP module makes requests OUT, doesn't receive IN.

## ✅ Correct Scenario Structure

```
Webhook Module (Trigger) → WhatsApp Module (Action)
```

**How it works:**
1. Backend sends POST to webhook URL
2. Webhook module receives data
3. WhatsApp module uses the data to send message

## 📋 Data Mapping

Your backend sends:
```json
{
  "phone": "+212664990829",
  "message": "سلام [Name]👋\n\nشكرا لملء استمارة...",
  "applicationId": "uuid",
  "applicationName": "Full Name"
}
```

**In Make.com WhatsApp module:**
- **To:** `{{1.phone}}` (from webhook)
- **Message:** `{{1.message}}` (from webhook)

## 🐛 Troubleshooting

### Issue 1: Webhook Not Receiving Data
**Check:**
- Webhook URL is correct in Render
- Scenario is turned ON
- Webhook module is first (trigger)

**Fix:**
- Verify webhook URL in Make.com
- Check scenario execution history

### Issue 2: WhatsApp Module Not Getting Data
**Check:**
- Data mapping: `{{1.phone}}` and `{{1.message}}`
- Modules are connected
- WhatsApp Business API credentials are correct

**Fix:**
- Check module connections
- Verify data mapping fields

### Issue 3: Phone Number Format
**Check:**
- Phone number includes country code: `+212664990829`
- WhatsApp Business API accepts the format

**Fix:**
- Ensure phone number has `+` and country code
- Check WhatsApp Business API requirements

### Issue 4: Scenario Not Executing
**Check:**
- Scenario is turned ON (Active toggle)
- Webhook URL is accessible
- Backend is sending requests

**Fix:**
- Turn scenario ON
- Test webhook directly with curl
- Check Render logs for `[WHATSAPP]` messages

## ✅ Verification Checklist

- [ ] ✅ Webhook module added (not HTTP module)
- [ ] ✅ Webhook URL copied from Make.com
- [ ] ✅ `WHATSAPP_WEBHOOK_URL` set in Render
- [ ] ✅ WhatsApp module configured with `{{1.phone}}` and `{{1.message}}`
- [ ] ✅ Modules connected: Webhook → WhatsApp
- [ ] ✅ Scenario turned ON (Active)
- [ ] ✅ Manual Deploy done
- [ ] ✅ Webhook tested directly
- [ ] ✅ Backend test notification sent
- [ ] ✅ Checked Make.com execution history
- [ ] ✅ Checked WhatsApp for message

## 🎯 Quick Fix Summary

1. **Replace HTTP module with Webhook module** (as trigger)
2. **Get webhook URL** from Make.com
3. **Add to Render** as `WHATSAPP_WEBHOOK_URL`
4. **Configure WhatsApp module** to use `{{1.phone}}` and `{{1.message}}`
5. **Turn scenario ON**
6. **Deploy and test**

**The key issue: You need a Webhook module to RECEIVE data from your backend, not an HTTP module!**

