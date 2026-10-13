import assert from "node:assert/strict";
import { test } from "node:test";
import { buildApp } from "../src/app.js";
import { loadEnv } from "../src/config/env.js";
import { createAddressSchema, updateAddressSchema } from "../src/customer/address-schemas.js";

const testEnv = loadEnv({
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://postgres:placeholder@localhost:5432/iron_peak_fitness",
  FRONTEND_URL: "http://localhost:5173",
  SESSION_SECRET: "test-session-secret-that-is-at-least-32-characters",
});

test("unauthenticated address reads and writes return 401", async () => {
  const app = await buildApp(testEnv);
  try {
    const getResponse = await app.inject({ method: "GET", url: "/api/v1/customer/addresses" });
    const postResponse = await app.inject({ method: "POST", url: "/api/v1/customer/addresses", payload: {} });
    assert.equal(getResponse.statusCode, 401);
    assert.equal(postResponse.statusCode, 401);
  } finally {
    await app.close();
  }
});

test("address schema trims supported fields and rejects client ownership fields", () => {
  const result = createAddressSchema.parse({
    fullName: " Alex Morgan ", mobile: "+91 98765 43210", addressLine1: " 1 Main Road ",
    addressLine2: "", landmark: "", city: " Mumbai ", state: " Maharashtra ", postalCode: "400001",
    country: " India ", addressType: "Home", isDefault: true,
  });
  assert.equal(result.fullName, "Alex Morgan");
  assert.equal(result.postalCode, "400001");
  assert.throws(() => createAddressSchema.parse({ ...result, userId: "other-user" }));
  assert.throws(() => updateAddressSchema.parse({ customerId: "other-user" }));
  assert.throws(() => createAddressSchema.parse({ ...result, postalCode: "123" }));
});
