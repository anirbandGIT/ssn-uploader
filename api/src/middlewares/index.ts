import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { success } from "zod/v4";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error("ERROR:", err);

  // Zod validation error
  if (err instanceof ZodError)
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors,
    });

  // postgres unique constraint error
  if (err.code === "23505") {
    const detail = err.detail || "";

    if (detail.includes("phone_number"))
      return res.status(409).json({
        success: false,
        message: "Phone number already exists",
        code: "DUPLICATE_PHONE",
      });

    if (detail.includes("ssn_encrypted"))
      return res.status(409).json({
        success: false,
        message: "The SSN already exists",
        code: "DUPLICATE_SSN_ERROR",
      });

    return res.status(409).json({
      success: false,
      message: "Duplicate entry",
      code: "DUPLICATE_ERROR",
    });
  }

  // custom app errors
  if (err.statusCode)
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });

  // fallback
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    code: "INTERNAL_ERROR",
  });
}
