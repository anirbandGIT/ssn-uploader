import type { Config } from "drizzle-kit";

import { env } from "./config/index.js";

export default {
  schema: "./schema/index.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
} satisfies Config;
