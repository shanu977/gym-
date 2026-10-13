import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import csrfProtection from "@fastify/csrf-protection";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import Fastify, { type FastifyInstance } from "fastify";
import { loadEnv, type AppEnv } from "./config/env.js";
import { registerErrorHandler } from "./middleware/error-handler.js";
import { healthRoutes } from "./routes/health.js";
import { authRoutes } from "./routes/auth.js";
import { customerRoutes } from "./routes/customer.js";
import { assistantRoutes } from "./routes/assistant.js";

export async function buildApp(env: AppEnv = loadEnv()): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      redact: ["req.headers.authorization", "req.headers.cookie"],
    },
    bodyLimit: 1024 * 1024,
  });
  app.decorate("appEnv", env);

  await app.register(helmet);
  await app.register(cookie, { secret: env.SESSION_SECRET });
  await app.register(rateLimit, { global: false, addHeaders: { "x-ratelimit-limit": true, "x-ratelimit-remaining": true, "retry-after": true } });
  await app.register(csrfProtection, {
    cookieKey: env.NODE_ENV === "production" ? "__Host-iron_peak_csrf" : "iron_peak_csrf",
    cookieOpts: { httpOnly: false, secure: env.NODE_ENV === "production", sameSite: "lax", path: "/", signed: true },
    getToken: (request) => {
      const token = request.headers["x-csrf-token"];
      return Array.isArray(token) ? token[0] : token;
    },
  });
  await app.register(cors, {
    origin: env.FRONTEND_URL,
    credentials: true,
  });

  registerErrorHandler(app);
  await app.register(healthRoutes, { prefix: "/api/v1" });
  await app.register(authRoutes, { prefix: "/api/v1" });
  await app.register(customerRoutes, { prefix: "/api/v1" });
  await app.register(assistantRoutes, { prefix: "/api/v1" });

  return app;
}
