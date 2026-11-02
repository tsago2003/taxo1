"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authOptional = authOptional;
exports.requireBuyer = requireBuyer;
exports.requireSeller = requireSeller;
const auth_1 = require("./auth");
function authOptional(req, _res, next) {
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
        req.user = (0, auth_1.verifyToken)(header.slice(7)) ?? undefined;
    }
    next();
}
function requireBuyer(req, res, next) {
    if (!req.user || req.user.role !== "buyer") {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
}
function requireSeller(req, res, next) {
    if (!req.user || req.user.role !== "seller") {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
}
//# sourceMappingURL=middleware.js.map