# Testing Notifications Guide

## 📧 Testing Email Notifications (Currently Active)

### Step 1: Verify Resend is Configured
1. Check Render Dashboard → Environment Variables
2. Ensure `RESEND_API_KEY` is set (starts with `re_`)
3. Ensure `NOTIFICATION_FROM_EMAIL` is set

### Step 2: Test Email Notification
Use this command to trigger a status change and send an email:

```bash
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" ^
  -H "Content-Type: application/json" ^
  -d "{\"status\":\"needs_info\",\"notes\":\"اذكر لنا رقم الطلب\"}"
```

**Replace `<APP_ID>` with an actual application ID from your database.**

### Step 3: Verify Email Sent
1. Check Render Logs → Look for: `Email notification sent to...`
2. Check the application's email inbox
3. Check spam folder if not received

### Step 4: Test All Notification Types
```bash
# Application received (automatic when form is submitted)
# Test by submitting a new form via Webflow

# Needs Info
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" -H "Content-Type: application/json" -d "{\"status\":\"needs_info\",\"notes\":\"معلومات إضافية\"}"

# Qualified
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" -H "Content-Type: application/json" -d "{\"status\":\"qualified\"}"

# Rejected
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" -H "Content-Type: application/json" -d "{\"status\":\"rejected\"}"

# Badge Activated
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" -H "Content-Type: application/json" -d "{\"status\":\"badge_activated\"}"
```

## 📱 Testing WhatsApp Notifications

### Option 1: Evolution API (Free, Self-Hosted)

#### Setup Evolution API:
1. **Deploy Evolution API** (free on Render or your server):
   - Go to [Evolution API GitHub](https://github.com/EvolutionAPI/evolution-api)
   - Follow setup instructions
   - Or use their cloud service

2. **Create an Instance:**
   - Access Evolution API dashboard
   - Create a new WhatsApp instance
   - Scan QR code with your WhatsApp

3. **Configure Environment Variables in Render:**
   ```
   EVOLUTION_API_URL=https://your-evolution-api.com
   EVOLUTION_API_KEY=your_api_key (if required)
   EVOLUTION_INSTANCE_NAME=your_instance_name
   WHATSAPP_DEFAULT_COUNTRY_CODE=+212
   ```

4. **Test WhatsApp:**
   ```bash
   curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" ^
     -H "Content-Type: application/json" ^
     -d "{\"status\":\"needs_info\",\"notes\":\"اذكر لنا رقم الطلب\"}"
   ```

5. **Check Logs:**
   - Render Logs → Look for: `WhatsApp notification sent via Evolution API to...`
   - Check your WhatsApp for the message

### Option 2: WhatsApp Business API (Official)

#### Setup WhatsApp Business API:
1. **Create Meta Business Account:**
   - Go to [Meta Business](https://business.facebook.com)
   - Create a business account

2. **Get WhatsApp Business API Access:**
   - Apply for WhatsApp Business API
   - Get your access token and phone number ID

3. **Configure Environment Variables in Render:**
   ```
   WHATSAPP_BUSINESS_API_URL=https://graph.facebook.com/v18.0
   WHATSAPP_BUSINESS_TOKEN=your_access_token
   WHATSAPP_BUSINESS_PHONE_ID=your_phone_number_id
   WHATSAPP_DEFAULT_COUNTRY_CODE=+212
   ```

4. **Test WhatsApp:**
   ```bash
   curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" ^
     -H "Content-Type: application/json" ^
     -d "{\"status\":\"qualified\"}"
   ```

### Option 3: Manual Testing (No Service Configured)

If no WhatsApp service is configured, the system will log the message:

1. **Check Render Logs:**
   - Look for: `WhatsApp message prepared for +212...`
   - The full message will be in the logs

2. **Manually send the message** using your preferred method

## 🔍 Debugging

### Check Notification Status:
1. **Render Logs:**
   - Go to Render Dashboard → Your Service → Logs
   - Search for "notification" or "Email notification sent"

2. **Application Phone Number:**
   - Ensure application has `phone` or `whatsapp_number` field
   - Format: `+212612345678` or `06612345678` (will auto-normalize)

3. **Common Issues:**
   - **Email not sending**: Check `RESEND_API_KEY` is valid
   - **WhatsApp not sending**: Check Evolution API or Business API is configured
   - **Phone format error**: Ensure phone starts with country code or use `WHATSAPP_DEFAULT_COUNTRY_CODE`

## 📊 Notification Flow

```
Application Status Change
    ↓
NotificationsService.notifyStatusChange()
    ↓
├─→ Send Email (via Resend) ✅ Active
└─→ Send WhatsApp (via Evolution/Business API) ⚙️ Configure if needed
```

## ✅ Quick Test Checklist

- [ ] Resend API key configured
- [ ] Test email notification sent
- [ ] Email received in inbox
- [ ] Application has phone number
- [ ] Evolution API or Business API configured (for WhatsApp)
- [ ] Test WhatsApp notification sent
- [ ] WhatsApp message received
- [ ] Check logs for any errors

## 🚀 Production Testing

1. **Create a test application** with your own email and WhatsApp number
2. **Change status** via admin dashboard or API
3. **Verify both email and WhatsApp** are received
4. **Check logs** for confirmation messages

