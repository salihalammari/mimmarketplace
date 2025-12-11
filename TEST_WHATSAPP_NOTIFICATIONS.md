# 🧪 Test WhatsApp Connection and Notifications

## ✅ Pre-Test Checklist

Before testing, make sure:
- [ ] ✅ Make.com scenario is configured correctly
- [ ] ✅ Webhook module is first (trigger)
- [ ] ✅ WhatsApp module is second (action)
- [ ] ✅ WhatsApp module uses "Send a Message" (not Template)
- [ ] ✅ Receiver: `{{1.phone}}` (from webhook)
- [ ] ✅ Body: `{{1.message}}` (from webhook)
- [ ] ✅ `WHATSAPP_WEBHOOK_URL` is set in Render
- [ ] ✅ Make.com scenario is turned ON (Active)
- [ ] ✅ Service is deployed on Render

## 🧪 Test Steps

### Step 1: Test Webhook Directly (Make.com)

Test if Make.com receives data from your backend:

```bash
curl -X POST "YOUR_MAKECOM_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+212664990829",
    "message": "Test message from backend - WhatsApp connection test"
  }'
```

**Replace `YOUR_MAKECOM_WEBHOOK_URL` with your actual Make.com webhook URL!**

**Check Make.com:**
1. Go to your scenario
2. Click **"History"** tab (right sidebar)
3. You should see a new execution (green "Success")
4. Check if WhatsApp message was sent

**Expected:**
- ✅ Make.com receives the webhook
- ✅ Scenario executes successfully
- ✅ WhatsApp message is sent
- ✅ You receive WhatsApp message

### Step 2: Test from Backend API

Test the full flow from your backend:

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
- ✅ Make.com scenario execution history
- ✅ WhatsApp for the message

### Step 3: Test Status Change Notification

Test when admin changes status in dashboard:

1. **Go to admin dashboard:** https://mimmarketplace.onrender.com/admin
2. **Find an application** with a phone number
3. **Change status to:** `needs_info`, `qualified`, `rejected`, or `badge_activated`
4. **Click confirm** (✓ button)
5. **Check:**
   - ✅ Render logs for `[WHATSAPP] ✅` messages
   - ✅ Make.com scenario execution
   - ✅ WhatsApp for the message

## 🔍 What to Check

### Render Logs

Look for these messages:

**✅ Success:**
```
[WHATSAPP] Attempting to send WhatsApp message for application...
[WHATSAPP] ✅ WhatsApp notification sent via webhook to +212664990829 for application...
```

**❌ Failure:**
```
[WHATSAPP] ⚠️ WhatsApp webhook failed for +212664990829: ...
[WHATSAPP] ❌ All WhatsApp services failed for application...
```

### Make.com History

1. **Go to scenario → History tab**
2. **Check recent executions:**
   - Should show "Success" (green)
   - Should show execution time
   - Click on execution to see details

### WhatsApp

1. **Check your WhatsApp** (the phone number you're testing with)
2. **Look for the message:**
   - Should be from your WhatsApp Business number
   - Should contain the Arabic message text

## 🐛 Troubleshooting

### Issue 1: Webhook Not Receiving Data

**Symptoms:**
- No execution in Make.com history
- Render logs show webhook call but no response

**Fix:**
- Verify webhook URL is correct in Render
- Check Make.com scenario is turned ON
- Test webhook directly with curl

### Issue 2: Make.com Receives but WhatsApp Not Sent

**Symptoms:**
- Make.com shows execution but no WhatsApp message

**Fix:**
- Check WhatsApp module configuration
- Verify Connection is set correctly
- Verify Sender ID is correct
- Check Receiver mapping: `{{1.phone}}`
- Check Body mapping: `{{1.message}}`

### Issue 3: Phone Number Format Error

**Symptoms:**
- WhatsApp API error about phone number

**Fix:**
- Ensure phone number has country code: `+212664990829`
- Check phone number is in correct format
- Verify WhatsApp Business API accepts the number

### Issue 4: No Phone Number in Application

**Symptoms:**
- Render logs show: `⚠️ No phone number found for application`

**Fix:**
- Make sure application has `phone` or `whatsapp_number` field
- Check phone number is not null/empty

## 📋 Test Results Template

After testing, note:

- [ ] ✅ Webhook receives data from backend
- [ ] ✅ Make.com scenario executes successfully
- [ ] ✅ WhatsApp message is sent
- [ ] ✅ Message received in WhatsApp
- [ ] ✅ Message content is correct (Arabic text)
- [ ] ✅ Status change triggers notification
- [ ] ✅ Test notification endpoint works

## 🎯 Quick Test Commands

### Test 1: Direct Webhook Test
```bash
curl -X POST "YOUR_MAKECOM_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"phone": "+212664990829", "message": "Test WhatsApp"}'
```

### Test 2: Backend Test Notification
```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d '{"email": "salihalammari91@gmail.com", "type": "needs_info"}'
```

### Test 3: Check Configuration
```bash
curl "https://mimmarketplace.onrender.com/notifications/config"
```

## ✅ Success Indicators

**Everything working if you see:**
- ✅ Render logs: `[WHATSAPP] ✅ WhatsApp notification sent via webhook`
- ✅ Make.com: Execution shows "Success"
- ✅ WhatsApp: Message received from your business number
- ✅ Message: Contains correct Arabic text

**If all checkmarks ✅, WhatsApp notifications are working!**

