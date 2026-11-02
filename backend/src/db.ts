import { Pool, types } from "pg";
import fs from "fs";
import { config } from "./config";

// Parse NUMERIC columns (price) as JS numbers instead of strings.
types.setTypeParser(1700, (val: string | null) =>
  val === null ? null : parseFloat(val)
);

const connectionString = config.databaseUrl.split("?")[0];

function getSslConfig() {
  if (fs.existsSync(config.caCertPath)) {
    return {
      ca: fs.readFileSync(config.caCertPath, "utf8"),
      rejectUnauthorized: true,
    };
  }
  return { rejectUnauthorized: false };
}

export const pool = new Pool({
  connectionString,
  ssl: getSslConfig(),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}
