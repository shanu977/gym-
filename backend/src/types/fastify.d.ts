import type { UserRole } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    appEnv: import("../config/env.js").AppEnv;
  }
  interface FastifyRequest {
    auth?: {
      userId: string;
      email: string;
      roles: UserRole[];
      sessionId: string;
    };
  }
}

export {};
