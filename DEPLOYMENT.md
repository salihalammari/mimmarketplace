# Deployment Guide for Render

## Quick Deployment Steps

### 1. Prerequisites
- ✅ GitHub repository with your code
- ✅ Supabase database with connection string
- ✅ Render account (free tier works)

### 2. Deploy to Render

#### Using Blueprint (render.yaml) - Recommended

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Blueprint in Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **New** → **Blueprint**
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`

3. **Set Environment Variables**
   - In Render Dashboard, go to your service → **Environment**
   - Add `DATABASE_URL` with your Supabase **direct connection** string (port 5432):
     ```
     postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres
     ```
     ⚠️ **Critical**: 
     - No quotes around the value
     - No leading/trailing spaces
     - Must start directly with `postgresql://`
     - Use **direct connection** (port 5432), NOT pooled (6543)
     - Get this from: Supabase Dashboard → Settings → Database → Connection string → **URI (direct)**
     - ❌ Do NOT use the pooled connection (port 6543) - Render cannot connect to it
   - `NODE_ENV` and `PORT` are already configured in `render.yaml`

4. **Deploy**
   - Click **Apply** or **Save Changes**
   - Render will automatically:
     - Install dependencies
     - Generate Prisma Client
     - Build the application
     - Run database migrations
     - Start the server

5. **Verify Deployment**
   - Check the health endpoint: `https://your-app.onrender.com/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

### 3. Test Your API

Once deployed, your API will be available at:
```
https://your-app-name.onrender.com
```

**Test endpoints:**
- Health: `GET https://your-app-name.onrender.com/health`
- Create Application: `POST https://your-app-name.onrender.com/applications`
- Webhook: `POST https://your-app-name.onrender.com/webhooks/webflow`

### 4. Configure Webflow Webhook

1. Go to your Webflow project settings
2. Navigate to **Integrations** → **Webhooks**
3. Add webhook with URL: `https://your-app-name.onrender.com/webhooks/webflow`
4. Select trigger: **Form submission: API V2**

### 5. CORS Configuration

✅ **Already configured!** The API accepts requests from any origin, so you can:
- Use it from Webflow forms
- Integrate with any frontend (React, Vue, Angular, etc.)
- Use it from mobile apps
- Access from any platform

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version (Render uses Node 18+ by default)
- Check build logs in Render Dashboard

### Database Connection Issues
- **Use direct connection (port 5432), NOT pooled (6543)**
- Verify `DATABASE_URL` is set correctly (no quotes, no spaces)
- Ensure Supabase allows connections from Render's IPs
- If you see `P1001: Can't reach database server`, you're likely using the pooled connection - switch to direct
- Get the correct connection string from: Supabase → Settings → Database → Connection string → **URI (direct)**

### Migration Fails
- Ensure database is accessible
- Check migration files are in `prisma/migrations/`
- Verify `migration_lock.toml` exists

### Health Check Fails
- Verify server is starting correctly
- Check logs for errors
- Ensure PORT environment variable is set

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ Yes | - | Supabase PostgreSQL **direct connection** string (port 5432) |
| `NODE_ENV` | No | `production` | Environment mode |
| `PORT` | No | `10000` | Server port (Render assigns automatically) |

**DATABASE_URL Format (Direct Connection):**
```
postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres
```
⚠️ **Critical**: 
- No quotes, no spaces, must start with `postgresql://`
- Use **direct connection** (port 5432), NOT pooled (6543)
- Render cannot connect to Supabase's pooled connection (port 6543)
- Get from: Supabase Dashboard → Settings → Database → Connection string → **URI (direct)**

## Monitoring

- **Logs**: View in Render Dashboard → Your Service → Logs
- **Metrics**: Available in Render Dashboard
- **Health**: Monitor `/health` endpoint

## Updating Your Deployment

1. Push changes to GitHub
2. Render automatically detects changes and redeploys
3. Migrations run automatically on startup if new ones exist

## Support

For issues:
1. Check Render logs
2. Verify environment variables
3. Test locally first: `npm run build && npm run start:prod`

