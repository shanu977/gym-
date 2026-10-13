import type { FastifyPluginAsync } from "fastify";
import { Prisma } from "@prisma/client";
import { prisma } from "../database/client.js";
import { AppError } from "../errors/app-error.js";
import { parseRequest } from "../middleware/validation.js";
import { authenticate } from "../auth/middleware.js";
import { hashPassword, verifyPassword } from "../auth/password.js";
import { clearSessionCookie, createSession, findSession, revokeSession, safeUserProjection, setSessionCookie } from "../auth/session.js";
import { loginSchema, registerSchema } from "../auth/schemas.js";

const genericCredentialsError = () => new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.get("/auth/csrf", async (_request, reply) => ({ csrfToken: await reply.generateCsrf() }));

  app.post("/auth/register", {
    onRequest: app.csrfProtection,
    config: { rateLimit: { max: 10, timeWindow: "15 minutes" } },
  }, async (request, reply) => {
    const input = parseRequest(registerSchema, request.body, request);
    const email = input.email;
    try {
      const result = await prisma.$transaction(async (tx) => {
        const passwordHash = await hashPassword(input.password, app.appEnv);
        const user = await tx.user.create({
          data: {
            email,
            passwordHash,
            roles: ["CUSTOMER"],
            profile: { create: { firstName: input.firstName, lastName: input.lastName, phone: input.mobile } },
          },
          select: { id: true, email: true, roles: true, profile: { select: { firstName: true, lastName: true, phone: true } } },
        });
        const session = await createSession(tx, user.id, request, app.appEnv, false);
        return { user, session };
      });
      setSessionCookie(reply, app.appEnv, result.session.rawToken, result.session.expiresAt);
      return reply.status(201).send({ user: safeUserProjection(result.user) });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError(409, "EMAIL_ALREADY_REGISTERED", "An account with this email already exists");
      }
      throw error;
    }
  });

  app.post("/auth/login", {
    onRequest: app.csrfProtection,
    config: { rateLimit: { max: 20, timeWindow: "15 minutes" } },
  }, async (request, reply) => {
    const input = parseRequest(loginSchema, request.body, request);
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true, email: true, passwordHash: true, roles: true, profile: { select: { firstName: true, lastName: true, phone: true } } },
    });
    const valid = user?.passwordHash ? await verifyPassword(user.passwordHash, input.password) : false;
    if (!user || !valid) throw genericCredentialsError();
    const session = await createSession(prisma, user.id, request, app.appEnv, input.rememberSession);
    setSessionCookie(reply, app.appEnv, session.rawToken, session.expiresAt);
    return { user: safeUserProjection(user) };
  });

  app.get("/auth/me", { onRequest: authenticate }, async (request) => {
    const user = await prisma.user.findUnique({
      where: { id: request.auth!.userId },
      select: { id: true, email: true, roles: true, profile: { select: { firstName: true, lastName: true, phone: true } } },
    });
    if (!user) throw new AppError(401, "AUTHENTICATION_REQUIRED", "Authentication required");
    return { user: safeUserProjection(user) };
  });

  app.post("/auth/logout", { onRequest: app.csrfProtection }, async (request, reply) => {
    const rawToken = request.cookies[app.appEnv.SESSION_COOKIE_NAME];
    if (rawToken) {
      const session = await findSession(prisma, rawToken);
      if (session) await revokeSession(prisma, session.id);
    }
    clearSessionCookie(reply, app.appEnv);
    return reply.status(204).send();
  });
};
