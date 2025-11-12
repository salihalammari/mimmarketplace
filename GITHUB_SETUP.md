# GitHub Authentication Setup

## Issue: Password Authentication Not Supported

GitHub no longer accepts passwords for Git operations. You need to use a **Personal Access Token (PAT)**.

## Solution: Create and Use Personal Access Token

### Step 1: Create Personal Access Token

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token** → **Generate new token (classic)**
3. Give it a name: `mimmarketplace-backend`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click **Generate token**
6. **Copy the token immediately** (you won't see it again!)

### Step 2: Use Token Instead of Password

When pushing, use the token as your password:

```bash
git push origin main
# Username: salihalammari
# Password: [paste your token here]
```

### Step 3: Save Credentials (Optional)

To avoid entering token every time:

**Option A: Use Git Credential Manager**
```bash
git config --global credential.helper store
```

**Option B: Use SSH (Recommended)**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub
# Copy public key: cat ~/.ssh/id_ed25519.pub
# Add to GitHub → Settings → SSH and GPG keys

# Change remote URL to SSH
git remote set-url origin git@github.com:salihalammari/mimmarketplace.git
```

## Quick Fix: Use Token Now

1. Create token (see Step 1 above)
2. When prompted for password, paste the token
3. Push will succeed

## Alternative: Use GitHub CLI

```bash
# Install GitHub CLI (if not installed)
# Then authenticate
gh auth login

# Push
git push origin main
```

