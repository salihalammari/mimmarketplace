# Fix Database Connection Issue

## Problem
The application can't connect to the Supabase database with error:
```
Can't reach database server at `db.tjxotorfwaqzcvtoealh.supabase.co:5432`
```

## Root Causes

1. **Incomplete Password in .env** - Your `.env` file shows `Sali2991...` which is truncated
2. **Network Connectivity** - WSL/Windows might have network restrictions
3. **Wrong Connection String Format** - Missing SSL mode or incorrect endpoint

## Solution Steps

### Step 1: Get Your Complete Database Password

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `tjxotorfwaqzcvtoealh`
3. Go to **Settings** → **Database**
4. Scroll to **Connection string**
5. Select **URI** tab
6. Copy the **complete** connection string

### Step 2: Update Your .env File

Open `.env` and replace the `DATABASE_URL` line with the complete connection string:

**For Local Development (Direct Connection):**
```env
DATABASE_URL="postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_COMPLETE_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require"
```

**OR For Local Development (Pooler - if direct doesn't work):**
```env
DATABASE_URL="postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_COMPLETE_PASSWORD@aws-1-us-east-2.pooler.supabase.com:5432/postgres?sslmode=require"
```

**Important:**
- Replace `YOUR_COMPLETE_PASSWORD` with your actual Supabase database password
- The password should NOT be truncated (no `...` at the end)
- Keep the quotes around the connection string
- Make sure there's only ONE `DATABASE_URL` line in your `.env` file

### Step 3: Test the Connection

Run the test script:
```bash
node scripts/test-db-connection.js
```

If successful, you should see:
```
✅ Database connection successful!
✅ Query test successful
📊 Available tables: applications, audit_logs, badges, ...
```

### Step 4: Start the Server

```bash
npm run start:prod
```

## Alternative: Test Connection with psql First

If you can connect with psql, use the same connection string format:

```bash
psql "postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require"
```

If psql works but Node.js doesn't, it might be a network/firewall issue.

## For Render Deployment

Render uses a different connection string. See `RENDER_DATABASE_SETUP.md` for details.

The key difference:
- **Local**: Can use either direct or pooler
- **Render**: MUST use direct connection (port 5432), NOT pooler (port 6543)

## Still Having Issues?

1. **Check your password is complete** - No truncation, no `...`
2. **Verify Supabase is running** - Check Supabase dashboard
3. **Test with psql** - If psql works, the issue is with Node.js/Prisma
4. **Check firewall/network** - Some networks block database connections
5. **Try pooler endpoint** - Sometimes pooler works when direct doesn't

