-- Marketplace v2: seller verification, shop info, discounts, multi-image, ratings.
-- Idempotent — safe to run multiple times.
-- Run with: psql "$DATABASE_URL" -f db/migrate-marketplace-v2.sql

-- Seller verification + shop pickup info + cached rating
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE users ADD COLUMN IF NOT EXISTS shop_location TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS shop_hours TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS rating_count INTEGER NOT NULL DEFAULT 0;

-- Existing sellers are treated as verified (pre-date this feature).
UPDATE users SET verification_status = 'verified' WHERE role = 'seller' AND verification_status = 'pending';

-- Discounts + multi-image support
ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_price NUMERIC(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Shop reviews (client ratings)
CREATE TABLE IF NOT EXISTS shop_reviews (
  id SERIAL PRIMARY KEY,
  shop_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reviews_shop ON shop_reviews(shop_id);
