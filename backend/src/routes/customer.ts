import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../database/client.js";
import { AppError } from "../errors/app-error.js";
import { authenticate } from "../auth/middleware.js";
import { parseRequest } from "../middleware/validation.js";
import { customerProfileSelect, toCustomerProfileResponse } from "../customer/projection.js";
import { updateProfileSchema } from "../customer/schemas.js";
import { createAddressSchema, setDefaultAddressSchema, updateAddressSchema, type CreateAddressInput, type UpdateAddressInput } from "../customer/address-schemas.js";
import { customerAddressSelect, toAddressType, toCustomerAddressResponse } from "../customer/address-projection.js";
import { addCartItemSchema, updateCartItemSchema } from "../customer/cart-schemas.js";
import { cartItemSelect, toCartItemResponse, toCartResponse } from "../customer/cart-projection.js";
import { resolveCartSelection, sameVariantSelection } from "../customer/cart-utils.js";
import { wishlistItemSelect, toWishlistItemResponse } from "../customer/wishlist-projection.js";
import { wishlistProductSchema } from "../customer/wishlist-schemas.js";

function addressNotFound(): never {
  throw new AppError(404, "ADDRESS_NOT_FOUND", "Address not found");
}

function addressData(input: CreateAddressInput | UpdateAddressInput) {
  return {
    ...(input.fullName !== undefined ? { fullName: input.fullName } : {}),
    ...(input.mobile !== undefined ? { mobile: input.mobile } : {}),
    ...(input.addressLine1 !== undefined ? { addressLine1: input.addressLine1 } : {}),
    ...(input.addressLine2 !== undefined ? { addressLine2: input.addressLine2 } : {}),
    ...(input.landmark !== undefined ? { landmark: input.landmark } : {}),
    ...(input.city !== undefined ? { city: input.city } : {}),
    ...(input.state !== undefined ? { state: input.state } : {}),
    ...(input.postalCode !== undefined ? { postalCode: input.postalCode } : {}),
    ...(input.country !== undefined ? { country: input.country } : {}),
    ...(input.addressType !== undefined ? { addressType: toAddressType(input.addressType) } : {}),
  };
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function requireUuidParam(value: string): string {
  if (!isUuid(value)) throw new AppError(400, "VALIDATION_ERROR", "Request validation failed");
  return value;
}

async function findProduct(productKey: string, activeOnly = true) {
  const product = await prisma.product.findFirst({
    where: {
      ...(activeOnly ? { status: "ACTIVE" } : {}),
      OR: [
        { slug: productKey },
        ...(isUuid(productKey) ? [{ id: productKey }] : []),
      ],
    },
    select: { id: true },
  });
  if (!product) throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  return product;
}

export const customerRoutes: FastifyPluginAsync = async (app) => {
  app.get("/customer/profile", { onRequest: authenticate }, async (request) => {
    const user = await prisma.user.findUnique({
      where: { id: request.auth!.userId },
      select: customerProfileSelect,
    });
    if (!user) throw new AppError(401, "AUTHENTICATION_REQUIRED", "Authentication required");
    return toCustomerProfileResponse(user);
  });

  app.patch("/customer/profile", { onRequest: [authenticate, app.csrfProtection] }, async (request) => {
    const input = parseRequest(updateProfileSchema, request.body, request);
    const userId = request.auth!.userId;
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: {
              firstName: input.firstName ?? "",
              lastName: input.lastName ?? "",
              ...(input.phone !== undefined ? { phone: input.phone } : {}),
              ...(input.location !== undefined ? { location: input.location } : {}),
              ...(input.fitnessGoal !== undefined ? { fitnessGoal: input.fitnessGoal } : {}),
              ...(input.trainingLevel !== undefined ? { trainingLevel: input.trainingLevel } : {}),
              ...(input.preferredTrainingTime !== undefined ? { preferredTrainingTime: input.preferredTrainingTime } : {}),
              ...(input.bio !== undefined ? { bio: input.bio } : {}),
              ...(input.emailUpdates !== undefined ? { emailUpdates: input.emailUpdates } : {}),
              ...(input.trainingReminders !== undefined ? { trainingReminders: input.trainingReminders } : {}),
            },
            update: input,
          },
        },
      },
      select: customerProfileSelect,
    });
    return toCustomerProfileResponse(user);
  });

  app.get("/customer/addresses", { onRequest: authenticate }, async (request) => {
    const addresses = await prisma.shippingAddress.findMany({
      where: { userId: request.auth!.userId },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
      select: customerAddressSelect,
    });
    return { addresses: addresses.map(toCustomerAddressResponse) };
  });

  app.get("/customer/addresses/:id", { onRequest: authenticate }, async (request) => {
    const id = requireUuidParam((request.params as { id: string }).id);
    const address = await prisma.shippingAddress.findFirst({
      where: { id, userId: request.auth!.userId },
      select: customerAddressSelect,
    });
    if (!address) addressNotFound();
    return { address: toCustomerAddressResponse(address) };
  });

  app.post("/customer/addresses", { onRequest: [authenticate, app.csrfProtection] }, async (request, reply) => {
    const input = parseRequest(createAddressSchema, request.body, request);
    const userId = request.auth!.userId;
    const address = await prisma.$transaction(async (tx) => {
      const existingCount = await tx.shippingAddress.count({ where: { userId } });
      const shouldDefault = input.isDefault === true || existingCount === 0;
      if (shouldDefault) await tx.shippingAddress.updateMany({ where: { userId }, data: { isDefault: false } });
      return tx.shippingAddress.create({
        data: {
          userId,
          fullName: input.fullName,
          mobile: input.mobile,
          addressLine1: input.addressLine1,
          addressLine2: input.addressLine2 ?? null,
          landmark: input.landmark ?? null,
          city: input.city,
          state: input.state,
          postalCode: input.postalCode,
          country: input.country,
          addressType: toAddressType(input.addressType),
          isDefault: shouldDefault,
        },
        select: customerAddressSelect,
      });
    });
    return reply.status(201).send({ address: toCustomerAddressResponse(address) });
  });

  app.patch("/customer/addresses/:id", { onRequest: [authenticate, app.csrfProtection] }, async (request) => {
    const id = requireUuidParam((request.params as { id: string }).id);
    const input = parseRequest(updateAddressSchema, request.body, request);
    const userId = request.auth!.userId;
    const address = await prisma.$transaction(async (tx) => {
      const existing = await tx.shippingAddress.findFirst({ where: { id, userId }, select: { isDefault: true } });
      if (!existing) addressNotFound();
      const shouldDefault = input.isDefault === true || existing.isDefault;
      if (shouldDefault) await tx.shippingAddress.updateMany({ where: { userId, id: { not: id } }, data: { isDefault: false } });
      return tx.shippingAddress.update({
        where: { id },
        data: { ...addressData(input), isDefault: shouldDefault },
        select: customerAddressSelect,
      });
    });
    return { address: toCustomerAddressResponse(address) };
  });

  app.patch("/customer/addresses/:id/default", { onRequest: [authenticate, app.csrfProtection] }, async (request) => {
    const id = requireUuidParam((request.params as { id: string }).id);
    parseRequest(setDefaultAddressSchema, request.body ?? {}, request);
    const userId = request.auth!.userId;
    const address = await prisma.$transaction(async (tx) => {
      const existing = await tx.shippingAddress.findFirst({ where: { id, userId }, select: { id: true } });
      if (!existing) addressNotFound();
      await tx.shippingAddress.updateMany({ where: { userId }, data: { isDefault: false } });
      return tx.shippingAddress.update({ where: { id }, data: { isDefault: true }, select: customerAddressSelect });
    });
    return { address: toCustomerAddressResponse(address) };
  });

  app.delete("/customer/addresses/:id", { onRequest: [authenticate, app.csrfProtection] }, async (request, reply) => {
    const id = requireUuidParam((request.params as { id: string }).id);
    const userId = request.auth!.userId;
    await prisma.$transaction(async (tx) => {
      const existing = await tx.shippingAddress.findFirst({ where: { id, userId }, select: { isDefault: true } });
      if (!existing) addressNotFound();
      await tx.shippingAddress.delete({ where: { id } });
      if (existing.isDefault) {
        const replacement = await tx.shippingAddress.findFirst({ where: { userId }, orderBy: { createdAt: "asc" }, select: { id: true } });
        if (replacement) await tx.shippingAddress.update({ where: { id: replacement.id }, data: { isDefault: true } });
      }
    });
    return reply.status(204).send();
  });

  app.get("/customer/wishlist", { onRequest: authenticate }, async (request) => {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: request.auth!.userId },
      select: { items: { orderBy: { createdAt: "desc" }, select: wishlistItemSelect } },
    });
    return { items: wishlist?.items.map(toWishlistItemResponse) ?? [] };
  });

  app.get("/customer/wishlist/check/:productId", { onRequest: authenticate }, async (request) => {
    const { productId } = request.params as { productId: string };
    const product = await findProduct(productId);
    const wishlist = await prisma.wishlist.findUnique({ where: { userId: request.auth!.userId }, select: { id: true } });
    if (!wishlist) return { saved: false };
    const item = await prisma.wishlistItem.findUnique({ where: { wishlistId_productId: { wishlistId: wishlist.id, productId: product.id } }, select: { id: true } });
    return { saved: Boolean(item) };
  });

  app.post("/customer/wishlist/items", { onRequest: [authenticate, app.csrfProtection] }, async (request, reply) => {
    const input = parseRequest(wishlistProductSchema, request.body, request);
    const product = await findProduct(input.productId);
    const item = await prisma.$transaction(async (tx) => {
      const wishlist = await tx.wishlist.upsert({ where: { userId: request.auth!.userId }, update: {}, create: { userId: request.auth!.userId }, select: { id: true } });
      const existing = await tx.wishlistItem.findUnique({ where: { wishlistId_productId: { wishlistId: wishlist.id, productId: product.id } }, select: wishlistItemSelect });
      if (existing) return existing;
      return tx.wishlistItem.create({ data: { wishlistId: wishlist.id, productId: product.id }, select: wishlistItemSelect });
    });
    return reply.status(201).send({ item: toWishlistItemResponse(item) });
  });

  app.delete("/customer/wishlist/items/:productId", { onRequest: [authenticate, app.csrfProtection] }, async (request, reply) => {
    const { productId } = request.params as { productId: string };
    const product = await findProduct(productId, false);
    const wishlist = await prisma.wishlist.findUnique({ where: { userId: request.auth!.userId }, select: { id: true } });
    if (wishlist) await prisma.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id, productId: product.id } });
    return reply.status(204).send();
  });

  app.get("/customer/cart", { onRequest: authenticate }, async (request) => {
    const cart = await prisma.cart.findUnique({ where: { userId: request.auth!.userId }, select: { id: true, items: { select: cartItemSelect } } });
    return toCartResponse(cart?.id ?? null, (cart?.items ?? []) as any);
  });

  app.post("/customer/cart/items", { onRequest: [authenticate, app.csrfProtection] }, async (request, reply) => {
    const input = parseRequest(addCartItemSchema, request.body, request);
    const result = await prisma.$transaction(async (tx) => {
      const selection = await resolveCartSelection(tx, input);
      if (input.quantity > selection.stockQuantity) throw new AppError(409, "QUANTITY_EXCEEDS_STOCK", "The requested quantity exceeds available stock");
      const cart = await tx.cart.upsert({ where: { userId: request.auth!.userId }, update: {}, create: { userId: request.auth!.userId }, select: { id: true } });
      const items = await tx.cartItem.findMany({ where: { cartId: cart.id, productId: selection.productId }, select: { id: true, variantId: true, variantSnapshot: true, quantity: true } as any }) as any[];
      const existing = items.find((item) => item.variantId === selection.variantId && sameVariantSelection(item.variantSnapshot, selection.variantSnapshot));
      const quantity = (existing?.quantity ?? 0) + input.quantity;
      if (quantity > selection.stockQuantity || quantity > 99) throw new AppError(409, "QUANTITY_EXCEEDS_STOCK", "The requested quantity exceeds available stock");
      if (existing) return tx.cartItem.update({ where: { id: existing.id }, data: { quantity }, select: cartItemSelect }) as any;
      return tx.cartItem.create({ data: { cartId: cart.id, productId: selection.productId, variantId: selection.variantId, variantSnapshot: selection.variantSnapshot, quantity: input.quantity } as any, select: cartItemSelect }) as any;
    });
    return reply.status(201).send({ item: toCartItemResponse(result as any) });
  });

  app.patch("/customer/cart/items/:id", { onRequest: [authenticate, app.csrfProtection] }, async (request) => {
    const id = requireUuidParam((request.params as { id: string }).id);
    const input = parseRequest(updateCartItemSchema, request.body, request);
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.cartItem.findFirst({ where: { id, cart: { userId: request.auth!.userId } }, select: { id: true, productId: true, variantId: true, variantSnapshot: true } as any }) as any;
      if (!existing) throw new AppError(404, "CART_ITEM_NOT_FOUND", "Cart item not found");
      const selection = await resolveCartSelection(tx, { productId: existing.productId, variantId: existing.variantId ?? undefined, variants: (existing.variantSnapshot ?? {}) as Record<string, string>, quantity: input.quantity });
      if (input.quantity > selection.stockQuantity) throw new AppError(409, "QUANTITY_EXCEEDS_STOCK", "The requested quantity exceeds available stock");
      return tx.cartItem.update({ where: { id }, data: { quantity: input.quantity }, select: cartItemSelect }) as any;
    });
    return { item: toCartItemResponse(result as any) };
  });

  app.delete("/customer/cart/items/:id", { onRequest: [authenticate, app.csrfProtection] }, async (request, reply) => {
    const id = requireUuidParam((request.params as { id: string }).id);
    const result = await prisma.cartItem.deleteMany({ where: { id, cart: { userId: request.auth!.userId } } });
    if (!result.count) throw new AppError(404, "CART_ITEM_NOT_FOUND", "Cart item not found");
    return reply.status(204).send();
  });

  app.delete("/customer/cart", { onRequest: [authenticate, app.csrfProtection] }, async (request, reply) => {
    await prisma.cart.deleteMany({ where: { userId: request.auth!.userId } });
    return reply.status(204).send();
  });
};
