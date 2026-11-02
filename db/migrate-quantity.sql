-- Product stock / quantity support.
-- Idempotent — safe to run multiple times.
-- Run with: psql "$DATABASE_URL" -f db/migrate-quantity.sql

ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;
