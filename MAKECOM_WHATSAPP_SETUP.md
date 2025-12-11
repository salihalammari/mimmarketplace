# 📱 WhatsApp Business API Setup with Make.com

## ✅ Current Status

**Email:** ✅ Working (Resend configured)
**WhatsApp:** ⚠️ Needs Make.com webhook configuration

## 🎯 What You Need

Your backend is already configured to send WhatsApp messages via Make.com webhook. You just need to:

1. **Create a Make.com scenario** that receives webhook and sends WhatsApp
2. **Get the webhook URL** from Make.com
3. **Add it to Render** environment variables

## 📋 Step-by-Step Setup

### Step 1: Create Make.com Scenario

1. Go to: **https://www.make.com** (or integromat.com)
2. Click **"Create a new scenario"**
3. Add these modules:

#### Module 1: Webhook (Trigger)
1. Search for **"Webhooks"** → Select **"Custom webhook"**
2. Click **"Add"**
3. Click **"Save"** to create the webhook
4. **Copy the webhook URL** - You'll need this later!
   - It looks like: `https://hook.make.com/xxxxxxxxxxxxx`

#### Module 2: WhatsApp Business API (Action)
1. Click **"+"** to add another module
2. Search for **"WhatsApp Business API"** or **"WhatsApp"**
3. Select **"Send a Message"** or **"Send Text Message"**
4. Configure:
   - **Phone Number ID:** Your WhatsApp Business phone number ID
   - **To:** `{{1.phone}}` (from webhook data)
   - **Message:** `{{1.message}}` (from webhook data)

#### Module 3: (Optional) Error Handling
1. Add **"Error handling"** module
2. Configure to log errors or send notifications

### Step 2: Configure Webhook Data Format

Your backend sends this JSON to the webhook:

```json
{
  "phone": "+212644003494",
  "message": "سلام [Name]👋\n\nشكرا لملء استمارة طلب الشارة الرقمية للثقة..."
}
```

**In Make.com webhook module:**
- The data will be available as `{{1.phone}}` and `{{1.message}}`
- Make sure your WhatsApp module uses these fields

### Step 3: Test the Scenario

1. **Turn on the scenario** in Make.com
2. **Test the webhook:**
   ```bash
   curl -X POST "YOUR_MAKECOM_WEBHOOK_URL" \
     -H "Content-Type: application/json" \
     -d '{
       "phone": "+212644003494",
       "message": "Test message from backend"
     }'
   ```
3. **Check if WhatsApp message was sent**

### Step 4: Add Webhook URL to Render

1. Go to: **Render Dashboard → mimmarketplace → Environment**
2. Find `WHATSAPP_WEBHOOK_URL`
3. **Set it to your Make.com webhook URL:**
   ```
   https://hook.make.com/xxxxxxxxxxxxx
   ```
4. Click **"Save Changes"**

### Step 5: Manual Deploy

1. **Render Dashboard → mimmarketplace**
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"**
4. Wait **3-5 minutes**

### Step 6: Test WhatsApp Notification

```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "salihalammari91@gmail.com",
    "type": "needs_info",
    "phone": "+212644003494"
  }'
```

**Expected:**
- ✅ Check Render logs for `[WHATSAPP] ✅` messages
- ✅ Check Make.com scenario execution logs
- ✅ Check WhatsApp for the message

## 🔍 How It Works

### Backend Flow:
1. Application status changes (or test notification triggered)
2. Backend builds WhatsApp message (Arabic template)
3. Backend gets phone number from application
4. Backend sends POST request to Make.com webhook:
   ```json
   {
     "phone": "+212644003494",
     "message": "سلام [Name]👋\n\nشكرا لملء استمارة..."
   }
   ```

### Make.com Flow:
1. Webhook receives the POST request
2. Extracts `phone` and `message` from JSON
3. Sends WhatsApp message via WhatsApp Business API
4. Returns success/error

## 📋 Required Environment Variables

In Render Dashboard → Environment:

| Variable | Description | Example |
|----------|-------------|---------|
| `WHATSAPP_WEBHOOK_URL` | Make.com webhook URL | `https://hook.make.com/xxxxxxxxxxxxx` |
| `WHATSAPP_DEFAULT_COUNTRY_CODE` | Default country code (already set) | `+212` |

