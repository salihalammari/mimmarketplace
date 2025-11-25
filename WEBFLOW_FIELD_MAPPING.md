# Webflow Form Field Mapping

## Your Webflow Form Fields → Database Mapping

Based on your form field names, here's how they map to the database:

### Required Fields (Core Database Fields)

| Webflow Field Name | Database Field | Type | Notes |
|-------------------|----------------|------|-------|
| `full_name` | `full_name` | String | Required - Seller's full name |
| `email` | `email` | String | Required - Email address |
| `phone_number` | `phone` | String | Optional - Phone number |
| `products_category` | `category` | String | Required - Product category |

### Optional Fields (Stored in `submitted_fields` JSON)

| Webflow Field Name | Database Field (in submitted_fields) | Type | Notes |
|-------------------|--------------------------------------|------|-------|
| `selling_page` | `sellingPage` / `mainSalesPageLink` | String | Main shop/selling page URL |
| `secondarys_selling_page` | `secondarySellingPage` / `secondarySalesPageLink` | String | Secondary selling page URL |
| `city` | `city` | String | City name |
| `products_category` | `productsCategory` / `salesCategories` | Array/String | Product categories |
| `others` | `otherProducts` | String | Other products description |
| `valide_product` | `validProduct` | Boolean | Whether product is valid |
| `products_type` | `productsType` / `productType` | String | Type of products |
| `time_selling` | `timeSelling` / `sellingDuration` | String | How long selling |
| `feedbacks` | `feedbacks` / `customerFeedback` | String | Customer feedback |
| `return_policies` | `returnPolicies` / `returnHandling` | String | Return policy information |
| `fake_orders` | `fakeOrders` / `fakeOrdersExperience` | String | Fake orders experience |

## Field Name Variations Supported

The code handles these variations automatically (with underscore/hyphen normalization):

- `full_name` = `full-name` = `full name`
- `phone_number` = `phone-number` = `phone`
- `selling_page` = `selling-page`
- `secondarys_selling_page` = `secondarys-selling-page`
- `products_category` = `products-category`
- `products_type` = `products-type`
- `time_selling` = `time-selling`
- `return_policies` = `return-policies`
- `fake_orders` = `fake-orders`
- `valide_product` = `valide-product`

## Example Webflow Webhook Payload

```json
{
  "name": "Application form",
  "site": "mimmarketplace",
  "submittedAt": "2025-11-19T20:00:00.000Z",
  "data": {
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+212612345678",
    "selling_page": "https://example.com/shop",
    "secondarys_selling_page": "https://example.com/shop2",
    "city": "Casablanca",
    "products_category": "Electronics",
    "others": "Other products description",
    "valide_product": "yes",
    "products_type": "Digital",
    "time_selling": "2 years",
    "feedbacks": "Good feedback",
    "return_policies": "30 days return",
    "fake_orders": "No fake orders"
  }
}
```

## Database Schema

### Core Fields (Direct columns)
- `id` - UUID (auto-generated)
- `full_name` - From `full_name`
- `email` - From `email`
- `phone` - From `phone_number` (optional)
- `category` - From `products_category`
- `language` - Auto-detected or from form
- `status` - Default: "pending"
- `created_at` - Auto-generated timestamp
- `updated_at` - Auto-updated timestamp

### Submitted Fields (JSON column)
All other fields are stored in the `submitted_fields` JSON column:

```json
{
  "sellingPage": "https://example.com/shop",
  "secondarySellingPage": "https://example.com/shop2",
  "city": "Casablanca",
  "productsCategory": "Electronics",
  "otherProducts": "Other products description",
  "validProduct": true,
  "productsType": "Digital",
  "timeSelling": "2 years",
  "feedbacks": "Good feedback",
  "returnPolicies": "30 days return",
  "fakeOrders": "No fake orders"
}
```

## Testing

After deploying, test with:

```bash
curl -X POST https://mimmarketplace.onrender.com/webhooks/webflow \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "full_name": "Test User",
      "email": "test@example.com",
      "phone_number": "+212612345678",
      "selling_page": "https://example.com/shop",
      "city": "Casablanca",
      "products_category": "Electronics",
      "time_selling": "1 year",
      "feedbacks": "Good",
      "return_policies": "30 days",
      "fake_orders": "None"
    }
  }'
```

## Verification

1. **Check Render Logs:**
   - Look for "Clean form data keys: ..."
   - Should show: `full_name`, `email`, `phone_number`, etc.

2. **Check Database:**
   - `full_name` should have value from `full_name`
   - `email` should have value from `email`
   - `phone` should have value from `phone_number`
   - `submitted_fields` JSON should contain all other fields

3. **Check Admin Dashboard:**
   - All fields should display correctly
   - No empty values

## Notes

- Field names are case-insensitive
- Underscores and hyphens are normalized (treated the same)
- Empty values are automatically filtered out
- Required fields (`full_name`, `email`) are validated
- Boolean fields (`valide_product`) accept: "yes", "true", "1", "no", "false", "0"

