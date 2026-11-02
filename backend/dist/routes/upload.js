"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const middleware_1 = require("../middleware");
const config_1 = require("../config");
const moderation_1 = require("../moderation");
fs_1.default.mkdirSync(config_1.config.uploadDir, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, config_1.config.uploadDir),
    filename: (_req, file, cb) => {
        const ext = (file.originalname.split(".").pop() || "jpg")
            .replace(/[^a-zA-Z0-9]/g, "")
            .slice(0, 5) || "jpg";
        cb(null, `${Date.now()}-${crypto_1.default.randomBytes(6).toString("hex")}.${ext}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/"))
            cb(null, true);
        else
            cb(new Error("Only images are allowed"));
    },
});
const router = (0, express_1.Router)();
router.post("/", middleware_1.requireSeller, upload.single("file"), async (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: "No file uploaded." });
    let moderation;
    try {
        const buffer = fs_1.default.readFileSync(req.file.path);
        moderation = await (0, moderation_1.analyzeImageBuffer)(buffer);
    }
    catch {
        moderation = { status: "pending", reasons: ["unreadable_image"], checks: {}, nsfwScore: 0 };
    }
    res.status(201).json({ url: `/uploads/${req.file.filename}`, moderation });
});
exports.default = router;
//# sourceMappingURL=upload.js.map