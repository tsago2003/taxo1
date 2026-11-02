-- Backfill: translate the demo products into Georgian and fix category/image
-- mismatches + add measurements. Idempotent — keyed on exact legacy English titles.
-- Run with: psql "$DATABASE_URL" -f db/migrate-georgian-demo.sql

UPDATE products SET name='ვინტაჟური ჯინსის ქურთუკი', description='კლასიკური ოვერსაიზ ჯინსის ქურთუკი გაცვეთილი შეფერილობით. მარადიული ფენის ნივთი ყველა სეზონისთვის.', measurements='{"chest":"54","length":"62","sleeve":"60"}'::jsonb WHERE name='Vintage Denim Jacket';
UPDATE products SET name='ზოლიანი ნაქსოვი სვიტერი', description='რბილი ბამბის ნარევი ნაქსოვი სვიტერი რეტრო ზოლებით. მყუდრო და სუნთქვადი.', measurements='{"chest":"56","length":"64","sleeve":"58"}'::jsonb WHERE name='Striped Knit Sweater';
UPDATE products SET name='ყვავილებიანი მიდი კაბა', description='ნაკადი ყვავილებიანი მიდი კაბა ხელსაყრელი სილუეტით. იდეალურია გაზაფხულის დღეებისთვის.', measurements='{"chest":"44","length":"110"}'::jsonb WHERE name='Floral Midi Dress';
UPDATE products SET name='მაღალწელიანი ჯინსი', description='მოდუნებული მაღალწელიანი ჯინსი საშუალო შეფერილობით. კომფორტული და ხელსაყრელი ჭრით.', measurements='{"waist":"76","length":"100"}'::jsonb WHERE name='High-Waisted Mom Jeans';
UPDATE products SET name='ტყავის ჩანთა', description='კომპაქტური ნატურალური ტყავის ჩანთა რეგულირებადი თასმით. მინიმალური ცვეთა.' WHERE name='Leather Crossbody Bag';
UPDATE products SET name='პლისირებული მიდი კალთა', description='ელეგანტური პლისირებული მიდი კალთა, რომელიც ლამაზად მოძრაობს. ნეიტრალური კრემისფერი ყველაფერს უხდება.', measurements='{"waist":"72","length":"78"}'::jsonb WHERE name='Pleated Midi Skirt';
UPDATE products SET name='თეთრი სპორტული ფეხსაცმელი', description='სუფთა თეთრი ტყავის სპორტული ფეხსაცმელი კარგ მდგომარეობაში. ნებისმიერი გარდერობის ბაზა.', image_url='https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80' WHERE name='Classic White Sneakers';
UPDATE products SET name='შალის პალტო', description='ელეგანტური შალის ნარევი პალტო ქამრით. მსუბუქად ნახმარი, მარადიული სტილი.', measurements='{"chest":"58","length":"105","sleeve":"63"}'::jsonb WHERE name='Wool Blend Trench Coat';
UPDATE products SET name='აბრეშუმის შარფი', description='ფერადი ნაბეჭდი აბრეშუმის შარფი. მრავალმხრივი აქსესუარი ნებისმიერი ლუქისთვის.' WHERE name='Silk Scarf';
UPDATE products SET name='ოვერსაიზ გრაფიკული მაისური', description='რბილი ოვერსაიზ გრაფიკული მაისური ვინტაჟური ჯგუფის პრინტით. მოდუნებული და კომფორტული.', measurements='{"chest":"62","length":"72"}'::jsonb WHERE name='Oversized Graphic Tee';
