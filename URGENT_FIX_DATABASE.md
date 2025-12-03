# ⚠️ URGENT: Fix Database Connection First

## 🔴 Problem

Your Render logs show:
```
Can't reach database server at aws-1-us-east-2.pooler.supabase.com:5432
```

**This prevents the entire application from working, including email notifications.**

## ✅ Quick Fix (5 minutes)

### Step 1: Get Correct Connection String from Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll to **Connection string**
5. Select **URI** tab (NOT Session mode or Transaction mode)
6. Copy the connection string

**It should look like:**
```
postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres
```

**Important:**
- ✅ Use `db.tjxotorfwaqzcvtoealh.supabase.co` (NOT `pooler.supabase.com`)
- ✅ Use port `5432` (NOT `6543`)
- ✅ No `?pgbouncer=true` in the URL

### Step 2: Update DATABASE_URL in Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select **mimmarketplace** service
3. Go to **Environment** tab
4. Find `DATABASE_URL`
5. Click **Edit**
6. **Delete** the old value completely
7. **Paste** the new connection string from Supabase
8. **Add** `?sslmode=require` at the end:
   ```
   postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require
   ```
9. Click **Save Changes**

### Step 3: Wait for Redeploy

- Render will automatically redeploy
- Wait 2-3 minutes
- Check logs - should see no database errors

### Step 4: Verify Database Connection

Check Render logs. You should see:
```
PrismaService initialized
🚀 Server running on port 10000
```

**NOT:**
```
Can't reach database server...
```

## 🧪 After Database is Fixed

Once database connection works, test email again:

```bash
curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
  -H "Content-Type: application/json" \
  -d '{"email":"salihalammari91@gmail.com","type":"needs_info"}'
```

Then check:
1. ✅ Render logs show `[EMAIL] ✅ Email notification sent successfully...`
2. ✅ Check your inbox: `salihalammari91@gmail.com`
3. ✅ Check spam folder

## 📝 Summary

**Problem:** Database connection failure → App can't run → No emails sent
**Solution:** Fix `DATABASE_URL` in Render with correct Supabase connection string
**After fix:** App will work → Email notifications will work

**Do this first, then test email again!**

