import { z } from "zod";

export const createPersonSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),

  phoneNumber: z
    .string()
    .length(10, "Phone must be exactly 10 digits")
    .regex(/^\d+$/, "Phone must contain only digits"),

  ssn: z
    .string()
    .length(9, "SSN must be exactly 9 digits")
    .regex(/^\d+$/, "SSN must contain only digits"),
});

export const fileSchema = z.object({
  type: z.enum(["ssn_image", "csv"]),
  mimeType: z.string(),
  size: z.number().max(10 * 1024 * 1024),
});
