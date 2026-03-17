import { Pool } from "pg";

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function testDb() {
  const res = await db.query("SELECT NOW()");
  console.log("DB Time:", res.rows[0]);
}
