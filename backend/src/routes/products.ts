import { Router } from "express";
import { query } from "../db";
import { requireSeller } from "../middleware";
import { getSimilarProducts } from "../recommendations";

const router = Router();

router.get("/", async (req, res) => {
  const { category, size, condition, q, minPrice, maxPrice, sort, includeSold } = req.query;
  const conditions: string[] = [];
  const params: unknown[] = [];
  let i = 1;

  if (includeSold !== "true") conditions.push("p.is_sold = false");
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
        : sort === "trending"
          ? "views_count DESC, orders_count DESC, p.created_at DESC"
          : "p.created_at DESC";

  const rows = await query(
    `SELECT p.*, u.shop_name,
       (SELECT count(*)::int FROM product_views v WHERE v.product_id = p.id) AS views_count,
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

  if (!name) return res.status(400).json({ error: "Product name is required." });
  if (!Number.isFinite(price) || price < 0) return res.status(400).json({ error: "A valid price is required." });
  if (!category) return res.status(400).json({ error: "Category is required." });

  const rows = await query(
    `INSERT INTO products (user_id, name, description, price, category, size, condition, brand, image_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [req.user!.userId, name, description, price, category, size, condition, brand, imageUrl]
  );
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
    `SELECT p.*, u.shop_name FROM products p JOIN users u ON u.id = p.user_id WHERE p.id = $1`,
    [id]
  );
  if (rows.length === 0) return res.status(404).json({ error: "Product not found." });

  if (req.user?.role === "buyer") {
    query("INSERT INTO product_views (user_id, product_id) VALUES ($1, $2)", [req.user.userId, id]).catch(() => {});
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
  const isSold = body.isSold === true;

  if (!name) return res.status(400).json({ error: "Product name is required." });
  if (!Number.isFinite(price) || price < 0) return res.status(400).json({ error: "A valid price is required." });
  if (!category) return res.status(400).json({ error: "Category is required." });

  const rows = await query(
    `UPDATE products SET name=$1, description=$2, price=$3, category=$4, size=$5, condition=$6, brand=$7, image_url=$8, is_sold=$9 WHERE id=$10 RETURNING *`,
    [name, description, price, category, size, condition, brand, imageUrl, isSold, id]
  );
  res.json(rows[0]);
});

router.delete("/:id", requireSeller, async (req, res) => {
  const id = Number(req.params.id);
  const existing = await query<{ user_id: number }>("SELECT user_id FROM products WHERE id = $1", [id]);
  if (existing.length === 0) return res.status(404).json({ error: "Product not found." });
  if (existing[0].user_id !== req.user!.userId) return res.status(403).json({ error: "Forbidden" });

  await query("DELETE FROM products WHERE id = $1", [id]);
  res.json({ success: true });
});

export default router;
