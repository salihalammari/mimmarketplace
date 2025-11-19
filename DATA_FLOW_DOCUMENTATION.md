# Complete Data Flow Documentation

## 🔄 End-to-End Data Flow

```
User submits form on Webflow
    ↓
Webflow sends webhook to Render
    ↓
Backend processes and saves to database
    ↓
Admin dashboard displays new application
    (auto-refreshes every 30 seconds)
```

## 📋 Detailed Step-by-Step Flow

### Step 1: User Submits Form on Webflow

**Location:** Webflow website (`mimmarketplace.com/application-form`)

**What happens:**
- User fills out the application form
- User clicks "Submit" button
- Webflow captures form data

**Form Fields (Example):**
- Full Name
- Email
- Phone/WhatsApp
- Category
- City
- Shop URL
- Products & Brand
- And other fields...

---

### Step 2: Webflow Sends Webhook to Render

**Webhook Configuration:**
- **URL:** `https://mimmarketplace.onrender.com/webhooks/webflow`
- **Method:** POST
- **Trigger:** Form submission: API V2
- **Content-Type:** application/json

**Webhook Payload Format:**
```json
{
  "name": "Application form",
  "site": "mimmarketplace",
  "submittedAt": "2025-11-19T17:30:00.000Z",
  "data": {
    "full-name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "category": "Electronics",
    "language": "en",
    "city": "New York",
    "main-sales-page": "https://example.com/shop"
  }
}
```

**Backend Processing:**
1. Webhook endpoint receives POST request
2. Validates webhook data structure
3. Extracts form fields from payload
4. Normalizes field names (handles English/Arabic)
5. Maps fields to application schema

**Endpoint:** `POST /webhooks/webflow`

---

### Step 3: Backend Processes and Saves to Database

**Processing Steps:**

1. **Data Normalization:**
   - Converts field names to lowercase
   - Replaces spaces/underscores with hyphens
   - Handles both English and Arabic field names

2. **Data Mapping:**
   - Maps Webflow fields to database schema
   - Extracts required fields (name, email, phone, category)
   - Stores additional fields in `submitted_fields` JSON

3. **Database Save:**
   - Creates new record in `applications` table
   - Sets default status: `pending`
   - Stores timestamp: `created_at`
   - Returns application ID

**Database Schema:**
```sql
applications
├── id (UUID)
├── seller_name
├── email
├── phone
├── category
├── language
├── status (pending/qualified/rejected/needs_info)
├── submitted_fields (JSON)
├── created_at
└── updated_at
```

**Response:**
```json
{
  "success": true,
  "message": "Application received successfully",
  "applicationId": "uuid-here"
}
```

---

### Step 4: Admin Dashboard Displays New Application

**Dashboard Access:**
- **URL:** `https://mimmarketplace.onrender.com/admin`
- **Auto-refresh:** Every 30 seconds

**Dashboard Features:**

1. **Statistics Display:**
   - Total applications
   - Pending count
   - Qualified count
   - Rejected count
   - Badge activated count

2. **Applications List:**
   - Shows all applications in a table
   - Displays: Name, Email, Phone, City, Category, Status, Date
   - Filter by status (All, Pending, Qualified, Rejected, Needs Info)
   - Sort by date (newest first)

3. **Application Details:**
   - Click "View" to see full details
   - Shows all submitted fields
   - Displays timestamps

4. **Actions:**
   - Update status (Pending → Qualified/Rejected/Needs Info)
   - Add admin notes
   - Create badge (for qualified applications)

**API Endpoints Used by Dashboard:**

- `GET /applications/stats` - Get statistics
- `GET /applications` - Get all applications
- `GET /applications?status=pending` - Filter by status
- `GET /applications/:id` - Get application details
- `PATCH /applications/:id/status` - Update status
- `POST /badges/create` - Create badge

**Auto-Refresh Mechanism:**
```javascript
// Dashboard automatically refreshes every 30 seconds
setInterval(() => {
  loadStats();
  loadApplications();
}, 30000);
```

---

## 🔍 Flow Verification

### Test the Complete Flow

Run the verification script:
```bash
node scripts/test-complete-flow-verification.js
```

This will:
1. ✅ Simulate form submission
2. ✅ Send webhook to Render
3. ✅ Verify data saved to database
4. ✅ Confirm dashboard can display application

### Manual Testing

1. **Submit a test form on Webflow:**
   - Go to your Webflow site
   - Fill out the application form
   - Click Submit

2. **Check Render logs:**
   - Go to Render Dashboard → Your Service → Logs
   - Look for: "Webflow Webhook Received"
   - Look for: "Application created with ID: ..."

3. **Check Admin Dashboard:**
   - Open: `https://mimmarketplace.onrender.com/admin`
   - Wait up to 30 seconds (auto-refresh)
   - New application should appear

4. **Verify in Database:**
   - Check applications list
   - Verify all fields are saved correctly
   - Check status is "pending"

---

## ⚡ Performance Metrics

**Typical Flow Timing:**
- Webhook reception: < 100ms
- Data processing: < 200ms
- Database save: < 300ms
- **Total: < 1 second**

**Dashboard Refresh:**
- API call: < 500ms
- Data rendering: < 100ms
- **Total: < 1 second**

**Auto-refresh Interval:** 30 seconds

---

## 🔧 Configuration

### Webflow Webhook Setup

1. Go to Webflow Dashboard
2. Navigate to: Your Site → Integrations → Webhooks
3. Create/Edit webhook:
   - **URL:** `https://mimmarketplace.onrender.com/webhooks/webflow`
   - **Trigger:** Form submission: API V2
   - **Method:** POST

### Render Configuration

**Environment Variables:**
- `DATABASE_URL` - Supabase connection string
- `WEBFLOW_WEBHOOK_SECRET` - Webhook signature secret (optional)
- `PORT` - Server port (10000)
- `NODE_ENV` - production

**Build & Deploy:**
- Build: `npm install && npx prisma generate && npm run build`
- Start: `npx prisma migrate deploy && npm run start:prod`

---

## 📊 Monitoring

### Check Flow Status

1. **Health Check:**
   ```bash
   curl https://mimmarketplace.onrender.com/health
   ```

2. **Test Webhook:**
   ```bash
   curl -X POST https://mimmarketplace.onrender.com/webhooks/webflow/test
   ```

3. **Check Applications:**
   ```bash
   curl https://mimmarketplace.onrender.com/applications
   ```

### Render Logs

Monitor logs for:
- ✅ "Webflow Webhook Received"
- ✅ "Application created with ID: ..."
- ✅ "Database connected successfully"
- ❌ Any error messages

---

## 🐛 Troubleshooting

### Webhook Not Received

1. Check Webflow webhook URL is correct
2. Verify webhook is enabled in Webflow
3. Check Render logs for errors
4. Test webhook endpoint manually

### Data Not Saved

1. Check database connection
2. Verify DATABASE_URL in Render
3. Check Prisma migrations are applied
4. Review error logs

### Dashboard Not Showing Data

1. Check browser console for errors
2. Verify API endpoints are accessible
3. Check CORS settings
4. Verify API_URL in dashboard code

---

## ✅ Success Indicators

**Flow is working correctly when:**
- ✅ Webhook endpoint returns success
- ✅ Application appears in database
- ✅ Dashboard shows new application
- ✅ Stats update correctly
- ✅ No errors in Render logs

---

## 📝 Summary

The complete flow is **fully automated**:

1. User submits form → Webflow handles it
2. Webflow sends webhook → Render receives it
3. Backend saves to database → Automatic
4. Dashboard displays → Auto-refreshes every 30s

**No manual intervention required!** 🎉

