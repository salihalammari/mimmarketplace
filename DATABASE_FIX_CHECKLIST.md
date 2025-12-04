# Database Connection Fix Checklist

## 🔴 Current Status

Health check shows:
```json
{
  "status": "ok",
  "database": "disconnected",
  "error": "Can't reach database server at db.tjxotorfwaqzcvtoealh.supabase.co:5432"
}
```

## ✅ Step-by-Step Fix

### Step 1: Verify Supabase Database is Running

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `tjxotorfwaqzcvtoealh`
3. Check if project status is **"Active"** (not paused)
4. If paused, click **"Resume"** or **"Restore"**

### Step 2: Get Correct Connection String

1. In Supabase Dashboard → **Settings → Database**
2. Scroll to **Connection string**
3. Click **URI** tab (NOT Session or Transaction mode)
4. You should see:
   ```
   postgresql://postgres.tjxotorfwaqzcvtoealh:[YOUR-PASSWORD]@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres
   ```
5. **Copy the entire string**

### Step 3: Check Password

1. In Supabase → **Settings → Database**
2. If you don't know the password, click **"Reset Database Password"**
3. Copy the new password
4. Update it in the connection string

### Step 4: Update DATABASE_URL in Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select **mimmarketplace** service
3. Go to **Environment** tab
4. Find `DATABASE_URL`
5. Click **Edit**
6. **Delete everything** in the field
7. **Paste** the connection string from Supabase
8. **Add** `?sslmode=require` at the end:
   ```
   postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require
   ```
9. **Important:**
   - ✅ No quotes
   - ✅ No spaces before/after
   - ✅ Complete password (not truncated)
   - ✅ Port must be `5432`
   - ✅ Host must be `db.tjxotorfwaqzcvtoealh.supabase.co` (NOT pooler)
10. Click **Save Changes**

### Step 5: Force Manual Redeploy

**This is critical!** After changing DATABASE_URL:

1. In Render Dashboard → **mimmarketplace**
2. Click **"Manual Deploy"** button (top right)
3. Select **"Deploy latest commit"**
4. Wait **3-5 minutes** for deployment to complete
5. Check deployment status - should show "Live" (green)

### Step 6: Check Supabase Network Settings

1. Go to Supabase Dashboard → **Settings → Database**
2. Scroll to **Network Restrictions** or **Connection Pooling**
3. Check if there are IP restrictions
4. If needed, temporarily allow all IPs: `0.0.0.0/0`
5. Or add Render IPs: `74.220.48.0/24` and `74.220.56.0/24`

### Step 7: Verify Connection

After redeploy, test:

```bash
curl "https://mimmarketplace.onrender.com/health"
```

**✅ Success:**
```json
{
  "status": "ok",
  "database": "connected"
}
```

**❌ Still failing:**
- Check Render logs for more details
- Verify DATABASE_URL format again
- Check Supabase project is not paused

## 🔍 Common Mistakes

### ❌ Wrong Host
```
aws-1-us-east-2.pooler.supabase.com  ← WRONG
```
```
db.tjxotorfwaqzcvtoealh.supabase.co  ← CORRECT
```

### ❌ Wrong Port
```
:6543  ← WRONG (pooler port)
```
```
:5432  ← CORRECT (direct connection)
```

### ❌ Truncated Password
```
...YOUR_PASSWORD...  ← WRONG (truncated)
```
```
YOUR_COMPLETE_PASSWORD  ← CORRECT (full password)
```

### ❌ Missing SSL Mode
```
.../postgres  ← Missing SSL
```
```
.../postgres?sslmode=require  ← CORRECT
```

### ❌ Quotes or Spaces
```
"postgresql://..."  ← WRONG (has quotes)
```
```
postgresql://...  ← CORRECT (no quotes)
```

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

## ✅ After Database Connects

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

**Current:** Database disconnected
**Action:** Fix DATABASE_URL format and redeploy
**After fix:** Database connected → App works → Email works

**Most important:** Make sure to **Manual Deploy** after changing DATABASE_URL!

