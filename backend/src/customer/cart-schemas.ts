import { z } from "zod";

const uuid = z.string().uuid();
const selectedVariants = z.record(z.string().trim().min(1).max(100), z.string().trim().min(1).max(160)).default({});

export const addCartItemSchema = z.object({
  productId: z.string().trim().min(1).max(220),
  variantId: uuid.optional(),
  variants: selectedVariants,
  quantity: z.number().int().min(1).max(99),
}).strict();

export const updateCartItemSchema = z.object({ quantity: z.number().int().min(1).max(99) }).strict();

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
