"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { querySchema, type QueryFormData, type QueryFormInput } from "@/validations/query";

const DEFAULT_VALUES: QueryFormInput = {
  full_name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export function useQueryForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<QueryFormInput, unknown, QueryFormData>({
    resolver: zodResolver(querySchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  const onSubmit = async (data: QueryFormData) => {
    const supabase = createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("queries") as any).insert({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
    });

    if (error) {
      console.error("Query submission error:", error);
      toast.error("Failed to send message. Please try again.");
      throw error;
    }

    toast.success("Message sent! We'll respond within 2 hours.");
    form.reset(DEFAULT_VALUES);
    setSubmitted(true);
  };

  const resetForm = () => {
    form.reset(DEFAULT_VALUES);
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
