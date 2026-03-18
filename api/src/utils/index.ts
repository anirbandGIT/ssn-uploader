export * from "./crypto";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "text/csv",
  "application/vnd.ms-excel",
];
const MAX_FILE_SIZE: number = 10; // in MB

export class AppError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode = 400, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function validateFile(file: Express.Multer.File) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype))
    throw new Error("Invalid file type");

  if (file.size > MAX_FILE_SIZE * 1024 * 1024)
    throw new Error("File too large");
}

export function sanitizeFilename(name: string) {
  // remove path traversal
  name = name.replace(/(\.\.[/\\])/g, "");

  // remove invalid chars
  name = name.replace(/[^a-zA-Z0-9.\-_]/g, "_");

  // limit length
  if (name.length > 100) {
    const ext = name.split(".").pop();
    name = name.slice(0, 80) + "." + ext;
  }

  return name;
}
