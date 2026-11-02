import { Router } from "express";
import { query } from "../db";
import { requireSeller } from "../middleware";
import { getSimilarProducts } from "../recommendations";
import { logActivity } from "../activity";
import { analyzeImage } from "../moderation";

const router = Router();

router.get("/", async (req, res) => {
  const { category, size, condition, q, minPrice, maxPrice, sort, includeSold } = req.query;
  const conditions: string[] = [];
  const params: unknown[] = [];
  let i = 1;

  if (includeSold !== "true") conditions.push("p.is_sold = false");
  // Public catalog only shows products that passed moderation and are in stock.
  conditions.push("p.moderation_status = 'approved'");
  conditions.push("p.quantity > 0");
  if (typeof category === "string" && category) { params.push(category); conditions.push(`p.category = $${i++}`); }
  if (typeof size === "string" && size) { params.push(size); conditions.push(`p.size = $${i++}`); }
  if (typeof condition === "string" && condition) { params.push(condition); conditions.push(`p.condition = $${i++}`); }
  if (typeof q === "string" && q) { params.push(`%${q}%`); conditions.push(`(p.name ILIKE $${i} OR p.description ILIKE $${i} OR p.brand ILIKE $${i++})`); }
  if (typeof minPrice === "string" && minPrice && !Number.isNaN(parseFloat(minPrice))) { params.push(parseFloat(minPrice)); conditions.push(`p.price >= $${i++}`); }
  if (typeof maxPrice === "string" && maxPrice && !Number.isNaN(parseFloat(maxPrice))) { params.push(parseFloat(maxPrice)); conditions.push(`p.price <= $${i++}`); }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const orderBy =
    sort === "price-asc"
      ? "p.price ASC"
      : sort === "price-desc"
        ? "p.price DESC"
        : sort === "popular"
          ? "recent_views DESC, views_count DESC, p.created_at DESC"
          : sort === "trending"
            ? "views_count DESC, orders_count DESC, p.created_at DESC"
            : "p.created_at DESC";

  const rows = await query(
    `SELECT p.*, u.shop_name, u.rating_avg,
       (SELECT count(*)::int FROM product_views v WHERE v.product_id = p.id) AS views_count,
       (SELECT count(DISTINCT COALESCE(v.user_id::text, v.device_id))::int FROM product_views v WHERE v.product_id = p.id AND v.viewed_at > now() - interval '10 minutes') AS recent_views,
       (SELECT count(*)::int FROM order_items oi WHERE oi.product_id = p.id) AS orders_count
     FROM products p JOIN users u ON u.id = p.user_id ${where} ORDER BY ${orderBy}`,
    params
  );
  res.json(rows);
});

router.post("/", requireSeller, async (req, res) => {
  const body = req.body ?? {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const price = typeof body.price === "number" ? body.price : NaN;
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const size = typeof body.size === "string" && body.size ? body.size.trim() : null;
  const condition = typeof body.condition === "string" && body.condition ? body.condition.trim() : "Good";
  const brand = typeof body.brand === "string" && body.brand ? body.brand.trim() : null;
  const imageUrl = typeof body.imageUrl === "string" && body.imageUrl ? body.imageUrl.trim() : null;
  const images = Array.isArray(body.images) && body.images.length
    ? body.images.filter((x: unknown): x is string => typeof x === "string" && !!x).slice(0, 5)
    : imageUrl ? [imageUrl] : [];
  const primaryImage = images[0] ?? null;
  const salePrice =
    typeof body.salePrice === "number" && Number.isFinite(body.salePrice) && body.salePrice >= 0 && body.salePrice < price
      ? body.salePrice
      : null;
  const quantity =
    typeof body.quantity === "number" && Number.isInteger(body.quantity) && body.quantity >= 1
      ? body.quantity
      : 1;

  if (!name) return res.status(400).json({ error: "Product name is required." });
  if (!Number.isFinite(price) || price < 0) return res.status(400).json({ error: "A valid price is required." });
  if (!category) return res.status(400).json({ error: "Category is required." });
  if (images.length === 0) return res.status(400).json({ error: "Please upload at least one photo." });

  // Only verified sellers can list products.
  const seller = await query<{ verification_status: string }>(
    "SELECT verification_status FROM users WHERE id = $1",
    [req.user!.userId]
  );
  if (seller[0]?.verification_status !== "verified")
    return res.status(403).json({ error: "Your shop is not verified yet." });

  const moderation = primaryImage ? await analyzeImage(primaryImage) : { status: "approved", reasons: [] };

  const rows = await query(
    `INSERT INTO products (user_id, name, description, price, sale_price, category, size, condition, brand, image_url, images, quantity, moderation_status, moderation_reasons)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12,$13,$14::jsonb) RETURNING *`,
    [req.user!.userId, name, description, price, salePrice, category, size, condition, brand, primaryImage, JSON.stringify(images), quantity, moderation.status, JSON.stringify(moderation.reasons)]
  );
  logActivity(req.user, "product.created", "product", Number(rows[0].id), name);
  res.status(201).json(rows[0]);
});

router.get("/mine", requireSeller, async (req, res) => {
  const rows = await query(
    `SELECT p.*, u.shop_name
     FROM products p JOIN users u ON u.id = p.user_id
     WHERE p.user_id = $1
     ORDER BY p.created_at DESC`,
    [req.user!.userId]
  );
  res.json(rows);
});

router.get("/:id/similar", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid product id." });
  res.json(await getSimilarProducts(id, 4));
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid product id." });

  const rows = await query(
    `SELECT p.*, u.shop_name, u.rating_avg, u.shop_location, u.shop_hours, u.verification_status,
       (SELECT count(DISTINCT COALESCE(v.user_id::text, v.device_id))::int FROM product_views v WHERE v.product_id = p.id AND v.viewed_at > now() - interval '10 minutes') AS recent_views
     FROM products p JOIN users u ON u.id = p.user_id WHERE p.id = $1`,
    [id]
  );
  if (rows.length === 0) return res.status(404).json({ error: "Product not found." });

  // Count every visitor: logged-in buyers by user_id, guests by device_id.
  const deviceId =
    typeof req.headers["x-device-id"] === "string"
      ? req.headers["x-device-id"].slice(0, 64)
      : null;
  const userId = req.user?.role === "buyer" ? req.user.userId : null;

  if (userId || deviceId) {
    // Throttle: don't record the same visitor re-viewing within 60 seconds.
    query(
      `INSERT INTO product_views (user_id, device_id, product_id)
       SELECT $1::integer, $2::text, $3::integer
       WHERE NOT EXISTS (
         SELECT 1 FROM product_views
         WHERE product_id = $3
           AND (
             ($1::integer IS NOT NULL AND user_id = $1)
             OR ($1::integer IS NULL AND $2::text IS NOT NULL AND device_id = $2)
           )
           AND viewed_at > now() - interval '60 seconds'
       )`,
      [userId, deviceId, id]
    ).catch(() => {});
  }
  res.json(rows[0]);
});

