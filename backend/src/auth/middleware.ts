import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../errors/app-error.js";
import { prisma } from "../database/client.js";
import { findSession } from "./session.js";

export async function authenticate(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const rawToken = request.cookies[request.server.appEnv.SESSION_COOKIE_NAME];
  if (!rawToken) throw new AppError(401, "AUTHENTICATION_REQUIRED", "Authentication required");
  const session = await findSession(prisma, rawToken);
  if (!session) throw new AppError(401, "AUTHENTICATION_REQUIRED", "Authentication required");
  request.auth = { userId: session.user.id, email: session.user.email, roles: session.user.roles, sessionId: session.id };
  await prisma.authSession.updateMany({ where: { id: session.id }, data: { lastSeenAt: new Date() } });
}

export function requireAuthenticated() {
  return authenticate;
}

export function requireAnyRole(...roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    await authenticate(request, reply);
    if (!request.auth || !request.auth.roles.some((role) => roles.includes(role))) {
      throw new AppError(403, "FORBIDDEN", "Forbidden");
    }
  };
}
