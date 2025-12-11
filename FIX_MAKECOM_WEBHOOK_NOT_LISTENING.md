# 🔧 Fix: "There is no scenario listening for this webhook"

## 🔴 Current Problem

**Error:** `There is no scenario listening for this webhook.`

**Meaning:** Make.com webhook URL is set in Render, but Make.com scenario is not receiving the webhook.

## ✅ Fix Steps

### Step 1: Verify Webhook URL in Render

1. **Render Dashboard → mimmarketplace → Environment**
2. **Find `WHATSAPP_WEBHOOK_URL`**
3. **Check the URL** - Should look like:
   ```
   https://hook.make.com/xxxxxxxxxxxxx
   ```
4. **Copy this URL** - You'll need it for Step 2

### Step 2: Verify Webhook URL in Make.com

1. **Go to Make.com**
2. **Open your scenario**
3. **Click on the Webhook module** (left, pink circle)
4. **Check the webhook URL** in the configuration panel
5. **Compare with Render's `WHATSAPP_WEBHOOK_URL`**
6. **They must match exactly!**

**If they don't match:**
- Copy the webhook URL from Make.com
- Update `WHATSAPP_WEBHOOK_URL` in Render
- Manual Deploy

### Step 3: Make Sure Webhook Module is Saved

1. **Click on Webhook module** in Make.com
2. **Click "Save"** button
3. **Wait for webhook URL to appear**
4. **Copy the URL** if it changed

### Step 4: Turn Scenario ON

1. **In Make.com scenario**
2. **Toggle "Active" to ON** (top right, purple toggle)
3. **Or:** Toggle "Immediately as data arrives" (bottom bar) to ON
4. **Make sure scenario is saved**

### Step 5: Test Webhook Directly

Test if Make.com receives the webhook:

```bash
curl -X POST "YOUR_MAKECOM_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+212664990829",
    "message": "Test message from backend"
  }'
```

**Replace `YOUR_MAKECOM_WEBHOOK_URL` with your actual webhook URL!**

**Check Make.com:**
- ✅ Go to scenario → **History** tab
- ✅ Should see a new execution (green "Success")
- ✅ If no execution → Webhook URL is wrong or scenario is OFF

### Step 6: Update Render if Needed

If webhook URL changed or was wrong:

1. **Render Dashboard → Environment**
2. **Update `WHATSAPP_WEBHOOK_URL`** with correct URL from Make.com
3. **Click "Save Changes"**
4. **Manual Deploy**

### Step 7: Test Again

After fixing:

1. **Change status in admin dashboard** (to `qualified`, `needs_info`, etc.)
2. **Check Render logs** - Should see:
   ```
   [WHATSAPP] ✅ WhatsApp notification sent via webhook...
   ```
3. **Check Make.com history** - Should show execution
4. **Check WhatsApp** - Should receive message

## 🔍 Common Causes

### Cause 1: Scenario Not Turned ON
**Fix:** Toggle "Active" to ON in Make.com

### Cause 2: Webhook URL Mismatch
**Fix:** Verify URLs match exactly between Render and Make.com

### Cause 3: Webhook Module Not Saved
**Fix:** Save Webhook module in Make.com

### Cause 4: Wrong Webhook URL in Render
**Fix:** Get fresh URL from Make.com and update Render

## 📋 Quick Checklist

- [ ] ✅ Webhook URL in Render matches Make.com webhook URL
- [ ] ✅ Webhook module is saved in Make.com
- [ ] ✅ Scenario is turned ON (Active toggle)
- [ ] ✅ Webhook tested directly (Step 5)
- [ ] ✅ Make.com shows execution in History
- [ ] ✅ Manual Deploy done after URL change

## 🎯 Most Likely Issue

**90% of cases:** Scenario is not turned ON in Make.com

**Quick fix:**
1. Go to Make.com scenario
2. Toggle "Active" to ON (top right)
3. Test again

## ✅ Success Indicators

After fixing, you should see:

**Render logs:**
```
[WHATSAPP] ✅ WhatsApp notification sent via webhook to +212664990829...
```

**Make.com:**
- History shows execution (green "Success")
- WhatsApp message sent

**WhatsApp:**
- Message received from your business number

## 💡 Pro Tip

**Always verify:**
1. Webhook URL in Make.com
2. Webhook URL in Render (must match!)
3. Scenario is turned ON
4. Webhook module is saved

**The error "There is no scenario listening" means Make.com can't find an active scenario for that webhook URL!**

