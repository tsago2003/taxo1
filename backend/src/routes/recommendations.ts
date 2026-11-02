import { Router } from "express";
import { requireBuyer } from "../middleware";
import { getRecommendations } from "../recommendations";

const router = Router();

router.get("/", requireBuyer, async (req, res) => {
  const recs = await getRecommendations(req.user!.userId, 8);
  res.json(recs);
});

export default router;
