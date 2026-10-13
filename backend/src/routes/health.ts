import type { FastifyPluginAsync } from "fastify";

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get("/health", {
    schema: {
      response: {
        200: {
          type: "object",
          required: ["status", "service", "timestamp"],
          properties: {
            status: { type: "string", const: "ok" },
            service: { type: "string" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
      },
    },
  }, async () => ({
    status: "ok",
    service: "iron-peak-fitness-api",
    timestamp: new Date().toISOString(),
  }));
};
