# Quick Start Guide

## 🚀 API Endpoint

```
https://mimmarketplace.onrender.com
```

## 📋 Quick Examples

### 1. Health Check
```bash
curl https://mimmarketplace.onrender.com/health
```

### 2. Create Application (cURL)
```bash
curl -X POST https://mimmarketplace.onrender.com/applications \
  -H "Content-Type: application/json" \
  -d '{
    "seller_name": "John Doe",
    "email": "john@example.com",
    "category": "electronics",
    "language": "en",
    "phone": "+212612345678"
  }'
```

### 3. JavaScript Fetch
```javascript
fetch('https://mimmarketplace.onrender.com/applications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    seller_name: 'John Doe',
    email: 'john@example.com',
    category: 'electronics',
    language: 'en'
  })
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

### 4. React Hook
```jsx
const submitApplication = async (data) => {
  const response = await fetch('https://mimmarketplace.onrender.com/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

## 🔗 Webflow Webhook URL

```
https://mimmarketplace.onrender.com/webhooks/webflow
```

## 📚 Full Documentation

- **Complete Integration Guide**: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Database Setup**: [RENDER_DATABASE_SETUP.md](./RENDER_DATABASE_SETUP.md)

## ✅ Required Fields

- `seller_name` (string)
- `email` (string, valid email)
- `category` (string)
- `language` (string: "en" or "ar")

## 📝 Optional Fields

- `phone` (string)
- `status` (string, defaults to "pending")
- `submitted_fields` (object, JSON)

## 🎯 Example Response

```json
{
  "id": "uuid-here",
  "seller_name": "John Doe",
  "email": "john@example.com",
  "category": "electronics",
  "language": "en",
  "status": "pending",
  "created_at": "2025-11-11T19:38:05.231Z",
  "updated_at": "2025-11-11T19:38:05.231Z"
}
```

