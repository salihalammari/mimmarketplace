# 🚨 Fix Render Start Command & Database Connection

## Issues Found

1. **Service running in dev mode** - Using `nest start` instead of `npm run start:prod`
2. **Database connection failing** - Can't reach Supabase
3. **Wrong port** - Running on 3000 instead of 10000

## ✅ Fix Steps

### STEP 1: Fix Start Command in Render Dashboard

Render is ignoring `render.yaml` and using `npm run start` (dev mode).

1. Go to: **Render Dashboard → mimmarketplace → Settings**
2. Scroll to **"Start Command"**
3. **Change it to:**
   ```
   npx prisma migrate deploy && npm run start:prod
   ```
4. **Also check "Environment"** - Make sure `NODE_ENV` is set to `production`
5. Click **"Save Changes"**

### STEP 2: Verify DATABASE_URL Format

1. **Render Dashboard → mimmarketplace → Environment**
2. Find `DATABASE_URL`
3. **Verify format:**
   ```
   postgresql://postgres.tjxotorfwaqzcvtoealh:COMPLETE_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require
   ```

**Critical checks:**
- ✅ Host: `db.tjxotorfwaqzcvtoealh.supabase.co` (NOT pooler)
- ✅ Port: `5432` (NOT 6543)
- ✅ Password: COMPLETE (no `...` truncation)
- ✅ Has `?sslmode=require` at the end
- ✅ No quotes around the string

### STEP 3: Get Fresh Connection String

1. **Supabase Dashboard → Settings → Database**
2. Scroll to **"Connection string"**
3. Click **"URI"** tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with actual password
6. Add `?sslmode=require` at the end

### STEP 4: Reset Password (If Needed)

If password might be wrong:

1. **Supabase Dashboard → Settings → Database**
2. Click **"Reset Database Password"**
3. Copy the NEW password (shown only once!)
4. Update DATABASE_URL in Render

### STEP 5: Check Network Restrictions

1. **Supabase Dashboard → Settings → Database**
2. Scroll to **"Network Restrictions"**
3. **Disable IP restrictions** temporarily
4. Or add Render IPs: `74.220.48.0/24` and `74.220.56.0/24`

### STEP 6: Update Environment Variables in Render

1. **Render Dashboard → mimmarketplace → Environment**
2. **Verify these are set:**
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `DATABASE_URL` = (correct format from Step 2)
3. Click **"Save Changes"**

### STEP 7: MANUAL REDEPLOY

**⚠️ CRITICAL: After changing start command and env vars:**

1. **Render Dashboard → mimmarketplace**
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"**
4. Wait **3-5 minutes**
5. Check logs - should see:
   - `✅ Database connected successfully`
   - `🚀 Server running on port 10000` (NOT 3000)
   - `Running 'npm run start:prod'` (NOT `nest start`)

### STEP 8: Test Connection

After redeploy:

```bash
curl "https://mimmarketplace.onrender.com/health"
```

**✅ SUCCESS:**
```json
{
  "status": "ok",
  "database": "connected"
}
```

## 🔍 What to Check in Render Logs

**After redeploy, logs should show:**

✅ **Correct:**
```
==> Running 'npm run start:prod'
✅ Database connected successfully
🚀 Server running on port 10000
```

❌ **Wrong (current):**
```
==> Running 'npm run start'
⚠️ Development mode: Starting without database connection
🚀 Server running on port 3000
```

## 📋 Complete Checklist

- [ ] ✅ Start Command in Render = `npx prisma migrate deploy && npm run start:prod`
- [ ] ✅ NODE_ENV = `production` in Render
- [ ] ✅ PORT = `10000` in Render
- [ ] ✅ DATABASE_URL uses direct endpoint (`db.tjxotorfwaqzcvtoealh.supabase.co`)
- [ ] ✅ DATABASE_URL has port `5432` (not 6543)
- [ ] ✅ DATABASE_URL has `?sslmode=require`
- [ ] ✅ Password is COMPLETE (no truncation)
- [ ] ✅ Network restrictions disabled in Supabase
- [ ] ✅ **Manual Deploy** done after changes
- [ ] ✅ Logs show `Database connected successfully`
- [ ] ✅ Logs show `Server running on port 10000`

## 🎯 Most Likely Issues

1. **Start command wrong** (40%) - Using `npm run start` instead of `npm run start:prod`
2. **Password wrong/truncated** (30%) - Password has `...` or is incorrect
3. **Network restrictions** (20%) - IP restrictions blocking Render
4. **NODE_ENV not set** (10%) - Service running in dev mode

## 💡 Quick Fix

**In Render Dashboard → Settings → Start Command:**

Change from:
```
npm run start
```

To:
```
npx prisma migrate deploy && npm run start:prod
```

Then **Manual Deploy** and test again!

