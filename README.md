# MIM Marketplace Backend

Backend API for handling seller verification applications from the MIM Marketplace website.

## Features

- ✅ Receive application form submissions from Webflow
- ✅ Store applications in Supabase PostgreSQL database
- ✅ RESTful API for managing applications
- ✅ Webhook endpoint for Webflow form submissions
- ✅ Ready for Render deployment

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

1. Push code to GitHub
2. Create new Web Service in Render
3. Connect repository
4. Set environment variables:
   - `DATABASE_URL` - Supabase PostgreSQL connection string
   - `NODE_ENV` - `production`
5. Build command: `npm install && npx prisma generate && npm run build`
6. Start command: `npm run start:prod`
7. Run migrations: `npx prisma migrate deploy` (in Render Shell)

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
