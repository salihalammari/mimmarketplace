# 🚨 Fix: Database Connection Error - Pooler Endpoint

## 🔴 Current Problem

**Error:** `Can't reach database server at aws-1-us-east-2.pooler.supabase.com:5432`

**Cause:** `DATABASE_URL` in Render is using the **pooler endpoint** instead of the **direct endpoint**.

## ✅ Quick Fix

### Step 1: Get Direct Connection String from Supabase

1. **Go to:** https://app.supabase.com
2. **Select your project**
3. **Settings → Database**
4. **Scroll to "Connection string"**
5. **Click "URI" tab** (NOT Session or Transaction mode)
6. **Copy the connection string:**
   ```
   postgresql://postgres.tjxotorfwaqzcvtoealh:[YOUR-PASSWORD]@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres
   ```

**Important:** Notice it says `db.tjxotorfwaqzcvtoealh.supabase.co` (NOT `pooler.supabase.com`)

### Step 2: Update DATABASE_URL in Render

1. **Render Dashboard → mimmarketplace → Environment**
2. **Find `DATABASE_URL`**
3. **Click "Edit"**
4. **Delete everything** in the field
5. **Paste the connection string** from Step 1
6. **Replace `[YOUR-PASSWORD]`** with your actual password
7. **Add `?sslmode=require`** at the end if not present

**Final format:**
```
postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_ACTUAL_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require
```

**Critical checks:**
- ✅ Host: `db.tjxotorfwaqzcvtoealh.supabase.co` (NOT `pooler.supabase.com`)
- ✅ Port: `5432` (NOT `6543`)
- ✅ Password: COMPLETE (no `...` truncation)
- ✅ Has `?sslmode=require` at the end
- ✅ No quotes around the string

8. **Click "Save Changes"**

### Step 3: Manual Deploy

1. **Render Dashboard → mimmarketplace**
2. **Click "Manual Deploy"**
3. **Select "Deploy latest commit"**
4. **Wait 3-5 minutes**

### Step 4: Verify

After deploy, check logs - should see:
```
✅ Database connected successfully
🚀 Server running on port 10000
```

## 🔍 Connection String Comparison

### ❌ WRONG (Current - Pooler):
```
postgresql://postgres.tjxotorfwaqzcvtoealh:PASSWORD@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```
- Uses `pooler.supabase.com`
- Won't work on Render

### ✅ CORRECT (Direct):
```
postgresql://postgres.tjxotorfwaqzcvtoealh:PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require
```
- Uses `db.tjxotorfwaqzcvtoealh.supabase.co`
- Works on Render

## 📋 Quick Checklist

- [ ] ✅ Get connection string from Supabase (URI tab)
- [ ] ✅ Verify host is `db.tjxotorfwaqzcvtoealh.supabase.co` (NOT pooler)
- [ ] ✅ Verify port is `5432`
- [ ] ✅ Add `?sslmode=require` at the end
- [ ] ✅ Update `DATABASE_URL` in Render
- [ ] ✅ Manual Deploy
- [ ] ✅ Check logs for "Database connected successfully"

## 🎯 Why This Happens

Render's free tier doesn't work well with Supabase's pooler endpoint. You **must** use the direct connection endpoint.

**The fix:** Change `pooler.supabase.com` to `db.tjxotorfwaqzcvtoealh.supabase.co` in your DATABASE_URL.

## 💡 Pro Tip

**Save the correct connection string** so you can paste it directly next time:
```
postgresql://postgres.tjxotorfwaqzcvtoealh:YOUR_PASSWORD@db.tjxotorfwaqzcvtoealh.supabase.co:5432/postgres?sslmode=require
```

**After fixing, the deployment will succeed and WhatsApp testing can continue!**

