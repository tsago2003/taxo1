import bcrypt from "bcryptjs";
import { query } from "./db";
import { config } from "./config";

/**
 * Ensure at least one platform admin exists. Runs on server startup, so the
 * admin account is created from env (or defaults) without a hardcoded hash.
 */
export async function ensureAdmin(): Promise<void> {
  try {
    const existing = await query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    if (existing.length > 0) return;

    const hash = await bcrypt.hash(config.adminPassword, 10);
    await query(
      `INSERT INTO users (email, password_hash, name, shop_name, role)
       VALUES ($1, $2, $3, $4, 'admin')
       ON CONFLICT (email) DO NOTHING`,
      [config.adminEmail, hash, "Platform Admin", "ReThread Admin"]
    );
    console.log(`[bootstrap] Admin account ready: ${config.adminEmail}`);
  } catch (err) {
    console.error("[bootstrap] Failed to ensure admin account:", err);
  }
}
