import { z } from "zod";

export const createDealSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  stage: z
    .enum([
      "PROSPECTING",
      "QUALIFICATION",
      "PROPOSAL",
      "NEGOTIATION",
      "CLOSED_WON",
      "CLOSED_LOST",
    ])
    .default("PROSPECTING"),
  value: z.number().min(0, "El valor debe ser positivo").default(0),
  probability: z.number().min(0).max(100).default(10),
  expectedCloseDate: z.string().optional(),
  source: z
    .enum(["INBOUND", "OUTBOUND", "REFERRAL", "EVENT", "PARTNER"])
    .default("INBOUND"),
  accountId: z.string().min(1, "La cuenta es obligatoria"),
  contactId: z.string().optional(),
  assignedToId: z.string().optional(),
});

export const updateDealSchema = createDealSchema.partial().omit({
  accountId: true,
});

export const updateDealStageSchema = z.object({
  stage: z.enum([
    "PROSPECTING",
    "QUALIFICATION",
    "PROPOSAL",
    "NEGOTIATION",
    "CLOSED_WON",
    "CLOSED_LOST",
  ]),
  lostReason: z.string().optional(),
});

export type CreateDealInput = z.infer<typeof createDealSchema>;
export type UpdateDealInput = z.infer<typeof updateDealSchema>;
