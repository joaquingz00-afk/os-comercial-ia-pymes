import { z } from "zod";

export const createContactSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  role: z
    .enum(["DECISION_MAKER", "INFLUENCER", "CHAMPION", "USER", "BLOCKER"])
    .default("USER"),
  isPrimary: z.boolean().default(false),
  accountId: z.string().min(1, "La cuenta es obligatoria"),
});

export const updateContactSchema = createContactSchema.partial().omit({
  accountId: true,
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
