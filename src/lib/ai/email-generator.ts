import { callAI } from "./client";
import { SYSTEM_PROMPTS } from "./prompts";

interface EmailContext {
  accountName: string;
  contactName: string;
  dealTitle: string;
  dealStage: string;
  dealValue: number;
  lastActivity?: string;
  daysSinceLastContact: number;
  tenantId: string;
  userId: string;
}

export async function generateFollowUpEmail(ctx: EmailContext): Promise<string> {
  const userPrompt = `Genera un email de seguimiento para:
- Empresa: ${ctx.accountName}
- Contacto: ${ctx.contactName}
- Deal: ${ctx.dealTitle}
- Etapa actual: ${ctx.dealStage}
- Valor: $${ctx.dealValue.toLocaleString()}
- Última actividad: ${ctx.lastActivity || "No registrada"}
- Días sin contacto: ${ctx.daysSinceLastContact}

Genera SOLO el cuerpo del email (sin asunto ni firma).`;

  return callAI({
    feature: "EMAIL_GENERATION",
    systemPrompt: SYSTEM_PROMPTS.emailGenerator,
    userPrompt,
    userId: ctx.userId,
    tenantId: ctx.tenantId,
  });
}
