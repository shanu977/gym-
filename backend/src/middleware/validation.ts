import type { FastifyRequest } from "fastify";
import { z, type ZodType } from "zod";
import { AppError } from "../errors/app-error.js";

export function parseRequest<T>(schema: ZodType<T>, value: unknown, request: FastifyRequest): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new AppError(400, "VALIDATION_ERROR", "Request validation failed", {
      issues: result.error.issues,
      requestId: request.id,
    });
  }
  return result.data;
}

export const emptyRequestSchema = z.object({}).strict();
