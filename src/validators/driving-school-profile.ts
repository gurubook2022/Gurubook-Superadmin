import { z } from "zod";

export const drivingSchoolProfileFormSchema = z.object({
  drivingSchoolName: z
    .string()
    .min(1, { message: "Driving School Name is required." }),
  contactPerson: z
    .string()
    .min(1, { message: "Contact Person is required." }),
  phone: z.string().min(1, { message: "Phone is required." }),
  email: z.coerce.string().min(1, { message: "Email is required." }),
  country: z.string().min(1, { message: "Country is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  houseNumber: z.string().min(1, { message: "House Number is required." }),
  postalCode: z.string().min(1, { message: "Postal Code is required." }),
  city: z.string().min(1, { message: "City is required." }),
});

export type DrivingSchoolProfileInput = z.infer<
  typeof drivingSchoolProfileFormSchema
>;
