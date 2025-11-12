# Integration Guide

Complete guide for integrating the MIM Marketplace Backend API with Webflow forms and frontend applications.

## Table of Contents

1. [Webflow Form Integration](#webflow-form-integration)
2. [Frontend Integration](#frontend-integration)
   - [Vanilla JavaScript](#vanilla-javascript)
   - [React](#react)
   - [Vue.js](#vuejs)
   - [Angular](#angular)
   - [Next.js](#nextjs)

---

## Webflow Form Integration

### Step 1: Set Up Webhook in Webflow

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

3. **Test the Webhook** (Optional)
   - Use the test endpoint to verify:
     ```
     POST https://mimmarketplace.onrender.com/webhooks/webflow/test
     ```

### Step 2: Configure Form Fields

Your Webflow form fields should use these names (English or Arabic supported):

#### Required Fields:
- `full-name` or `الاسم-الكامل` - Seller's full name
- `email` or `البريد-الالكتروني` - Email address
- `phone` or `whatsapp` or `رقم-الهاتف` - Phone number
- `category` or `فئة` - Product category
- `language` - Language preference (`en` or `ar`)

#### Optional Fields:
- `main-sales-page` or `رابط-صفحة-البيع` - Main sales page URL
- `city` or `المدينة` - City
- `products-brand` or `المنتجات-والبراند` - Products and brand description
- `sales-categories` or `فئات-البيع` - Sales categories (array)
- `badge-usage` or `استعمال-البادج` - Badge usage locations (array)
- `images-belong-to-store` or `هل-الصور-تنتمي` - Boolean (yes/no)
- `product-type` or `نوع-المنتوج` - Product type
- `selling-duration` or `مدة-البيع` - Selling duration
- `customer-feedback` or `تعليقات-الزبائن` - Customer feedback frequency
- `return-handling` or `إرجاع-السلعة` - Return handling policy
- `fake-orders` or `طلبات-مزيفة` - Fake orders experience
- `shipping-time` or `مدة-الشحن` - Shipping time
- `delivery-area` or `منطقة-التوصيل` - Delivery area

### Step 3: Webflow Form Setup Example

In your Webflow form, set field names like this:

```html
<!-- Example form structure -->
<form>
  <input type="text" name="full-name" placeholder="Full Name" required />
  <input type="email" name="email" placeholder="Email" required />
  <input type="tel" name="phone" placeholder="Phone" required />
  <select name="category" required>
    <option value="electronics">Electronics</option>
    <option value="fashion">Fashion</option>
    <option value="home">Home & Living</option>
  </select>
  <select name="language" required>
    <option value="en">English</option>
    <option value="ar">Arabic</option>
  </select>
  <!-- Additional fields... -->
</form>
```

### Step 4: Verify Webhook is Working

After submitting a form in Webflow:

1. Check Render logs for webhook receipt
2. Verify data in database via API:
   ```bash
   GET https://mimmarketplace.onrender.com/applications
   ```

---

## Frontend Integration

The API is CORS-enabled, so you can call it directly from any frontend application.

### Base URL
```
https://mimmarketplace.onrender.com
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/applications` | Get all applications |
| GET | `/applications/:id` | Get specific application |
| POST | `/applications` | Create new application |
| PATCH | `/applications/:id/status` | Update application status |

---

## Vanilla JavaScript

### Create Application

```html
<!DOCTYPE html>
<html>
<head>
  <title>MIM Marketplace Application</title>
</head>
<body>
  <form id="applicationForm">
    <input type="text" name="seller_name" placeholder="Seller Name" required />
    <input type="email" name="email" placeholder="Email" required />
    <input type="tel" name="phone" placeholder="Phone" />
    <input type="text" name="category" placeholder="Category" required />
    <select name="language" required>
      <option value="en">English</option>
      <option value="ar">Arabic</option>
    </select>
    <textarea name="submitted_fields" placeholder='{"city": "Casablanca"}'></textarea>
    <button type="submit">Submit Application</button>
  </form>

  <script>
    const form = document.getElementById('applicationForm');
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = {
        seller_name: formData.get('seller_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        category: formData.get('category'),
        language: formData.get('language'),
        submitted_fields: formData.get('submitted_fields') 
          ? JSON.parse(formData.get('submitted_fields')) 
          : null
      };

      try {
        const response = await fetch('https://mimmarketplace.onrender.com/applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const result = await response.json();
          alert('Application submitted successfully! ID: ' + result.id);
          form.reset();
        } else {
          const error = await response.json();
          alert('Error: ' + (error.message || 'Failed to submit'));
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Network error. Please try again.');
      }
    });
  </script>
</body>
</html>
```

### Fetch Applications

```javascript
async function fetchApplications() {
  try {
    const response = await fetch('https://mimmarketplace.onrender.com/applications');
    const applications = await response.json();
    console.log('Applications:', applications);
    return applications;
  } catch (error) {
    console.error('Error fetching applications:', error);
  }
}

// Usage
fetchApplications();
```

---

## React

### Installation

```bash
npm install axios
# or
npm install fetch
```

### Create Application Component

```jsx
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://mimmarketplace.onrender.com';

function ApplicationForm() {
  const [formData, setFormData] = useState({
    seller_name: '',
    email: '',
    phone: '',
    category: '',
    language: 'en',
    submitted_fields: {}
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/applications`, formData);
      setMessage(`Success! Application ID: ${response.data.id}`);
      setFormData({
        seller_name: '',
        email: '',
        phone: '',
        category: '',
        language: 'en',
        submitted_fields: {}
      });
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="seller_name"
        value={formData.seller_name}
        onChange={handleChange}
        placeholder="Seller Name"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
      />
      <input
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Category"
        required
      />
      <select
        name="language"
        value={formData.language}
        onChange={handleChange}
        required
      >
        <option value="en">English</option>
        <option value="ar">Arabic</option>
      </select>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
      
      {message && <p>{message}</p>}
    </form>
  );
}

export default ApplicationForm;
```

### Fetch Applications Hook

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://mimmarketplace.onrender.com';

function useApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${API_URL}/applications`);
        setApplications(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return { applications, loading, error };
}

// Usage
function ApplicationsList() {
  const { applications, loading, error } = useApplications();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {applications.map(app => (
        <div key={app.id}>
          <h3>{app.seller_name}</h3>
          <p>{app.email}</p>
          <p>Status: {app.status}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Vue.js

### Installation

```bash
npm install axios
```

### Application Form Component

```vue
<template>
  <form @submit.prevent="submitApplication">
    <input
      v-model="formData.seller_name"
      type="text"
      placeholder="Seller Name"
      required
    />
    <input
      v-model="formData.email"
      type="email"
      placeholder="Email"
      required
    />
    <input
      v-model="formData.phone"
      type="tel"
      placeholder="Phone"
    />
    <input
      v-model="formData.category"
      type="text"
      placeholder="Category"
      required
    />
    <select v-model="formData.language" required>
      <option value="en">English</option>
      <option value="ar">Arabic</option>
    </select>
    
    <button type="submit" :disabled="loading">
      {{ loading ? 'Submitting...' : 'Submit Application' }}
    </button>
    
    <p v-if="message">{{ message }}</p>
  </form>
</template>

<script>
import axios from 'axios';

const API_URL = 'https://mimmarketplace.onrender.com';

export default {
  data() {
    return {
      formData: {
        seller_name: '',
        email: '',
        phone: '',
        category: '',
        language: 'en',
        submitted_fields: {}
      },
      loading: false,
      message: ''
    };
  },
  methods: {
    async submitApplication() {
      this.loading = true;
      this.message = '';

      try {
        const response = await axios.post(`${API_URL}/applications`, this.formData);
        this.message = `Success! Application ID: ${response.data.id}`;
        this.formData = {
          seller_name: '',
          email: '',
          phone: '',
          category: '',
          language: 'en',
          submitted_fields: {}
        };
      } catch (error) {
        this.message = `Error: ${error.response?.data?.message || error.message}`;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

---

## Angular

### Service

```typescript
// application.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://mimmarketplace.onrender.com';

export interface Application {
  id?: string;
  seller_name: string;
  email: string;
  phone?: string;
  category: string;
  language: string;
  status?: string;
  submitted_fields?: any;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  constructor(private http: HttpClient) {}

  createApplication(application: Application): Observable<Application> {
    return this.http.post<Application>(`${API_URL}/applications`, application);
  }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${API_URL}/applications`);
  }

  getApplication(id: string): Observable<Application> {
    return this.http.get<Application>(`${API_URL}/applications/${id}`);
  }

  updateStatus(id: string, status: string, notes?: string): Observable<Application> {
    return this.http.patch<Application>(`${API_URL}/applications/${id}/status`, {
      status,
      notes
    });
  }
}
```

### Component

```typescript
// application-form.component.ts
import { Component } from '@angular/core';
import { ApplicationService, Application } from './application.service';

@Component({
  selector: 'app-application-form',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="application.seller_name" name="seller_name" placeholder="Seller Name" required />
      <input [(ngModel)]="application.email" name="email" type="email" placeholder="Email" required />
      <input [(ngModel)]="application.phone" name="phone" type="tel" placeholder="Phone" />
      <input [(ngModel)]="application.category" name="category" placeholder="Category" required />
      <select [(ngModel)]="application.language" name="language" required>
        <option value="en">English</option>
        <option value="ar">Arabic</option>
      </select>
      
      <button type="submit" [disabled]="loading">
        {{ loading ? 'Submitting...' : 'Submit Application' }}
      </button>
      
      <p *ngIf="message">{{ message }}</p>
    </form>
  `
})
export class ApplicationFormComponent {
  application: Application = {
    seller_name: '',
    email: '',
    phone: '',
    category: '',
    language: 'en'
  };
  loading = false;
  message = '';

  constructor(private applicationService: ApplicationService) {}

  onSubmit() {
    this.loading = true;
    this.message = '';

    this.applicationService.createApplication(this.application).subscribe({
      next: (result) => {
        this.message = `Success! Application ID: ${result.id}`;
        this.application = {
          seller_name: '',
          email: '',
          phone: '',
          category: '',
          language: 'en'
        };
      },
      error: (error) => {
        this.message = `Error: ${error.error?.message || error.message}`;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
```

---

## Next.js

### API Route (Server-Side)

```typescript
// pages/api/submit-application.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const API_URL = 'https://mimmarketplace.onrender.com';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
```

### Client Component

```tsx
// components/ApplicationForm.tsx
'use client';

import { useState } from 'react';

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    seller_name: '',
    email: '',
    phone: '',
    category: '',
    language: 'en',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Success! Application ID: ${data.id}`);
        setFormData({
          seller_name: '',
          email: '',
          phone: '',
          category: '',
          language: 'en',
        });
      } else {
        setMessage(`Error: ${data.message || 'Failed to submit'}`);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

---

## Error Handling

All endpoints return standard HTTP status codes:

- `200` - Success (GET requests)
- `201` - Created (POST requests)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format

```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

---

## Testing

### Test Health Endpoint

```bash
curl https://mimmarketplace.onrender.com/health
```

### Test Create Application

```bash
curl -X POST https://mimmarketplace.onrender.com/applications \
  -H "Content-Type: application/json" \
  -d '{
    "seller_name": "Test Seller",
    "email": "test@example.com",
    "category": "electronics",
    "language": "en",
    "phone": "+212612345678"
  }'
```

---

## Support

For issues or questions:
- Check API health: `https://mimmarketplace.onrender.com/health`
- Review Render logs for errors
- Verify CORS is enabled (already configured)

