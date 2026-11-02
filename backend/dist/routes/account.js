"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.get("/orders", middleware_1.requireBuyer, async (req, res) => {
    const orderRows = await (0, db_1.query)("SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC", [req.user.userId]);
    const orders = [];
    for (const row of orderRows) {
        const items = await (0, db_1.query)("SELECT * FROM order_items WHERE order_id = $1", [row.id]);
        orders.push({ ...row, items });
    }
    res.json(orders);
});
exports.default = router;
//# sourceMappingURL=account.js.map