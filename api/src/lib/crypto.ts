import crypto from "crypto";

const ALGO = "aes-256-cbc";
const KEY = crypto
  .createHash("sha256")
  .update(process.env.SSN_ENCRYPTION_KEY || "secret")
  .digest();

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(ALGO, KEY, iv);

  const encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

// need to add decrypt later