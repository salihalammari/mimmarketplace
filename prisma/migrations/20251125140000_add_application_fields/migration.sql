-- Add new flexible fields for seller applications
ALTER TABLE "applications"
    ADD COLUMN IF NOT EXISTS "selling_page" TEXT,
    ADD COLUMN IF NOT EXISTS "secondary_selling_page" TEXT,
    ADD COLUMN IF NOT EXISTS "city" TEXT,
    ADD COLUMN IF NOT EXISTS "products_category" TEXT,
    ADD COLUMN IF NOT EXISTS "other_products" TEXT,
    ADD COLUMN IF NOT EXISTS "valid_product" BOOLEAN,
    ADD COLUMN IF NOT EXISTS "products_type" TEXT,
    ADD COLUMN IF NOT EXISTS "time_selling" TEXT,
    ADD COLUMN IF NOT EXISTS "feedbacks" TEXT,
    ADD COLUMN IF NOT EXISTS "return_policies" TEXT,
    ADD COLUMN IF NOT EXISTS "fake_orders" TEXT,
    ADD COLUMN IF NOT EXISTS "badge_use" TEXT[],
    ADD COLUMN IF NOT EXISTS "delivery_duration" TEXT,
    ADD COLUMN IF NOT EXISTS "delivery_zone" TEXT,
    ADD COLUMN IF NOT EXISTS "whatsapp_number" TEXT,
    ADD COLUMN IF NOT EXISTS "instagram_handle" TEXT,
    ADD COLUMN IF NOT EXISTS "facebook_handle" TEXT,
    ADD COLUMN IF NOT EXISTS "tiktok_handle" TEXT;

