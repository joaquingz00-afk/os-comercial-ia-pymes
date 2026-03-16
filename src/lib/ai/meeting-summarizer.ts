import { callAI } from "./client";
import { SYSTEM_PROMPTS } from "./prompts";

interface MeetingContext {
  accountName: string;
  dealTitle?: string;
  notes: string;
  tenantId: string;
  userId: string;
}

export interface MeetingSummary {
  summary: string;
  keyPoints: string[];
  actionItems: { task: string; owner: string }[];
  objections: string[];
  nextSteps: string;
}

export async function summarizeMeeting(
  ctx: MeetingContext
): Promise<MeetingSummary> {
  const userPrompt = `Resume estas notas de reunión:
- Empresa: ${ctx.accountName}
${ctx.dealTitle ? `- Deal: ${ctx.dealTitle}` : ""}

Notas:
${ctx.notes}`;

  const result = await callAI({
    feature: "MEETING_SUMMARY",
    systemPrompt: SYSTEM_PROMPTS.meetingSummarizer,
    userPrompt,
    userId: ctx.userId,
    tenantId: ctx.tenantId,
  });

  try {
    return JSON.parse(result) as MeetingSummary;
  } catch {
    return {
      summary: result,
      keyPoints: [],
      actionItems: [],
      objections: [],
      nextSteps: "",
    };
  }
}
