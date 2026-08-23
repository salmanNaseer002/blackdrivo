"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { querySchema, type QueryFormData, type QueryFormInput, type AccountType } from "@/validations/query";
import { DEFAULT_COUNTRIES } from "@/lib/data/locations";

const buildDefaultValues = (accountType: AccountType): QueryFormInput => ({
  full_name: "",
  email: "",
  phone: "",
  phone_country: "US",
  account_type: accountType,
  subject: "",
  message: "",
});

export function useQueryForm(accountType: AccountType = "passenger") {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<QueryFormInput, unknown, QueryFormData>({
    resolver: zodResolver(querySchema),
    defaultValues: buildDefaultValues(accountType),
    mode: "onBlur",
  });

  const onSubmit = async (data: QueryFormData) => {
    const supabase = createClient();

    const phoneCode = DEFAULT_COUNTRIES.find((c) => c.code === data.phone_country)?.phoneCode ?? "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("queries") as any).insert({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone ? `${phoneCode} ${data.phone}` : null,
      account_type: data.account_type,
      subject: data.subject,
      message: data.message,
    });

    if (error) {
      console.error("Query submission error:", error);
      toast.error("Failed to send message. Please try again.");
      throw error;
    }

    toast.success("Message sent! We'll respond within 2 hours.");
    form.reset(buildDefaultValues(accountType));
    setSubmitted(true);
  };

  const resetForm = () => {
    form.reset(buildDefaultValues(accountType));
    setSubmitted(false);
  };

  return {
    form,
    submitted,
    resetForm,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
}
