import { z } from "zod";

export const changePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current Password is required." }),
    newPassword: z
      .string()
      .min(6, { message: "New Password must be at least 6 characters." }),
    confirmNewPassword: z
      .string()
      .min(1, { message: "Please re-enter the new password." }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordFormSchema>;
