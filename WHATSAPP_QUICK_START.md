# WhatsApp Quick Start - Free Setup (5 Minutes)

## 🎯 Easiest Free Option: Evolution API on Render

### Step 1: Deploy Evolution API (2 minutes)

1. **Go to Render Dashboard** → New → Web Service
2. **Connect GitHub repo:** `https://github.com/EvolutionAPI/evolution-api`
3. **Or use Docker:**
   - Service Type: **Web Service**
   - Environment: **Docker**
   - Docker Image: `atendai/evolution-api:latest`
   - Port: `8080`

4. **Set Environment Variables:**
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/db
   # Get free PostgreSQL from Supabase or Render
   ```

5. **Deploy!** Your Evolution API will be at: `https://evolution-api.onrender.com`

### Step 2: Create WhatsApp Instance (1 minute)

**Option A: Via Web Interface (if available)**
- Go to your Evolution API URL
- Create new instance
- Scan QR code

**Option B: Via API:**
```bash
curl -X POST "https://evolution-api.onrender.com/instance/create" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "mim-marketplace",
    "token": "your-secret-token-123",
    "qrcode": true
  }'
```

**Save the response** - you'll need:
- Instance name: `mim-marketplace`
- QR code (to scan)

### Step 3: Connect WhatsApp (1 minute)

1. Open WhatsApp on your phone
2. Go to **Settings** → **Linked Devices** → **Link a Device**
3. Scan the QR code from Step 2
4. Wait for "Connected" status

### Step 4: Configure Your Backend (1 minute)

In **Render Dashboard** → Your `mimmarketplace` service → **Environment**:

Add these variables:
```
EVOLUTION_API_URL=https://evolution-api.onrender.com
EVOLUTION_INSTANCE_NAME=mim-marketplace
EVOLUTION_API_KEY=your-secret-token-123
WHATSAPP_DEFAULT_COUNTRY_CODE=+212
```

**Save** and **Redeploy** your service.

### Step 5: Test! (30 seconds)

```bash
# Replace <APP_ID> with a real application ID
curl -X PATCH "https://mimmarketplace.onrender.com/applications/<APP_ID>/status" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"qualified\"}"
```

**Check:**
- ✅ Render logs: `WhatsApp notification sent via Evolution API to...`
- ✅ Your WhatsApp: You should receive the message!

## 🎉 Done!

Your WhatsApp notifications are now working for free!

## 🔍 Verify It's Working

1. **Check Evolution API Status:**
   ```bash
   curl "https://evolution-api.onrender.com/instance/fetchInstances"
   ```
   Should show your instance with status "open"

2. **Check Your Backend Logs:**
   - Render Dashboard → Logs
   - Look for: `WhatsApp notification sent via Evolution API`

3. **Test with Real Application:**
   - Change status in admin dashboard
   - Check WhatsApp for message

## 🐛 Quick Fixes

**"Instance not found":**
- Double-check `EVOLUTION_INSTANCE_NAME` matches exactly
- Verify instance exists in Evolution API

**"Connection closed":**
- Re-scan QR code
- Make sure WhatsApp is still connected

**"Message not sending":**
- Check phone number format: `+212612345678`
- Verify Evolution API is running
- Check Evolution API logs

## 💡 Alternative: Use Free Cloud Service

If self-hosting seems complex, try:

1. **Chatwoot** (Free tier): [https://www.chatwoot.com](https://www.chatwoot.com)
2. **Wati.io** (Free trial): [https://www.wati.io](https://www.wati.io)

Then update the code to use their webhook/API instead of Evolution API.

## 📞 Need Help?

- Evolution API Docs: [https://doc.evolution-api.com](https://doc.evolution-api.com)
- Check `WHATSAPP_SETUP_FREE.md` for detailed instructions

