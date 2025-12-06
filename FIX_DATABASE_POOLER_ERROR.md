# Fix: Database Connection Error - Wrong Endpoint

## ❌ Problem

Render logs show:
```
Can't reach database server at `aws-1-us-east-2.pooler.supabase.com:5432`
```

**The issue:** Your `DATABASE_URL` is using the **pooler endpoint**, which doesn't work on Render.

## ✅ Solution: Use Direct Connection

You need to use the **direct connection** endpoint, not the pooler.

### Step 1: Get Correct Connection String from Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings → Database**
4. Scroll to **Connection string**
5. Click **URI** tab (NOT Session mode or Transaction mode)
6. Copy the connection string

**It should look like:**
```
postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres
```

**Important:**
- ✅ Host: `db.tjxotorfwaqzcvtoealh.supabase.co` (NOT `pooler.supabase.com`)
- ✅ Port: `5432` (NOT `6543`)
- ✅ No `?pgbouncer=true` in the URL

### Step 2: Update DATABASE_URL in Render

1. Go to **Render Dashboard → mimmarketplace → Environment**
2. Find `DATABASE_URL`
3. Click **Edit**
4. **Delete everything** in the field
5. **Paste** the connection string from Supabase
6. **Add** `?sslmode=require` at the end:
   ```
   postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require
   ```
7. **Important:**
   - ✅ No quotes
   - ✅ No spaces
   - ✅ Complete password (not truncated)
8. Click **Save Changes**

### Step 3: Manual Redeploy

**Critical:** After changing `DATABASE_URL`, you MUST redeploy:

1. Go to **Render Dashboard → mimmarketplace**
2. Click **Manual Deploy** button (top right)
3. Select **"Deploy latest commit"**
4. Wait **3-5 minutes** for deployment

### Step 4: Verify Connection

After redeploy, check:

```bash
curl "https://mimmarketplace.onrender.com/health"
```

**✅ Should show:**
```json
{
  "status": "ok",
  "database": "connected"
}
```

**❌ Still shows:**
```json
{
  "database": "disconnected"
}
```

## 🔍 Connection String Comparison

### ❌ Wrong (Pooler - Won't Work):
```
postgresql://postgres.tjxotorfwaqzcvtoealh:PASSWORD@aws-1-us-east-2.pooler.supabase.com:5432/postgres?pgbouncer=true
```
- Uses `pooler.supabase.com`
- Has `?pgbouncer=true`
- Won't work on Render

### ✅ Correct (Direct - Works):
```
postgresql://postgres.tjxotorfwaqzcvtoealh:PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require
```
- Uses `db.tjxotorfwaqzcvtoealh.supabase.co`
- Port `5432`
- Has `?sslmode=require`
- Works on Render

## 📝 Example Correct DATABASE_URL

```
postgresql://postgres.tjxotorfwaqzcvtoealh:YourCompletePassword123@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require
```

**Breakdown:**
- `postgresql://` - Protocol
- `postgres.tjxotorfwaqzcvtoealh` - Username
- `YourCompletePassword123` - Full password (no truncation)
- `@db.tjxotorfwaqzcvtoealh.supabase.co` - Host (direct, not pooler)
- `:5432` - Port (direct connection)
- `/postgres` - Database name
- `?sslmode=require` - SSL mode

## ✅ After Database is Fixed

Once health check shows `"database": "connected"`:

1. **Test email:**
   ```bash
   curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
     -H "Content-Type: application/json" \
     -d '{"email":"salihalammari91@gmail.com","type":"needs_info"}'
   ```

2. **Check Render logs** for `[EMAIL] ✅` messages

3. **Check inbox** for the email

## 🎯 Summary

**Problem:** Using pooler endpoint (`pooler.supabase.com`) which doesn't work on Render
**Solution:** Use direct connection (`db.tjxotorfwaqzcvtoealh.supabase.co:5432`)
**Action:** Update `DATABASE_URL` in Render with direct connection string and redeploy

**Most important:** After changing `DATABASE_URL`, you MUST manually redeploy!

