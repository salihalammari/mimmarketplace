ALTER TABLE "applications"
  ADD COLUMN IF NOT EXISTS "needs_info_reminder_sent_at" TIMESTAMP(3);

