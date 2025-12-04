# How to Check Render Logs for Email Debugging

## 🔍 Important: These Are Local Logs, Not Render Logs!

The logs you showed are from your **local WSL environment** (port 3000), not from Render.

To debug email sending, you need to check **Render logs** where the actual email sending happens.

## 📋 Step-by-Step: Check Render Logs

### Step 1: Go to Render Dashboard

1. Open [Render Dashboard](https://dashboard.render.com)
2. Sign in to your account
3. Find and click on **mimmarketplace** service

### Step 2: Open Logs Tab

1. In the service page, look for tabs at the top:
   - **Overview**
   - **Logs** ← Click this!
   - **Events**
   - **Settings**
   - etc.

2. Click **Logs** tab

### Step 3: Find Email Logs

1. The logs will show real-time activity
2. Look for messages with `[EMAIL]` tag
3. Scroll to find logs from when you tested (around 2:25 PM)

### Step 4: What to Look For

**After you ran the test notification, you should see:**

**✅ Success:**
```
[EMAIL] Attempting to send email to salihalammari91@gmail.com via Gmail...
[EMAIL] ✅ Email notification sent successfully to salihalammari91@gmail.com...
```

**❌ Error (Most Common):**
```
[EMAIL] Attempting to send email to salihalammari91@gmail.com via Gmail...
[EMAIL] ❌ Failed to send email notification via Gmail... Invalid login: 535-5.7.8 Username and Password not accepted
```

**❌ Other Errors:**
```
[EMAIL] ❌ Failed to send email notification via Gmail... Connection timeout
[EMAIL] ❌ Failed to send email notification via Gmail... Authentication failed
```

## 🔧 Common Issues Based on Render Logs

### If Logs Show "Invalid login" or "Username and Password not accepted":

**Problem:** Gmail App Password is incorrect

**Fix:**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Go to **App passwords**
3. **Delete** the old app password for "MIM Marketplace Backend"
4. **Generate new** app password:
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Name: **MIM Marketplace Backend**
   - Click **Generate**
5. **Copy** the 16-character password (it looks like: `abcd efgh ijkl mnop`)
6. **Remove spaces**: `abcdefghijklmnop`
7. In Render → **Environment** → `GMAIL_APP_PASSWORD`
8. **Paste** the new password (no spaces)
9. Click **Save Changes**
10. Go to **Manual Deploy** → **Deploy latest commit**
11. Wait 3-5 minutes
12. Test again

### If Logs Show "Email sent successfully" but no email:

**Problem:** Email might be in spam or delayed

**Fix:**
1. Check **Spam folder** in Gmail
2. Check **All Mail** folder
3. Search for: "معلومات إضافية مطلوبة" or "MIM Marketplace"
4. Wait 1-2 minutes (Gmail delivery can be slow)

### If Logs Show No `[EMAIL]` Messages:

**Problem:** Service might not have processed the request

**Fix:**
1. Make sure you're testing on Render URL: `https://mimmarketplace.onrender.com`
2. Not local URL: `http://localhost:3000`
3. Check if service is "Live" (green) in Render Dashboard
4. Try the test again

## 🧪 Test Again and Check Logs

1. **Run test:**
   ```bash
   curl -X POST "https://mimmarketplace.onrender.com/applications/test-notification" \
     -H "Content-Type: application/json" \
     -d '{"email":"salihalammari91@gmail.com","type":"needs_info"}'
   ```

2. **Immediately go to Render Dashboard → Logs**

3. **Look for `[EMAIL]` messages** that appeared right after the test

4. **Copy the error message** if there is one

## 📸 How to Share Logs

If you want help debugging:

1. Go to Render Dashboard → Logs
2. Find the `[EMAIL]` messages
3. Copy the relevant log lines (especially error messages)
4. Share them here

## 🎯 Quick Checklist

- [ ] Go to Render Dashboard (not local)
- [ ] Click **Logs** tab
- [ ] Look for `[EMAIL]` messages
- [ ] Check for errors
- [ ] If "Invalid login" → Regenerate Gmail App Password
- [ ] If "Email sent" → Check Spam folder
- [ ] Redeploy after changing env vars

## 💡 Pro Tip

**Keep Render logs open** while testing:
1. Open Render Dashboard → Logs in one browser tab
2. Run the test command in another terminal
3. Watch the logs update in real-time
4. You'll see exactly what happens!

**The Render logs will tell you exactly why emails aren't being sent!**

