# 📱 Make.com WhatsApp Business Cloud Configuration Guide

## 🔍 Why All Fields Are Required

Each required field (*) serves a specific purpose:

1. **Connection*** - Links Make.com to your WhatsApp Business API account
2. **Sender ID*** - Your WhatsApp Business phone number (who sends the message)
3. **Receiver*** - The recipient's phone number (who receives the message)
4. **Message Template*** - The message content to send

## ✅ Step-by-Step Configuration

### Step 1: Connection* (Required)

**What it does:** Connects Make.com to your WhatsApp Business API

**How to fill:**
1. Click **"Add"** button next to "My WhatsApp Business Cl..."
2. **If you already have a connection:**
   - Select it from the dropdown
3. **If you need to create a connection:**
   - Click **"Add"** → Follow Make.com's connection wizard
   - You'll need:
     - WhatsApp Business API credentials
     - Access token
     - Phone number ID

**Note:** You need a WhatsApp Business API account set up first!

### Step 2: Sender ID* (Required)

**What it does:** Your WhatsApp Business phone number that sends messages

**How to fill:**
1. Click the dropdown arrow in the "Sender ID" field
2. **Select your WhatsApp Business phone number** from the list
   - It should show something like: `+212 644-003494` or your business number
3. **Or:** If you see "Mim Marketplace (+212 644-003494)" - select that

**Important:** This must be a verified WhatsApp Business number!

### Step 3: Receiver* (Required)

**What it does:** The phone number that will receive the message (from your backend)

**How to fill:**
1. Click in the "Receiver" field
2. **Click the mapping icon** (usually a small icon next to the field)
3. **Select from Webhook module:**
   - Choose: `1.phone` (from Webhooks module)
   - Or type: `{{1.phone}}`
4. **This will automatically use the phone number sent from your backend**

**Example:** If your backend sends `{"phone": "+212664990829"}`, this field will use that value.

### Step 4: Message Template* (Required)

**⚠️ IMPORTANT:** You're using "Send a Template Message" - this requires pre-approved templates!

**Two options:**

#### Option A: Use "Send a Message" (Free-form text) - RECOMMENDED

1. **Change module type:**
   - Delete current WhatsApp module
   - Add new module: **"WhatsApp Business Cloud" → "Send a Message"** (NOT "Send a Template Message")
2. **Configure:**
   - **Connection:** Same as above
   - **Sender ID:** Same as above
   - **Receiver:** `{{1.phone}}` (from webhook)
   - **Message Type:** "Text"
   - **Body:** `{{1.message}}` (from webhook)

#### Option B: Use Template (If you have approved templates)

1. **Keep "Send a Template Message"**
2. **Message Template field:**
   - Select a pre-approved template from dropdown
   - Templates must be approved by WhatsApp first
3. **Map template variables:**
   - If template has variables, map them from webhook data

## 🎯 Recommended Configuration

**Use "Send a Message" instead of "Send a Template Message":**

1. **Delete current WhatsApp module**
2. **Add new module:** "WhatsApp Business Cloud" → **"Send a Message"**
3. **Configure:**
   - **Connection:** Your WhatsApp Business connection
   - **Sender ID:** Your business phone number
   - **Receiver:** `{{1.phone}}` (from webhook)
   - **Message Type:** "Text"
   - **Body:** `{{1.message}}` (from webhook)

## 📋 Field Mapping Summary

| Field | Value | Source |
|-------|-------|--------|
| Connection* | Your WhatsApp Business API connection | Make.com connections |
| Sender ID* | Your business phone number | WhatsApp Business account |
| Receiver* | `{{1.phone}}` | From Webhook module |
| Message Template* | `{{1.message}}` | From Webhook module (if using "Send a Message") |

## 🔍 Why Each Field is Required

1. **Connection*** - Without it, Make.com can't access WhatsApp API
2. **Sender ID*** - WhatsApp needs to know which verified number sends the message
3. **Receiver*** - WhatsApp needs the recipient's phone number
4. **Message Template*** - WhatsApp needs the message content to send

## ✅ Quick Fix

**Change from "Send a Template Message" to "Send a Message":**

1. **Delete current WhatsApp module**
2. **Add:** "WhatsApp Business Cloud" → **"Send a Message"**
3. **Fill required fields:**
   - Connection: Your WhatsApp Business connection
   - Sender ID: Your business number
   - Receiver: `{{1.phone}}`
   - Message Type: "Text"
   - Body: `{{1.message}}`
4. **Save**

**This will work with your backend's free-form messages!**

## 🐛 Common Issues

### Issue 1: No Connection Available
**Fix:** Create WhatsApp Business API connection first in Make.com

### Issue 2: No Sender ID Available
**Fix:** Make sure your WhatsApp Business number is verified and connected

### Issue 3: Template Not Found
**Fix:** Use "Send a Message" instead of "Send a Template Message"

### Issue 4: Can't Map Receiver/Message
**Fix:** Make sure Webhook module is saved first, then use mapping dropdown

## 💡 Why "Send a Message" is Better

- ✅ No template approval needed
- ✅ Works with any message text
- ✅ Perfect for dynamic messages from your backend
- ✅ Easier to set up

**"Send a Template Message" requires:**
- ❌ Pre-approved templates from WhatsApp
- ❌ Template approval process
- ❌ Limited message flexibility

**Recommendation: Use "Send a Message" for your use case!**

