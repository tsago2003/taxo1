import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db";
import { signToken } from "../auth";
import { logActivity } from "../activity";

const router = Router();

router.post("/register", async (req, res) => {
  const body = req.body ?? {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name) return res.status(400).json({ error: "Please enter your name." });
  if (!email.includes("@") || email.length < 5)
    return res.status(400).json({ error: "Please enter a valid email address." });
  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters." });

  const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.length > 0)
    return res.status(409).json({ error: "An account with this email already exists." });

  const hash = await bcrypt.hash(password, 10);
  const rows = await query<{ id: number }>(
    "INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, 'buyer') RETURNING id",
    [email, hash, name]
  );

  const token = signToken({ userId: rows[0].id, email, name, role: "buyer", isActive: true });
  logActivity({ id: rows[0].id, role: "buyer" }, "user.signup", "user", rows[0].id, "buyer");
  res.status(201).json({
    token,
    user: { id: rows[0].id, email, name, role: "buyer" },
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
    name: string;
  }>("SELECT id, password_hash, name FROM users WHERE email = $1 AND role = 'buyer'", [
    email,
  ]);

  if (rows.length === 0)
    return res.status(401).json({ error: "Invalid email or password." });

  const valid = await bcrypt.compare(password, rows[0].password_hash);
  if (!valid) return res.status(401).json({ error: "Invalid email or password." });

  const token = signToken({
    userId: rows[0].id,
    email,
    name: rows[0].name,
    role: "buyer",
  });
  res.json({
    token,
    user: { id: rows[0].id, email, name: rows[0].name, role: "buyer" },
  });
});

export default router;
