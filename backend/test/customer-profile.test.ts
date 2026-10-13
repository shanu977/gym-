import assert from "node:assert/strict";
import { test } from "node:test";
import { buildApp } from "../src/app.js";
import { loadEnv } from "../src/config/env.js";
import { updateProfileSchema } from "../src/customer/schemas.js";
import { toCustomerProfileResponse } from "../src/customer/projection.js";

const baseUser = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "member@example.com",
  roles: ["CUSTOMER"] as const,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-02T00:00:00.000Z"),
};

const testEnv = loadEnv({
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://postgres:placeholder@localhost:5432/iron_peak_fitness",
  FRONTEND_URL: "http://localhost:5173",
  SESSION_SECRET: "test-session-secret-that-is-at-least-32-characters",
});

test("unauthenticated profile requests return 401", async () => {
  const app = await buildApp(testEnv);
  try {
    const getResponse = await app.inject({ method: "GET", url: "/api/v1/customer/profile" });
    const patchResponse = await app.inject({ method: "PATCH", url: "/api/v1/customer/profile", payload: { firstName: "Changed" } });
    assert.equal(getResponse.statusCode, 401);
    assert.equal(patchResponse.statusCode, 401);
  } finally {
    await app.close();
  }
});

test("profile patch accepts editable fields and trims strings", () => {
  const result = updateProfileSchema.parse({ firstName: "  Alex ", bio: "  Ready to train. " });
  assert.deepEqual(result, { firstName: "Alex", bio: "Ready to train." });
});

test("profile patch rejects server-controlled and unknown fields", () => {
  assert.throws(() => updateProfileSchema.parse({ email: "attacker@example.com" }));
  assert.throws(() => updateProfileSchema.parse({ id: "other-user" }));
  assert.throws(() => updateProfileSchema.parse({ roles: ["ADMIN"] }));
  assert.throws(() => updateProfileSchema.parse({}));
});

test("profile response exposes safe account and profile fields only", () => {
  const response = toCustomerProfileResponse({
    ...baseUser,
    profile: {
      firstName: "Alex",
      lastName: "Morgan",
      phone: "+91 98765 43210",
      location: "Mumbai, India",
      fitnessGoal: "Build strength",
      trainingLevel: "Intermediate",
      preferredTrainingTime: "Morning",
      bio: "Consistent work.",
      emailUpdates: true,
      trainingReminders: false,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    },
  });
  assert.equal(response.account.id, baseUser.id);
  assert.equal(response.account.email, baseUser.email);
  assert.equal(response.profile?.firstName, "Alex");
  assert.equal("passwordHash" in response, false);
  assert.equal("sessionId" in response, false);
  assert.equal("roles" in response.profile!, false);
});
