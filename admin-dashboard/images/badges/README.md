# Badge Images Setup

## 📋 Required Badge Images

You need to add three badge images to this folder:

### 1. Verified Seller Badge (Level 1)
- **Filename:** `verified-seller.png`
- **Description:** Teal/Green badge with "MIM VERIFIED" and "VERIFIED SELLER"
- **Color Scheme:** White, Teal, Black
- **Dimensions:** Recommended 400x400px or higher (will be scaled automatically)

### 2. Trusted Seller Badge (Level 2)
- **Filename:** `trusted-seller.png`
- **Description:** Purple badge with "MIM VERIFIED" and "TRUSTED SELLER"
- **Color Scheme:** White, Purple, Black
- **Dimensions:** Recommended 400x400px or higher (will be scaled automatically)

### 3. Golden Seller Badge (Level 3)
- **Filename:** `golden-seller.png`
- **Description:** Gold badge with "MIM VERIFIED" and "GOLDEN SELLER"
- **Color Scheme:** White, Gold, Purple gradient
- **Dimensions:** Recommended 400x400px or higher (will be scaled automatically)

## 📁 File Structure

```
admin-dashboard/
  └── images/
      └── badges/
          ├── verified-seller.png    (Level 1 - Teal/Green)
          ├── trusted-seller.png     (Level 2 - Purple)
          ├── golden-seller.png      (Level 3 - Gold)
          └── README.md              (This file)
```

## 🎨 Badge Design Specifications

### Level 1: Verified Seller
- **Shape:** Hexagonal badge
- **Main Colors:** White background, Teal border gradient
- **Text:** 
  - Top: "MIM VERIFIED" (Teal)
  - Bottom: "VERIFIED SELLER" (White on Teal band)
  - Year: "2025" (Black)
- **Logo:** Stylized "M" with teal swirl

### Level 2: Trusted Seller
- **Shape:** Hexagonal badge
- **Main Colors:** White background, Purple border gradient
- **Text:**
  - Top: "MIM VERIFIED" (Purple)
  - Bottom: "TRUSTED SELLER" (White on Purple band)
  - Year: "2025" (Black)
- **Logo:** Stylized "M" with purple swirl

### Level 3: Golden Seller
- **Shape:** Hexagonal badge
- **Main Colors:** White background, Gold to Purple gradient border
- **Text:**
  - Top: "MIM VERIFIED" (Gold)
  - Bottom: "GOLDEN SELLER" (White on Gold band)
  - Year: "2025" (Black)
- **Logo:** Stylized "M" with gold ring/starburst

## ✅ How to Add Images

1. **Save your badge images** with the exact filenames:
   - `verified-seller.png`
   - `trusted-seller.png`
   - `golden-seller.png`

2. **Place them in this folder:** `admin-dashboard/images/badges/`

3. **Verify the images load:**
   - Open the admin dashboard
   - Click "Create Badge" on a qualified application
   - You should see the badge images in the level selector

## 🔍 Image Requirements

- **Format:** PNG (with transparency support)
- **Size:** 400x400px minimum (higher resolution recommended)
- **Background:** Transparent or black (as per design)
- **Quality:** High resolution for crisp display

## 🚀 Usage in Dashboard

The badge images are automatically displayed in:

1. **Badge Creation Modal:**
   - Each badge level button shows its corresponding image
   - Preview appears when a level is selected

2. **Application Details:**
   - When viewing an application with an activated badge
   - Shows the appropriate badge image based on badge level

## 📝 Notes

- Images are loaded with `onerror` handlers, so if an image is missing, it will gracefully hide
- Images are automatically scaled to fit the display area
- The dashboard will work even if images are not yet added (images will just be hidden)

## 🎯 Next Steps

1. Add the three badge image files to this folder
2. Test in the admin dashboard
3. Verify images display correctly in both the badge creation modal and application details

