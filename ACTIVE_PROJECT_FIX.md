# 🔧 Fix Database Connection - Project is Active

## ✅ Good News
Your Supabase project is **Active** (green dot), so it's not paused!

## 🔍 Next Steps to Fix Connection

Since the project is active but connection still fails, check these:

### STEP 1: Verify DATABASE_URL in Render

1. Go to: **Render Dashboard → mimmarketplace → Environment**
2. Find `DATABASE_URL`
3. **Check these EXACT requirements:**

**✅ CORRECT FORMAT:**
```
postgresql://postgres.tjxotorfwaqzcvtoealh:COMPLETE_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require
```

**Critical checks:**
- [ ] Host is `db.tjxotorfwaqzcvtoealh.supabase.co` (NOT `pooler.supabase.com`)
- [ ] Port is `5432` (NOT `6543`)
- [ ] Password is COMPLETE (no `...` truncation)
- [ ] Has `?sslmode=require` at the end
- [ ] No quotes around the string
- [ ] No spaces before/after

### STEP 2: Get Fresh Connection String from Supabase

1. In Supabase Dashboard → **Settings → Database**
2. Scroll to **"Connection string"**
3. Click **"URI"** tab (NOT Session or Transaction mode)
4. Copy the connection string
5. It should look like:
   ```
   postgresql://postgres.tjxotorfwaqzcvtoealh:[YOUR-PASSWORD]@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your actual password
7. Add `?sslmode=require` at the end if not present

### STEP 3: Reset Database Password (If Unsure)

If you're not sure about the password:

1. Supabase Dashboard → **Settings → Database**
2. Scroll to **"Database password"**
3. Click **"Reset Database Password"**
4. **Copy the NEW password** (shown only once!)
5. Update DATABASE_URL in Render with the new password

### STEP 4: Check Network Restrictions

1. Supabase Dashboard → **Settings → Database**
2. Scroll to **"Network Restrictions"** or **"Connection Pooling"**
3. Check if IP restrictions are enabled:
   - If **"Restrict connections"** is ON → **Disable it temporarily**
   - Or add Render IPs: `74.220.48.0/24` and `74.220.56.0/24`
   - Or allow all: `0.0.0.0/0` (for testing)

### STEP 5: Update DATABASE_URL in Render

1. Render Dashboard → **mimmarketplace → Environment**
2. Find `DATABASE_URL`
3. Click **Edit**
4. **Delete everything** in the field
5. **Paste** the connection string from Step 2
6. **Verify format matches exactly** (see Step 1)
7. Click **Save Changes**

### STEP 6: MANUAL REDEPLOY (REQUIRED!)

**⚠️ CRITICAL: After changing DATABASE_URL, you MUST manually redeploy!**

1. Render Dashboard → **mimmarketplace**
2. Click **"Manual Deploy"** button (top right)
3. Select **"Deploy latest commit"**
4. Wait **3-5 minutes** for deployment
5. Check status shows **"Live"** (green)

**Why manual deploy?**
- Auto-deploy doesn't always pick up environment variable changes
- Manual deploy ensures the new DATABASE_URL is loaded

### STEP 7: Test Connection

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

## 🎯 Most Likely Issues (Since Project is Active)

1. **Password is wrong/truncated** (40% chance)
   - Password might have `...` at the end
   - **Fix:** Reset password, copy complete version

2. **Network restrictions** (30% chance)
   - IP restrictions blocking Render
   - **Fix:** Disable restrictions or allow Render IPs

3. **Service not redeployed** (20% chance)
   - Changed DATABASE_URL but didn't redeploy
   - **Fix:** Manual Deploy in Render

4. **Wrong connection string format** (10% chance)
   - Using pooler endpoint or missing SSL
   - **Fix:** Use direct endpoint with `?sslmode=require`

## 📋 Quick Checklist

- [ ] ✅ Supabase project is Active (confirmed ✓)
- [ ] ✅ DATABASE_URL uses `db.tjxotorfwaqzcvtoealh.supabase.co` (direct, not pooler)
- [ ] ✅ DATABASE_URL has port `5432` (not 6543)
- [ ] ✅ DATABASE_URL has `?sslmode=require` at the end
- [ ] ✅ Password is COMPLETE (no truncation, no `...`)
- [ ] ✅ No quotes around DATABASE_URL in Render
- [ ] ✅ Network restrictions disabled or Render IPs allowed
- [ ] ✅ **Manual Deploy** was done after changing DATABASE_URL
- [ ] ✅ Render service shows **"Live"** status

## 🔍 How to Verify DATABASE_URL Format

**Go to Render Dashboard → Environment → DATABASE_URL**

**Should look like:**
```
postgresql://postgres.tjxotorfwaqzcvtoealh:MyCompletePassword123@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require
```

**Should NOT look like:**
- `postgresql://...@aws-1-us-east-2.pooler.supabase.com:5432/...` (pooler)
- `postgresql://...:Sali2991...@...` (truncated password)
- `postgresql://...@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres` (missing SSL)

## 💡 Next Steps

1. **Check DATABASE_URL in Render** - Verify format matches exactly
2. **Check network restrictions in Supabase** - Disable if enabled
3. **Reset password if needed** - Get fresh connection string
4. **Manual Deploy** - Required after changing env vars
5. **Test again** - Should show `"database": "connected"`

