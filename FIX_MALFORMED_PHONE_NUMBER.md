# 🔧 Fix: "Phone number is malformed" Error

## 🔴 Current Error

**Error:** `[400] [131009] (#131009) Parameter value is not valid. The phone number is malformed: Please use the format: +1234567890.`

**What it means:** The phone number in the "Receiver" field is not in the correct format. WhatsApp Business API requires: `+1234567890` (with +, no spaces, country code included).

## ✅ Fix: Two Places to Check

### Issue 1: Make.com Mapping (Most Likely)

**Problem:** The "Receiver" field might have spaces or wrong format.

**Fix:**
1. **In Make.com scenario**
2. **Click WhatsApp Business Cloud module**
3. **Find "Receiver" field**
4. **Check the mapping:**
   - Should be: `{{1.phone}}` (no spaces)
   - If it shows: `{{1. phone}}` (with space) → **WRONG!**
5. **If wrong:**
   - Click mapping icon
   - Delete current mapping
   - Re-select `1.phone` from dropdown (ensure NO space)
   - Save

### Issue 2: Backend Phone Number Format

**Problem:** Phone number from database might not be properly formatted.

**Fix:** The backend now ensures phone numbers are always in correct format (`+1234567890`).

## 🔍 How to Verify Phone Number Format

**WhatsApp Business API requires:**
- ✅ Format: `+1234567890`
- ✅ Must start with `+`
- ✅ No spaces
- ✅ No special characters except `+`
- ✅ Country code included

**Examples:**
- ✅ `+212664990829` (Morocco - correct)
- ✅ `+212644003494` (Morocco - correct)
- ✅ `+1234567890` (US - correct)
- ❌ `212664990829` (missing +)
- ❌ `+212 664 990 829` (has spaces)
- ❌ `0664990829` (missing country code)
- ❌ `+212-664-990-829` (has dashes)

## 📋 Step-by-Step Fix

### Step 1: Check Make.com Mapping

1. **Open Make.com scenario**
2. **Click WhatsApp Business Cloud module**
3. **Find "Receiver" field**
4. **Verify it shows:** `{{1.phone}}` (no space between `1.` and `phone`)
5. **If it shows:** `{{1. phone}}` (with space):
   - Click mapping icon
   - Delete mapping
   - Re-select `1.phone` from dropdown
   - Save

### Step 2: Verify Phone Number in Database

**Check what phone number is being sent:**

1. **Check Make.com execution log:**
   - Go to scenario → History
   - Click on latest execution
   - Check "Input" section
   - See what value `1.phone` has
   - Should be: `+212644003494` (with +, no spaces)

2. **If phone number is wrong format:**
   - Check your database
   - Phone number should be stored as: `+212644003494` or `0664990829`
   - Backend will normalize it automatically

### Step 3: Test with Correct Format

**Test the webhook with properly formatted phone:**

```bash
curl -X POST "https://hook.eu2.make.com/ivl5u46c0mrldnoy3ve1pt66j433w7l1" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+212644003494",
    "message": "Test with correct phone format"
  }'
```

**Important:** Phone number must be `+212644003494` (with +, no spaces).

## 🐛 Common Issues

### Issue 1: Space in Mapping
**Symptom:** `{{1. phone}}` instead of `{{1.phone}}`
**Fix:** Re-map using dropdown, ensure no space

### Issue 2: Phone Number Without +
**Symptom:** `212644003494` instead of `+212644003494`
**Fix:** Backend now adds `+` automatically

### Issue 3: Spaces in Phone Number
**Symptom:** `+212 644 003 494` with spaces
**Fix:** Backend now removes all spaces

### Issue 4: Missing Country Code
**Symptom:** `0644003494` without country code
**Fix:** Backend now adds default country code (`+212`)

## ✅ Quick Checklist

- [ ] ✅ Clicked WhatsApp Business Cloud module
- [ ] ✅ Checked "Receiver" field mapping
- [ ] ✅ Verified it's `{{1.phone}}` (NO space)
- [ ] ✅ If wrong, re-mapped using dropdown
- [ ] ✅ Saved module
- [ ] ✅ Verified phone number format in database
- [ ] ✅ Tested with properly formatted phone number

## 🧪 Test After Fixing

**Test command:**
```bash
curl -X POST "https://hook.eu2.make.com/ivl5u46c0mrldnoy3ve1pt66j433w7l1" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+212644003494",
    "message": "Test after fixing phone format"
  }'
```

**Expected result:**
- ✅ Make.com History: Both modules show green checkmarks
- ✅ No "malformed phone number" error
- ✅ WhatsApp: Message received

## 💡 Most Likely Fix

**90% chance the issue is in Make.com mapping:**

1. **Click WhatsApp Business Cloud module**
2. **Check "Receiver" field**
3. **If it shows `{{1. phone}}` (with space):**
   - Click mapping icon
   - Delete current mapping
   - Select `1.phone` from dropdown (NO space)
   - Save

**The space in the mapping is causing the malformed phone number!**

## ✅ Success Indicators

After fixing:
- ✅ No "malformed phone number" error
- ✅ WhatsApp message sent successfully
- ✅ Phone number format: `+212644003494` (no spaces)

**The fix is ensuring the phone number is in format `+1234567890` with no spaces!**

