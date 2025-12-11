# 🔧 Fix: Malformed Phone Number Error

## 🔴 Current Problem

**Error:** `[400] [131009] (#131009) Parameter value is not valid. The phone number is malformed: Please use the format: +1234567890.`

**Status:**
- ✅ Webhook module: Working
- ✅ Data mapping: Working (no more "missing parameter" error)
- ❌ Phone number format: Wrong

## ✅ Fix: Two Issues to Fix

### Issue 1: Make.com Mapping Has Space (Most Likely!)

**Problem:** The mapping shows `1. phone` (with space) instead of `1.phone`

**Fix:**
1. **In Make.com scenario**
2. **Click WhatsApp Business Cloud module**
3. **Find "Receiver" field**
4. **Check the mapping:**
   - ❌ **Wrong:** `1. phone` (has space)
   - ✅ **Correct:** `1.phone` (no space)
5. **If it has a space:**
   - Click the mapping icon
   - Delete the current mapping
   - Re-select `1.phone` from dropdown (make sure NO space)
   - Save

### Issue 2: Phone Number Format in Backend

**Problem:** Phone number might have spaces or wrong format

**Fix:** The backend will now ensure phone numbers are always in correct format.

## 🔍 How to Check Phone Number Format

**WhatsApp Business API requires:**
- Format: `+1234567890`
- Must start with `+`
- No spaces
- No special characters except `+`
- Country code included

**Examples:**
- ✅ `+212664990829` (Morocco)
- ✅ `+1234567890` (US)
- ❌ `212664990829` (missing +)
- ❌ `+212 664 990 829` (has spaces)
- ❌ `0664990829` (missing country code)

## 📋 Quick Fix Checklist

### In Make.com:
- [ ] ✅ Click WhatsApp Business Cloud module
- [ ] ✅ Check "Receiver" field mapping
- [ ] ✅ Ensure it's `{{1.phone}}` (NO space between `1.` and `phone`)
- [ ] ✅ If wrong, re-map using dropdown (don't type manually)
- [ ] ✅ Save module

### In Backend (Already Fixed):
- [ ] ✅ Phone number normalization ensures `+` prefix
- [ ] ✅ Spaces and special characters removed
- [ ] ✅ Country code added if missing

## 🧪 Test After Fixing

**Test with a properly formatted phone number:**

```bash
curl -X POST "https://hook.eu2.make.com/ivl5u46c0mrldnoy3ve1pt66j433w7l1" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+212664990829",
    "message": "Test after fixing phone format"
  }'
```

**Check:**
- ✅ Make.com History shows success
- ✅ No "malformed phone number" error
- ✅ WhatsApp message received

## 🐛 Common Issues

### Issue 1: Space in Mapping
**Symptom:** `1. phone` instead of `1.phone`
**Fix:** Re-map using dropdown, ensure no space

### Issue 2: Phone Number Without +
**Symptom:** `212664990829` instead of `+212664990829`
**Fix:** Backend now adds `+` automatically

### Issue 3: Spaces in Phone Number
**Symptom:** `+212 664 990 829` with spaces
**Fix:** Backend now removes all spaces

### Issue 4: Missing Country Code
**Symptom:** `0664990829` without country code
**Fix:** Backend now adds default country code (`+212`)

## 💡 Most Likely Fix

**90% chance the issue is in Make.com mapping:**

1. **Click WhatsApp Business Cloud module**
2. **Check "Receiver" field**
3. **If it shows `1. phone` (with space):**
   - Click mapping icon
   - Delete current mapping
   - Select `1.phone` from dropdown (NO space)
   - Save

**The space in the mapping is causing the malformed phone number!**

## ✅ Success Indicators

After fixing:
- ✅ No "malformed phone number" error
- ✅ WhatsApp message sent successfully
- ✅ Phone number format: `+212664990829` (no spaces)

