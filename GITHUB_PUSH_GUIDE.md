# How to Push to GitHub - Fix Authentication

## 🔐 Problem: Password Authentication Not Supported

GitHub no longer accepts passwords. You need a **Personal Access Token**.

## ✅ Solution: Use Personal Access Token

### Step 1: Create Personal Access Token

1. Go to GitHub: [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `MIM Marketplace Backend`
4. Select scopes:
   - ✅ **repo** (full control of private repositories)
5. Click **"Generate token"**
6. **IMPORTANT:** Copy the token immediately (you won't see it again!)
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Use Token to Push

**Option A: Use token as password (Quick)**
```bash
git push origin main
# When asked for username: salihalammari
# When asked for password: paste your token (ghp_xxxxx)
```

**Option B: Store token in Git (Recommended)**
```bash
# Set token as credential helper
git config --global credential.helper store

# Then push (enter token once, it will be saved)
git push origin main
# Username: salihalammari
# Password: paste your token
```

**Option C: Use SSH (Best for long-term)**
```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key

# Change remote to SSH
git remote set-url origin git@github.com:salihalammari/mimmarketplace.git

# Now push without password
git push origin main
```

## 🚀 Quick Push Commands

After setting up token:

```bash
# Check what needs to be committed
git status

# Add all changes
git add -A

# Commit
git commit -m "feat: add email and whatsapp notification system"

# Push
git push origin main
```

## ✅ After Push

1. Render will automatically detect the push
2. Render will start building automatically
3. Check Render Dashboard → Deploys tab
4. Wait for deployment to complete
5. Test notifications!

