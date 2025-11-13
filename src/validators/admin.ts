import { z } from "zod";

export const adminFormSchema = z.object({
  email: z.coerce.string().min(1, { message: "Email is required." }),
  firstName: z.coerce.string().min(1, { message: "First Name is required." }),
  lastName: z.coerce.string().min(1, { message: "Last Name is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export type AdminInput = z.infer<typeof adminFormSchema>;
