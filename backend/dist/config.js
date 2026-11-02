"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "..", ".env") });
exports.config = {
    port: Number(process.env.PORT) || 4000,
    databaseUrl: process.env.DATABASE_URL || "",
    jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
    caCertPath: path_1.default.join(__dirname, "..", "..", "ca-certificate.crt"),
    uploadDir: path_1.default.join(__dirname, "..", "uploads"),
};
//# sourceMappingURL=config.js.map