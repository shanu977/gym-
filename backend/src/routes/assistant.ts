import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { AppError } from "../errors/app-error.js";
import { parseRequest } from "../middleware/validation.js";
import { askAi, isAiConfigured, type AssistantMessage } from "../assistant/ai.js";
import { demoAnswer } from "../assistant/answers.js";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1, "Message content is required").max(2000, "Message is too long"),
});

const chatRequestSchema = z
  .object({
    messages: z.array(chatMessageSchema).min(1, "At least one message is required").max(20, "Too many messages"),
  })
  .strict();

const DEMO_NOTICE = "Demo mode: AI credentials are not configured, so replies come from the Iron Peak catalog.";

export const assistantRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    "/assistant/chat",
    {
      onRequest: app.csrfProtection,
      config: { rateLimit: { max: 20, timeWindow: "1 minute" } },
      schema: {
        response: {
          200: {
            type: "object",
            required: ["mode", "reply"],
            properties: {
              mode: { type: "string", enum: ["live", "demo"] },
              reply: { type: "string" },
              notice: { type: "string" },
              model: { type: "string" },
            },
          },
        },
      },
    },
    async (request) => {
      const input = parseRequest(chatRequestSchema, request.body, request);
      const messages = input.messages as AssistantMessage[];
      const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
      if (!lastUserMessage) throw new AppError(400, "VALIDATION_ERROR", "At least one user message is required");

      if (isAiConfigured(app.appEnv)) {
        try {
          const result = await askAi(app.appEnv, messages);
          return { mode: "live" as const, reply: result.reply, model: result.model };
        } catch (error) {
          request.log.error({ err: error }, "Live assistant request failed");
          return {
            mode: "demo" as const,
            reply: demoAnswer(lastUserMessage.content),
            notice: "Live AI is configured but unreachable right now, so this reply came from the Iron Peak catalog fallback.",
          };
        }
      }

      return { mode: "demo" as const, reply: demoAnswer(lastUserMessage.content), notice: DEMO_NOTICE };
    },
  );
};
