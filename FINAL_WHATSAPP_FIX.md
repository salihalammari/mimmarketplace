# 🎯 Final Fix: WhatsApp Webhook Not Working

## 🔴 Current Error

**Error:** `There is no scenario listening for this webhook.`

**Meaning:** Make.com scenario is either:
1. Not active, OR
2. Webhook URL in Render doesn't match Make.com webhook URL

## ✅ Complete Fix Checklist

### Step 1: Activate Scenario in Make.com

1. **Go to Make.com**
2. **Open your scenario:** "Integration Webhooks, WhatsApp Business Cloud"
3. **Toggle "Active" to ON** (top right, purple toggle)
4. **Verify:** Scenario shows "Active" (green badge)

### Step 2: Get Webhook URL from Make.com

1. **In Make.com scenario**
2. **Click on Webhook module** (left, pink circle)
3. **Copy the webhook URL** - Should be:
   ```
   https://hook.eu2.make.com/ivl5u46c0mrldnoy3ve1pt66j433w7l1
   ```
4. **Or:** Go to Webhooks → Find "Mim-webhook webhook" → Copy URL

### Step 3: Verify Webhook URL in Render

1. **Render Dashboard → mimmarketplace → Environment**
2. **Find `WHATSAPP_WEBHOOK_URL`**
3. **Verify it matches EXACTLY:**
   ```
   https://hook.eu2.make.com/ivl5u46c0mrldnoy3ve1pt66j433w7l1
   ```
4. **If different:**
   - Update it to match Make.com webhook URL
   - Click "Save Changes"
   - **Manual Deploy**

### Step 4: Verify WhatsApp Module Data Mapping

1. **In Make.com scenario**
2. **Click WhatsApp module** (green circle)
3. **Verify:**
   - **Receiver:** `{{1.phone}}` (mapped from webhook)
   - **Body:** `{{1.message}}` (mapped from webhook)
   - **Connection:** Your WhatsApp Business connection
   - **Sender ID:** Your business phone number
4. **Save** if you made changes

### Step 5: Test Webhook Directly

Test if Make.com receives the webhook:

```bash
curl -X POST "https://hook.eu2.make.com/ivl5u46c0mrldnoy3ve1pt66j433w7l1" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+212664990829",
    "message": "Test message - final test"
  }'
```

**Check Make.com:**
- ✅ Go to scenario → **History** tab
- ✅ Should see execution (green "Success")
- ✅ Both modules should have green checkmarks
- ✅ Check if WhatsApp message was sent

### Step 6: Test from Backend

After everything is configured:

1. **Go to admin dashboard:** https://mimmarketplace.onrender.com/admin
2. **Change status** to `qualified`, `needs_info`, `rejected`, or `badge_activated`
3. **Check Render logs** - Should see:
   ```
   [WHATSAPP] ✅ WhatsApp notification sent via webhook...
   ```
4. **Check Make.com History** - Should show execution
5. **Check WhatsApp** - Should receive message

## 🔍 Verification Checklist

- [ ] ✅ Scenario is **Active** in Make.com (green badge)
- [ ] ✅ Webhook URL in Render **matches** Make.com webhook URL exactly
- [ ] ✅ WhatsApp module **Receiver** = `{{1.phone}}`
- [ ] ✅ WhatsApp module **Body** = `{{1.message}}`
- [ ] ✅ WhatsApp module **Connection** is set
- [ ] ✅ WhatsApp module **Sender ID** is set
- [ ] ✅ Webhook tested directly (Step 5)
- [ ] ✅ Make.com shows execution in History
- [ ] ✅ Manual Deploy done (if URL changed)

## 🐛 Common Issues

### Issue 1: Scenario Still Inactive
**Symptom:** Error persists after activating
**Fix:**
- Double-check scenario is actually ON (refresh page)
- Make sure you activated the correct scenario
- Check scenario ID matches

### Issue 2: Webhook URL Mismatch
**Symptom:** Different URLs in Render vs Make.com
**Fix:**
- Get exact URL from Make.com
- Update Render's `WHATSAPP_WEBHOOK_URL`
- Manual Deploy

### Issue 3: Data Mapping Wrong
**Symptom:** WhatsApp module fails with missing parameters
**Fix:**
- Use mapping icon (not just typing)
- Map Receiver to `{{1.phone}}`
- Map Body to `{{1.message}}`

## 🎯 Most Likely Issue

**90% of cases:** Scenario is not active OR webhook URL doesn't match

**Quick fix:**
1. Activate scenario in Make.com
2. Verify webhook URLs match exactly
3. Test webhook directly

## ✅ Success Indicators

After fixing, you should see:

**Render logs:**
```
[WHATSAPP] ✅ WhatsApp notification sent via webhook to +212664990829...
```

**Make.com:**
- History shows execution (green "Success")
- Both modules have green checkmarks
- No red error triangles

**WhatsApp:**
- Message received from your business number
- Message contains correct Arabic text

## 💡 Pro Tip

**Always verify:**
1. Scenario is **Active** (not just saved)
2. Webhook URLs **match exactly** (character by character)
3. Data mapping uses **mapping icon** (not just typing)

**The error "There is no scenario listening" means Make.com can't find an active scenario for that webhook URL!**

