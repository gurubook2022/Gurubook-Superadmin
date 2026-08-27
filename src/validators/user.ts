import { z } from "zod";

export const userFormSchema = z
  .object({
    firstName: z.coerce.string().min(1, { message: "First Name is required." }),
    lastName: z.coerce.string().min(1, { message: "Last Name is required." }),
    email: z.coerce.string().min(1, { message: "Email is required." }),

    userType: z.enum(["USER", "BKFUSER"]),
    purpose: z.enum(["NEW", "EXTENSION"]),
    acquiredClasses: z.array(z.string()).optional(),
    classes: z
      .array(z.string())
      .nonempty({ message: "Atleast one class is required" }),

    examLanguage: z.string().min(1, { message: "Exam Language is required." }),
    learningLanguage: z.string(),
  })
  .refine(
    (data) =>
      data.purpose !== "EXTENSION" ||
      (data.acquiredClasses && data.acquiredClasses.length > 0),
    {
      message: "Atleast one already owned class is required",
      path: ["acquiredClasses"],
    }
  );

export type UserInput = z.infer<typeof userFormSchema>;
