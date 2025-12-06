# Complete Database Connection Fix Guide

## 🔴 Current Problem

Even with correct endpoint (`db.tjxotorfwaqzcvtoealh.supabase.co:5432`), connection still fails:
```
Can't reach database server at `db.tjxotorfwaqzcvtoealh.supabase.co:5432`
```

## ✅ Complete Fix Checklist

### Step 1: Verify Supabase Database is Active

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `tjxotorfwaqzcvtoealh`
3. Check project status:
   - ✅ Should show **"Active"** (green)
   - ❌ If shows **"Paused"** → Click **"Resume"** or **"Restore"**
   - ❌ If shows **"Inactive"** → Reactivate the project

**Free tier projects can pause after inactivity. Make sure it's active!**

### Step 2: Get Fresh Connection String

1. In Supabase Dashboard → **Settings → Database**
2. Scroll to **Connection string**
3. Click **URI** tab (NOT Session or Transaction mode)
4. You should see:
   ```
   postgresql://postgres.tjxotorfwaqzcvtoealh:[YOUR-PASSWORD]@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres
   ```
5. **Copy the ENTIRE string**

### Step 3: Verify/Reset Database Password

If you don't know the password or it might be wrong:

1. In Supabase → **Settings → Database**
2. Scroll to **Database password**
3. Click **"Reset Database Password"**
4. **Copy the new password** (shown only once!)
5. Update it in the connection string

### Step 4: Check Network Restrictions

1. In Supabase → **Settings → Database**
2. Scroll to **Network Restrictions** or **Connection Pooling**
3. Check if there are IP restrictions:
   - If **"Restrict connections to specific IPs"** is enabled → Disable it temporarily
   - Or add Render IPs: `74.220.48.0/24` and `74.220.56.0/24`
   - Or allow all: `0.0.0.0/0` (for testing)

### Step 5: Update DATABASE_URL in Render

1. Go to **Render Dashboard → mimmarketplace → Environment**
2. Find `DATABASE_URL`
3. Click **Edit**
4. **Delete everything** in the field
5. **Paste** the connection string from Supabase
6. **Replace** `[YOUR-PASSWORD]` with the actual password
7. **Add** `?sslmode=require` at the end:
   ```
   postgresql://postgres.tjxotorfwaqzcvtoealh:YourActualPassword@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require
   ```
8. **Critical checks:**
   - ✅ No quotes around the string
   - ✅ No spaces before/after
   - ✅ Complete password (not truncated, no `...`)
   - ✅ Host is `db.tjxotorfwaqzcvtoealh.supabase.co` (NOT pooler)
   - ✅ Port is `5432` (NOT `6543`)
   - ✅ Has `?sslmode=require` at the end
9. Click **Save Changes**

### Step 6: Manual Redeploy (CRITICAL!)

**After changing DATABASE_URL, you MUST redeploy:**

1. Go to **Render Dashboard → mimmarketplace**
2. Click **"Manual Deploy"** button (top right)
3. Select **"Deploy latest commit"**
4. Wait **3-5 minutes** for deployment
5. Check deployment status - should show **"Live"** (green)

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
- Check Supabase project is active

## 🔍 Common Issues & Solutions

### Issue 1: Password Truncated

**Symptom:** Password has `...` at the end

**Fix:**
- Reset password in Supabase
- Copy the complete password
- Update DATABASE_URL

### Issue 2: Supabase Project Paused

**Symptom:** Project shows "Paused" status

**Fix:**
- Go to Supabase Dashboard
- Click **"Resume"** or **"Restore"**
- Wait for project to activate
- Test connection again

### Issue 3: Network Restrictions

**Symptom:** Connection works locally but not on Render

**Fix:**
- Disable IP restrictions in Supabase
- Or add Render IPs to allowlist
- Or allow all IPs temporarily: `0.0.0.0/0`

### Issue 4: Wrong Connection String Format

**Symptom:** Connection string looks wrong

**Correct Format:**
```
postgresql://postgres.tjxotorfwaqzcvtoealh:PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require
```

**Check:**
- Starts with `postgresql://`
- Username: `postgres.tjxotorfwaqzcvtoealh`
- Password: Complete (no truncation)
- Host: `db.tjxotorfwaqzcvtoealh.supabase.co`
- Port: `5432`
- Database: `postgres`
- SSL: `?sslmode=require`

### Issue 5: Service Not Redeployed

**Symptom:** Changed DATABASE_URL but still getting old errors

**Fix:**
- **Manual Deploy** is required after changing env vars
- Auto-deploy doesn't always pick up env var changes
- Go to Manual Deploy → Deploy latest commit

## 📝 Example Correct DATABASE_URL

```
postgresql://postgres.tjxotorfwaqzcvtoealh:MyCompletePassword123@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require
```

**Important:**
- No quotes
- No spaces
- Complete password
- Direct connection (not pooler)
- SSL mode required

## ✅ Verification Checklist

Before testing, verify:

- [ ] Supabase project is **Active** (not paused)
- [ ] Database password is **complete** (not truncated)
- [ ] Connection string uses **direct endpoint** (`db.tjxotorfwaqzcvtoealh.supabase.co`)
- [ ] Connection string has **port 5432** (not 6543)
- [ ] Connection string has **`?sslmode=require`** at the end
- [ ] DATABASE_URL in Render has **no quotes, no spaces**
- [ ] **Manual Deploy** was done after changing DATABASE_URL
- [ ] Service shows **"Live"** status in Render

## 🧪 Test After Fix

Once health check shows `"database": "connected"`:

1. **Test email:**
   ```bash
   curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
     -H "Content-Type: application/json" \
     -d '{"email":"salihalammari91@gmail.com","type":"needs_info"}'
   ```

2. **Check Render logs** for `[EMAIL] ✅` messages

3. **Check inbox** for the email

## 🎯 Most Likely Issues

Based on your error, most likely:

1. **Supabase project is paused** → Resume it
2. **Password is wrong/truncated** → Reset and update
3. **Service not redeployed** → Manual Deploy required
4. **Network restrictions** → Disable or allow Render IPs

## 📋 Quick Action Plan

1. ✅ Check Supabase project is **Active**
2. ✅ Get fresh connection string from Supabase
3. ✅ Reset database password if needed
4. ✅ Update DATABASE_URL in Render (direct connection)
5. ✅ **Manual Deploy** in Render
6. ✅ Test health endpoint
7. ✅ Test email notifications

**Follow these steps in order, and the database connection will work!**

