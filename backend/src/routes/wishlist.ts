import { Router } from "express";
import { query } from "../db";
import { requireBuyer } from "../middleware";

const router = Router();

router.get("/", requireBuyer, async (req, res) => {
  const rows = await query(
    `SELECT p.*, u.shop_name FROM wishlists w JOIN products p ON p.id = w.product_id JOIN users u ON u.id = p.user_id WHERE w.user_id = $1 ORDER BY w.created_at DESC`,
    [req.user!.userId]
  );
  res.json(rows);
});

router.post("/", requireBuyer, async (req, res) => {
  const productId = Number(req.body?.productId);
  if (!Number.isInteger(productId) || productId <= 0)
    return res.status(400).json({ error: "Invalid product." });
  const exists = await query("SELECT id FROM products WHERE id = $1", [productId]);
  if (exists.length === 0) return res.status(404).json({ error: "Product not found." });
  await query(
    "INSERT INTO wishlists (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [req.user!.userId, productId]
  );
  res.json({ inWishlist: true });
});

router.delete("/:productId", requireBuyer, async (req, res) => {
  const productId = Number(req.params.productId);
  if (!Number.isInteger(productId) || productId <= 0)
    return res.status(400).json({ error: "Invalid product." });
  await query("DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2", [
    req.user!.userId,
    productId,
  ]);
  res.json({ inWishlist: false });
});

export default router;
