"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const shop = await (0, db_1.query)(`SELECT id, shop_name, shop_location, shop_hours, rating_avg, rating_count, created_at
     FROM users WHERE id = $1 AND role = 'seller'`, [id]);
    if (shop.length === 0)
        return res.status(404).json({ error: "Shop not found." });
    const products = await (0, db_1.query)(`SELECT * FROM products WHERE user_id = $1 AND is_sold = false AND moderation_status = 'approved' AND quantity > 0 ORDER BY created_at DESC LIMIT 50`, [id]);
    res.json({ shop: shop[0], products });
});
router.get("/:id/reviews", async (req, res) => {
    const id = Number(req.params.id);
    const rows = await (0, db_1.query)(`SELECT r.*, u.name AS reviewer_name FROM shop_reviews r LEFT JOIN users u ON u.id = r.reviewer_id WHERE r.shop_id = $1 ORDER BY r.created_at DESC`, [id]);
    res.json(rows);
});
router.post("/:id/reviews", middleware_1.requireBuyer, async (req, res) => {
    const shopId = Number(req.params.id);
    const rating = Number(req.body?.rating);
    const comment = typeof req.body?.comment === "string" ? req.body.comment.trim() : "";
    if (!Number.isInteger(rating) || rating < 1 || rating > 5)
        return res.status(400).json({ error: "Rating must be between 1 and 5." });
    const shop = await (0, db_1.query)("SELECT id FROM users WHERE id = $1 AND role = 'seller'", [shopId]);
    if (shop.length === 0)
        return res.status(404).json({ error: "Shop not found." });
    if (shopId === req.user.userId)
        return res.status(400).json({ error: "You cannot rate your own shop." });
    await (0, db_1.query)("INSERT INTO shop_reviews (shop_id, reviewer_id, rating, comment) VALUES ($1,$2,$3,$4)", [shopId, req.user.userId, rating, comment]);
    await (0, db_1.query)(`UPDATE users SET rating_avg = (SELECT round(avg(rating)::numeric, 2) FROM shop_reviews WHERE shop_id = $1),
       rating_count = (SELECT count(*)::int FROM shop_reviews WHERE shop_id = $1) WHERE id = $1`, [shopId]);
    res.status(201).json({ success: true });
});
exports.default = router;
//# sourceMappingURL=shops.js.map