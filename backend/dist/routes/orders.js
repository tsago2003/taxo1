"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
router.post("/", async (req, res) => {
    const body = req.body ?? {};
    const customerName = typeof body.customerName === "string" ? body.customerName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const address = typeof body.address === "string" ? body.address.trim() : "";
    const city = typeof body.city === "string" ? body.city.trim() : "";
    const postal = typeof body.postal === "string" ? body.postal.trim() : "";
    const notes = typeof body.notes === "string" ? body.notes.trim() : "";
    const items = Array.isArray(body.items) ? body.items : [];
    if (!customerName || !email || !phone || !address)
        return res.status(400).json({ error: "Please complete your name, email, phone and address." });
    if (!email.includes("@"))
        return res.status(400).json({ error: "Please enter a valid email address." });
    if (items.length === 0)
        return res.status(400).json({ error: "Your cart is empty." });
    const buyerId = req.user?.role === "buyer" ? req.user.userId : null;
    const validItems = [];
    for (const item of items) {
        const productId = Number(item?.productId);
        const quantity = Number(item?.quantity);
        if (!Number.isInteger(productId) || productId <= 0)
            return res.status(400).json({ error: "Invalid cart item." });
        if (!Number.isInteger(quantity) || quantity < 1)
            return res.status(400).json({ error: "Invalid quantity." });
        const rows = await (0, db_1.query)("SELECT id, name, price, size FROM products WHERE id = $1 AND is_sold = false", [productId]);
        if (rows.length === 0)
            return res.status(409).json({ error: "One or more items are no longer available." });
        validItems.push({ product: rows[0], quantity });
    }
    const client = await db_1.pool.connect();
    try {
        await client.query("BEGIN");
        const total = validItems.reduce((s, it) => s + it.product.price * it.quantity, 0);
        const orderRes = await client.query(`INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, customer_address, customer_city, customer_postal, notes, total)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, total`, [buyerId, customerName, email, phone, address, city, postal, notes, total]);
        const orderId = orderRes.rows[0].id;
        for (const it of validItems) {
            await client.query(`INSERT INTO order_items (order_id, product_id, product_name, price, quantity, size) VALUES ($1,$2,$3,$4,$5,$6)`, [orderId, it.product.id, it.product.name, it.product.price, it.quantity, it.product.size]);
            await client.query("UPDATE products SET is_sold = true WHERE id = $1", [it.product.id]);
        }
        await client.query("COMMIT");
        res.status(201).json({ id: orderId, total: orderRes.rows[0].total });
    }
    catch (err) {
        await client.query("ROLLBACK");
        throw err;
    }
    finally {
        client.release();
    }
});
router.get("/", middleware_1.requireSeller, async (req, res) => {
    const userId = req.user.userId;
    const orderRows = await (0, db_1.query)(`SELECT DISTINCT o.* FROM orders o JOIN order_items oi ON oi.order_id = o.id JOIN products p ON p.id = oi.product_id WHERE p.user_id = $1 ORDER BY o.created_at DESC`, [userId]);
    const orders = [];
    for (const row of orderRows) {
        const items = await (0, db_1.query)(`SELECT oi.* FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = $1 AND p.user_id = $2`, [row.id, userId]);
        orders.push({ ...row, items });
    }
    res.json(orders);
});
router.get("/:id", middleware_1.requireSeller, async (req, res) => {
    const userId = req.user.userId;
    const id = Number(req.params.id);
    const rows = await (0, db_1.query)(`SELECT DISTINCT o.* FROM orders o JOIN order_items oi ON oi.order_id = o.id JOIN products p ON p.id = oi.product_id WHERE o.id = $1 AND p.user_id = $2`, [id, userId]);
    if (rows.length === 0)
        return res.status(404).json({ error: "Order not found." });
    const items = await (0, db_1.query)(`SELECT oi.* FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = $1 AND p.user_id = $2`, [id, userId]);
    res.json({ ...rows[0], items });
});
router.patch("/:id", middleware_1.requireSeller, async (req, res) => {
    const userId = req.user.userId;
    const id = Number(req.params.id);
    const status = typeof req.body?.status === "string" ? req.body.status : "";
    if (!ORDER_STATUSES.includes(status))
        return res.status(400).json({ error: "Invalid order status." });
    const owned = await (0, db_1.query)(`SELECT 1 FROM orders o JOIN order_items oi ON oi.order_id = o.id JOIN products p ON p.id = oi.product_id WHERE o.id = $1 AND p.user_id = $2`, [id, userId]);
    if (owned.length === 0)
        return res.status(404).json({ error: "Order not found." });
    await (0, db_1.query)("UPDATE orders SET status = $1 WHERE id = $2", [status, id]);
    res.json({ success: true });
});
exports.default = router;
//# sourceMappingURL=orders.js.map