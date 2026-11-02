"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const bootstrap_1 = require("./bootstrap");
const auth_1 = __importDefault(require("./routes/auth"));
const seller_1 = __importDefault(require("./routes/seller"));
const admin_1 = __importDefault(require("./routes/admin"));
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = __importDefault(require("./routes/orders"));
const account_1 = __importDefault(require("./routes/account"));
const wishlist_1 = __importDefault(require("./routes/wishlist"));
const recommendations_1 = __importDefault(require("./routes/recommendations"));
const shops_1 = __importDefault(require("./routes/shops"));
const upload_1 = __importDefault(require("./routes/upload"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json({ limit: "2mb" }));
app.use(middleware_1.authOptional);
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", auth_1.default);
app.use("/api/seller", seller_1.default);
app.use("/api/admin", admin_1.default);
app.use("/api/products", products_1.default);
app.use("/api/orders", orders_1.default);
app.use("/api/account", account_1.default);
app.use("/api/wishlist", wishlist_1.default);
app.use("/api/recommendations", recommendations_1.default);
app.use("/api/shops", shops_1.default);
app.use("/api/upload", upload_1.default);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});
(0, bootstrap_1.ensureAdmin)();
app.listen(config_1.config.port, () => {
    console.log(`API listening on http://localhost:${config_1.config.port}`);
});
//# sourceMappingURL=index.js.map