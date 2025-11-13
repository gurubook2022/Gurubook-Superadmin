import { z } from "zod";

export const languageFormSchema = z.object({
    title: z.coerce.string().min(1, { message: "Title is required." }),
    isApproved: z.coerce.boolean()
});

export type LanguageInput = z.infer<typeof languageFormSchema>;
