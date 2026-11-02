import { NextFunction, Request, Response } from "express";
import { verifyToken, SessionPayload } from "./auth";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: SessionPayload;
    }
  }
}

export function authOptional(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    req.user = verifyToken(header.slice(7)) ?? undefined;
  }
  next();
}

export function requireBuyer(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "buyer") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export function requireSeller(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "seller") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
