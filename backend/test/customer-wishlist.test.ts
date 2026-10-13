import assert from "node:assert/strict";
import { test } from "node:test";
import { buildApp } from "../src/app.js";
import { loadEnv } from "../src/config/env.js";
import { wishlistProductSchema } from "../src/customer/wishlist-schemas.js";

const testEnv = loadEnv({
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://postgres:placeholder@localhost:5432/iron_peak_fitness",
  FRONTEND_URL: "http://localhost:5173",
  SESSION_SECRET: "test-session-secret-that-is-at-least-32-characters",
});

test("unauthenticated wishlist reads and writes return 401", async () => {
  const app = await buildApp(testEnv);
  try {
    const getResponse = await app.inject({ method: "GET", url: "/api/v1/customer/wishlist" });
    const postResponse = await app.inject({ method: "POST", url: "/api/v1/customer/wishlist/items", payload: { productId: "peak-whey-vanilla" } });
    assert.equal(getResponse.statusCode, 401);
    assert.equal(postResponse.statusCode, 401);
  } finally {
    await app.close();
  }
});

test("wishlist input is strict and requires a product key", () => {
  assert.equal(wishlistProductSchema.parse({ productId: " peak-whey-vanilla " }).productId, "peak-whey-vanilla");
  assert.throws(() => wishlistProductSchema.parse({ productId: "product", variantId: "variant" }));
  assert.throws(() => wishlistProductSchema.parse({ userId: "other-user", productId: "product" }));
});
