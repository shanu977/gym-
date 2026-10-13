export const cartItemSelect = {
  id: true,
  productId: true,
  variantId: true,
  variantSnapshot: true,
  quantity: true,
  product: {
    select: {
      id: true,
      slug: true,
      name: true,
      image: true,
      pricePaise: true,
      compareAtPricePaise: true,
      status: true,
      brand: { select: { name: true } },
      variants: { select: { id: true, name: true, value: true, pricePaise: true, compareAtPricePaise: true, stockQuantity: true, isActive: true } },
    },
  },
} as any;

export type CartItemRecord = {
  id: string; productId: string; variantId: string | null; variantSnapshot: unknown; quantity: number;
  product: { id: string; slug: string; name: string; image: string | null; pricePaise: number; compareAtPricePaise: number | null; status: "ACTIVE" | "DRAFT" | "ARCHIVED"; brand: { name: string }; variants: Array<{ id: string; name: string; value: string; pricePaise: number | null; compareAtPricePaise: number | null; stockQuantity: number; isActive: boolean }> };
};

function snapshot(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[0] === "string" && typeof entry[1] === "string"));
}

export function toCartItemResponse(item: CartItemRecord) {
  const selected = snapshot(item.variantSnapshot);
  const matches = item.product.variants.filter((variant) => selected[variant.name] === variant.value);
  const stockValues = matches.length ? matches.map((variant) => variant.stockQuantity) : [];
  const availableQuantity = item.product.status === "ACTIVE" ? (stockValues.length ? Math.max(0, Math.min(...stockValues)) : 99) : 0;
  const firstMatch = matches[0];
  const unitPricePaise = matches.length === 1 && firstMatch && firstMatch.pricePaise !== null ? firstMatch.pricePaise : item.product.pricePaise;
  const compareAtPricePaise = matches.length === 1 && firstMatch && firstMatch.compareAtPricePaise !== null ? firstMatch.compareAtPricePaise : item.product.compareAtPricePaise;
  return {
    id: item.id,
    productId: item.product.id,
    productSlug: item.product.slug,
    name: item.product.name,
    brand: item.product.brand.name,
    image: item.product.image,
    variantId: item.variantId,
    variants: selected,
    quantity: item.quantity,
    unitPricePaise,
    compareAtPricePaise,
    availableQuantity,
    available: availableQuantity >= item.quantity,
  };
}

export function toCartResponse(id: string | null, items: CartItemRecord[]) {
  const responseItems = items.map(toCartItemResponse);
  const subtotalPaise = responseItems.reduce((sum, item) => sum + item.unitPricePaise * item.quantity, 0);
  const originalPaise = responseItems.reduce((sum, item) => sum + (item.compareAtPricePaise ?? item.unitPricePaise) * item.quantity, 0);
  return {
    cart: {
      id,
      items: responseItems,
      itemCount: responseItems.length,
      totalUnits: responseItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotalPaise,
      savingsPaise: Math.max(0, originalPaise - subtotalPaise),
      shippingPaise: 0,
      taxPaise: 0,
      totalPaise: subtotalPaise,
    },
  };
}
