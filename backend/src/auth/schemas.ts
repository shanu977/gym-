import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email().max(320);
export const passwordSchema = z.string().min(12).max(128);

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  mobile: z.string().trim().min(1).max(32).optional(),
}).strict();

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberSession: z.boolean().default(false),
}).strict();
