import { z } from "zod";

export const signInFormSchema = z.object({
  email: z.coerce.string().min(1, { message: "Email is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export type SignInInput = z.infer<typeof signInFormSchema>;
