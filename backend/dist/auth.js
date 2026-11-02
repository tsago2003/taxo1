"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
function signToken(payload) {
    return jsonwebtoken_1.default.sign(payload, config_1.config.jwtSecret, { expiresIn: "7d" });
}
function verifyToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        if (typeof decoded.userId !== "number" ||
            typeof decoded.email !== "string" ||
            typeof decoded.name !== "string" ||
            (decoded.role !== "buyer" &&
                decoded.role !== "seller" &&
                decoded.role !== "admin")) {
            return null;
        }
        return {
            userId: decoded.userId,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
            shopName: typeof decoded.shopName === "string" ? decoded.shopName : undefined,
            isActive: typeof decoded.isActive === "boolean" ? decoded.isActive : undefined,
        };
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=auth.js.map