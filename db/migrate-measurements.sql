-- Physical measurements (cm) for products — shown on the PDP spec box.
-- Idempotent — safe to run multiple times.
-- Run with: psql "$DATABASE_URL" -f db/migrate-measurements.sql

ALTER TABLE products ADD COLUMN IF NOT EXISTS measurements JSONB;
