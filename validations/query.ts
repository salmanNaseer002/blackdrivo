import { z } from "zod";
import { DEFAULT_COUNTRIES } from "@/lib/data/locations";

export const QUERY_SUBJECTS = [
  { value: "booking",   label: "Booking inquiry" },
  { value: "corporate", label: "Corporate accounts" },
  { value: "driver",    label: "Driver partnership" },
  { value: "support",   label: "Customer support" },
  { value: "other",     label: "Other" },
] as const;

export const ACCOUNT_TYPES = [
  { value: "passenger", label: "Passenger" },
  { value: "partner",   label: "Partner" },
  { value: "agency",    label: "Travel Agency" },
  { value: "business",  label: "Business" },
] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number]["value"];

// Subject options are scoped per account type — each team sees only the
// subjects relevant to the emails they actually handle.
export const SUBJECTS_BY_ACCOUNT_TYPE: Record<AccountType, { value: string; label: string }[]> = {
  passenger: [
    { value: "booking",  label: "Booking inquiry" },
    { value: "ride",     label: "Ride issue" },
    { value: "refund",   label: "Refund or dispute" },
    { value: "lost_item", label: "Lost item" },
    { value: "support",  label: "General support" },
    { value: "other",    label: "Other" },
  ],
  partner: [
    { value: "application", label: "Application status" },
    { value: "earnings",    label: "Payments & earnings" },
    { value: "documents",   label: "Vehicle & documents" },
    { value: "account",     label: "Account issue" },
    { value: "other",       label: "Other" },
  ],
  agency: [
    { value: "partnership", label: "New agency partnership" },
    { value: "booking",     label: "Booking on behalf of a client" },
    { value: "billing",     label: "Billing & invoicing" },
    { value: "rates",       label: "Rates & availability" },
    { value: "other",       label: "Other" },
  ],
  business: [
    { value: "new_account", label: "New business account" },
    { value: "partnership", label: "Airline / corporate partnership" },
    { value: "billing",     label: "Billing & invoicing" },
    { value: "service",     label: "Service inquiry" },
    { value: "other",       label: "Other" },
  ],
};

export const querySchema = z
  .object({
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

    phone: z.string().transform((v) => v.trim()),

    phone_country: z.string().min(1),

    account_type: z
      .string()
      .min(1, "Please select an account type"),

    subject: z
      .string()
      .min(1, "Please select a subject"),

    message: z
      .string()
      .min(10, "Message must be at least 10 characters")
      .max(2000, "Message must be under 2000 characters")
      .transform((v) => v.trim()),
  })
  .superRefine((data, ctx) => {
    if (data.phone === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Phone number is required",
      });
      return;
    }
    const country = DEFAULT_COUNTRIES.find((c) => c.code === data.phone_country);
    const digitsNeeded = (country?.phoneFormat.match(/#/g) ?? []).length;
    const digits = data.phone.replace(/\D/g, "");
    if (!country || digits.length !== digitsNeeded) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: `Enter a valid ${country?.name ?? ""} phone number`,
      });
    }
  });

export type QueryFormData = z.infer<typeof querySchema>;

export type QueryFormInput = z.input<typeof querySchema>;
