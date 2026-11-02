"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.get("/", middleware_1.requireBuyer, async (req, res) => {
    const rows = await (0, db_1.query)(`SELECT p.*, u.shop_name FROM wishlists w JOIN products p ON p.id = w.product_id JOIN users u ON u.id = p.user_id WHERE w.user_id = $1 ORDER BY w.created_at DESC`, [req.user.userId]);
    res.json(rows);
});
router.post("/", middleware_1.requireBuyer, async (req, res) => {
    const productId = Number(req.body?.productId);
    if (!Number.isInteger(productId) || productId <= 0)
        return res.status(400).json({ error: "Invalid product." });
    const exists = await (0, db_1.query)("SELECT id FROM products WHERE id = $1", [productId]);
    if (exists.length === 0)
        return res.status(404).json({ error: "Product not found." });
    await (0, db_1.query)("INSERT INTO wishlists (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [req.user.userId, productId]);
    res.json({ inWishlist: true });
});
router.delete("/:productId", middleware_1.requireBuyer, async (req, res) => {
    const productId = Number(req.params.productId);
    if (!Number.isInteger(productId) || productId <= 0)
        return res.status(400).json({ error: "Invalid product." });
    await (0, db_1.query)("DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2", [
        req.user.userId,
        productId,
    ]);
    res.json({ inWishlist: false });
});
exports.default = router;
//# sourceMappingURL=wishlist.js.map