# Fix Database Connection Error

## ❌ Current Problem

Render logs show:
```
Can't reach database server at aws-1-us-east-2.pooler.supabase.com:5432
Please make sure your database server is running at aws-1-us-east-2.pooler.supabase.com:5432.
```

**This prevents the entire application from working, including email notifications.**

## ✅ Solution Steps

### Step 1: Check DATABASE_URL in Render

1. Go to **Render Dashboard → mimmarketplace → Environment**
2. Find `DATABASE_URL`
3. Verify it's set correctly

**Expected format:**
```
postgresql://postgres:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres?pgbouncer=true
```

### Step 2: Verify Supabase Database is Running

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings → Database**
4. Check database status (should be "Active")

### Step 3: Check Supabase Connection Pooling

**Option A: Use Connection Pooler (Recommended)**
```
postgresql://postgres:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres?pgbouncer=true
```

**Option B: Use Direct Connection (If pooler fails)**
```
postgresql://postgres:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

### Step 4: Check IP Allowlist (Firewall)

1. Go to Supabase Dashboard → **Settings → Database**
2. Scroll to **Connection Pooling** or **Network Restrictions**
3. Add Render's IP ranges:
   - `74.220.48.0/24`
   - `74.220.56.0/24`
4. Or allow all IPs temporarily for testing: `0.0.0.0/0`

### Step 5: Verify Password

1. In Supabase Dashboard → **Settings → Database**
2. Click **Reset Database Password** if needed
3. Copy the new password
4. Update `DATABASE_URL` in Render with the new password

### Step 6: Test Connection

After updating `DATABASE_URL`:
1. Save changes in Render
2. Service will auto-redeploy
3. Check logs - should see successful database connection
4. Then test email again

## 🔍 Quick Diagnostic

**Check if DATABASE_URL is set:**
```bash
# In Render Dashboard → Environment, verify:
DATABASE_URL=postgresql://postgres:...
```

**Common Issues:**
- ❌ Missing `DATABASE_URL` → Add it
- ❌ Wrong password → Reset in Supabase
- ❌ IP blocked → Add Render IPs to Supabase firewall
- ❌ Database paused → Resume in Supabase dashboard

## 🚀 After Fixing Database

Once database connection is fixed:

1. **Service will restart automatically**
2. **Check logs** - should see no database errors
3. **Test email again:**
   ```bash
   curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
     -H "Content-Type: application/json" \
     -d '{"email":"salihalammari91@gmail.com","type":"needs_info"}'
   ```
4. **Check Render logs** for `[EMAIL]` messages
5. **Check your inbox** for the email

## 📝 Summary

**Problem:** Database connection failure prevents app from running
**Solution:** Fix `DATABASE_URL` in Render, verify Supabase is running, check firewall
**After fix:** App will work, then email notifications will work
