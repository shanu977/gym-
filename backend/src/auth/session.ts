import { createHash, randomBytes } from "node:crypto";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { Prisma, PrismaClient, UserRole } from "@prisma/client";
import type { AppEnv } from "../config/env.js";

export type AuthUser = {
  id: string;
  email: string;
  roles: UserRole[];
  profile: { firstName: string; lastName: string; phone: string | null } | null;
};

export type SessionPrincipal = { userId: string; email: string; roles: UserRole[]; sessionId: string };

export const SESSION_TOKEN_BYTES = 32;

export function createSessionToken(): string {
  return randomBytes(SESSION_TOKEN_BYTES).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function sessionCookieOptions(env: AppEnv, maxAgeSeconds?: number) {
  const production = env.NODE_ENV === "production";
  const configuredName = env.SESSION_COOKIE_NAME;
  const name = production && configuredName.startsWith("__Host-") ? configuredName : configuredName;
  return {
    httpOnly: true,
    secure: production,
    sameSite: "lax" as const,
    path: "/",
    ...(maxAgeSeconds === undefined ? {} : { maxAge: maxAgeSeconds }),
    name,
  };
}

export function setSessionCookie(reply: FastifyReply, env: AppEnv, token: string, expiresAt: Date): void {
  const seconds = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
  const options = sessionCookieOptions(env, seconds);
  reply.setCookie(options.name, token, options);
}

export function clearSessionCookie(reply: FastifyReply, env: AppEnv): void {
  const options = sessionCookieOptions(env);
  reply.clearCookie(options.name, options);
}

export function requestIpHash(request: FastifyRequest, env: AppEnv): string {
  return createHash("sha256").update(`${env.SESSION_SECRET}:${request.ip}`, "utf8").digest("hex");
}

export function safeUserProjection(user: AuthUser) {
  return {
    id: user.id,
    email: user.email,
    roles: user.roles,
    profile: user.profile,
  };
}

const userSelect = {
  id: true,
  email: true,
  roles: true,
  profile: { select: { firstName: true, lastName: true, phone: true } },
} satisfies Prisma.UserSelect;

export async function createSession(
  db: PrismaClient | Prisma.TransactionClient,
  userId: string,
  request: FastifyRequest,
  env: AppEnv,
  rememberSession: boolean,
) {
  const rawToken = createSessionToken();
  const ttlMs = rememberSession
    ? env.REMEMBER_SESSION_TTL_DAYS * 24 * 60 * 60 * 1000
    : env.SESSION_TTL_HOURS * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + ttlMs);
  const session = await db.authSession.create({
    data: {
      userId,
      tokenHash: hashSessionToken(rawToken),
      expiresAt,
      userAgent: request.headers["user-agent"]?.slice(0, 512),
      ipHash: requestIpHash(request, env),
    },
  });
  return { rawToken, expiresAt, sessionId: session.id };
}

export async function findSession(db: PrismaClient, rawToken: string, now = new Date()) {
  return db.authSession.findUnique({
    where: { tokenHash: hashSessionToken(rawToken) },
    include: { user: { select: userSelect } },
  }).then((session) => {
    if (!session || session.revokedAt || session.expiresAt <= now) return null;
    return session;
  });
}

export async function revokeSession(db: PrismaClient, sessionId: string): Promise<void> {
  await db.authSession.updateMany({ where: { id: sessionId, revokedAt: null }, data: { revokedAt: new Date() } });
}
