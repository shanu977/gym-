import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  HOST: z.string().min(1).default("127.0.0.1"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
  SESSION_COOKIE_NAME: z.string().regex(/^[A-Za-z0-9_-]+$/).default("iron_peak_session"),
  SESSION_TTL_HOURS: z.coerce.number().positive().max(24 * 30).default(12),
  REMEMBER_SESSION_TTL_DAYS: z.coerce.number().positive().max(365).default(30),
  ARGON2_MEMORY_COST: z.coerce.number().int().min(8 * 1024).default(19456),
  ARGON2_TIME_COST: z.coerce.number().int().min(1).max(10).default(2),
  ARGON2_PARALLELISM: z.coerce.number().int().min(1).max(8).default(1),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  AI_API_KEY: z.string().trim().default(""),
  AI_BASE_URL: z.string().url().default("https://api.groq.com/openai/v1"),
  AI_MODEL: z.string().min(1).default("openai/gpt-oss-120b"),
  AI_MAX_TOKENS: z.coerce.number().int().min(64).max(2000).default(600),
  AI_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(20000),
});

export type AppEnv = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const details = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
    throw new Error(`Invalid environment configuration: ${details}`);
  }
  if (result.data.NODE_ENV === "production" && result.data.SESSION_SECRET.includes("replace-with")) {
    throw new Error("Invalid environment configuration: SESSION_SECRET must be a real production secret");
  }
  return result.data;
}
