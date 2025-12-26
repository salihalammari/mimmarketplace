# 🔍 Get Correct Connection String from Supabase

## ⚠️ Current Issue

The hostname `db.cjtyzcagrxcypkcbmgbl.supabase.co` cannot be reached, but your project is active at `cjtyzcagrxcypkcbmgbl.supabase.co`.

**The database connection string uses a DIFFERENT hostname than the API endpoint!**

---

## ✅ Solution: Get Exact Connection String

### Step 1: Go to Database Settings

1. **Supabase Dashboard** → Your project (`cjtyzcagrxcypkcbmgbl`)
2. **Settings** (gear icon) → **Database**
3. **Scroll down** to **"Connection string"** section

### Step 2: Get Direct Connection String

1. **Click** the **"URI"** tab (NOT Session or Transaction mode)
2. **You'll see** a connection string like:
   ```
   postgresql://postgres.cjtyzcagrxcypkcbmgbl:[YOUR-PASSWORD]@[HOSTNAME]:5432/postgres
   ```
3. **Copy** the ENTIRE connection string
4. **The hostname might be different** from `db.cjtyzcagrxcypkcbmgbl.supabase.co`

### Step 3: Common Hostname Formats

Supabase might use one of these formats:
- `db.cjtyzcagrxcypkcbmgbl.supabase.co` (what we tried)
- `aws-0-eu-north-1.pooler.supabase.com` (pooler)
- `aws-0-eu-north-1.compute.amazonaws.com` (direct)
- Or a different format shown in your dashboard

### Step 4: Update Connection String

Replace `[YOUR-PASSWORD]` with: `Mimmarket123@40123`

If password contains `@`, URL-encode it:
- `Mimmarket123@40123` → `Mimmarket123%4040123`

Add `?sslmode=require` at the end:
```env
DATABASE_URL="postgresql://postgres.cjtyzcagrxcypkcbmgbl:Mimmarket123%4040123@[HOSTNAME_FROM_SUPABASE]:5432/postgres?sslmode=require"
```

### Step 5: Test in CMD

```cmd
set DATABASE_URL=postgresql://postgres.cjtyzcagrxcypkcbmgbl:Mimmarket123%4040123@[EXACT_HOSTNAME_FROM_SUPABASE]:5432/postgres?sslmode=require
npm exec prisma db pull --print
```

---

## 🔍 Alternative: Check Connection Pooling

1. **Supabase Dashboard → Settings → Database**
2. **Look for:** "Connection Pooling" section
3. **Check** if there's a "Direct connection" option
4. **Some projects** have separate connection strings for:
   - Direct connection (for migrations)
   - Pooled connection (for applications)

---

## 📝 What to Look For

When copying from Supabase:
- ✅ Copy the **ENTIRE** connection string
- ✅ Use the **exact hostname** shown (don't guess)
- ✅ Port should be `5432` for direct connection
- ✅ Replace `[YOUR-PASSWORD]` with your actual password
- ✅ URL-encode password if it contains `@`

---

## ⚠️ Important

The hostname in the connection string might be **different** from:
- The API endpoint: `cjtyzcagrxcypkcbmgbl.supabase.co`
- What we tried: `db.cjtyzcagrxcypkcbmgbl.supabase.co`

**Always use the hostname shown in Supabase Dashboard!**

