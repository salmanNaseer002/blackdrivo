import { z } from "zod";

const currentYear = new Date().getFullYear();

export const accountSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const personalSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .regex(/^\+?[\d\s\-\(\)]{7,20}$/, "Enter a valid phone number"),
  dob: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Home address is required"),
  licenseNum: z.string().min(3, "License number is required"),
  licenseExpiry: z.string().min(1, "License expiry is required"),
  licenseState: z.string().min(1, "State is required"),
});

export const vehicleSchema = z.object({
  vehicleMake: z.string().min(2, "Vehicle make is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  vehicleYear: z
    .string()
    .refine((v) => {
      const yr = parseInt(v, 10);
      return yr >= 2015 && yr <= currentYear + 1;
    }, `Vehicle must be 2015 or newer`),
  vehicleColor: z.string().min(2, "Vehicle color is required"),
  vehicleReg: z.string().min(2, "License plate is required"),
  vehicleClass: z.enum(["business", "first_class", "suv", "van"]),
});

export const documentsSchema = z.object({
  licenseUploaded: z.boolean().refine((v) => v, "Driver's license is required"),
  insuranceUploaded: z.boolean().refine((v) => v, "Insurance certificate is required"),
  vehicleRegUploaded: z.boolean().refine((v) => v, "Vehicle registration is required"),
});

// Full submission schema
export const driverRegisterSchema = accountSchema
  .merge(personalSchema)
  .merge(vehicleSchema);

export type DriverRegisterData = z.infer<typeof driverRegisterSchema>;
