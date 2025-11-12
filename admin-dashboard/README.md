# MIM Marketplace Admin Dashboard

Complete admin dashboard for managing seller verification applications and badges.

## Features

✅ **Application Management**
- View all applications with filtering by status
- View detailed application information
- Update application status (pending, needs_info, qualified, rejected, badge_activated)
- Add notes to applications

✅ **Statistics Dashboard**
- Total applications count
- Applications by status (pending, qualified, rejected, badge activated)
- Real-time statistics

✅ **Badge Management**
- Create verification badges (Level 1: Verified, Level 2: Trusted, Level 3: Golden)
- Automatic seller creation from applications
- Badge code generation
- Badge activation

✅ **Status Workflow**
- **Pending** → Initial application received
- **Needs Info** → Request additional information
- **Qualified** → Application approved, ready for badge
- **Rejected** → Application denied
- **Badge Activated** → Badge created and activated

## Setup

### Option 1: Direct HTML File

1. Open `index.html` in a web browser
2. The dashboard will connect to: `https://mimmarketplace.onrender.com`

### Option 2: Local Server

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then open: `http://localhost:8000`

### Option 3: Deploy to Static Hosting

Deploy the `admin-dashboard` folder to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## Usage

### Viewing Applications

1. **All Applications**: Click "All" filter or leave default
2. **Filter by Status**: Click any status button (Pending, Qualified, etc.)
3. **View Details**: Click "View" button on any application

### Updating Application Status

1. Click "Status" button on an application
2. Select new status from dropdown
3. Add optional notes
4. Click "Update Status"

### Creating Badges

1. Ensure application status is "Qualified"
2. Click "Create Badge" button
3. Select badge level:
   - **Level 1**: Verified Seller (Entry level)
   - **Level 2**: Trusted Seller (3+ months verified)
   - **Level 3**: Golden Seller (Long-term verified)
4. Click "Create & Activate Badge"

The system will:
- Create a seller record (if doesn't exist)
- Generate unique badge code
- Set badge validity (3 months)
- Update application status to "badge_activated"
- Create audit log entry

## API Endpoints Used

- `GET /applications` - Get all applications
- `GET /applications?status=pending` - Filter by status
- `GET /applications/stats` - Get statistics
- `GET /applications/:id` - Get application details
- `PATCH /applications/:id/status` - Update status
- `POST /badges/create` - Create badge

## Badge Levels

### Level 1: Verified Seller
- First-level verification
- Confirms identity, product match, and quality compliance
- Entry badge (free for early users)
- Valid for 3 months

### Level 2: Trusted Seller
- Sellers who maintain verified status for 3+ months
- Good performance record
- Mid-level trust tier
- Valid for 3 months

### Level 3: Golden Seller
- Long-term verified sellers
- Multiple renewal cycles
- Highest level badge
- Public recognition
- Valid for 3 months

## Status Workflow

```
Application Received (pending)
    ↓
[Admin Reviews]
    ↓
┌─────────────────┬──────────────┬──────────────┐
│                 │              │              │
Needs Info    Qualified    Rejected
│                 │
│                 ↓
│            [Create Badge]
│                 │
│                 ↓
│         Badge Activated
│
[Request More Info]
```

## Customization

### Change API URL

Edit the `API_URL` constant in `index.html`:

```javascript
const API_URL = 'https://your-api-url.com';
```

### Styling

All styles are in the `<style>` tag in `index.html`. Customize colors, fonts, and layout as needed.

## Security Notes

⚠️ **Important**: This is a client-side dashboard. For production:

1. **Add Authentication**: Implement login/authentication
2. **API Security**: Add API keys or JWT tokens
3. **CORS**: Ensure your API allows requests from your dashboard domain
4. **HTTPS**: Always use HTTPS in production

## Troubleshooting

### Applications not loading
- Check browser console for errors
- Verify API URL is correct
- Check CORS settings on backend

### Badge creation fails
- Ensure application status is "qualified"
- Check backend logs for errors
- Verify database connection

### Status update fails
- Check network connection
- Verify application ID is correct
- Check backend API logs

## Support

For issues or questions:
- Check backend API health: `https://mimmarketplace.onrender.com/health`
- Review browser console for errors
- Check network tab for API responses

