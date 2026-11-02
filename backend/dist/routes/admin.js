"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../db");
const auth_1 = require("../auth");
const middleware_1 = require("../middleware");
const activity_1 = require("../activity");
const router = (0, express_1.Router)();
const ROLES = ["buyer", "seller", "admin"];
const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
router.post("/login", async (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!email || !password)
        return res.status(400).json({ error: "Email and password are required." });
    const rows = await (0, db_1.query)("SELECT id, password_hash, name FROM users WHERE email = $1 AND role = 'admin' AND is_active = true", [email]);
    if (rows.length === 0)
        return res.status(401).json({ error: "Invalid email or password." });
    const valid = await bcryptjs_1.default.compare(password, rows[0].password_hash);
    if (!valid)
        return res.status(401).json({ error: "Invalid email or password." });
    const token = (0, auth_1.signToken)({
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
router.get("/stats", middleware_1.requireAdmin, async (_req, res) => {
    const sellers = await (0, db_1.query)("SELECT count(*)::int AS n FROM users WHERE role = 'seller'");
    const buyers = await (0, db_1.query)("SELECT count(*)::int AS n FROM users WHERE role = 'buyer'");
    const products = await (0, db_1.query)("SELECT count(*)::int AS n FROM products");
    const soldProducts = await (0, db_1.query)("SELECT count(*)::int AS n FROM products WHERE is_sold = true");
    const orders = await (0, db_1.query)("SELECT count(*)::int AS n FROM orders");
    const revenue = await (0, db_1.query)("SELECT COALESCE(sum(total), 0)::float AS n FROM orders");
    const newSignups7d = await (0, db_1.query)("SELECT count(*)::int AS n FROM users WHERE created_at > now() - interval '7 days'");
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
router.get("/users", middleware_1.requireAdmin, async (req, res) => {
    const role = typeof req.query.role === "string" ? req.query.role : "";
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const conditions = [];
    const params = [];
    let i = 1;
    if (ROLES.includes(role)) {
        params.push(role);
        conditions.push(`role = $${i++}`);
    }
    if (q) {
        params.push(`%${q}%`);
        conditions.push(`(email ILIKE $${i} OR name ILIKE $${i} OR shop_name ILIKE $${i++})`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const rows = await (0, db_1.query)(`SELECT id, email, name, role, shop_name, is_active, verification_status, shop_location, shop_hours, rating_avg, rating_count, created_at
     FROM users ${where}
     ORDER BY created_at DESC
     LIMIT 300`, params);
    res.json(rows);
});
router.patch("/users/:id", middleware_1.requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
        return res.status(400).json({ error: "Invalid user id." });
    const existing = await (0, db_1.query)("SELECT id FROM users WHERE id = $1", [id]);
    if (existing.length === 0)
        return res.status(404).json({ error: "User not found." });
    const body = req.body ?? {};
    const updates = [];
    const params = [];
    let i = 1;
    if (typeof body.isActive === "boolean") {
        params.push(body.isActive);
        updates.push(`is_active = $${i++}`);
    }
    if (typeof body.role === "string" && ROLES.includes(body.role)) {
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
    await (0, db_1.query)(`UPDATE users SET ${updates.join(", ")} WHERE id = $${i}`, params);
    (0, activity_1.logActivity)(req.user, typeof body.isActive === "boolean"
        ? body.isActive
            ? "user.activated"
            : "user.suspended"
        : "user.updated", "user", id);
    res.json({ success: true });
});
router.delete("/users/:id", middleware_1.requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
        return res.status(400).json({ error: "Invalid user id." });
    if (req.user.userId === id)
        return res.status(400).json({ error: "You cannot delete your own account." });
    await (0, db_1.query)("DELETE FROM users WHERE id = $1", [id]);
    (0, activity_1.logActivity)(req.user, "user.deleted", "user", id);
    res.json({ success: true });
});
router.get("/products", middleware_1.requireAdmin, async (req, res) => {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const params = [];
    let where = "";
    if (q) {
        params.push(`%${q}%`);
        where = `WHERE (p.name ILIKE $1 OR p.brand ILIKE $1 OR u.shop_name ILIKE $1 OR u.email ILIKE $1)`;
    }
    const rows = await (0, db_1.query)(`SELECT p.*, u.shop_name, u.email AS seller_email
     FROM products p JOIN users u ON u.id = p.user_id
     ${where}
     ORDER BY p.created_at DESC
     LIMIT 300`, params);
    res.json(rows);
});
router.patch("/products/:id", middleware_1.requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
        return res.status(400).json({ error: "Invalid product id." });
    if (typeof req.body?.isSold !== "boolean")
        return res.status(400).json({ error: "isSold (boolean) is required." });
    await (0, db_1.query)("UPDATE products SET is_sold = $1 WHERE id = $2", [req.body.isSold, id]);
    (0, activity_1.logActivity)(req.user, req.body.isSold ? "product.marked_sold" : "product.marked_available", "product", id);
    res.json({ success: true });
});
router.delete("/products/:id", middleware_1.requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
        return res.status(400).json({ error: "Invalid product id." });
    await (0, db_1.query)("DELETE FROM products WHERE id = $1", [id]);
    (0, activity_1.logActivity)(req.user, "product.deleted", "product", id);
    res.json({ success: true });
});
router.get("/orders", middleware_1.requireAdmin, async (_req, res) => {
    const rows = await (0, db_1.query)("SELECT * FROM orders ORDER BY created_at DESC LIMIT 300");
    const orders = [];
    for (const row of rows) {
        const items = await (0, db_1.query)("SELECT * FROM order_items WHERE order_id = $1", [row.id]);
        orders.push({ ...row, items });
    }
    res.json(orders);
});
router.patch("/orders/:id", middleware_1.requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
        return res.status(400).json({ error: "Invalid order id." });
    const status = typeof req.body?.status === "string" ? req.body.status : "";
    if (!ORDER_STATUSES.includes(status))
        return res.status(400).json({ error: "Invalid order status." });
    await (0, db_1.query)("UPDATE orders SET status = $1 WHERE id = $2", [status, id]);
    (0, activity_1.logActivity)(req.user, "order.status_changed", "order", id, status);
    res.json({ success: true });
});
router.get("/activity", middleware_1.requireAdmin, async (_req, res) => {
    const rows = await (0, db_1.query)(`SELECT a.*, u.email AS actor_email
     FROM activity_log a
     LEFT JOIN users u ON u.id = a.actor_id
     ORDER BY a.created_at DESC
     LIMIT 200`);
    res.json(rows);
});
router.get("/moderation", middleware_1.requireAdmin, async (_req, res) => {
    const rows = await (0, db_1.query)(`SELECT p.*, u.shop_name, u.email AS seller_email
     FROM products p JOIN users u ON u.id = p.user_id
     WHERE p.moderation_status = 'pending'
     ORDER BY p.created_at ASC`);
    res.json(rows);
});
router.post("/moderation/:id/approve", middleware_1.requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
        return res.status(400).json({ error: "Invalid product id." });
    await (0, db_1.query)(`UPDATE products
     SET moderation_status = 'approved', moderation_reasons = '[]'::jsonb,
         moderated_at = now(), moderated_by = $1
     WHERE id = $2`, [req.user.userId, id]);
    (0, activity_1.logActivity)(req.user, "moderation.approved", "product", id);
    res.json({ success: true });
});
router.post("/moderation/:id/reject", middleware_1.requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
        return res.status(400).json({ error: "Invalid product id." });
    await (0, db_1.query)(`UPDATE products
     SET moderation_status = 'rejected', moderated_at = now(), moderated_by = $1
     WHERE id = $2`, [req.user.userId, id]);
    (0, activity_1.logActivity)(req.user, "moderation.rejected", "product", id);
    res.json({ success: true });
});
exports.default = router;
//# sourceMappingURL=admin.js.map