-- Seed data for the second-hand clothing marketplace.
-- Creates a demo seller account (email: demo@thrift-shop.com / password: demo1234)
-- and a set of example products so the landing page looks alive immediately.
-- Idempotent: safe to run multiple times.

DO $$
DECLARE
  demo_user_id int;
BEGIN
  INSERT INTO users (email, password_hash, shop_name)
  VALUES (
    'demo@thrift-shop.com',
    '$2b$10$Q0FrSSBHkyVfPEsEfaOPuOlj5053f.QtHuGim8nYY5ASRlxvdYSGi',
    'Vintage Vibes Thrift'
  )
  ON CONFLICT (email) DO NOTHING;

  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@thrift-shop.com';

  IF NOT EXISTS (SELECT 1 FROM products LIMIT 1) THEN
    INSERT INTO products (user_id, name, description, price, category, size, condition, brand, image_url) VALUES
    (demo_user_id, 'Vintage Denim Jacket', 'Classic oversized denim jacket with a lived-in wash. A timeless layering piece for every season.', 34.50, 'Outerwear', 'M', 'Good', 'Levi''s', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80'),
    (demo_user_id, 'Striped Knit Sweater', 'Soft cotton blend knit sweater in a retro striped pattern. Cozy and breathable.', 22.00, 'Tops', 'L', 'Like new', 'Uniqlo', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80'),
    (demo_user_id, 'Floral Midi Dress', 'Flowy floral midi dress with a flattering fit-and-flare silhouette. Perfect for spring days.', 28.90, 'Dresses', 'S', 'Good', 'Zara', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'),
    (demo_user_id, 'High-Waisted Mom Jeans', 'Relaxed high-waisted mom jeans in a medium wash. Comfortable with a flattering cut.', 26.00, 'Trousers', 'M', 'Good', 'Weekday', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'),
    (demo_user_id, 'Leather Crossbody Bag', 'Compact genuine leather crossbody bag with an adjustable strap. Minimal wear.', 39.00, 'Bags', NULL, 'Like new', 'Fossil', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'),
    (demo_user_id, 'Pleated Midi Skirt', 'Elegant pleated midi skirt that moves beautifully. Neutral beige tone goes with everything.', 18.50, 'Skirts', 'M', 'Good', 'Mango', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80'),
    (demo_user_id, 'Classic White Sneakers', 'Clean white leather sneakers in great condition. A staple for any wardrobe.', 31.00, 'Shoes', '41', 'Good', 'Adidas', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'),
    (demo_user_id, 'Wool Blend Trench Coat', 'Elegant wool blend trench coat with a belted waist. Lightly worn, timeless style.', 65.00, 'Outerwear', 'L', 'Good', 'COS', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80'),
    (demo_user_id, 'Silk Scarf', 'Colorful printed silk scarf. A versatile accessory to elevate any outfit.', 12.00, 'Accessories', NULL, 'New with tags', NULL, 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80'),
    (demo_user_id, 'Oversized Graphic Tee', 'Soft oversized graphic tee with a vintage band print. Relaxed and comfortable.', 14.00, 'Tops', 'XL', 'Fair', NULL, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80');
  END IF;
END $$;
