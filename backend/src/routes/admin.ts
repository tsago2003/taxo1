import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db";
import { signToken } from "../auth";
import { requireAdmin } from "../middleware";
import { logActivity } from "../activity";

const router = Router();

const ROLES = ["buyer", "seller", "admin"] as const;
const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

router.post("/login", async (req, res) => {
  const email =
    typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  const rows = await query<{ id: number; password_hash: string; name: string }>(
    "SELECT id, password_hash, name FROM users WHERE email = $1 AND role = 'admin' AND is_active = true",
    [email]
  );
  if (rows.length === 0)
    return res.status(401).json({ error: "Invalid email or password." });

  const valid = await bcrypt.compare(password, rows[0].password_hash);
  if (!valid) return res.status(401).json({ error: "Invalid email or password." });

  const token = signToken({
    userId: rows[0].id,
    email,
    name: rows[0].name,
    role: "admin",
    isActive: true,
  });
  res.json({
    token,
    user: { id: rows[0].id, email, name: rows[0].name, role: "admin" },
  });
});

router.get("/stats", requireAdmin, async (_req, res) => {
  const sellers = await query<{ n: number }>("SELECT count(*)::int AS n FROM users WHERE role = 'seller'");
  const buyers = await query<{ n: number }>("SELECT count(*)::int AS n FROM users WHERE role = 'buyer'");
  const products = await query<{ n: number }>("SELECT count(*)::int AS n FROM products");
  const soldProducts = await query<{ n: number }>("SELECT count(*)::int AS n FROM products WHERE is_sold = true");
  const orders = await query<{ n: number }>("SELECT count(*)::int AS n FROM orders");
  const revenue = await query<{ n: number }>("SELECT COALESCE(sum(total), 0)::float AS n FROM orders");
  const newSignups7d = await query<{ n: number }>(
    "SELECT count(*)::int AS n FROM users WHERE created_at > now() - interval '7 days'"
  );

  res.json({
    sellers: sellers[0]?.n ?? 0,
    buyers: buyers[0]?.n ?? 0,
    products: products[0]?.n ?? 0,
    soldProducts: soldProducts[0]?.n ?? 0,
    orders: orders[0]?.n ?? 0,
    revenue: revenue[0]?.n ?? 0,
    newSignups7d: newSignups7d[0]?.n ?? 0,
  });
});

router.get("/users", requireAdmin, async (req, res) => {
  const role = typeof req.query.role === "string" ? req.query.role : "";
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

  const conditions: string[] = [];
  const params: unknown[] = [];
  let i = 1;
  if (ROLES.includes(role as (typeof ROLES)[number])) {
    params.push(role);
    conditions.push(`role = $${i++}`);
  }
  if (q) {
    params.push(`%${q}%`);
    conditions.push(`(email ILIKE $${i} OR name ILIKE $${i} OR shop_name ILIKE $${i++})`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const rows = await query(
    `SELECT id, email, name, role, shop_name, is_active, verification_status, shop_location, shop_hours, rating_avg, rating_count, created_at
     FROM users ${where}
     ORDER BY created_at DESC
     LIMIT 300`,
    params
  );
  res.json(rows);
});

router.patch("/users/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "Invalid user id." });

  const existing = await query("SELECT id FROM users WHERE id = $1", [id]);
  if (existing.length === 0) return res.status(404).json({ error: "User not found." });

  const body = req.body ?? {};
  const updates: string[] = [];
  const params: unknown[] = [];
  let i = 1;

  if (typeof body.isActive === "boolean") {
    params.push(body.isActive);
    updates.push(`is_active = $${i++}`);
  }
  if (typeof body.role === "string" && ROLES.includes(body.role as (typeof ROLES)[number])) {
    params.push(body.role);
    updates.push(`role = $${i++}`);
  }
  if (typeof body.verification === "string" && ["pending", "verified", "rejected"].includes(body.verification)) {
    params.push(body.verification);
    updates.push(`verification_status = $${i++}`);
  }
  if (updates.length === 0)
    return res.status(400).json({ error: "Nothing to update." });

  params.push(id);
  await query(`UPDATE users SET ${updates.join(", ")} WHERE id = $${i}`, params);

  logActivity(
    req.user,
    typeof body.isActive === "boolean"
      ? body.isActive
        ? "user.activated"
        : "user.suspended"
      : "user.updated",
    "user",
    id
  );
  res.json({ success: true });
});

router.delete("/users/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "Invalid user id." });
  if (req.user!.userId === id)
    return res.status(400).json({ error: "You cannot delete your own account." });

  await query("DELETE FROM users WHERE id = $1", [id]);
  logActivity(req.user, "user.deleted", "user", id);
  res.json({ success: true });
});

