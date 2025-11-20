# Fix: Empty Data from Framer/Webflow Form Submission

## Problem

Your form is submitting to **Webflow's API directly** (`https://webflow.com/api/v1/form/669d41d62080b312856f3d70`), not to your backend webhook. This is why the data is empty in your database.

## Root Cause

When a form is submitted on a Webflow site:
1. The form submits to Webflow's form API (what you're seeing)
2. Webflow processes the submission
3. **Webflow then sends a webhook** to your configured webhook URL (if set up)
4. Your backend receives the webhook with the form data

**The issue:** Your webhook might not be configured, or Webflow isn't sending the data in the expected format.

## Solution 1: Configure Webflow Webhook (Recommended)

### Step 1: Set Up Webhook in Webflow Dashboard

1. Go to **Webflow Dashboard** → Your Site
2. Navigate to **Project Settings** → **Integrations** → **Webhooks**
3. Click **+ Add webhook**
4. Configure:
   - **Name:** Application Form Webhook
   - **Trigger:** Form submission: API V2
   - **URL:** `https://mimmarketplace.onrender.com/webhooks/webflow`
   - **Method:** POST
5. Click **Save**

### Step 2: Verify Form ID

The form ID in your request is: `669d41d62080b312856f3d70`

Make sure this form is connected to the webhook you just created.

### Step 3: Test the Webhook

After configuring, submit the form again and check:
1. **Render Logs** - Should show "Webflow Webhook Received"
2. **Database** - Should have the new application

## Solution 2: Check Webflow Webhook Payload Format

Webflow API V2 might send data in a different format. Let's check what format it's actually using.

### Check Render Logs

After submitting the form, check your Render logs for:
- "Full body: ..." - This shows the exact payload Webflow is sending
- "Clean form data keys: ..." - This shows what fields were extracted

### Common Webflow Payload Formats

**Format 1: Direct fields**
```json
{
  "name": "Application form",
  "data": {
    "full_name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Format 2: Nested in data**
```json
{
  "name": "Application form",
  "site": "mimmarketplace",
  "data": {
    "full_name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Format 3: Array format**
```json
[
  { "name": "full_name", "value": "John Doe" },
  { "name": "email", "value": "john@example.com" }
]
```

## Solution 3: Debug the Webhook

### Add Debugging to See What Webflow Sends

The webhook handler already logs everything. Check Render logs after form submission:

1. Go to **Render Dashboard** → Your Service → **Logs**
2. Submit the form
3. Look for these log entries:
   - "=== Webflow Webhook Received ==="
   - "Full body: ..."
   - "Clean form data keys: ..."

### If Webhook is Not Being Called

If you don't see any logs, the webhook isn't being triggered. Check:

1. **Webhook is enabled** in Webflow
2. **Webhook URL is correct:** `https://mimmarketplace.onrender.com/webhooks/webflow`
3. **Form is connected** to the webhook
4. **Webhook trigger** is set to "Form submission: API V2"

## Solution 4: Test Webhook Manually

Test if your webhook endpoint works with the expected format:

```bash
curl -X POST https://mimmarketplace.onrender.com/webhooks/webflow \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Application form",
    "site": "mimmarketplace",
    "data": {
      "full_name": "Test User",
      "email": "test@example.com",
      "phone_number": "+212612345678",
      "selling_page": "https://example.com",
      "city": "Casablanca",
      "products_category": "Electronics",
      "time_selling": "1 year",
      "feedbacks": "Good",
      "return_policies": "30 days",
      "fake_orders": "None"
    }
  }'
```

## Solution 5: Verify Form Field Names

Make sure your Webflow form fields use these exact names:

- `full_name` (not `full-name` or `fullName`)
- `email`
- `phone_number`
- `selling_page`
- `secondarys_selling_page`
- `city`
- `products_category`
- `others`
- `valide_product`
- `products_type`
- `time_selling`
- `feedbacks`
- `return_policies`
- `fake_orders`

### How to Check/Set Field Names in Webflow

1. Open your form in Webflow Designer
2. Select each form field
3. In the **Settings Panel** → **Field Settings**
4. Check/Set the **Field Name** (this is what gets sent in the webhook)

## Troubleshooting Steps

### Step 1: Verify Webhook Configuration

1. Go to Webflow Dashboard
2. Check if webhook exists and is enabled
3. Verify the URL is: `https://mimmarketplace.onrender.com/webhooks/webflow`
4. Check the trigger is: "Form submission: API V2"

### Step 2: Check Render Logs

1. Submit the form
2. Immediately check Render logs
3. Look for webhook activity

### Step 3: Test Webhook Endpoint

```bash
# Test if endpoint is accessible
curl -X POST https://mimmarketplace.onrender.com/webhooks/webflow/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Step 4: Check Form Submission

The form is submitting to Webflow successfully (200 OK), but:
- Webflow needs to forward it to your webhook
- The webhook needs to be configured correctly
- The form field names need to match

## Expected Flow

```
User submits form on mimmarketplace.com
    ↓
Form submits to Webflow API (what you see)
    ↓
Webflow processes submission
    ↓
Webflow sends webhook to: https://mimmarketplace.onrender.com/webhooks/webflow
    ↓
Your backend receives webhook with form data
    ↓
Data is saved to database
```

## Quick Fix Checklist

- [ ] Webhook is configured in Webflow Dashboard
- [ ] Webhook URL is: `https://mimmarketplace.onrender.com/webhooks/webflow`
- [ ] Webhook trigger is: "Form submission: API V2"
- [ ] Form field names match expected names (see above)
- [ ] Render logs show webhook being received
- [ ] Test webhook manually to verify it works

## Next Steps

1. **Configure the webhook** in Webflow Dashboard (if not done)
2. **Submit the form** again
3. **Check Render logs** immediately after submission
4. **Share the logs** if you still see empty data - we can debug the payload format

The webhook handler is already set up to handle multiple formats, so once Webflow sends the webhook, it should work!

