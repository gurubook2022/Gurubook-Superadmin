import { z } from "zod";

export const userFormSchema = z.object({
    email: z.coerce.string().min(1, { message: "Email is required." }),
    firstName: z.coerce.string().min(1, { message: "First Name is required." }),
    lastName: z.coerce.string().min(1, { message: "Last Name is required." }),
    password: z.string().min(1, { message: "Password is required." }),
    role: z.string().min(1, { message: "User Type is required." }),
    examLanguage: z.string().min(1, { message: "Exam Language is required." }),
    learningLanguage: z.string(),

    country: z.string().min(1, { message: "Country is required." }),
    address: z.string().min(1, { message: "Address is required." }),
    postalCode: z.string().min(1, { message: "Post code is required." }),
    city: z.string().min(1, { message: "City is required." }),
    phone: z.string().min(1, { message: "Phone is required." }),

    classes: z.array(z.string()).nonempty({ message: "Atleast one class is required" }),
});

export type UserInput = z.infer<typeof userFormSchema>;
