# 🔧 Fix: WhatsApp Module Missing 'to' and 'body' Parameters

## 🔴 Current Problem

**Error:** 
- Missing value of required parameter 'to'
- Missing value of required parameter 'body'

**Meaning:** The WhatsApp module is not receiving data from the webhook. The data mapping is incorrect.

## ✅ Fix: Configure Data Mapping

### Step 1: Open WhatsApp Module Configuration

1. **In Make.com scenario**
2. **Click on the WhatsApp Business Cloud module** (green circle, right side)
3. **Configuration panel should open** on the right

### Step 2: Configure Receiver Field (to)

1. **Find "Receiver" field** (required, marked with *)
2. **Click in the field**
3. **Click the mapping icon** (small icon next to the field, usually looks like `</>` or `{ }`)
4. **Select from Webhook module:**
   - Choose: `1.phone` (from Webhooks module)
   - Or type: `{{1.phone}}`
5. **This maps the phone number from webhook data**

### Step 3: Configure Body Field (message)

1. **Find "Body" field** (required, marked with *)
2. **Click in the field**
3. **Click the mapping icon**
4. **Select from Webhook module:**
   - Choose: `1.message` (from Webhooks module)
   - Or type: `{{1.message}}`
5. **This maps the message text from webhook data**

### Step 4: Verify Other Fields

**Make sure these are also configured:**

1. **Connection:**
   - Should show your WhatsApp Business connection
   - If empty, click "Add" to create connection

2. **Sender ID:**
   - Should show your WhatsApp Business phone number
   - Select from dropdown

3. **Message Type:**
   - Should be "Text"

### Step 5: Save WhatsApp Module

1. **Click "Save"** button (bottom right of configuration panel)
2. **Make sure no errors are shown**

### Step 6: Test Again

After fixing the mapping:

1. **Test webhook directly:**
   ```bash
   curl -X POST "https://hook.eu2.make.com/ivl5u46c0mrldnoy3ve1pt66j433w7l1" \
     -H "Content-Type: application/json" \
     -d '{
       "phone": "+212664990829",
       "message": "Test message after fixing mapping"
     }'
   ```

2. **Check Make.com:**
   - Go to scenario → **History** tab
   - Should see execution with green checkmarks (success)
   - Check if WhatsApp message was sent

## 🔍 Data Mapping Reference

**Your backend sends:**
```json
{
  "phone": "+212664990829",
  "message": "سلام [Name]👋\n\nشكرا لملء استمارة...",
  "applicationId": "uuid",
  "applicationName": "Full Name"
}
```

**WhatsApp module should map:**
- **Receiver (to):** `{{1.phone}}` → Gets `+212664990829`
- **Body (message):** `{{1.message}}` → Gets the Arabic message text

## 📋 Field Mapping Checklist

- [ ] ✅ **Connection:** Your WhatsApp Business connection selected
- [ ] ✅ **Sender ID:** Your business phone number selected
- [ ] ✅ **Receiver (to):** `{{1.phone}}` (mapped from webhook)
- [ ] ✅ **Message Type:** "Text"
- [ ] ✅ **Body:** `{{1.message}}` (mapped from webhook)
- [ ] ✅ **Module saved** (no errors)

## 🐛 Common Issues

### Issue 1: Can't See Mapping Options
**Fix:**
- Make sure Webhook module is saved first
- Click the mapping icon (not just type in field)
- Use dropdown to select from Webhook module

### Issue 2: Fields Show Empty
**Fix:**
- Click mapping icon
- Select `1.phone` and `1.message` from dropdown
- Don't just type `{{1.phone}}` - use the mapping tool

### Issue 3: Wrong Data Format
**Fix:**
- Verify webhook receives correct JSON
- Check field names match: `phone` and `message`
- Test webhook directly first

## ✅ Success Indicators

After fixing, you should see:

**Make.com History:**
- ✅ Both modules show green checkmarks
- ✅ No red error triangles
- ✅ Execution shows "Success"

**WhatsApp:**
- ✅ Message received from your business number
- ✅ Message contains correct Arabic text

## 🎯 Quick Fix Summary

1. **Click WhatsApp module** (green circle)
2. **Configure Receiver:** Map to `{{1.phone}}` from webhook
3. **Configure Body:** Map to `{{1.message}}` from webhook
4. **Save module**
5. **Test again**

**The error happens because WhatsApp module doesn't know where to get the phone number and message from the webhook data!**

