import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db";
import { signToken } from "../auth";
import { logActivity } from "../activity";

const router = Router();

router.post("/register", async (req, res) => {
  const body = req.body ?? {};
  const shopName =
    typeof body.shopName === "string" ? body.shopName.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const shopLocation = typeof body.shopLocation === "string" ? body.shopLocation.trim() : "";
  const shopHours = typeof body.shopHours === "string" ? body.shopHours.trim() : "";

  if (!shopName)
    return res.status(400).json({ error: "Please enter your shop name." });
  if (!email.includes("@") || email.length < 5)
    return res.status(400).json({ error: "Please enter a valid email address." });
  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters." });

  const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.length > 0)
    return res.status(409).json({ error: "An account with this email already exists." });

  const hash = await bcrypt.hash(password, 10);
  const rows = await query<{ id: number }>(
    "INSERT INTO users (email, password_hash, shop_name, shop_location, shop_hours, role, verification_status) VALUES ($1, $2, $3, $4, $5, 'seller', 'pending') RETURNING id",
    [email, hash, shopName, shopLocation, shopHours]
  );

  const token = signToken({
    userId: rows[0].id,
    email,
    name: shopName,
    role: "seller",
    shopName,
    isActive: true,
  });
  logActivity({ id: rows[0].id, role: "seller" }, "user.signup", "user", rows[0].id, "seller");
  res.status(201).json({
    token,
    user: { id: rows[0].id, email, shopName, role: "seller", verificationStatus: "pending" },
  });
});

router.post("/login", async (req, res) => {
  const body = req.body ?? {};
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  const rows = await query<{
    id: number;
    password_hash: string;
    shop_name: string;
    verification_status: string;
    shop_location: string | null;
    shop_hours: string | null;
  }>(
    "SELECT id, password_hash, shop_name, verification_status, shop_location, shop_hours FROM users WHERE email = $1 AND role = 'seller' AND is_active = true",
    [email]
  );

  if (rows.length === 0)
    return res.status(401).json({ error: "Invalid email or password." });

  const valid = await bcrypt.compare(password, rows[0].password_hash);
  if (!valid) return res.status(401).json({ error: "Invalid email or password." });

  const token = signToken({
    userId: rows[0].id,
    email,
    name: rows[0].shop_name,
    role: "seller",
    shopName: rows[0].shop_name,
    isActive: true,
  });
  res.json({
    token,
    user: {
      id: rows[0].id,
      email,
      shopName: rows[0].shop_name,
      role: "seller",
      verificationStatus: rows[0].verification_status,
      shopLocation: rows[0].shop_location,
      shopHours: rows[0].shop_hours,
    },
  });
});

export default router;
