import assert from "node:assert/strict";
import { test } from "node:test";
import { buildApp } from "../src/app.js";
import { loadEnv } from "../src/config/env.js";
import { addCartItemSchema, updateCartItemSchema } from "../src/customer/cart-schemas.js";
import { toCartResponse } from "../src/customer/cart-projection.js";

const testEnv = loadEnv({
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://postgres:placeholder@localhost:5432/iron_peak_fitness",
  FRONTEND_URL: "http://localhost:5173",
  SESSION_SECRET: "test-session-secret-that-is-at-least-32-characters",
});

test("unauthenticated cart reads and writes return 401", async () => {
  const app = await buildApp(testEnv);
  try {
    const getResponse = await app.inject({ method: "GET", url: "/api/v1/customer/cart" });
    const postResponse = await app.inject({ method: "POST", url: "/api/v1/customer/cart/items", payload: { productId: "peak-whey-vanilla", quantity: 1, variants: {} } });
    assert.equal(getResponse.statusCode, 401);
    assert.equal(postResponse.statusCode, 401);
  } finally {
    await app.close();
  }
});

test("cart input accepts only supported identifiers and quantities", () => {
  const input = addCartItemSchema.parse({ productId: "peak-whey-vanilla", variants: { Size: "1 kg" }, quantity: 2 });
  assert.equal(input.quantity, 2);
  assert.throws(() => addCartItemSchema.parse({ productId: "product", quantity: 0, variants: {} }));
  assert.throws(() => addCartItemSchema.parse({ productId: "product", quantity: 1, variants: {}, pricePaise: 1 }));
  assert.throws(() => updateCartItemSchema.parse({ quantity: -1 }));
});

test("cart merchandise totals use authoritative paise values", () => {
  const response = toCartResponse("cart-1", [{
    id: "item-1", productId: "product-1", variantId: "variant-1", variantSnapshot: { Size: "1 kg" }, quantity: 2,
    product: { id: "product-1", slug: "peak-whey-vanilla", name: "Peak Whey", image: "image", pricePaise: 349000, compareAtPricePaise: 399000, status: "ACTIVE", brand: { name: "Iron Peak" }, variants: [{ id: "variant-1", name: "Size", value: "1 kg", pricePaise: null, compareAtPricePaise: null, stockQuantity: 5, isActive: true }] },
  }]);
  assert.equal(response.cart.subtotalPaise, 698000);
  assert.equal(response.cart.savingsPaise, 100000);
  assert.equal(response.cart.totalPaise, 698000);
});
