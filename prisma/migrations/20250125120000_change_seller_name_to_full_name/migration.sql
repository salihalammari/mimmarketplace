-- AlterTable: Rename seller_name back to full_name (idempotent)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'applications'
          AND column_name = 'seller_name'
    ) THEN
        ALTER TABLE "applications" RENAME COLUMN "seller_name" TO "full_name";
    END IF;
END $$;