router.get("/products", requireAdmin, async (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const params: unknown[] = [];
  let where = "";
  if (q) {
    params.push(`%${q}%`);
    where = `WHERE (p.name ILIKE $1 OR p.brand ILIKE $1 OR u.shop_name ILIKE $1 OR u.email ILIKE $1)`;
  }
  const rows = await query(
    `SELECT p.*, u.shop_name, u.email AS seller_email
     FROM products p JOIN users u ON u.id = p.user_id
     ${where}
     ORDER BY p.created_at DESC
     LIMIT 300`,
    params
  );
  res.json(rows);
});

router.patch("/products/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "Invalid product id." });
  if (typeof req.body?.isSold !== "boolean")
    return res.status(400).json({ error: "isSold (boolean) is required." });

  await query("UPDATE products SET is_sold = $1 WHERE id = $2", [req.body.isSold, id]);
  logActivity(
    req.user,
    req.body.isSold ? "product.marked_sold" : "product.marked_available",
    "product",
    id
  );
  res.json({ success: true });
});

router.delete("/products/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "Invalid product id." });

  await query("DELETE FROM products WHERE id = $1", [id]);
  logActivity(req.user, "product.deleted", "product", id);
  res.json({ success: true });
});

router.get("/orders", requireAdmin, async (_req, res) => {
  const rows = await query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 300");
  const orders = [];
  for (const row of rows) {
    const items = await query("SELECT * FROM order_items WHERE order_id = $1", [row.id]);
    orders.push({ ...row, items });
  }
  res.json(orders);
});

router.patch("/orders/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "Invalid order id." });
  const status = typeof req.body?.status === "string" ? req.body.status : "";
  if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number]))
    return res.status(400).json({ error: "Invalid order status." });

  await query("UPDATE orders SET status = $1 WHERE id = $2", [status, id]);
  logActivity(req.user, "order.status_changed", "order", id, status);
  res.json({ success: true });
});

router.get("/activity", requireAdmin, async (_req, res) => {
  const rows = await query(
    `SELECT a.*, u.email AS actor_email
     FROM activity_log a
     LEFT JOIN users u ON u.id = a.actor_id
     ORDER BY a.created_at DESC
     LIMIT 200`
  );
  res.json(rows);
});

router.get("/moderation", requireAdmin, async (_req, res) => {
  const rows = await query(
    `SELECT p.*, u.shop_name, u.email AS seller_email
     FROM products p JOIN users u ON u.id = p.user_id
     WHERE p.moderation_status = 'pending'
     ORDER BY p.created_at ASC`
  );
  res.json(rows);
});

router.post("/moderation/:id/approve", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "Invalid product id." });

  await query(
    `UPDATE products
     SET moderation_status = 'approved', moderation_reasons = '[]'::jsonb,
         moderated_at = now(), moderated_by = $1
     WHERE id = $2`,
    [req.user!.userId, id]
  );
  logActivity(req.user, "moderation.approved", "product", id);
  res.json({ success: true });
});

router.post("/moderation/:id/reject", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "Invalid product id." });

  await query(
    `UPDATE products
     SET moderation_status = 'rejected', moderated_at = now(), moderated_by = $1
     WHERE id = $2`,
    [req.user!.userId, id]
  );
  logActivity(req.user, "moderation.rejected", "product", id);
  res.json({ success: true });
});

export default router;
