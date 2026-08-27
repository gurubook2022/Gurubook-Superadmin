import { z } from "zod";

export const adminFormSchema = z.object({
  email: z.coerce.string().min(1, { message: "Email is required." }),
  firstName: z.coerce.string().min(1, { message: "First Name is required." }),
  lastName: z.coerce.string().min(1, { message: "Last Name is required." }),
  password: z.string().min(1, { message: "Password is required." }),
  drivingSchoolName: z
    .string()
    .min(1, { message: "Driving School Name is required." }),
  contactPerson: z
    .string()
    .min(1, { message: "Contact Person is required." }),
  phone: z.string().min(1, { message: "Phone is required." }),
  country: z.string().min(1, { message: "Country is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  houseNumber: z.string().min(1, { message: "House Number is required." }),
  postalCode: z.string().min(1, { message: "Postal Code is required." }),
  city: z.string().min(1, { message: "City is required." }),
});

export type AdminInput = z.infer<typeof adminFormSchema>;
