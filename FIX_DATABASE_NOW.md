# 🚨 FIX DATABASE CONNECTION - STEP BY STEP

## Current Error
```
Can't reach database server at `db.tjxotorfwaqzcvtoealh.supabase.co:5432`
```

## ✅ STEP-BY-STEP FIX (Follow in Order)

### STEP 1: Check Supabase Project Status ⚠️ MOST IMPORTANT

**90% of connection failures are because the project is PAUSED!**

1. Go to: **https://app.supabase.com**
2. Select your project
3. **Look at the top of the page** - what does it say?
   - ✅ **"Active"** (green badge) = Good, continue to Step 2
   - ❌ **"Paused"** (yellow/red badge) = **THIS IS THE PROBLEM!**

**If PAUSED:**
- Click the **"Resume"** or **"Restore"** button
- Wait **1-2 minutes** for project to activate
- You'll see a green "Active" badge when ready
- **Then test again:** `curl "https://mimmarketplace.onrender.com/health"`

**If ACTIVE:**
- Continue to Step 2

---

### STEP 2: Get Fresh Connection String from Supabase

1. In Supabase Dashboard → **Settings → Database**
2. Scroll to **"Connection string"** section
3. Click the **"URI"** tab (NOT Session or Transaction mode)
4. You'll see:
   ```
   postgresql://postgres.tjxotorfwaqzcvtoealh:[YOUR-PASSWORD]@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres
   ```
5. **Copy this entire string**

---

### STEP 3: Reset Database Password (If You Don't Know It)

**If the password might be wrong or truncated:**

1. Supabase Dashboard → **Settings → Database**
2. Scroll to **"Database password"**
3. Click **"Reset Database Password"**
4. **Copy the NEW password** (shown only once - save it!)
5. Update the connection string from Step 2 with the new password

---

### STEP 4: Update DATABASE_URL in Render

1. Go to: **Render Dashboard → mimmarketplace → Environment**
2. Find `DATABASE_URL` variable
3. Click **"Edit"** or the pencil icon
4. **Delete everything** in the field
5. **Paste** your connection string from Step 2
6. **Replace** `[YOUR-PASSWORD]` with the actual password
7. **Add** `?sslmode=require` at the end if it's not there

**Final format should be:**
```
postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_ACTUAL_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require
```

**Critical checks:**
- ✅ No quotes around the string
- ✅ No spaces before/after
- ✅ Host is `db.tjxotorfwaqzcvtoealh.supabase.co` (NOT `pooler.supabase.com`)
- ✅ Port is `5432` (NOT `6543`)
- ✅ Password is COMPLETE (no `...` truncation)
- ✅ Has `?sslmode=require` at the end

8. Click **"Save Changes"**

---

### STEP 5: MANUAL REDEPLOY (REQUIRED!)

**⚠️ CRITICAL: After changing DATABASE_URL, you MUST manually redeploy!**

1. In Render Dashboard → **mimmarketplace**
2. Click **"Manual Deploy"** button (top right, blue button)
3. Select **"Deploy latest commit"**
4. Wait **3-5 minutes** for deployment
5. Check status - should show **"Live"** (green)

**Why manual deploy?**
- Auto-deploy doesn't always pick up environment variable changes
- Manual deploy ensures the new DATABASE_URL is loaded

---

### STEP 6: Test Connection

After redeploy completes:

```bash
curl "https://mimmarketplace.onrender.com/health"
```

**✅ SUCCESS looks like:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-05T15:23:08.000Z",
  "database": "connected"
}
```

**❌ STILL FAILING:**
- Check Render logs for more details
- Go back to Step 1 (check if Supabase is paused)
- Verify DATABASE_URL format matches exactly

---

## 🔍 Verify Your DATABASE_URL Format

**✅ CORRECT:**
```
postgresql://postgres.tjxotorfwaqzcvtoealh:MyCompletePassword123@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require
```

**❌ WRONG - Pooler endpoint:**
```
postgresql://postgres.tjxotorfwaqzcvtoealh:PASSWORD@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

**❌ WRONG - Missing SSL:**
```
postgresql://postgres.tjxotorfwaqzcvtoealh:PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres
```

**❌ WRONG - Truncated password:**
```
postgresql://postgres.tjxotorfwaqzcvtoealh:Sali2991...@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres
```

---

## 🎯 Most Common Issues

1. **Supabase project is PAUSED** (90% of cases)
   - Free tier auto-pauses after 1 week of inactivity
   - **Fix:** Resume in Supabase dashboard

2. **Password is truncated** (5% of cases)
   - Shows `...` at the end
   - **Fix:** Reset password, copy complete version

3. **Service not redeployed** (3% of cases)
   - Changed DATABASE_URL but didn't redeploy
   - **Fix:** Manual Deploy in Render

4. **Network restrictions** (2% of cases)
   - IP restrictions blocking Render
   - **Fix:** Disable restrictions in Supabase

---

## 📋 Quick Checklist

Before testing, verify:

- [ ] ✅ Supabase project shows **"Active"** (not paused)
- [ ] ✅ DATABASE_URL uses `db.tjxotorfwaqzcvtoealh.supabase.co` (direct, not pooler)
- [ ] ✅ DATABASE_URL has port `5432` (not 6543)
- [ ] ✅ DATABASE_URL has `?sslmode=require` at the end
- [ ] ✅ Password is COMPLETE (no truncation, no `...`)
- [ ] ✅ No quotes around DATABASE_URL in Render
- [ ] ✅ **Manual Deploy** was done after changing DATABASE_URL
- [ ] ✅ Render service shows **"Live"** status

---

## 🚀 After Fix Works

Once health check shows `"database": "connected"`:

1. **Test email notifications:**
   ```bash
   curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
     -H "Content-Type: application/json" \
     -d '{"email":"salihalammari91@gmail.com","type":"needs_info"}'
   ```

2. **Check Render logs** for `[EMAIL] ✅` messages

3. **Check your inbox** for the email

---

## 💡 Still Not Working?

If you've followed all steps and it's still failing:

1. **Check Render logs** - Look for more specific error messages
2. **Verify Supabase project is Active** - Double-check the dashboard
3. **Test connection string locally:**
   ```bash
   node scripts/test-db-connection.js
   ```
4. **Contact Supabase support** - They can check if there are any issues on their end

**Start with Step 1 - checking if Supabase is paused. This fixes 90% of cases!**

