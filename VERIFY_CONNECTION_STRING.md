# 🔍 Verify Connection String from Supabase

## ⚠️ DNS Resolution Failed

The hostname `db.cjtyzcagrxcypkcbmgbl.supabase.co` cannot be resolved, which suggests:
- The hostname might be incorrect
- The connection string format might be wrong
- Need to get the exact connection string from Supabase

---

## ✅ Solution: Get Exact Connection String from Supabase

### Step 1: Get Direct Connection String

1. **Go to:** https://app.supabase.com
2. **Select project:** `cjtyzcagrxcypkcbmgbl` (mimmarketplace)
3. **Settings** (gear icon) → **Database**
4. **Scroll to:** "Connection string" section
5. **Click:** **"URI"** tab (NOT Session or Transaction mode)
6. **Copy** the ENTIRE connection string

### Step 2: Verify the Hostname

The connection string should look like one of these formats:

**Format 1 (Direct):**
```
postgresql://postgres.cjtyzcagrxcypkcbmgbl:[YOUR-PASSWORD]@db.cjtyzcagrxcypkcbmgbl.supabase.co:5432/postgres
```

**Format 2 (Alternative):**
```
postgresql://postgres.cjtyzcagrxcypkcbmgbl:[YOUR-PASSWORD]@aws-0-eu-north-1.pooler.supabase.com:5432/postgres
```

**Important:** The hostname might be different! Copy it exactly as shown in Supabase.

### Step 3: Replace Password

Replace `[YOUR-PASSWORD]` with: `Mimmarket123@40123`

### Step 4: URL-Encode Password (If Needed)

If password contains `@`, encode it:
- `Mimmarket123@40123` → `Mimmarket123%4040123`

### Step 5: Add SSL Mode

Add `?sslmode=require` at the end:
```env
DATABASE_URL="postgresql://postgres.cjtyzcagrxcypkcbmgbl:Mimmarket123%4040123@[HOSTNAME_FROM_SUPABASE]:5432/postgres?sslmode=require"
```

### Step 6: Update `.env` File

1. **Open:** `C:\Users\Dell\Desktop\Dev\backend\.env`
2. **Replace** the `DATABASE_URL` line with the connection string from Supabase
3. **Save** the file

### Step 7: Test Connection

```bash
npm exec prisma db pull --print
```

---

## 🔍 Alternative: Check Connection Pooling Settings

1. **Supabase Dashboard → Settings → Database**
2. **Look for:** "Connection Pooling" section
3. **Check** if there's a different connection string for direct connections
4. **Some projects** use different hostnames for direct vs pooled connections

---

## 📝 What to Look For

When copying from Supabase, make sure:
- ✅ Hostname matches exactly (might be `db.xxx.supabase.co` or different)
- ✅ Port is `5432` for direct connection
- ✅ Password is correct: `Mimmarket123@40123`
- ✅ Connection string includes `postgresql://` at the start

---

## ⚠️ If Hostname is Different

If Supabase shows a different hostname (not `db.cjtyzcagrxcypkcbmgbl.supabase.co`):
1. **Use the hostname** shown in Supabase (it's the correct one)
2. **Update** `.env` with the exact connection string from Supabase
3. **Test** connection again

---

## ✅ Quick Checklist

- [ ] Opened Supabase Dashboard → Settings → Database
- [ ] Clicked "URI" tab (NOT Session/Transaction)
- [ ] Copied the ENTIRE connection string
- [ ] Replaced `[YOUR-PASSWORD]` with `Mimmarket123@40123`
- [ ] URL-encoded password if it contains `@`
- [ ] Added `?sslmode=require` at the end
- [ ] Updated `.env` file
- [ ] Tested: `npm exec prisma db pull --print`

