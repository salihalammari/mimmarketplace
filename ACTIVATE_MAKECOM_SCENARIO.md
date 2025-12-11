# ✅ Activate Make.com Scenario

## 🔴 Current Problem

**Warning:** "We cannot auto-retry the scheduled incomplete executions because your scenario is not active."

**Meaning:** Your Make.com scenario is **turned OFF**, so it's not receiving webhooks from your backend.

## ✅ Quick Fix

### Step 1: Activate the Scenario

**In the Make.com interface you're viewing:**

1. **Click the "Activate scenario" button** (top right of the orange warning banner)
2. **Or:** Go to the scenario main page and toggle "Active" to ON (top right, purple toggle)

### Step 2: Verify Scenario is Active

After activating, you should see:
- ✅ No more orange warning banner
- ✅ Scenario shows "Active" status (green/purple indicator)
- ✅ "Active" toggle is ON (top right)

### Step 3: Test the Webhook

After activating, test if it works:

```bash
curl -X POST "YOUR_MAKECOM_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+212664990829",
    "message": "Test message after activation"
  }'
```

**Check Make.com:**
- ✅ Go to scenario → **History** tab
- ✅ Should see a new execution (green "Success")
- ✅ Check if WhatsApp message was sent

### Step 4: Test from Backend

After scenario is active, test from your backend:

1. **Go to admin dashboard:** https://mimmarketplace.onrender.com/admin
2. **Change status** to `needs_info`, `qualified`, `rejected`, or `badge_activated`
3. **Check:**
   - ✅ Render logs for `[WHATSAPP] ✅` messages
   - ✅ Make.com History shows execution
   - ✅ WhatsApp receives message

## 🔍 Why This Happened

**Make.com scenarios must be "Active" to receive webhooks:**
- When scenario is OFF → Webhooks are ignored
- When scenario is ON → Webhooks are processed

**The error you saw earlier:**
```
There is no scenario listening for this webhook
```

**This was because the scenario was not active!**

## ✅ After Activation

Once the scenario is active:

1. **Webhooks will be received** from your backend
2. **WhatsApp messages will be sent** automatically
3. **History will show executions** (green "Success")
4. **No more "incomplete executions"** warnings

## 📋 Quick Checklist

- [ ] ✅ Click "Activate scenario" button
- [ ] ✅ Verify scenario shows "Active" status
- [ ] ✅ Test webhook directly
- [ ] ✅ Check Make.com History for execution
- [ ] ✅ Test from backend (change status)
- [ ] ✅ Check WhatsApp for message

## 🎯 Next Steps

1. **Activate the scenario** (click the button)
2. **Test webhook** directly
3. **Test from backend** (change status in admin dashboard)
4. **Verify WhatsApp** message is received

**Once activated, your WhatsApp notifications will work!**

## 💡 Pro Tip

**Always check:**
- Scenario is "Active" (not just saved)
- Webhook URL matches between Render and Make.com
- WhatsApp module is configured correctly

**The scenario must be ACTIVE to receive webhooks!**

