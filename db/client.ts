import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "./config/index.js";

console.log("---------- process.env.DATABASE_URL", env.DATABASE_URL)
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool);
