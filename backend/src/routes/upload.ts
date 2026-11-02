import { Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { requireSeller } from "../middleware";
import { config } from "../config";
import { analyzeImageBuffer } from "../moderation";

fs.mkdirSync(config.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploadDir),
  filename: (_req, file, cb) => {
    const ext = (file.originalname.split(".").pop() || "jpg")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 5) || "jpg";
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images are allowed"));
  },
});

const router = Router();

router.post("/", requireSeller, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  let moderation;
  try {
    const buffer = fs.readFileSync(req.file.path);
    moderation = await analyzeImageBuffer(buffer);
  } catch {
    moderation = { status: "pending", reasons: ["unreadable_image"], checks: {}, nsfwScore: 0 };
  }

  res.status(201).json({ url: `/uploads/${req.file.filename}`, moderation });
});

export default router;
