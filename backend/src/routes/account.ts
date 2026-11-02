import { Router } from "express";
import { query } from "../db";
import { requireBuyer } from "../middleware";

const router = Router();

router.get("/orders", requireBuyer, async (req, res) => {
  const orderRows = await query<Record<string, unknown>>(
    "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
    [req.user!.userId]
  );
  const orders = [];
  for (const row of orderRows) {
    const items = await query("SELECT * FROM order_items WHERE order_id = $1", [row.id]);
    orders.push({ ...row, items });
  }
  res.json(orders);
});

export default router;
