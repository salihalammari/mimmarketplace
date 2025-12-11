# 🔧 Fix: "Module references non-existing module '1'" Error

## 🔴 Current Problem

**Error:** "Module references non-existing module '1'."

**Cause:** The WhatsApp module is trying to use `1.phone` and `1.message` (data from module 1 = Webhook), but Make.com can't find the webhook module reference.

## ✅ Fix: Reconnect Modules

### Step 1: Check Webhook Module is Saved

1. **Click on the Webhook module** (left, pink circle)
2. **Make sure it's configured:**
   - Type: "Custom webhook"
   - Method: POST (default)
3. **Click "Save"** on the Webhook module
4. **Wait for it to save** - You should see the webhook URL appear

### Step 2: Delete and Re-add WhatsApp Module

1. **Click on the WhatsApp module** (right, green circle)
2. **Click the red "-" button** or "Delete" to remove it
3. **Click "+" to add a new module**
4. **Search for "WhatsApp Business Cloud"** → Select **"Send a Message"**
5. **Click "Add"**

### Step 3: Connect Modules Properly

1. **Make sure Webhook module is saved first** (Step 1)
2. **When configuring WhatsApp module**, you should see:
   - A dropdown or connection option to select data from Webhook
   - Or: Click on the connection point between modules
3. **Configure WhatsApp fields:**
   - **Receiver:** Click the field → Select from dropdown: `1.phone` (should show "Webhooks" as source)
   - **Body:** Click the field → Select from dropdown: `1.message` (should show "Webhooks" as source)

### Step 4: Alternative - Use Data Mapping

If the dropdown doesn't show `1.phone` and `1.message`:

1. **Click on WhatsApp module**
2. **For "Receiver" field:**
   - Click the field
   - Type: `{{1.phone}}` (with curly braces)
   - Or: Click the mapping icon → Select "Webhooks" → Select "phone"
3. **For "Body" field:**
   - Click the field
   - Type: `{{1.message}}` (with curly braces)
   - Or: Click the mapping icon → Select "Webhooks" → Select "message"

### Step 5: Verify Connection

1. **Check the connection line** between modules:
   - Should be a solid line (not dashed)
   - Should show data flowing from Webhook → WhatsApp
2. **Check WhatsApp module:**
   - No red error badges
   - Fields show correct data mapping

### Step 6: Save Both Modules

1. **Save Webhook module** (if not already saved)
2. **Save WhatsApp module**
3. **Save the scenario** (floppy disk icon)

### Step 7: Test Connection

1. **Click "Run once"** (bottom bar, purple button)
2. **Or:** Test with a webhook call (after you get the webhook URL)

## 🔍 Common Causes

### Cause 1: Webhook Module Not Saved
**Fix:** Save the Webhook module first, then configure WhatsApp

### Cause 2: Modules Not Connected
**Fix:** Make sure there's a connection line between modules

### Cause 3: Wrong Data Reference
**Fix:** Use `{{1.phone}}` and `{{1.message}}` with curly braces, or use the mapping dropdown

### Cause 4: Webhook Module Deleted/Not Created
**Fix:** Make sure Webhook module exists and is the first module

## 📋 Step-by-Step Fix

1. **Click on Webhook module** (left, pink)
2. **Click "Save"** - Wait for webhook URL to appear
3. **Click on WhatsApp module** (right, green)
4. **Click "Delete"** to remove it
5. **Click "+"** to add new WhatsApp module
6. **When configuring:**
   - **Receiver:** Use mapping dropdown → Select `1.phone`
   - **Body:** Use mapping dropdown → Select `1.message`
7. **Save WhatsApp module**
8. **Save scenario**
9. **Check:** Error should be gone!

## ✅ Correct Configuration

**Webhook Module (Module 1):**
- Type: Custom webhook
- Saved: ✅
- URL: Generated (starts with `https://hook.make.com/`)

**WhatsApp Module (Module 2):**
- Receiver: `{{1.phone}}` or mapped from Webhook
- Body: `{{1.message}}` or mapped from Webhook
- Connection: ✅ Connected to Webhook module

## 🎯 Quick Fix

**Simplest solution:**
1. **Delete WhatsApp module**
2. **Save Webhook module** (make sure it's saved first!)
3. **Add WhatsApp module again**
4. **When configuring, use the mapping dropdown** to select data from Webhook
5. **Save everything**

**The error happens when WhatsApp tries to reference module 1 before it's properly saved/connected!**

