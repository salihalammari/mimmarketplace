# 🔧 Update .env File - DATABASE_URL

## ⚠️ Current Problem

Your `.env` file has:
```env
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=..."
```

**This format doesn't work with Prisma 5.7.1!**

---

## ✅ Solution: Replace with Standard PostgreSQL URL

### Step 1: Get Your New Database Connection String

**For Supabase:**
1. Go to https://app.supabase.com
2. Select your project (or create a new one)
3. **Settings → Database**
4. Scroll to **"Connection string"**
5. Click **"URI"** tab (NOT Session or Transaction mode)
6. Copy the connection string

**Format should be:**
```
postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
```

**Example:**
```
postgresql://postgres.abc123xyz:MyPassword123@db.abc123xyz.supabase.co:5432/postgres
```

### Step 2: Update `.env` File

1. **Open** `.env` file in your project root: `C:\Users\Dell\Desktop\Dev\backend\.env`

2. **Find** this line:
   ```env
   DATABASE_URL="prisma+postgres://localhost:51213/?api_key=..."
   ```

3. **Replace** it with your new database URL:
   ```env
   DATABASE_URL="postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?sslmode=require"
   ```

4. **Important:**
   - ✅ Replace `PROJECT_REF` with your actual Supabase project reference
   - ✅ Replace `YOUR_PASSWORD` with your actual database password
   - ✅ Keep the quotes around the URL
   - ✅ Add `?sslmode=require` at the end
   - ✅ Use port `5432` (NOT `6543`)
   - ✅ Use host `db.PROJECT_REF.supabase.co` (NOT `pooler.supabase.com`)

### Step 3: Save and Test

After updating `.env`:

```bash
# Validate schema
npm exec prisma validate

# Should show: ✅ No errors!

# Generate Prisma Client
npm exec prisma generate

# Should complete successfully!

# Run migrations
npm exec prisma migrate deploy
```

---

## 📝 Complete Example `.env` File

```env
DATABASE_URL="postgresql://postgres.abc123xyz:MySecurePassword123@db.abc123xyz.supabase.co:5432/postgres?sslmode=require"
NODE_ENV=development
PORT=3000
RESEND_API_KEY=your_resend_key
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
NOTIFICATION_FROM_EMAIL=onboarding@resend.dev
WHATSAPP_WEBHOOK_URL=https://hook.integromat.com/your_webhook
```

---

## 🆘 Don't Have Database URL Yet?

### Option 1: Create New Supabase Project
1. Go to https://app.supabase.com
2. Click **"New Project"**
3. Fill in details
4. Wait for project to be created
5. Go to **Settings → Database → Connection string → URI**
6. Copy the connection string
7. Update `.env` as shown above

### Option 2: Use Existing Database
If you have an existing PostgreSQL database:
- Format: `postgresql://user:password@host:5432/database?sslmode=require`
- Update `.env` with your connection string

---

## ✅ After Fixing

Once you update the DATABASE_URL:
- ✅ `npm exec prisma validate` will work
- ✅ `npm exec prisma generate` will work
- ✅ `npm exec prisma migrate deploy` will set up your database

---

## ⚠️ Common Mistakes

- ❌ Using `prisma+postgres://` format
- ❌ Using pooler endpoint (`pooler.supabase.com:6543`)
- ❌ Missing `?sslmode=require`
- ❌ Forgetting to replace `PROJECT_REF` and `YOUR_PASSWORD`
- ❌ Removing quotes (quotes ARE needed in `.env`)

