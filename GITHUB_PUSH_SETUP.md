# How to Push to GitHub - Fix Authentication Error

## Problem
GitHub no longer accepts passwords. You need a **Personal Access Token (PAT)**.

## ✅ Solution: Create Personal Access Token

### Step 1: Create Token on GitHub

1. Go to GitHub: [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `MIM Marketplace Backend`
4. Select expiration: **90 days** (or your preference)
5. Check these permissions:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (if using GitHub Actions)
6. Click **"Generate token"**
7. **IMPORTANT:** Copy the token immediately! It looks like: `ghp_xxxxxxxxxxxxxxxxxxxx`
8. Save it somewhere safe (you won't see it again!)

### Step 2: Use Token Instead of Password

When you run `git push`, use the token as your password:

```bash
git push origin main
```

When prompted:
- **Username:** `salihalammari`
- **Password:** Paste your token (the `ghp_xxxxx` one, NOT your GitHub password)

### Step 3: Save Credentials (Optional but Recommended)

To avoid entering token every time:

**Option A: Use Git Credential Helper**
```bash
git config --global credential.helper store
```

Then on next push, enter token once, and it will be saved.

**Option B: Use SSH (More Secure)**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
# Then change remote URL:
git remote set-url origin git@github.com:salihalammari/mimmarketplace.git
```

## 🚀 Quick Push Command

After getting your token:

```bash
git push origin main
```

Enter:
- Username: `salihalammari`
- Password: `ghp_your_token_here`

## ✅ Alternative: Push via GitHub Desktop

If command line is difficult:
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. Open your repository
4. Click "Push origin" button

