import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

export const config = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  adminEmail: process.env.ADMIN_EMAIL || "admin@rethreed.ge",
  adminPassword: process.env.ADMIN_PASSWORD || "admin1234",
  caCertPath: path.join(__dirname, "..", "..", "ca-certificate.crt"),
  uploadDir: path.join(__dirname, "..", "uploads"),
};
