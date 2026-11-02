import express from "express";
import cors from "cors";
import path from "path";
import { config } from "./config";
import { authOptional } from "./middleware";
import { ensureAdmin } from "./bootstrap";
import authRouter from "./routes/auth";
import sellerRouter from "./routes/seller";
import adminRouter from "./routes/admin";
import productsRouter from "./routes/products";
import ordersRouter from "./routes/orders";
import accountRouter from "./routes/account";
import wishlistRouter from "./routes/wishlist";
import recommendationsRouter from "./routes/recommendations";
import shopsRouter from "./routes/shops";
import uploadRouter from "./routes/upload";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "2mb" }));
app.use(authOptional);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/account", accountRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/recommendations", recommendationsRouter);
app.use("/api/shops", shopsRouter);
app.use("/api/upload", uploadRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

ensureAdmin();

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
