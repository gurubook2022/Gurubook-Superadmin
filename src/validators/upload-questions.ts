import { z } from "zod";

export const uploadQuestionsFormSchema = z.object({
    file: z.custom((file) => file instanceof File, {
        message: 'Please select file(.xlsx) to upload questions.',
    }),
});

export type UploadQuestionsInput = z.infer<typeof uploadQuestionsFormSchema>;
