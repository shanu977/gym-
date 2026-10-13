import { z } from "zod";

export const wishlistProductSchema = z.object({
  productId: z.string().trim().min(1).max(220),
}).strict();

export type WishlistProductInput = z.infer<typeof wishlistProductSchema>;
