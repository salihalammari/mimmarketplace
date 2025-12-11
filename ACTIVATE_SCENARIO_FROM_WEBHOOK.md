# ✅ Fix: Webhook Active but Scenario Inactive

## 🔍 Current Status

From your Make.com webhook page:
- ✅ **Webhook status:** "Active" (green) - Good!
- ❌ **Scenario status:** "Inactive" (red) - This is the problem!

**Webhook URL:** `https://hook.eu2.make.com/ivl5u46c0mrldnoy3ve1pt66j433w7l1`

## 🔴 Problem

The webhook is active and can receive requests, but the **scenario is inactive**, so it won't process the webhooks.

## ✅ Fix Steps

### Step 1: Activate the Scenario

**From the webhook page you're viewing:**

1. **Click on the scenario link:** "Integration Webhooks, WhatsApp Business Cloud" (purple link in "Webhook's scenario" section)
2. **Or:** Go to Scenarios → Find "Integration Webhooks, WhatsApp Business Cloud"
3. **Toggle "Active" to ON** (top right, purple toggle)
4. **Or:** Click "Activate scenario" button if you see it

### Step 2: Verify Webhook URL in Render

**Your webhook URL is:**
```
https://hook.eu2.make.com/ivl5u46c0mrldnoy3ve1pt66j433w7l1
```

**Check Render:**
1. **Render Dashboard → mimmarketplace → Environment**
2. **Find `WHATSAPP_WEBHOOK_URL`**
3. **Verify it matches exactly:**
   ```
   https://hook.eu2.make.com/ivl5u46c0mrldnoy3ve1pt66j433w7l1
   ```
4. **If different, update it and Manual Deploy**

### Step 3: Verify Scenario is Active

After activating:
- ✅ Scenario status should show "Active" (green)
- ✅ No more "Inactive" (red) badge
- ✅ Scenario can now process webhooks

### Step 4: Test the Webhook

Test if it works now:

```bash
curl -X POST "https://hook.eu2.make.com/ivl5u46c0mrldnoy3ve1pt66j433w7l1" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+212664990829",
    "message": "Test message after scenario activation"
  }'
```

**Check Make.com:**
- ✅ Go to scenario → **History** tab
- ✅ Should see a new execution (green "Success")
- ✅ Check if WhatsApp message was sent

### Step 5: Test from Backend

After scenario is active:

1. **Go to admin dashboard:** https://mimmarketplace.onrender.com/admin
2. **Change status** to `needs_info`, `qualified`, `rejected`, or `badge_activated`
3. **Check:**
   - ✅ Render logs for `[WHATSAPP] ✅` messages
   - ✅ Make.com History shows execution
   - ✅ WhatsApp receives message

## 📋 Quick Checklist

- [ ] ✅ Click scenario link: "Integration Webhooks, WhatsApp Business Cloud"
- [ ] ✅ Toggle "Active" to ON in scenario
- [ ] ✅ Verify scenario shows "Active" (green)
- [ ] ✅ Verify `WHATSAPP_WEBHOOK_URL` in Render matches webhook URL
- [ ] ✅ Test webhook directly
- [ ] ✅ Test from backend (change status)
- [ ] ✅ Check WhatsApp for message

## 🎯 What You Need to Do

1. **Click the scenario link** (purple link: "Integration Webhooks, WhatsApp Business Cloud")
2. **Activate the scenario** (toggle "Active" to ON)
3. **Verify webhook URL** in Render matches: `https://hook.eu2.make.com/ivl5u46c0mrldnoy3ve1pt66j433w7l1`
4. **Test** - Change status in admin dashboard

## 💡 Important Notes

**Webhook URL to use in Render:**
```
https://hook.eu2.make.com/ivl5u46c0mrldnoy3ve1pt66j433w7l1
```

**Make sure:**
- ✅ This exact URL is in Render's `WHATSAPP_WEBHOOK_URL`
- ✅ Scenario is activated (not just webhook)
- ✅ Both webhook AND scenario must be active

**Once scenario is active, WhatsApp notifications will work!**

