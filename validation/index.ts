import { z } from "zod";

export const createPersonSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().min(10),
  ssn: z.string().min(4),
});

export const fileSchema = z.object({
  type: z.enum(["ssn_image", "csv"]),
  mimeType: z.string(),
  size: z.number().max(5 * 1024 * 1024),
});
