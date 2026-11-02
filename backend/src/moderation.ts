import sharp, { type Metadata, type Stats } from "sharp";
import fs from "fs/promises";
import path from "path";
import { config } from "./config";

export type ModerationStatus = "approved" | "pending";

export interface ModerationResult {
  status: ModerationStatus;
  reasons: string[];
  checks: Record<string, number | boolean>;
  /** 0..1 — fraction of detected skin-tone pixels (nudity heuristic). */
  nsfwScore: number;
}

const MIN_WIDTH = 400;
const MIN_HEIGHT = 400;
const MAX_REMOTE_BYTES = 8 * 1024 * 1024;

/**
 * Load an image into a buffer from either a local `/uploads/...` path or a
 * remote http(s) URL. Returns null when it can't be read safely.
 */
async function loadImageBuffer(imageUrl: string): Promise<Buffer | null> {
  if (imageUrl.startsWith("/uploads/")) {
    try {
      const filePath = path.join(config.uploadDir, path.basename(imageUrl));
      return await fs.readFile(filePath);
    } catch {
      return null;
    }
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(imageUrl, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) return null;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length === 0 || buf.length > MAX_REMOTE_BYTES) return null;
      return buf;
    } catch {
      return null;
    }
  }

  return null;
}

async function computeSharpnessAndSkin(buffer: Buffer) {
  const src = sharp(buffer);

  // Sharpness: Laplacian variance on a downscaled grayscale image.
  const gray = await src
    .clone()
    .resize(224, 224)
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const g = gray.data as Buffer;
  const w = gray.info.width;
  const h = gray.info.height;
  let sum = 0;
  let sumSq = 0;
  let n = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const lap = 4 * g[i] - g[i - 1] - g[i + 1] - g[i - w] - g[i + w];
      sum += lap;
      sumSq += lap * lap;
      n++;
    }
  }
  const mean = sum / n;
  const variance = sumSq / n - mean * mean;

  // Skin-tone heuristic on a small RGB image (proxy for possible nudity).
  const rgb = await src
    .clone()
    .resize(128, 128)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const d = rgb.data as Buffer;
  let skin = 0;
  let total = 0;
  for (let i = 0; i + 2 < d.length; i += 3) {
    const r = d[i];
    const g2 = d[i + 1];
    const b = d[i + 2];
    total++;
    const mx = Math.max(r, g2, b);
    const mn = Math.min(r, g2, b);
    if (
      r > 95 &&
      g2 > 40 &&
      b > 20 &&
      mx - mn > 15 &&
      Math.abs(r - g2) > 15 &&
      r > g2 &&
      r > b
    ) {
      skin++;
    }
  }

  return { sharpness: variance, skinRatio: total ? skin / total : 0 };
}

export async function analyzeImageBuffer(buffer: Buffer): Promise<ModerationResult> {
  let meta: Metadata;
  let stats: Stats;
  try {
    meta = await sharp(buffer).metadata();
    stats = await sharp(buffer).stats();
  } catch {
    return { status: "pending", reasons: ["unreadable_image"], checks: {}, nsfwScore: 0 };
  }

  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const reasons: string[] = [];
  const checks: Record<string, number | boolean> = { width, height };

  if (width < MIN_WIDTH || height < MIN_HEIGHT) reasons.push("low_resolution");

  if (width > 0 && height > 0) {
    const ratio = width / height;
    checks.aspectRatio = Number(ratio.toFixed(2));
    if (ratio > 1.6) reasons.push("too_landscape");
    else if (ratio < 0.4) reasons.push("too_tall");
  }

  const channels = stats.channels ?? [];
  const lum = channels.length
    ? channels.reduce((s, c) => s + c.mean, 0) / channels.length
    : 128;
  checks.meanLuminance = Math.round(lum);
  if (lum < 45) reasons.push("too_dark");
  else if (lum > 232) reasons.push("too_bright");

  let sharpness = 0;
  let skinRatio = 0;
  try {
    const s = await computeSharpnessAndSkin(buffer);
    sharpness = s.sharpness;
    skinRatio = s.skinRatio;
  } catch {
    // sharpness/skin are best-effort — other checks still apply
  }
  checks.sharpness = Number(sharpness.toFixed(2));
  checks.skinRatio = Number(skinRatio.toFixed(2));
  if (sharpness < 40) reasons.push("blurry");
  if (skinRatio > 0.35) reasons.push("possible_nudity");

  return {
    status: reasons.length === 0 ? "approved" : "pending",
    reasons,
    checks,
    nsfwScore: skinRatio,
  };
}

export async function analyzeImage(imageUrl: string): Promise<ModerationResult> {
  const buffer = await loadImageBuffer(imageUrl);
  if (!buffer) {
    return {
      status: "pending",
      reasons: ["manual_review_required"],
      checks: {},
      nsfwScore: 0,
    };
  }
  return analyzeImageBuffer(buffer);
}
