import { z } from "zod";

export const mediaManagementFormSchema = z.object({
    files: z.array(
        z.custom((file) => file instanceof File, {
            message: 'Please select one or more files to upload',
        })
    ).nonempty({ message: "Please select one or more files to upload." }),
});

export type MediaManagementInput = z.infer<typeof mediaManagementFormSchema>;
