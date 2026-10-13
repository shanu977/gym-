import { z } from "zod";

const mobileSchema = z.string().trim().min(1).max(32).refine((value) => {
  const digits = value.replace(/\D/g, "").replace(/^91/, "");
  return /^[6-9]\d{9}$/.test(digits);
}, "Enter a valid 10-digit Indian mobile number");

const addressFields = {
  fullName: z.string().trim().min(1).max(160),
  mobile: mobileSchema,
  addressLine1: z.string().trim().min(1).max(240),
  addressLine2: z.string().trim().max(240).nullable().optional(),
  landmark: z.string().trim().max(160).nullable().optional(),
  city: z.string().trim().min(1).max(120),
  state: z.string().trim().min(1).max(120),
  postalCode: z.string().trim().regex(/^\d{6}$/, "Enter a valid six-digit Indian PIN code"),
  country: z.string().trim().min(1).max(80),
  addressType: z.enum(["Home", "Work", "Other"]),
  isDefault: z.boolean().optional(),
};

export const createAddressSchema = z.object(addressFields).strict();
export const updateAddressSchema = z.object(addressFields).partial().strict().refine((value) => Object.keys(value).length > 0, {
  message: "At least one address field is required",
  path: [],
});
export const setDefaultAddressSchema = z.object({}).strict();

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
