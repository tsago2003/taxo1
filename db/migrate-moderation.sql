-- Product image moderation fields.
-- Idempotent — safe to run multiple times.
-- Run with: psql "$DATABASE_URL" -f db/migrate-moderation.sql

ALTER TABLE products ADD COLUMN IF NOT EXISTS moderation_status TEXT NOT NULL DEFAULT 'approved';
ALTER TABLE products ADD COLUMN IF NOT EXISTS moderation_reasons JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMPTZ;
ALTER TABLE products ADD COLUMN IF NOT EXISTS moderated_by INTEGER REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_moderation ON products(moderation_status);
