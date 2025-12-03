# Test Email + WhatsApp Notifications Together

## ✅ How It Works

When admin changes application status, the system automatically sends:
1. ✅ **Email** notification (via Resend)
2. ✅ **WhatsApp** notification (via Make.com webhook → WhatsApp Business)

## 🧪 Test Both Notifications

### Step 1: Get Application with Phone Number

```bash
curl "https://mimmarketplace.onrender.com/applications"
```

**Find an application that has:**
- Valid email address
- Valid phone/WhatsApp number (like `+212612345678` or `06612345678`)

**Copy the application `id`**

### Step 2: Change Status (Sends BOTH Email + WhatsApp)

```bash
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"qualified\",\"notes\":\"مبروك! تم قبول طلبك\"}"
```

**Replace `<APP_ID>` with the actual ID from Step 1.**

### Step 3: Verify Both Sent

**Check Email:**
- ✅ Go to the application's email inbox
- ✅ Look for email from "MIM Marketplace"
- ✅ Subject: `مبروك! تم قبول طلبك - MIM Marketplace` (or similar in Arabic)
- ✅ Check spam folder if not in inbox

**Check WhatsApp:**
- ✅ Check the phone number from the application
- ✅ Should receive WhatsApp message in Arabic
- ✅ Message: `خبار كتفرح🤩 [Name]، لقد تم قبول طلبك من أجل Mim Verified...`

**Check Render Logs:**
- ✅ `Email notification sent to [email] for application [id]`
- ✅ `WhatsApp notification sent via webhook to [phone] for application [id]`

**Check Make.com:**
- ✅ Go to Make.com → Your Scenario → "Runs" tab
- ✅ Should see a successful execution
- ✅ Check execution details

## 🎯 Test All Status Types

### Test "Needs Info" (with notes):
```bash
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"needs_info\",\"notes\":\"اذكر لنا رقم الطلب والمعلومات المطلوبة\"}"
```

**Sends:**
- Email: Needs info message with notes
- WhatsApp: Needs info message with notes

### Test "Qualified":
```bash
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"qualified\"}"
```

### Test "Rejected":
```bash
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"rejected\"}"
```

### Test "Badge Activated":
```bash
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"badge_activated\"}"
```

## ✅ Success Checklist

### Email:
- [ ] Email received in inbox
- [ ] Email content is in Arabic
- [ ] Email subject matches status
- [ ] Render logs show "Email notification sent"

### WhatsApp:
- [ ] WhatsApp message received on phone
- [ ] Message content is in Arabic
- [ ] Message matches status type
- [ ] Render logs show "WhatsApp notification sent via webhook"
- [ ] Make.com shows successful execution

## 🐛 Troubleshooting

### Email Not Sending:
- Check `RESEND_API_KEY` is set in Render
- Verify API key is valid (check Resend dashboard)
- Check email address is correct
- Check spam folder

### WhatsApp Not Sending:
- Check `WHATSAPP_WEBHOOK_URL` is set in Render
- Verify Make.com scenario is **turned ON**
- Check Make.com execution logs for errors
- Verify WhatsApp Business connection is "Verified"
- Check phone number format: `+212612345678`

### Both Not Sending:
- Check service is "Live" in Render
- Check Render logs for errors
- Verify all environment variables are set
- Check database connection is working

## 🎯 Quick Test from Admin Dashboard

You can also test from the admin dashboard:

1. Go to: `https://mimmarketplace.onrender.com/admin`
2. Find an application
3. Change status using the dropdown
4. Click the green ✓ button to confirm
5. Both email and WhatsApp will be sent automatically!

## 🚀 Ready!

The system is configured to send both email and WhatsApp when status changes. Just test it with the commands above!

