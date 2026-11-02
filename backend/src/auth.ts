import jwt from "jsonwebtoken";
import { config } from "./config";

export type Role = "buyer" | "seller" | "admin";

export interface SessionPayload {
  userId: number;
  email: string;
  name: string;
  role: Role;
  shopName?: string;
  isActive?: boolean;
}

export function signToken(payload: SessionPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;
    if (
      typeof decoded.userId !== "number" ||
      typeof decoded.email !== "string" ||
      typeof decoded.name !== "string" ||
      (decoded.role !== "buyer" &&
        decoded.role !== "seller" &&
        decoded.role !== "admin")
    ) {
      return null;
    }
    return {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      shopName:
        typeof decoded.shopName === "string" ? decoded.shopName : undefined,
      isActive:
        typeof decoded.isActive === "boolean" ? decoded.isActive : undefined,
    };
  } catch {
    return null;
  }
}
