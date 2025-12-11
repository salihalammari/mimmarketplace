# 🔧 Fix: Missing 'to' and 'body' Parameters - Step by Step

## 🔴 Current Problem

**Error from Make.com:**
- ❌ Missing value of required parameter 'to'
- ❌ Missing value of required parameter 'body'

**Status:**
- ✅ Webhook module: Working (green checkmark)
- ❌ WhatsApp module: Failing (red triangle)

**Cause:** Data mapping from webhook to WhatsApp module is not configured.

## ✅ Fix: Configure Data Mapping (5 Minutes)

### Step 1: Open WhatsApp Module Configuration

1. **In Make.com scenario**
2. **Click on the WhatsApp Business Cloud module** (green circle on the right)
3. **Configuration panel opens on the right side**

### Step 2: Fix "Receiver" Field (to parameter)

1. **Find "Receiver" field** (required, marked with red asterisk *)
2. **Click inside the field** (it's probably empty)
3. **Click the mapping icon** (looks like `{ }` or `</>` next to the field)
4. **In the mapping popup:**
   - Look for **"Webhooks"** or **"1"** (your webhook module)
   - Expand it to see: `phone` and `message`
   - **Click on `phone`** (or `1.phone`)
5. **You should see:** `{{1.phone}}` appear in the field
6. **Click "OK" or "Save"** in the mapping popup

### Step 3: Fix "Body" Field (message parameter)

1. **Find "Body" field** (required, marked with red asterisk *)
2. **Click inside the field** (it's probably empty)
3. **Click the mapping icon** (looks like `{ }` or `</>`)
4. **In the mapping popup:**
   - Look for **"Webhooks"** or **"1"** (your webhook module)
   - Expand it to see: `phone` and `message`
   - **Click on `message`** (or `1.message`)
5. **You should see:** `{{1.message}}` appear in the field
6. **Click "OK" or "Save"** in the mapping popup

### Step 4: Verify Other Required Fields

**Check these fields are also filled:**

1. **Connection:**
   - Should show your WhatsApp Business connection name
   - If empty, click "Add" to create connection

2. **Sender ID:**
   - Should show your WhatsApp Business phone number
   - Select from dropdown

3. **Message Type:**
   - Should be "Text" (not Template)

### Step 5: Save the Module

1. **Scroll down** in the configuration panel
2. **Click "Save" button** (bottom right)
3. **Make sure no red errors appear**

### Step 6: Reactivate Scenario

1. **In Make.com scenario** (top right)
2. **Toggle "Active" to ON** (if it's off)
3. **Wait a few seconds** for it to activate

### Step 7: Clear Failed Executions

1. **Click "INCOMPLETE EXECUTIONS" tab** (top of scenario)
2. **Delete any failed executions** (if any)
3. **This clears the error queue**

## 🎯 Visual Guide: What You Should See

**Before (Wrong):**
```
Receiver: [empty]
Body: [empty]
```

**After (Correct):**
```
Receiver: {{1.phone}}
Body: {{1.message}}
```

## 📋 Quick Checklist

- [ ] ✅ Clicked on WhatsApp Business Cloud module
- [ ] ✅ Opened "Receiver" field
- [ ] ✅ Clicked mapping icon
- [ ] ✅ Selected `1.phone` from webhook
- [ ] ✅ Opened "Body" field
- [ ] ✅ Clicked mapping icon
- [ ] ✅ Selected `1.message` from webhook
- [ ] ✅ Connection is selected
- [ ] ✅ Sender ID is selected
- [ ] ✅ Message Type is "Text"
- [ ] ✅ Clicked "Save" button
- [ ] ✅ Scenario is "Active"
- [ ] ✅ Cleared failed executions

## 🧪 Test After Fixing

**Test the webhook:**

```bash
curl -X POST "https://hook.eu2.make.com/ivl5u46c0mrldnoy3ve1pt66j433w7l1" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+212664990829",
    "message": "Test after fixing mapping"
  }'
```

**Check Make.com:**
1. Go to scenario → **History** tab
2. Should see:
   - ✅ Webhook: Green checkmark
   - ✅ WhatsApp: Green checkmark (not red triangle!)
   - ✅ Execution shows "Success"

## 🐛 Common Mistakes

### Mistake 1: Typing Instead of Mapping
❌ **Wrong:** Typing `{{1.phone}}` directly in the field
✅ **Correct:** Click mapping icon → Select from dropdown

### Mistake 2: Wrong Field Names
❌ **Wrong:** Using `phone` instead of `1.phone`
✅ **Correct:** Use `{{1.phone}}` (the `1` refers to module 1 = webhook)

### Mistake 3: Not Saving
❌ **Wrong:** Configuring but not clicking "Save"
✅ **Correct:** Always click "Save" button after mapping

## 💡 Pro Tip

**If you can't see the mapping options:**
1. Make sure **Webhook module is saved first**
2. Close and reopen WhatsApp module configuration
3. Use the mapping tool (icon), don't type manually

## ✅ Success Indicators

After fixing, you should see:

**In Make.com:**
- ✅ Both modules show green checkmarks
- ✅ No red error triangles
- ✅ Execution shows "Success"
- ✅ No "Missing parameter" errors

**In WhatsApp:**
- ✅ Message received on your phone

**The fix is just mapping the data correctly! It takes 2 minutes!**

