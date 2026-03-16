import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  industry: z.string().optional(),
  segment: z
    .enum(["STARTUP", "SMB", "MIDMARKET", "ENTERPRISE", "GOVERNMENT"])
    .optional(),
  size: z.string().optional(),
  annualRevenue: z.number().min(0).optional(),
  website: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  taxId: z.string().optional(),
  status: z
    .enum(["PROSPECT", "ACTIVE_CLIENT", "INACTIVE", "CHURNED"])
    .default("PROSPECT"),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
  assignedToId: z.string().optional(),
});

export const updateAccountSchema = createAccountSchema.partial();

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
