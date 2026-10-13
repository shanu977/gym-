import assert from "node:assert/strict";
import { test } from "node:test";
import { loadEnv } from "../src/config/env.js";
import { emailSchema, passwordSchema } from "../src/auth/schemas.js";
import { hashPassword, verifyPassword } from "../src/auth/password.js";
import { clearSessionCookie, createSessionToken, hashSessionToken, sessionCookieOptions } from "../src/auth/session.js";

const env = loadEnv({
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://postgres:placeholder@localhost:5432/iron_peak_fitness",
  FRONTEND_URL: "http://localhost:5173",
  SESSION_SECRET: "test-session-secret-that-is-at-least-32-characters",
});

test("normalizes and validates email", () => {
  assert.equal(emailSchema.parse("  MEMBER@Example.COM "), "member@example.com");
  assert.throws(() => emailSchema.parse("not-an-email"));
});

test("enforces 12 to 128 character password policy", () => {
  assert.throws(() => passwordSchema.parse("short"));
  assert.equal(passwordSchema.parse("a".repeat(12)).length, 12);
  assert.equal(passwordSchema.parse("a".repeat(128)).length, 128);
  assert.throws(() => passwordSchema.parse("a".repeat(129)));
});

test("hashes with Argon2id and verifies without exposing plaintext", async () => {
  const password = "correct-horse-battery-staple";
  const hash = await hashPassword(password, env);
  assert.notEqual(hash, password);
  assert.match(hash, /^\$argon2id\$/);
  assert.equal(await verifyPassword(hash, password), true);
  assert.equal(await verifyPassword(hash, "wrong-password-value"), false);
});

test("session tokens are opaque and only their hashes are persisted", () => {
  const token = createSessionToken();
  assert.equal(token.length > 30, true);
  assert.equal(hashSessionToken(token).length, 64);
  assert.notEqual(hashSessionToken(token), token);
});

test("session cookie uses secure HTTP-only defaults", () => {
  const options = sessionCookieOptions(env, 3600);
  assert.equal(options.httpOnly, true);
  assert.equal(options.secure, false);
  assert.equal(options.sameSite, "lax");
  assert.equal(options.path, "/");
  assert.equal(options.maxAge, 3600);
  assert.equal(typeof clearSessionCookie, "function");
});
