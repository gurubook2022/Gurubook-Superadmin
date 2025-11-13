import { z } from "zod";

export const priceFormSchema = z.object({
    vat: z.string().min(0, { message: "Required" }),
    dlApprovedLanguages: z.string().min(0, { message: "Required" }),
    dlNonApprovedLanguages: z.string().min(0, { message: "Required" }),
    bkfApprovedLanguages: z.string().min(0, { message: "Required" }),
    bkfNonApprovedLanguages: z.string().min(0, { message: "Required" }),
});

export type PriceInput = z.infer<typeof priceFormSchema>;
