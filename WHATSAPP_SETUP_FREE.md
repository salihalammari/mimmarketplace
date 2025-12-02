# Free WhatsApp Setup Guide - Evolution API

Evolution API is the **best free option** for WhatsApp notifications. It's open-source and can be self-hosted for free.

## 🚀 Quick Setup (3 Options)

### Option 1: Evolution API Cloud (Easiest - Free Tier Available)

1. **Sign up at Evolution API Cloud:**
   - Go to [https://evolution-api.com](https://evolution-api.com)
   - Or check their GitHub: [https://github.com/EvolutionAPI/evolution-api](https://github.com/EvolutionAPI/evolution-api)
   - Some providers offer free tiers

2. **Create an Instance:**
   - After signing up, create a new WhatsApp instance
   - You'll get an API URL and instance name

3. **Scan QR Code:**
   - Use your personal WhatsApp to scan the QR code
   - This connects your WhatsApp to the API

4. **Get Your Credentials:**
   - API URL: `https://your-instance.evolution-api.com`
   - Instance Name: `your-instance-name`
   - API Key (if required): Check your dashboard

5. **Configure in Render:**
   ```
   EVOLUTION_API_URL=https://your-instance.evolution-api.com
   EVOLUTION_INSTANCE_NAME=your-instance-name
   EVOLUTION_API_KEY=your-api-key (if required)
   WHATSAPP_DEFAULT_COUNTRY_CODE=+212
   ```

### Option 2: Self-Host on Render (100% Free)

1. **Create New Service on Render:**
   - Go to Render Dashboard → New → Web Service
   - Connect to Evolution API GitHub repo

2. **Use this Docker setup:**
   ```yaml
   # render.yaml (for Evolution API service)
   services:
     - type: web
       name: evolution-api
       env: docker
       dockerfilePath: ./Dockerfile
       envVars:
         - key: DATABASE_URL
           value: postgresql://...
         - key: REDIS_URL
           value: redis://...
   ```

3. **Or use their Docker image:**
   ```bash
   docker run -d \
     -p 8080:8080 \
     -e DATABASE_URL=postgresql://... \
     -e REDIS_URL=redis://... \
     atendai/evolution-api:latest
   ```

4. **Access Evolution API:**
   - Your service will be at: `https://evolution-api.onrender.com`
   - Create instance via API or web interface
   - Scan QR code with WhatsApp

5. **Configure in your main service:**
   ```
   EVOLUTION_API_URL=https://evolution-api.onrender.com
   EVOLUTION_INSTANCE_NAME=your-instance-name
   WHATSAPP_DEFAULT_COUNTRY_CODE=+212
   ```

### Option 3: Use Free Cloud Provider (Recommended for Quick Start)

**Recommended Free Providers:**

1. **Chatwoot (Free Tier):**
   - [https://www.chatwoot.com](https://www.chatwoot.com)
   - Free tier includes WhatsApp integration
   - Easy setup

2. **Wati.io (Free Trial):**
   - [https://www.wati.io](https://www.wati.io)
   - Free trial, then pay-per-use
   - Very reliable

3. **Twilio WhatsApp (Free Trial):**
   - [https://www.twilio.com/whatsapp](https://www.twilio.com/whatsapp)
   - Free trial credits
   - Then pay-per-message

## 📝 Step-by-Step: Evolution API Setup

### Step 1: Deploy Evolution API

**Using Render (Free):**

1. Fork this repo: [https://github.com/EvolutionAPI/evolution-api](https://github.com/EvolutionAPI/evolution-api)
2. In Render, create new Web Service
3. Connect your forked repo
4. Set environment variables:
   ```
   DATABASE_URL=your_postgres_url
   REDIS_URL=your_redis_url (optional)
   PORT=8080
   ```
5. Deploy!

**Using Docker (Local/Any Server):**

```bash
docker run -d \
  --name evolution-api \
  -p 8080:8080 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  atendai/evolution-api:latest
```

### Step 2: Create WhatsApp Instance

**Via API:**
```bash
curl -X POST "https://your-evolution-api.com/instance/create" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "mim-marketplace",
    "token": "your-secret-token",
    "qrcode": true
  }'
```

**Response:**
```json
{
  "qrcode": {
    "code": "data:image/png;base64,...",
    "base64": "..."
  },
  "instance": {
    "instanceName": "mim-marketplace",
    "status": "created"
  }
}
```

### Step 3: Scan QR Code

1. Open the QR code image from the response
2. Open WhatsApp on your phone
3. Go to Settings → Linked Devices → Link a Device
4. Scan the QR code
5. Wait for connection (status will change to "open")

### Step 4: Test Connection

```bash
curl -X GET "https://your-evolution-api.com/instance/fetchInstances"
```

Should return your instance with status "open".

### Step 5: Configure Your Backend

In Render Dashboard → Your Service → Environment:

```
EVOLUTION_API_URL=https://your-evolution-api.com
EVOLUTION_INSTANCE_NAME=mim-marketplace
EVOLUTION_API_KEY=your-secret-token (if you set one)
WHATSAPP_DEFAULT_COUNTRY_CODE=+212
```

### Step 6: Test WhatsApp Notification

```bash
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"qualified\"}"
```

Check:
- Render logs: `WhatsApp notification sent via Evolution API to...`
- Your WhatsApp: Should receive the message!

## 🔧 Alternative: Simple HTTP Webhook (Easiest Free Option)

If Evolution API seems complex, you can use a simple webhook service:

### Using Make.com (Free Tier):

1. Sign up at [https://make.com](https://make.com) (free tier available)
2. Create a scenario:
   - Trigger: Webhook
   - Action: Send WhatsApp (via Make's WhatsApp integration)
3. Get webhook URL
4. Update `notifications.service.ts` to call your webhook

### Using Zapier (Free Tier):

1. Sign up at [https://zapier.com](https://zapier.com)
2. Create Zap:
   - Trigger: Webhook
   - Action: Send WhatsApp message
3. Get webhook URL
4. Use in your code

## ✅ Quick Test Checklist

- [ ] Evolution API deployed and running
- [ ] WhatsApp instance created
- [ ] QR code scanned and connected
- [ ] Environment variables set in Render
- [ ] Test notification sent
- [ ] WhatsApp message received
- [ ] Check logs for confirmation

## 🐛 Troubleshooting

**"Instance not found":**
- Check `EVOLUTION_INSTANCE_NAME` matches exactly
- Verify instance exists: `GET /instance/fetchInstances`

**"Connection closed":**
- Re-scan QR code
- Check WhatsApp is connected: `GET /instance/connectionState/{instanceName}`

**"Message not sending":**
- Verify phone number format: `+212612345678`
- Check instance status is "open"
- Review Evolution API logs

**"API URL not working":**
- Ensure URL doesn't end with `/`
- Check Evolution API is accessible
- Verify CORS is enabled on Evolution API

## 💡 Pro Tips

1. **Use a dedicated WhatsApp number** (not your personal one) for production
2. **Keep QR code secure** - anyone with it can access your WhatsApp
3. **Monitor Evolution API logs** for delivery status
4. **Set up webhook** in Evolution API to track message delivery
5. **Use Redis** for better performance (optional but recommended)

## 🎯 Recommended Setup for Production

1. **Self-host Evolution API** on Render (free tier)
2. **Use dedicated WhatsApp Business number** (if possible)
3. **Set up monitoring** for message delivery
4. **Configure webhooks** for delivery status
5. **Add retry logic** for failed messages

## 📚 Resources

- Evolution API Docs: [https://doc.evolution-api.com](https://doc.evolution-api.com)
- Evolution API GitHub: [https://github.com/EvolutionAPI/evolution-api](https://github.com/EvolutionAPI/evolution-api)
- Community Support: [Evolution API Discord](https://discord.gg/evolutionapi)

