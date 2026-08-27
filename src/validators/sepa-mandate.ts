import { z } from "zod";

export const sepaMandateFormSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
  mandateReference: z
    .string()
    .min(1, { message: "Mandate Reference is required." }),
  version: z.string().min(1, { message: "Version is required." }),
  signedOn: z.string().min(1, { message: "Signed On date is required." }),
});

export type SepaMandateInput = z.infer<typeof sepaMandateFormSchema>;