router.put("/:id", requireSeller, async (req, res) => {
  const id = Number(req.params.id);
  const existing = await query<{ user_id: number }>("SELECT user_id FROM products WHERE id = $1", [id]);
  if (existing.length === 0) return res.status(404).json({ error: "Product not found." });
  if (existing[0].user_id !== req.user!.userId) return res.status(403).json({ error: "Forbidden" });

  const body = req.body ?? {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const price = typeof body.price === "number" ? body.price : NaN;
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const size = typeof body.size === "string" && body.size ? body.size.trim() : null;
  const condition = typeof body.condition === "string" && body.condition ? body.condition.trim() : "Good";
  const brand = typeof body.brand === "string" && body.brand ? body.brand.trim() : null;
  const imageUrl = typeof body.imageUrl === "string" && body.imageUrl ? body.imageUrl.trim() : null;
  const images = Array.isArray(body.images) && body.images.length
    ? body.images.filter((x: unknown): x is string => typeof x === "string" && !!x).slice(0, 5)
    : imageUrl ? [imageUrl] : [];
  const primaryImage = images[0] ?? null;
  const salePrice =
    typeof body.salePrice === "number" && Number.isFinite(body.salePrice) && body.salePrice >= 0 && body.salePrice < price
      ? body.salePrice
      : null;
  const isSold = body.isSold === true;
  const quantity =
    typeof body.quantity === "number" && Number.isInteger(body.quantity) && body.quantity >= 1
      ? body.quantity
      : 1;

  if (!name) return res.status(400).json({ error: "Product name is required." });
  if (!Number.isFinite(price) || price < 0) return res.status(400).json({ error: "A valid price is required." });
  if (!category) return res.status(400).json({ error: "Category is required." });

  const moderation = primaryImage ? await analyzeImage(primaryImage) : { status: "approved", reasons: [] };

  const rows = await query(
    `UPDATE products SET name=$1, description=$2, price=$3, sale_price=$4, category=$5, size=$6, condition=$7, brand=$8, image_url=$9, images=$10::jsonb, is_sold=$11, quantity=$12, moderation_status=$13, moderation_reasons=$14::jsonb, moderated_at=NULL, moderated_by=NULL WHERE id=$15 RETURNING *`,
    [name, description, price, salePrice, category, size, condition, brand, primaryImage, JSON.stringify(images), isSold, quantity, moderation.status, JSON.stringify(moderation.reasons), id]
  );
  logActivity(req.user, "product.updated", "product", id, name);
  res.json(rows[0]);
});

router.delete("/:id", requireSeller, async (req, res) => {
  const id = Number(req.params.id);
  const existing = await query<{ user_id: number }>("SELECT user_id FROM products WHERE id = $1", [id]);
  if (existing.length === 0) return res.status(404).json({ error: "Product not found." });
  if (existing[0].user_id !== req.user!.userId) return res.status(403).json({ error: "Forbidden" });

  await query("DELETE FROM products WHERE id = $1", [id]);
  logActivity(req.user, "product.deleted", "product", id);
  res.json({ success: true });
});

export default router;
