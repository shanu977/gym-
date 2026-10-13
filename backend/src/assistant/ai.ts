import type { AppEnv } from "../config/env.js";
import { generalGuidance, gym, memberships, programs, products, trainers } from "./knowledge.js";

export type AssistantMessage = { role: "user" | "assistant"; content: string };

export type AiResult = { reply: string; model: string };

export function isAiConfigured(env: AppEnv): boolean {
  return env.AI_API_KEY.trim().length > 0;
}

function knowledgeContext(): string {
  return JSON.stringify(
    {
      gym,
      memberships,
      trainers,
      programs,
      products,
      generalGuidance,
    },
    null,
    0,
  );
}

function systemPrompt(): string {
  return [
    "You are the official AI fitness assistant for Iron Peak Fitness, a private training club in Mumbai.",
    "Answer the member's question directly, warmly and concisely (usually under 140 words).",
    "Use only the facts in the CONTEXT block below for anything about Iron Peak: gym name, location, contact details, access hours, memberships, prices, trainers, programs, products, product prices and stock.",
    "Never invent products, prices, opening hours, stock, trainers or programs. If something is not in CONTEXT, say you do not have that detail and give the contact route instead: email " +
      gym.email +
      " or phone " +
      gym.phone +
      ".",
    "Prices are in Indian rupees and must be copied exactly as given in CONTEXT.",
    "For general training, nutrition or lifestyle questions not specific to Iron Peak, give sensible, evidence-based general guidance and add a short note that it is general guidance, not medical advice.",
    "Format as plain text. Use short paragraphs and simple bullet lines starting with a bullet character. Do not use markdown headings, tables or code blocks.",
    `CONTEXT:\n${knowledgeContext()}`,
  ].join("\n\n");
}

type ChatCompletionResponse = {
  choices?: Array<{ message?: { content?: unknown } }>;
  model?: unknown;
};

export async function askAi(env: AppEnv, messages: AssistantMessage[]): Promise<AiResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), env.AI_TIMEOUT_MS);
  try {
    const response = await fetch(`${env.AI_BASE_URL.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${env.AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: env.AI_MODEL,
        max_tokens: env.AI_MAX_TOKENS,
        temperature: 0.4,
        messages: [{ role: "system", content: systemPrompt() }, ...messages],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`AI provider responded with ${response.status}: ${detail.slice(0, 300)}`);
    }

    const body = (await response.json().catch(() => null)) as ChatCompletionResponse | null;
    const content = body?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      throw new Error("AI provider returned an empty completion");
    }
    return { reply: content.trim(), model: typeof body?.model === "string" && body.model ? body.model : env.AI_MODEL };
  } finally {
    clearTimeout(timer);
  }
}
