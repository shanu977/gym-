import type { Prisma } from "@prisma/client";

export const wishlistItemSelect = {
  id: true,
  productId: true,
  product: { select: { id: true, slug: true } },
  createdAt: true,
} satisfies Prisma.WishlistItemSelect;

export type WishlistItemRecord = Prisma.WishlistItemGetPayload<{ select: typeof wishlistItemSelect }>;

export function toWishlistItemResponse(item: WishlistItemRecord) {
  return {
    id: item.id,
    productId: item.product.id,
    productSlug: item.product.slug,
    createdAt: item.createdAt.toISOString(),
  };
}
