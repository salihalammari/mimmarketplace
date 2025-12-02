# Free Notification System Setup Guide

This project uses **Resend** for email notifications (free tier: 3,000 emails/month) and includes a flexible WhatsApp adapter for future integration.

## 📧 Email Notifications (Resend - FREE)

### Step 1: Create Resend Account
1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Get API Key
1. Go to [Resend API Keys](https://resend.com/api-keys)
2. Click **Create API Key**
3. Name it (e.g., "MIM Marketplace Production")
4. Copy the API key (starts with `re_`)

### Step 3: Verify Domain (Optional but Recommended)
1. Go to [Resend Domains](https://resend.com/domains)
2. Add your domain (e.g., `mimmarketplace.com`)
3. Add the DNS records provided by Resend
4. Wait for verification (usually a few minutes)

**Note:** If you don't verify a domain, you can use Resend's test domain, but emails may go to spam.

### Step 4: Configure Environment Variables

In Render Dashboard → Your Service → Environment, add:

```
RESEND_API_KEY=re_your_api_key_here
NOTIFICATION_FROM_EMAIL=noreply@yourdomain.com
NOTIFICATION_FROM_NAME=MIM Marketplace
```

**For testing without domain verification:**
```
NOTIFICATION_FROM_EMAIL=onboarding@resend.dev
```

## 📱 WhatsApp Notifications (Future Integration)

The system is prepared for WhatsApp but currently uses email as the primary channel. To add WhatsApp later, you can integrate:

### Free WhatsApp Options:
1. **Evolution API** (Self-hosted, free)
   - Open-source WhatsApp Business API
   - Requires your own server
   - [https://evolution-api.com](https://evolution-api.com)

2. **Baileys** (Node.js library, free)
   - WhatsApp Web protocol
   - Note: May violate WhatsApp ToS for business use
   - [https://github.com/WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys)

3. **WhatsApp Business API** (Official, free tier available)
   - Requires business verification
   - [https://business.whatsapp.com](https://business.whatsapp.com)

The WhatsApp message templates are already built in `notifications.service.ts` - you just need to add the sending logic.

## 🎯 Notification Triggers

The system automatically sends notifications for:

| Stage | Trigger | Channel |
|-------|---------|---------|
| **Application received** | Seller submits form | Email |
| **Needs more info** | Admin marks NEEDS_INFO | Email |
| **Qualified** | Admin marks QUALIFIED | Email |
| **Rejected** | Admin marks REJECTED | Email |
| **Reminder** | 2 days no reply (auto) | Email |
| **Badge activated** | Admin marks VERIFIED | Email |

## 🔄 Automatic Reminders

The system automatically sends reminders every 6 hours for applications in `needs_info` status that haven't been updated in 2+ days.

## 📝 Message Templates

All messages are in Arabic and match your requirements:

- **Application received**: Welcome message
- **Needs info**: Request for additional information (includes admin notes)
- **Qualified**: Congratulations message
- **Rejected**: Polite rejection with option to reapply
- **Reminder**: Gentle reminder for pending information
- **Badge activated**: Confirmation that badge is active

## ✅ Testing

1. **Test Email Notification:**
   ```bash
   curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
     -H "Content-Type: application/json" \
     -d "{\"status\":\"needs_info\",\"notes\":\"اذكر لنا رقم الطلب\"}"
   ```

2. **Check Logs:**
   - Render Dashboard → Logs
   - Look for: `Email notification sent to...`

3. **Verify Email:**
   - Check the application's email inbox
   - Check spam folder if not received

## 🚀 Deployment

After setting environment variables in Render:
1. Push code to GitHub
2. Render will auto-deploy
3. Notifications will start working automatically

## 💡 Tips

- **Resend Free Tier**: 3,000 emails/month (plenty for most use cases)
- **Email Deliverability**: Verify your domain for best results
- **Monitoring**: Check Resend dashboard for delivery stats
- **Fallback**: If email fails, check logs for error messages

## 🔧 Troubleshooting

**Emails not sending?**
- Check `RESEND_API_KEY` is set correctly
- Verify domain (if using custom domain)
- Check Render logs for error messages
- Ensure email address in application is valid

**Emails going to spam?**
- Verify your domain in Resend
- Use a proper `from` email address
- Add SPF/DKIM records (Resend provides these)

**Reminders not working?**
- Check cron job is running (every 6 hours)
- Verify `needs_info_reminder_sent_at` field exists in database
- Check application status is `needs_info`

