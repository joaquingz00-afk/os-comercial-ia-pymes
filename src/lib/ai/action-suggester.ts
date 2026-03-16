import { callAI } from "./client";
import { SYSTEM_PROMPTS } from "./prompts";

interface ActionContext {
  accountName: string;
  contactName: string;
  dealTitle: string;
  dealStage: string;
  dealValue: number;
  daysSinceLastContact: number;
  recentActivities: string[];
  tenantId: string;
  userId: string;
}

export interface ActionSuggestion {
  action: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  reason: string;
}

export async function suggestNextAction(
  ctx: ActionContext
): Promise<ActionSuggestion> {
  const userPrompt = `Analiza este deal y sugiere la próxima acción:
- Empresa: ${ctx.accountName}
- Contacto: ${ctx.contactName}
- Deal: ${ctx.dealTitle}
- Etapa: ${ctx.dealStage}
- Valor: $${ctx.dealValue.toLocaleString()}
- Días sin contacto: ${ctx.daysSinceLastContact}
- Actividades recientes:
${ctx.recentActivities.map((a) => `  - ${a}`).join("\n") || "  Ninguna registrada"}`;

  const result = await callAI({
    feature: "ACTION_SUGGESTION",
    systemPrompt: SYSTEM_PROMPTS.actionSuggester,
    userPrompt,
    userId: ctx.userId,
    tenantId: ctx.tenantId,
    maxTokens: 512,
  });

  try {
    return JSON.parse(result) as ActionSuggestion;
  } catch {
    return {
      action: result,
      priority: "MEDIUM",
      reason: "Sugerencia generada por IA",
    };
  }
}
