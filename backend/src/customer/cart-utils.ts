import type { Prisma, PrismaClient } from "@prisma/client";
import { AppError } from "../errors/app-error.js";
import type { AddCartItemInput } from "./cart-schemas.js";

type Db = Prisma.TransactionClient | PrismaClient;

function isUuid(value: string) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value); }
function canonicalVariants(input: Record<string, string>) { return Object.fromEntries(Object.entries(input).sort(([a], [b]) => a.localeCompare(b))); }

export async function resolveCartSelection(db: Db, input: AddCartItemInput) {
  const product = await db.product.findFirst({
    where: { status: "ACTIVE", OR: [{ slug: input.productId }, ...(isUuid(input.productId) ? [{ id: input.productId }] : [])] },
    select: { id: true, slug: true, variants: { where: { isActive: true }, select: { id: true, name: true, value: true, stockQuantity: true, pricePaise: true, compareAtPricePaise: true } } },
  });
  if (!product) throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  if (input.variantId) {
    const variant = product.variants.find((candidate) => candidate.id === input.variantId);
    if (!variant) throw new AppError(409, "VARIANT_NOT_AVAILABLE", "The selected variant is not available");
  } else if (product.variants.length && Object.keys(input.variants).length === 0) {
    throw new AppError(400, "VARIANT_REQUIRED", "A variant selection is required");
  }
  const matches = Object.entries(input.variants).map(([name, value]) => product.variants.find((variant) => variant.name === name && variant.value === value));
  if (matches.some((variant) => !variant)) throw new AppError(409, "VARIANT_NOT_AVAILABLE", "The selected variant is not available");
  const stockQuantity = matches.length ? Math.min(...matches.map((variant) => variant!.stockQuantity)) : 99;
  if (stockQuantity < 1) throw new AppError(409, "OUT_OF_STOCK", "The selected item is out of stock");
  return { productId: product.id, variantId: input.variantId ?? (matches.length === 1 ? matches[0]?.id ?? null : null), variantSnapshot: canonicalVariants(input.variants), stockQuantity };
}

export function sameVariantSelection(a: unknown, b: Record<string, string>) { return JSON.stringify(canonicalVariants((a && typeof a === "object" && !Array.isArray(a) ? a : {}) as Record<string, string>)) === JSON.stringify(canonicalVariants(b)); }
