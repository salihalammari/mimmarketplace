# 🚨 Fix: Database Connection Error on Render Deployment

## ❌ Current Error

```
Error: P1001: Can't reach database server at `aws-1-us-east-2.pooler.supabase.com:5432`
```

**Problem:** Your `DATABASE_URL` in Render is using the **pooler endpoint**, which doesn't work for Prisma migrations on Render.

## ✅ Solution: Use Direct Connection

### Step 1: Get Direct Connection String from Supabase

1. **Go to:** [Supabase Dashboard](https://app.supabase.com)
2. **Select your project**
3. **Go to:** Settings → **Database**
4. **Scroll to:** Connection string section
5. **Click:** **URI** tab (NOT Session mode or Transaction mode)
6. **Copy** the connection string

**It should look like:**
```
postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres
```

**Important:**
- ✅ Host: `db.tjxotorfwaqzcvtoealh.supabase.co` (NOT `pooler.supabase.com`)
- ✅ Port: `5432` (NOT `6543`)
- ✅ No `?pgbouncer=true` in the URL

### Step 2: Update DATABASE_URL in Render

1. **Go to:** [Render Dashboard](https://dashboard.render.com)
2. **Select your service:** `mim-backend` or `mimmarketplace`
3. **Click:** **Environment** tab (left sidebar)
4. **Find:** `DATABASE_URL` in the list
5. **Click:** **Edit** button (pencil icon)
6. **Delete everything** in the field
7. **Paste** the connection string from Supabase
8. **Add** `?sslmode=require` at the end:
   ```
   postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require
   ```
9. **Important:**
   - ✅ No quotes around the value
   - ✅ No leading/trailing spaces
   - ✅ Complete password (not truncated)
   - ✅ Must start with `postgresql://`
10. **Click:** **Save Changes**

### Step 3: Manual Redeploy (CRITICAL!)

**⚠️ After changing `DATABASE_URL`, you MUST manually redeploy:**

1. **Go to:** Render Dashboard → Your service
2. **Click:** **Manual Deploy** button (top right)
3. **Select:** **"Deploy latest commit"**
4. **Wait:** 3-5 minutes for deployment to complete

**Why manual deploy?**
- Render doesn't automatically redeploy when you change environment variables
- Manual deploy ensures the new `DATABASE_URL` is loaded

### Step 4: Verify Connection

After redeploy, check the logs:

**✅ Success indicators:**
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "postgres", schema "public" at "db.tjxotorfwaqzcvtoealh.supabase.co:5432"
Applying migration...
Migration applied successfully
🚀 Server running on port 10000
```

**❌ Still failing:**
- Check if `DATABASE_URL` format is correct
- Verify password is complete (not truncated)
- Ensure you did a manual redeploy

## 🔍 Connection String Format Comparison

### ❌ WRONG (Pooler - Won't Work):
```
postgresql://postgres.tjxotorfwaqzcvtoealh:PASSWORD@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```
- Uses `pooler.supabase.com` ❌
- Doesn't work for Prisma migrations ❌

### ✅ CORRECT (Direct - Will Work):
```
postgresql://postgres.tjxotorfwaqzcvtoealh:PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require
```
- Uses `db.tjxotorfwaqzcvtoealh.supabase.co` ✅
- Port `5432` ✅
- Has `?sslmode=require` ✅

## 📋 Quick Checklist

- [ ] ✅ Got connection string from Supabase (URI tab, direct connection)
- [ ] ✅ Verified host is `db.tjxotorfwaqzcvtoealh.supabase.co` (NOT pooler)
- [ ] ✅ Verified port is `5432` (NOT 6543)
- [ ] ✅ Updated `DATABASE_URL` in Render
- [ ] ✅ Added `?sslmode=require` at the end
- [ ] ✅ No quotes, no spaces in DATABASE_URL
- [ ] ✅ **Manual Deploy** was done after changing DATABASE_URL
- [ ] ✅ Checked deployment logs for success

## 🆘 Still Having Issues?

### Issue 1: Password Truncated
**Symptom:** Connection fails even with correct format
**Fix:** 
1. Go to Supabase → Settings → Database
2. Click **Reset database password**
3. Copy the new password (complete, not truncated)
4. Update `DATABASE_URL` in Render with new password
5. Manual redeploy

### Issue 2: Supabase Project Paused
**Symptom:** Can't connect even with correct format
**Fix:**
1. Go to Supabase Dashboard
2. Check if project is paused
3. If paused, click **Resume** or **Restore**

### Issue 3: Still Using Pooler
**Symptom:** Error still shows `pooler.supabase.com`
**Fix:**
1. Double-check `DATABASE_URL` in Render
2. Make sure it says `db.tjxotorfwaqzcvtoealh.supabase.co`
3. If it still shows pooler, update it again and redeploy

## 💡 Why This Happens

**Render's free tier doesn't work well with Supabase's pooler endpoint:**
- PgBouncer uses short-lived SSL that's incompatible
- Render keeps idle connections open, which PgBouncer rejects
- Prisma migrations require direct connections

**The fix:** Always use the **direct connection** endpoint for Render deployments.

## ✅ Success!

After fixing, your deployment should show:
```
✅ Build successful
✅ Prisma migrations applied
✅ Server running on port 10000
```

**The key is using the direct connection string and doing a manual redeploy!**

