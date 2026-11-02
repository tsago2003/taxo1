-- Seed data for the second-hand clothing marketplace (Georgian).
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
    INSERT INTO products (user_id, name, description, price, category, size, condition, brand, image_url, measurements) VALUES
    (demo_user_id, 'ვინტაჟური ჯინსის ქურთუკი', 'კლასიკური ოვერსაიზ ჯინსის ქურთუკი გაცვეთილი შეფერილობით. მარადიული ფენის ნივთი ყველა სეზონისთვის.', 34.50, 'Outerwear', 'M', 'Good', 'Levi''s', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80', '{"chest":"54","length":"62","sleeve":"60"}'),
    (demo_user_id, 'ზოლიანი ნაქსოვი სვიტერი', 'რბილი ბამბის ნარევი ნაქსოვი სვიტერი რეტრო ზოლებით. მყუდრო და სუნთქვადი.', 22.00, 'Tops', 'L', 'Like new', 'Uniqlo', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80', '{"chest":"56","length":"64","sleeve":"58"}'),
    (demo_user_id, 'ყვავილებიანი მიდი კაბა', 'ნაკადი ყვავილებიანი მიდი კაბა ხელსაყრელი სილუეტით. იდეალურია გაზაფხულის დღეებისთვის.', 28.90, 'Dresses', 'S', 'Good', 'Zara', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80', '{"chest":"44","length":"110"}'),
    (demo_user_id, 'მაღალწელიანი ჯინსი', 'მოდუნებული მაღალწელიანი ჯინსი საშუალო შეფერილობით. კომფორტული და ხელსაყრელი ჭრით.', 26.00, 'Trousers', 'M', 'Good', 'Weekday', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80', '{"waist":"76","length":"100"}'),
    (demo_user_id, 'ტყავის ჩანთა', 'კომპაქტური ნატურალური ტყავის ჩანთა რეგულირებადი თასმით. მინიმალური ცვეთა.', 39.00, 'Bags', NULL, 'Like new', 'Fossil', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80', NULL),
    (demo_user_id, 'პლისირებული მიდი კალთა', 'ელეგანტური პლისირებული მიდი კალთა, რომელიც ლამაზად მოძრაობს. ნეიტრალური კრემისფერი ყველაფერს უხდება.', 18.50, 'Skirts', 'M', 'Good', 'Mango', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80', '{"waist":"72","length":"78"}'),
    (demo_user_id, 'თეთრი სპორტული ფეხსაცმელი', 'სუფთა თეთრი ტყავის სპორტული ფეხსაცმელი კარგ მდგომარეობაში. ნებისმიერი გარდერობის ბაზა.', 31.00, 'Shoes', '41', 'Good', 'Adidas', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80', NULL),
    (demo_user_id, 'შალის პალტო', 'ელეგანტური შალის ნარევი პალტო ქამრით. მსუბუქად ნახმარი, მარადიული სტილი.', 65.00, 'Outerwear', 'L', 'Good', 'COS', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80', '{"chest":"58","length":"105","sleeve":"63"}'),
    (demo_user_id, 'აბრეშუმის შარფი', 'ფერადი ნაბეჭდი აბრეშუმის შარფი. მრავალმხრივი აქსესუარი ნებისმიერი ლუქისთვის.', 12.00, 'Accessories', NULL, 'New with tags', NULL, 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80', NULL),
    (demo_user_id, 'ოვერსაიზ გრაფიკული მაისური', 'რბილი ოვერსაიზ გრაფიკული მაისური ვინტაჟური ჯგუფის პრინტით. მოდუნებული და კომფორტული.', 14.00, 'Tops', 'XL', 'Fair', NULL, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80', '{"chest":"62","length":"72"}');
  END IF;
END $$;
