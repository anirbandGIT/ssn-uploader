import dotenv from "dotenv";
import path from "path";

// go up one level from api → root
dotenv.config({
  path: path.resolve(process.cwd(), "../.env"),
});

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "",
};
