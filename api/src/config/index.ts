import dotenv from "dotenv";
import path from "path";

// go up one level from api → root
dotenv.config({
  path: path.resolve(process.cwd(), "../.env"),
});

export const env = {
  PORT: process.env.PORT || "4000",
  DATABASE_URL: process.env.DATABASE_URL || "",
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || "localhost",
  MINIO_PORT: Number(process.env.MINIO_PORT || 9_000),
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || "",
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || "",
  MINIO_BUCKET: process.env.MINIO_BUCKET || "ssn-documents",
};
