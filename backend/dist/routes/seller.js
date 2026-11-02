"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../db");
const auth_1 = require("../auth");
const router = (0, express_1.Router)();
router.post("/register", async (req, res) => {
    const body = req.body ?? {};
    const shopName = typeof body.shopName === "string" ? body.shopName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!shopName)
        return res.status(400).json({ error: "Please enter your shop name." });
    if (!email.includes("@") || email.length < 5)
        return res.status(400).json({ error: "Please enter a valid email address." });
    if (password.length < 6)
        return res.status(400).json({ error: "Password must be at least 6 characters." });
    const existing = await (0, db_1.query)("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.length > 0)
        return res.status(409).json({ error: "An account with this email already exists." });
    const hash = await bcryptjs_1.default.hash(password, 10);
    const rows = await (0, db_1.query)("INSERT INTO users (email, password_hash, shop_name, role) VALUES ($1, $2, $3, 'seller') RETURNING id", [email, hash, shopName]);
    const token = (0, auth_1.signToken)({
        userId: rows[0].id,
        email,
        name: shopName,
        role: "seller",
        shopName,
    });
    res.status(201).json({
        token,
        user: { id: rows[0].id, email, shopName, role: "seller" },
    });
});
router.post("/login", async (req, res) => {
    const body = req.body ?? {};
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password)
        return res.status(400).json({ error: "Email and password are required." });
    const rows = await (0, db_1.query)("SELECT id, password_hash, shop_name FROM users WHERE email = $1 AND role = 'seller'", [
        email,
    ]);
    if (rows.length === 0)
        return res.status(401).json({ error: "Invalid email or password." });
    const valid = await bcryptjs_1.default.compare(password, rows[0].password_hash);
    if (!valid)
        return res.status(401).json({ error: "Invalid email or password." });
    const token = (0, auth_1.signToken)({
        userId: rows[0].id,
        email,
        name: rows[0].shop_name,
        role: "seller",
        shopName: rows[0].shop_name,
    });
    res.json({
        token,
        user: {
            id: rows[0].id,
            email,
            shopName: rows[0].shop_name,
            role: "seller",
        },
    });
});
exports.default = router;
//# sourceMappingURL=seller.js.map