## 🎯 WhatsApp Message Templates

Your backend sends these Arabic messages:

1. **Application Received:**
   ```
   سلام [Name]👋
   
   شكرا لملء استمارة طلب الشارة الرقمية للثقة.
   لقد توصلنا بطلبك وسوف نقوم بمراجعته والتواصل معك في أقرب وقت.
   ```

2. **Needs Info:**
   ```
   سلام [Name]
   ‼️نحن بحاجة لبعض المعلومات منك قبل إكمال الطلب.
   
   المعلومات المطلوبة:
   [Notes from admin]
   ```

3. **Qualified:**
   ```
   خبار كتفرح🤩
   [Name]، لقد تم قبول طلبك من أجل Mim Verified.
   ستتوصل بشارتك الرقمية قريبا🥳
   ```

4. **Rejected:**
   ```
   سلام [Name]
   شكرا لتقديمك، لكن يؤسفنا أن نخبرك أن متجرك لا يستوفي جميع متطلبات التحقق حاليا.
   يمكنك إعادة التقديم لاحقا بعد التحسن.
   ```

5. **Badge Activated:**
   ```
   مبروك ✅
   [Name]، شارتك الرقمية أصبحت فعالة.
   يمكنك الحصول عليها من بريدك الإلكتروني واستعمالها في صفحات البيع الخاصة بك.
   ```

6. **Reminder:**
   ```
   مرحباً [Name]، تذكير بسيط — ما زلنا ننتظر المعلومات الإضافية لإكمال عملية التحقق.
   ```

## 🔧 Make.com Module Configuration Details

### Webhook Module:
- **Method:** POST
- **Data Structure:** JSON
- **Fields Received:**
  - `phone` (string): Phone number with country code (e.g., "+212644003494")
  - `message` (string): Arabic message text

### WhatsApp Business API Module:
- **Action:** Send a Message
- **To:** `{{1.phone}}` (from webhook)
- **Message:** `{{1.message}}` (from webhook)
- **Phone Number ID:** Your WhatsApp Business phone number ID

## ✅ Verification Checklist

- [ ] ✅ Make.com scenario created
- [ ] ✅ Webhook module configured
- [ ] ✅ WhatsApp Business API module configured
- [ ] ✅ Scenario tested manually
- [ ] ✅ `WHATSAPP_WEBHOOK_URL` set in Render
- [ ] ✅ Manual Deploy done
- [ ] ✅ Test notification sent
- [ ] ✅ WhatsApp message received

## 🐛 Troubleshooting

### Issue 1: Webhook Not Receiving Data
**Check:**
- Make.com scenario is **turned ON**
- Webhook URL is correct in Render
- Test webhook directly with curl

**Fix:**
- Verify webhook URL in Make.com
- Check Make.com scenario execution logs

### Issue 2: WhatsApp Message Not Sent
**Check:**
- WhatsApp Business API module configuration
- Phone number format (should include country code)
- WhatsApp Business API credentials

**Fix:**
- Verify phone number ID in WhatsApp module
- Check WhatsApp Business API connection
- Test WhatsApp module separately

### Issue 3: Phone Number Missing
**Check:**
- Application has `phone` or `whatsapp_number` field
- Phone number format is correct

**Fix:**
- Ensure applications have phone numbers
- Check `WHATSAPP_DEFAULT_COUNTRY_CODE` is set

## 📊 Check Status

After setup, check notification configuration:

```bash
curl "https://mimmarketplace.onrender.com/notifications/config"
```

**Expected:**
```json
{
  "whatsapp": {
    "webhook": {
      "enabled": true,
      "url": "Set"
    },
    "anyEnabled": true
  }
}
```

## 🚀 Next Steps

1. **Create Make.com scenario** (Steps 1-2)
2. **Get webhook URL** (Step 3)
3. **Add to Render** (Step 4)
4. **Deploy** (Step 5)
5. **Test** (Step 6)

**Once configured, WhatsApp notifications will work automatically for all status changes!**

