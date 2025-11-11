# Render + Supabase Database Connection Setup

## ⚠️ Critical: Use Direct Connection, NOT Pooled

**Render web services CANNOT connect to Supabase's pooled connection (port 6543).**

### Why?
- PgBouncer uses short-lived SSL that's incompatible with Render's containers
- Render keeps idle connections open, which PgBouncer rejects
- This causes `P1001: Can't reach database server` errors

### ✅ Solution: Use Direct Connection

**Use the direct PostgreSQL connection (port 5432), NOT the pooled one (port 6543).**

## Step-by-Step Setup

### 1. Get Your Direct Connection String

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll to **Connection string**
5. Select **URI** tab (NOT Session mode or Transaction mode)
6. Copy the connection string - it should look like:
   ```
   postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres
   ```

### 2. Set in Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your service
3. Go to **Environment** tab
4. Find or add `DATABASE_URL`
5. Paste the connection string **exactly as shown**:
   - ✅ No quotes
   - ✅ No leading/trailing spaces
   - ✅ Must start with `postgresql://`
   - ✅ Uses port `5432` (NOT 6543)
   - ✅ No `?pgbouncer=true` or `connection_limit=1`

6. Click **Save Changes**

### 3. Verify Connection

After deployment, check Render logs. You should see:
```
PrismaService initialized
🚀 Server running on port 10000
```

If you see `P1001: Can't reach database server`, you're using the wrong connection string.

## Connection String Comparison

### ❌ Wrong (Pooled - Won't Work on Render)
```
postgresql://postgres.tjxotorfwaqzcvtoealh:PASSWORD@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```
- Uses `pooler.supabase.com`
- Port `6543`
- Has `?pgbouncer=true`

### ✅ Correct (Direct - Works on Render)
```
postgresql://postgres.tjxotorfwaqzcvtoealh:PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres
```
- Uses `db.tjxotorfwaqzcvtoealh.supabase.co`
- Port `5432`
- No query parameters

## When to Use Each Connection Type

### Direct Connection (Port 5432) - Use for:
- ✅ Backend services (NestJS, Express, etc.)
- ✅ Server-side applications
- ✅ Render, Railway, Heroku deployments
- ✅ Long-running processes

### Pooled Connection (Port 6543) - Use for:
- ✅ Serverless functions (Vercel, Netlify Functions)
- ✅ Edge functions
- ✅ Short-lived connections
- ❌ NOT for Render web services

## Troubleshooting

### Error: `P1001: Can't reach database server`
**Solution**: You're using the pooled connection. Switch to direct connection (port 5432).

### Error: Connection timeout
**Solution**: 
1. Verify your Supabase project is active
2. Check if your IP is allowed (Supabase allows all by default)
3. Verify the connection string format

### Error: Authentication failed
**Solution**: 
1. Verify your password is correct
2. Check for special characters in password (may need URL encoding)
3. Ensure no quotes or spaces in the connection string

## Best Practices

1. **Never commit connection strings** - Use environment variables
2. **Use direct connection for backend** - More reliable for long-running services
3. **Test locally first** - Use the same connection string format locally
4. **Monitor connection pool** - Direct connections use more resources, but are more stable

## Additional Resources

- [Supabase Connection Pooling Docs](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Prisma Connection Management](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-management)

