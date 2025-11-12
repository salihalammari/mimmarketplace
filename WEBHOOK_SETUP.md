# Webhook Setup Guide for Application Form

## Overview

Your application form at `mimmarketplace.com/application-form` needs to send data to the backend API when users submit the form.

## Webhook Configuration

### Option 1: Webflow Webhook (Recommended)

If your form is built in Webflow:

1. **Go to Webflow Dashboard**
   - Navigate to your project
   - Go to **Project Settings** → **Integrations** → **Webhooks**

2. **Create New Webhook**
   - Click **+ Add webhook**
   - Select trigger: **Form submission: API V2**
   - Enter webhook URL:
     ```
     https://mimmarketplace.onrender.com/webhooks/webflow
     ```
   - Method: **POST**
   - Click **Save**

3. **Form Field Names**
   Make sure your Webflow form fields use these names (English or Arabic):
   
   **Required:**
   - `full-name` or `الاسم-الكامل` - Seller's full name
   - `email` or `البريد-الالكتروني` - Email address
   - `phone` or `whatsapp` or `رقم-الهاتف` - Phone number
   - `category` or `فئة` - Product category
   - `language` - Language preference (`en` or `ar`)

   **Optional:**
   - `main-sales-page` or `رابط-صفحة-البيع` - Shop URL
   - `city` or `المدينة` - City
   - `products-brand` or `المنتجات-والبراند` - Products description
   - `sales-categories` or `فئات-البيع` - Categories (array)
   - `badge-usage` or `استعمال-البادج` - Badge locations (array)
   - And other fields as needed

### Option 2: Direct API Call (Custom Form)

If you have a custom form (not Webflow), you can call the API directly:

```javascript
// In your form submission handler
async function submitForm(formData) {
  const response = await fetch('https://mimmarketplace.onrender.com/applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      seller_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      category: formData.category,
      language: formData.language || 'ar',
      submitted_fields: {
        city: formData.city,
        mainSalesPageLink: formData.shopUrl,
        productsAndBrand: formData.products,
        // ... other fields
      }
    }),
  });

  const result = await response.json();
  return result;
}
```

## Testing the Webhook

### Test Webhook Endpoint

```bash
curl -X POST https://mimmarketplace.onrender.com/webhooks/webflow/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Test with Sample Data

```bash
curl -X POST https://mimmarketplace.onrender.com/webhooks/webflow \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Application Form",
    "site": "mimmarketplace.com",
    "data": {
      "full-name": "Test Seller",
      "email": "test@example.com",
      "phone": "+212612345678",
      "category": "electronics",
      "language": "ar",
      "city": "Casablanca",
      "main-sales-page": "https://example.com/shop"
    },
    "submittedAt": "2025-11-12T16:00:00Z"
  }'
```

## Data Flow

```
User Submits Form
    ↓
Webflow/Custom Form
    ↓
POST to /webhooks/webflow
    ↓
Backend Processes Data
    ↓
Saves to Database (applications table)
    ↓
Returns Success Response
    ↓
Admin Dashboard Displays New Application
```

## Verifying Data is Saved

1. **Check Admin Dashboard**
   - Go to: `https://mimmarketplace.onrender.com/`
   - View applications list
   - New submissions should appear immediately

2. **Check API Directly**
   ```bash
   curl https://mimmarketplace.onrender.com/applications
   ```

3. **Check Render Logs**
   - Go to Render Dashboard
   - View service logs
   - Look for "Received Webflow webhook" messages

## Troubleshooting

### Form submission not appearing in dashboard

1. **Check Webhook URL**
   - Verify it's: `https://mimmarketplace.onrender.com/webhooks/webflow`
   - Make sure it's using HTTPS

2. **Check Field Names**
   - Ensure form field names match expected names
   - Check for typos in field names

3. **Check Render Logs**
   - Look for error messages
   - Check if webhook is being received

4. **Test Webhook Manually**
   - Use the test endpoint first
   - Then test with sample data

### Data not saving correctly

1. **Check Required Fields**
   - `seller_name` (from `full-name`)
   - `email`
   - `category`
   - `language`

2. **Check Database Connection**
   - Verify DATABASE_URL is set correctly
   - Check if database is accessible

3. **Check API Response**
   - Look for error messages in response
   - Check status codes

## Field Mapping Reference

| Form Field Name | Database Field | Type |
|----------------|----------------|------|
| `full-name` / `الاسم-الكامل` | `seller_name` | Required |
| `email` / `البريد-الالكتروني` | `email` | Required |
| `phone` / `رقم-الهاتف` | `phone` | Optional |
| `category` / `فئة` | `category` | Required |
| `language` | `language` | Required |
| `main-sales-page` / `رابط-صفحة-البيع` | `submitted_fields.mainSalesPageLink` | Optional |
| `city` / `المدينة` | `submitted_fields.city` | Optional |
| `products-brand` / `المنتجات-والبراند` | `submitted_fields.productsAndBrand` | Optional |
| `sales-categories` / `فئات-البيع` | `submitted_fields.salesCategories` | Array |
| `badge-usage` / `استعمال-البادج` | `submitted_fields.badgeUsageLocations` | Array |

## Next Steps

1. ✅ Configure webhook in Webflow
2. ✅ Test form submission
3. ✅ Verify data appears in admin dashboard
4. ✅ Set up WhatsApp notifications (optional)

## Support

If you encounter issues:
- Check Render logs: `https://dashboard.render.com`
- Test webhook endpoint: `/webhooks/webflow/test`
- Verify API health: `/health`

