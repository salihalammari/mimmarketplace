-- AlterTable: Rename full_name to seller_name (if column exists)
-- This migration is safe to run even if the column is already named seller_name
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'applications' 
        AND column_name = 'full_name'
    ) THEN
        ALTER TABLE "applications" RENAME COLUMN "full_name" TO "seller_name";
    END IF;
END $$;

