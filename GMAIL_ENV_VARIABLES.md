# Gmail Environment Variables

## 📋 Required Environment Variables

Add these to your **Render Dashboard → Environment** or `.env` file:

```env
# Gmail Configuration (Required)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Email Sender Info
NOTIFICATION_FROM_EMAIL=your-email@gmail.com
NOTIFICATION_FROM_NAME=MIM Marketplace
```

## 🔑 How to Get Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **App passwords**
4. Generate new app password for "Mail"
5. Copy the 16-character password (remove spaces)

## ✅ Example

```env
GMAIL_USER=salihalammari91@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
NOTIFICATION_FROM_EMAIL=salihalammari91@gmail.com
NOTIFICATION_FROM_NAME=MIM Marketplace
```

## 🧪 Verify Setup

After setting variables, check configuration:

```bash
curl "https://mimmarketplace.onrender.com/notifications/config"
```

Should show:
```json
{
  "email": {
    "provider": "gmail",
    "enabled": true,
    "gmail": {
      "enabled": true,
      "user": "your-email@gmail.com",
      "appPasswordSet": true
    }
  }
}
```

## 📝 Notes

- **Gmail takes priority** over Resend if both are configured
- App password is different from your regular Gmail password
- Daily limit: 500 emails/day for regular Gmail accounts
- See `GMAIL_SETUP.md` for detailed setup instructions

