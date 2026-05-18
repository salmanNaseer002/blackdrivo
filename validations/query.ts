import { z } from "zod";

export const QUERY_SUBJECTS = [
  { value: "booking",   label: "Booking inquiry" },
  { value: "corporate", label: "Corporate accounts" },
  { value: "driver",    label: "Driver partnership" },
  { value: "support",   label: "Customer support" },
  { value: "other",     label: "Other" },
] as const;

export const querySchema = z.object({
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .transform((v) => v.trim()),

  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email is too long")
    .transform((v) => v.toLowerCase().trim()),

  phone: z
    .string()
    .transform((v) => v.trim())
    .refine(
      (v) => v === "" || /^\+?[\d\s\-\(\)]{7,20}$/.test(v),
      { message: "Please enter a valid phone number" }
    ),

  subject: z
    .string()
    .min(1, "Please select a subject"),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be under 2000 characters")
    .transform((v) => v.trim()),
});

export type QueryFormData = z.infer<typeof querySchema>;

export type QueryFormInput = z.input<typeof querySchema>;
