-- Add additional fields to user table for better-auth
-- Run this in Supabase SQL Editor if columns don't exist

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "firstName" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "lastName" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" TEXT;

-- Backfill: split existing "name" into firstName/lastName for existing users
UPDATE "user" 
SET 
  "firstName" = COALESCE("firstName", SPLIT_PART("name", ' ', 1)),
  "lastName" = COALESCE("lastName", NULLIF(TRIM(SUBSTRING("name" FROM POSITION(' ' IN "name"))), ''))
WHERE "firstName" IS NULL AND "name" IS NOT NULL;
