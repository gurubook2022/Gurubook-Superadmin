import { z } from "zod";

export const notificationFormSchema = z.object({
    content: z.string().min(1, { message: "Content is required." }),
    notificationFor: z.string().min(1, { message: "User Type is required." }),
});

export type NotificationInput = z.infer<typeof notificationFormSchema>;
