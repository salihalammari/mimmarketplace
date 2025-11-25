# API Test Data

## Available POST Endpoints

### 1. POST /webhooks/webflow (Webflow Webhook)
**URL:** `https://mimmarketplace.onrender.com/webhooks/webflow`

This is the endpoint that receives form submissions from Webflow.

#### Test Data (Using Your Exact Field Names)

**cURL:**
```bash
curl -X POST https://mimmarketplace.onrender.com/webhooks/webflow \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Application form",
    "site": "mimmarketplace",
    "submittedAt": "2025-11-19T20:00:00.000Z",
    "data": {
      "full_name": "Ahmed Benali",
      "email": "ahmed.benali@example.com",
      "phone_number": "+212612345678",
      "selling_page": "https://myshop.com",
      "secondarys_selling_page": "https://myshop.com/secondary",
      "city": "Casablanca",
      "products_category": "Electronics",
      "others": "Mobile accessories and gadgets",
      "valide_product": "yes",
      "products_type": "Digital Products",
      "time_selling": "2 years",
      "feedbacks": "Very positive feedback from customers",
      "return_policies": "30 days return policy",
      "fake_orders": "Never experienced fake orders"
    }
  }'
```

**JavaScript/Fetch:**
```javascript
fetch('https://mimmarketplace.onrender.com/webhooks/webflow', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Application form",
    site: "mimmarketplace",
    submittedAt: new Date().toISOString(),
    data: {
      full_name: "Ahmed Benali",
      email: "ahmed.benali@example.com",
      phone_number: "+212612345678",
      selling_page: "https://myshop.com",
      secondarys_selling_page: "https://myshop.com/secondary",
      city: "Casablanca",
      products_category: "Electronics",
      others: "Mobile accessories and gadgets",
      valide_product: "yes",
      products_type: "Digital Products",
      time_selling: "2 years",
      feedbacks: "Very positive feedback from customers",
      return_policies: "30 days return policy",
      fake_orders: "Never experienced fake orders"
    }
  })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

**Python:**
```python
import requests
import json
from datetime import datetime

url = "https://mimmarketplace.onrender.com/webhooks/webflow"
payload = {
    "name": "Application form",
    "site": "mimmarketplace",
    "submittedAt": datetime.now().isoformat(),
    "data": {
        "full_name": "Ahmed Benali",
        "email": "ahmed.benali@example.com",
        "phone_number": "+212612345678",
        "selling_page": "https://myshop.com",
        "secondarys_selling_page": "https://myshop.com/secondary",
        "city": "Casablanca",
        "products_category": "Electronics",
        "others": "Mobile accessories and gadgets",
        "valide_product": "yes",
        "products_type": "Digital Products",
        "time_selling": "2 years",
        "feedbacks": "Very positive feedback from customers",
        "return_policies": "30 days return policy",
        "fake_orders": "Never experienced fake orders"
    }
}

response = requests.post(url, json=payload)
print(response.json())
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Application received successfully",
  "applicationId": "uuid-here"
}
```

---

### 2. POST /applications (Direct API)
**URL:** `https://mimmarketplace.onrender.com/applications`

This endpoint creates an application directly (not from Webflow).

#### Test Data

**cURL:**
```bash
curl -X POST https://mimmarketplace.onrender.com/applications \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Ahmed Benali",
    "email": "ahmed.benali@example.com",
    "phone": "+212612345678",
    "category": "Electronics",
    "language": "en",
    "submitted_fields": {
      "sellingPage": "https://myshop.com",
      "secondarySellingPage": "https://myshop.com/secondary",
      "city": "Casablanca",
      "productsCategory": "Electronics",
      "otherProducts": "Mobile accessories and gadgets",
      "validProduct": true,
      "productsType": "Digital Products",
      "timeSelling": "2 years",
      "feedbacks": "Very positive feedback from customers",
      "returnPolicies": "30 days return policy",
      "fakeOrders": "Never experienced fake orders"
    }
  }'
```

**JavaScript/Fetch:**
```javascript
fetch('https://mimmarketplace.onrender.com/applications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    full_name: "Ahmed Benali",
    email: "ahmed.benali@example.com",
    phone: "+212612345678",
    category: "Electronics",
    language: "en",
    submitted_fields: {
      sellingPage: "https://myshop.com",
      secondarySellingPage: "https://myshop.com/secondary",
      city: "Casablanca",
      productsCategory: "Electronics",
      otherProducts: "Mobile accessories and gadgets",
      validProduct: true,
      productsType: "Digital Products",
      timeSelling: "2 years",
      feedbacks: "Very positive feedback from customers",
      returnPolicies: "30 days return policy",
      fakeOrders: "Never experienced fake orders"
    }
  })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

**Expected Response:**
```json
{
  "id": "uuid-here",
  "full_name": "Ahmed Benali",
  "email": "ahmed.benali@example.com",
  "phone": "+212612345678",
  "category": "Electronics",
  "language": "en",
  "status": "pending",
  "submitted_fields": {
    "sellingPage": "https://myshop.com",
    "secondarySellingPage": "https://myshop.com/secondary",
    "city": "Casablanca",
    "productsCategory": "Electronics",
    "otherProducts": "Mobile accessories and gadgets",
    "validProduct": true,
    "productsType": "Digital Products",
    "timeSelling": "2 years",
    "feedbacks": "Very positive feedback from customers",
    "returnPolicies": "30 days return policy",
    "fakeOrders": "Never experienced fake orders"
  },
  "created_at": "2025-11-19T20:00:00.000Z",
  "updated_at": "2025-11-19T20:00:00.000Z"
}
```

---

### 3. POST /webhooks/webflow/test (Test Endpoint)
**URL:** `https://mimmarketplace.onrender.com/webhooks/webflow/test`

Simple test endpoint to verify the webhook is accessible.

**cURL:**
```bash
curl -X POST https://mimmarketplace.onrender.com/webhooks/webflow/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Webhook endpoint is working",
  "receivedData": {
    "test": "data"
  }
}
```

---

## Field Mapping Reference

### Required Fields (for /webhooks/webflow)
- `full_name` → `full_name` (database)
- `email` → `email` (database)
- `products_category` → `category` (database)

### Optional Fields (stored in submitted_fields)
- `phone_number` → `phone` (database)
- `selling_page` → `sellingPage`
- `secondarys_selling_page` → `secondarySellingPage`
- `city` → `city`
- `products_category` → `productsCategory`
- `others` → `otherProducts`
- `valide_product` → `validProduct` (boolean)
- `products_type` → `productsType`
- `time_selling` → `timeSelling`
- `feedbacks` → `feedbacks`
- `return_policies` → `returnPolicies`
- `fake_orders` → `fakeOrders`

---

## Quick Test Commands

### Test Webhook Endpoint
```bash
curl -X POST https://mimmarketplace.onrender.com/webhooks/webflow/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Test Full Webhook with Your Fields
```bash
curl -X POST https://mimmarketplace.onrender.com/webhooks/webflow \
  -H "Content-Type: application/json" \
  -d '{
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

### Verify Application Was Created
```bash
curl https://mimmarketplace.onrender.com/applications
```

---

## Notes

- `/admin` is a **GET** endpoint (serves the dashboard HTML)
- Use `/webhooks/webflow` for Webflow form submissions
- Use `/applications` for direct API calls
- All endpoints support CORS
- Required fields are validated automatically

