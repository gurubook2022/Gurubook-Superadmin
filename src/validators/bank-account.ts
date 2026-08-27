import { z } from "zod";

export const bankAccountFormSchema = z.object({
    accountHolder: z.string().min(1, { message: "Required" }),
    iban: z.string().min(1, { message: "Required" }),
    bic: z.string().min(1, { message: "Required" }),
    bankName: z.string().min(1, { message: "Required" }),
});

export type BankAccountInput = z.infer<typeof bankAccountFormSchema>;
