import { z } from "zod";

export const createActivitySchema = z.object({
  type: z.enum(["CALL", "EMAIL", "MEETING", "NOTE", "TASK", "SEQUENCE_STEP"]),
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  date: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  outcome: z.enum(["CONNECTED", "NO_ANSWER", "VOICEMAIL", "RESCHEDULED"]).optional(),
  duration: z.number().min(0).optional(),
  nextFollowUp: z.string().optional(),
  dealId: z.string().optional(),
  accountId: z.string().optional(),
  contactId: z.string().optional(),
  assignedToId: z.string().optional(),
});

export const updateActivitySchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED", "OVERDUE"]).optional(),
  outcome: z.enum(["CONNECTED", "NO_ANSWER", "VOICEMAIL", "RESCHEDULED"]).optional(),
  duration: z.number().min(0).optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  nextFollowUp: z.string().optional(),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;
