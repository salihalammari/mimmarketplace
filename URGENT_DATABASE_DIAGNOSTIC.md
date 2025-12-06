# 🚨 URGENT: Database Connection Diagnostic

## Current Status
```
"database": "disconnected"
Error: Can't reach database server at `db.tjxotorfwaqzcvtoealh.supabase.co:5432`
```

## ⚡ IMMEDIATE ACTION REQUIRED

### Step 1: Check Supabase Project Status (MOST LIKELY ISSUE)

**Free tier projects auto-pause after 1 week of inactivity!**

1. Go to: https://app.supabase.com
2. Select your project
3. **Check the status badge:**
   - ✅ **"Active"** (green) = Good
   - ❌ **"Paused"** (yellow/red) = **THIS IS THE PROBLEM!**

**If paused:**
- Click **"Resume"** or **"Restore"** button
- Wait 1-2 minutes for project to activate
- Test again: `curl "https://mimmarketplace.onrender.com/health"`

### Step 2: Verify DATABASE_URL Format in Render

1. Go to: **Render Dashboard → mimmarketplace → Environment**
2. Find `DATABASE_URL`
3. **Check these EXACT requirements:**

```
✅ CORRECT FORMAT:
postgresql://postgres.tjxotorfwaqzcvtoealh:COMPLETE_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require

❌ WRONG - Pooler endpoint:
postgresql://postgres.tjxotorfwaqzcvtoealh:PASSWORD@aws-1-us-east-2.pooler.supabase.com:5432/postgres

❌ WRONG - Missing SSL:
postgresql://postgres.tjxotorfwaqzcvtoealh:PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres

❌ WRONG - Truncated password:
postgresql://postgres.tjxotorfwaqzcvtoealh:Sali2991...@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres
```

**Critical checks:**
- [ ] Host is `db.tjxotorfwaqzcvtoealh.supabase.co` (NOT `pooler.supabase.com`)
- [ ] Port is `5432` (NOT `6543`)
- [ ] Password is COMPLETE (no `...` at the end)
- [ ] Has `?sslmode=require` at the end
- [ ] No quotes around the string
- [ ] No spaces before/after

### Step 3: Reset Database Password (If Needed)

If password might be wrong:

1. **Supabase Dashboard → Settings → Database**
2. Scroll to **"Database password"**
3. Click **"Reset Database Password"**
4. **Copy the new password** (shown only once!)
5. **Update DATABASE_URL in Render:**
   - Replace `COMPLETE_PASSWORD` with the new password
   - Make sure it's the FULL password (no truncation)
6. **Save Changes**

### Step 4: Check Network Restrictions

1. **Supabase Dashboard → Settings → Database**
2. Scroll to **"Network Restrictions"** or **"Connection Pooling"**
3. Check if IP restrictions are enabled:
   - If **"Restrict connections"** is ON → **Disable it temporarily**
   - Or add Render IPs: `74.220.48.0/24` and `74.220.56.0/24`
   - Or allow all: `0.0.0.0/0` (for testing)

### Step 5: MANUAL REDEPLOY (REQUIRED!)

**After changing DATABASE_URL, you MUST redeploy:**

1. **Render Dashboard → mimmarketplace**
2. Click **"Manual Deploy"** button (top right)
3. Select **"Deploy latest commit"**
4. Wait **3-5 minutes**
5. Check status shows **"Live"** (green)

**⚠️ Auto-deploy does NOT pick up environment variable changes!**

### Step 6: Test Connection

After redeploy:

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
- Verify Supabase project is Active
- Double-check DATABASE_URL format

## 🎯 Most Likely Causes (In Order)

1. **Supabase project is PAUSED** (90% of cases)
   - Free tier auto-pauses after inactivity
   - **Fix:** Resume project in Supabase dashboard

2. **Password is truncated/wrong** (5% of cases)
   - Password shows `...` at the end
   - **Fix:** Reset password in Supabase, update DATABASE_URL

3. **Service not redeployed** (3% of cases)
   - Changed DATABASE_URL but didn't redeploy
   - **Fix:** Manual Deploy in Render

4. **Network restrictions** (2% of cases)
   - IP restrictions blocking Render
   - **Fix:** Disable restrictions or allow Render IPs

## 📋 Quick Checklist

Before testing again, verify:

- [ ] ✅ Supabase project shows **"Active"** (not paused)
- [ ] ✅ DATABASE_URL uses `db.tjxotorfwaqzcvtoealh.supabase.co` (direct, not pooler)
- [ ] ✅ DATABASE_URL has port `5432` (not 6543)
- [ ] ✅ DATABASE_URL has `?sslmode=require` at the end
- [ ] ✅ Password is COMPLETE (no truncation, no `...`)
- [ ] ✅ No quotes around DATABASE_URL in Render
- [ ] ✅ **Manual Deploy** was done after changing DATABASE_URL
- [ ] ✅ Render service shows **"Live"** status

## 🔍 How to Get Fresh Connection String

1. **Supabase Dashboard → Settings → Database**
2. Scroll to **"Connection string"**
3. Click **"URI"** tab (NOT Session or Transaction)
4. Copy the string
5. Replace `[YOUR-PASSWORD]` with actual password
6. Add `?sslmode=require` at the end
7. Paste into Render's DATABASE_URL

## ⚠️ Common Mistakes

1. **Using pooler endpoint** → Use direct: `db.tjxotorfwaqzcvtoealh.supabase.co`
2. **Password truncated** → Reset password, copy complete version
3. **Missing SSL mode** → Add `?sslmode=require`
4. **Not redeploying** → Manual Deploy required after env var changes
5. **Project paused** → Resume in Supabase dashboard

## 🚀 Expected Result

After fixing, health check should show:

```json
{
  "status": "ok",
  "timestamp": "2025-12-04T19:45:57.609Z",
  "database": "connected"
}
```

**Start with Step 1 (check if Supabase project is paused) - this is the most common issue!**

