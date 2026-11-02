"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAdmin = ensureAdmin;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("./db");
const config_1 = require("./config");
/**
 * Ensure at least one platform admin exists. Runs on server startup, so the
 * admin account is created from env (or defaults) without a hardcoded hash.
 */
async function ensureAdmin() {
    try {
        const existing = await (0, db_1.query)("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
        if (existing.length > 0)
            return;
        const hash = await bcryptjs_1.default.hash(config_1.config.adminPassword, 10);
        await (0, db_1.query)(`INSERT INTO users (email, password_hash, name, shop_name, role)
       VALUES ($1, $2, $3, $4, 'admin')
       ON CONFLICT (email) DO NOTHING`, [config_1.config.adminEmail, hash, "Platform Admin", "ReThread Admin"]);
        console.log(`[bootstrap] Admin account ready: ${config_1.config.adminEmail}`);
    }
    catch (err) {
        console.error("[bootstrap] Failed to ensure admin account:", err);
    }
}
//# sourceMappingURL=bootstrap.js.map