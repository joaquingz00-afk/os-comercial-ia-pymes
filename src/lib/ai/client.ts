import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "../db";

const anthropic = new Anthropic();

interface AiCallOptions {
  feature: string;
  systemPrompt: string;
  userPrompt: string;
  userId?: string;
  tenantId: string;
  maxTokens?: number;
}

export async function callAI({
  feature,
  systemPrompt,
  userPrompt,
  userId,
  tenantId,
  maxTokens = 1024,
}: AiCallOptions): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  const output = textBlock ? textBlock.text : "";

  // Log AI usage for billing/tracking
  await prisma.aiLog.create({
    data: {
      feature,
      input: { system: systemPrompt.slice(0, 200), user: userPrompt.slice(0, 500) },
      output: { text: output.slice(0, 1000) },
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      model: "claude-sonnet-4-20250514",
      userId,
      tenantId,
    },
  });

  return output;
}
