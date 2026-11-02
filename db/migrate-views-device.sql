-- Track anonymous visitors (guests) in product_views.
-- Idempotent — safe to run multiple times.
-- Run with: psql "$DATABASE_URL" -f db/migrate-views-device.sql

ALTER TABLE product_views ADD COLUMN IF NOT EXISTS device_id TEXT;
ALTER TABLE product_views ALTER COLUMN user_id DROP NOT NULL;
CREATE INDEX IF NOT EXISTS idx_views_device ON product_views(device_id);
