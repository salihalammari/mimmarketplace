# MIM Marketplace Backend

Backend API for handling seller verification applications from the MIM Marketplace website.

## Features

- ✅ Receive application form submissions from Webflow
- ✅ Store applications in Supabase PostgreSQL database
- ✅ RESTful API for managing applications
- ✅ Webhook endpoint for Webflow form submissions
- ✅ CORS enabled for all platforms (accessible from anywhere)
- ✅ Ready for Render deployment with automatic migrations

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Deployment**: Render

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env  # Edit with your Supabase credentials

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Start development server
npm run start:dev
```

## API Endpoints

### Health Check
- `GET /health` - Check if the server is running

### Applications
- `POST /applications` - Create a new application
- `GET /applications` - Get all applications
- `GET /applications/:id` - Get a specific application
- `PATCH /applications/:id/status` - Update application status

### Webhooks
- `POST /webhooks/webflow` - Receive Webflow form submissions
- `POST /webhooks/webflow/test` - Test webhook endpoint

## Webflow Integration

### Setting up the Webhook

1. Go to your Webflow project settings
2. Navigate to **Integrations** → **Webhooks**
3. Click **+ Add webhook**
4. Select **Form submission: API V2**
5. Enter your webhook URL:
   - Production: `https://your-render-url.onrender.com/webhooks/webflow`
6. Save the webhook

### Form Field Mapping

The webhook handler automatically maps Webflow form fields. Supported field names:

**English:**
- `full-name`, `email`, `phone`, `whatsapp`
- `main-sales-page`, `city`, `products-brand`
- `sales-categories`, `badge-usage` (arrays)
- `images-belong-to-store`, `product-type`
- `selling-duration`, `customer-feedback`
- `return-handling`, `fake-orders`
- `shipping-time`, `delivery-area`

**Arabic (also supported):**
- `الاسم-الكامل`, `البريد-الالكتروني`, `رقم-الهاتف`
- `رابط-صفحة-البيع`, `المدينة`, `المنتجات-والبراند`
- `فئات-البيع`, `استعمال-البادج` (arrays)
- And other Arabic equivalents

## Render Deployment

### Option 1: Using render.yaml (Recommended)

1. Push code to GitHub
2. In Render Dashboard, go to **New** → **Blueprint**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and configure the service
5. Set environment variables in Render Dashboard:
   - `DATABASE_URL` - Your Supabase PostgreSQL connection string (use **direct connection**, port 5432):
     ```
     postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres
     ```
     ⚠️ **Important**: 
     - No quotes, no spaces, must start with `postgresql://`
     - Use **direct connection** (port 5432), NOT pooled (6543)
     - Get this from: Supabase → Settings → Database → Connection string → URI (direct)
   - `NODE_ENV` - Already set to `production` in render.yaml
   - `PORT` - Already set to `10000` in render.yaml
6. Deploy! Migrations will run automatically on startup

### Option 2: Manual Setup

1. Push code to GitHub
2. Create new **Web Service** in Render
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma migrate deploy && npm run start:prod`
   - **Health Check Path**: `/health`
5. Set environment variables:
   - `DATABASE_URL` - Supabase PostgreSQL **direct connection** string (port 5432):
     ```
     postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres
     ```
     ⚠️ Use direct connection, NOT pooled (6543)
   - `NODE_ENV` - `production`
   - `PORT` - `10000` (or let Render assign automatically)
6. Deploy!

### CORS Configuration

The API is configured to accept requests from **any origin** (`origin: true`), making it accessible from:
- Webflow forms
- React/Vue/Angular frontends
- Mobile applications
- Any other platform

All standard HTTP methods are allowed: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`

## Database Schema

The `Application` model includes:
- Contact information
- Product and brand details
- Sales categories (array)
- Experience and customer service info
- Delivery information
- Badge usage locations
- Status tracking (pending, needs_info, qualified, rejected, badge_activated)
- Badge level (1: Verified, 2: Trusted, 3: Golden)
- Timestamps

## Development

### Prisma Studio
```bash
npx prisma studio
```

### Running Migrations
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Deploy to production
npx prisma migrate deploy
```

## Documentation

- See `SETUP_GUIDE.md` for detailed setup instructions
- See `QUICK_START.md` for quick reference

## Support

For issues or questions, check the documentation or contact the development team.
