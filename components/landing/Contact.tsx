"use client";

import React, { useRef, useEffect, forwardRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { usePathname } from "next/navigation";

if (
  typeof window !== "undefined" &&
  !(gsap.core as any).globals().ScrollTrigger
) {
  gsap.registerPlugin(ScrollTrigger);
}

type FormState = {
  name: string;
  phone: string;
  email: string;
  practice: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  practice: "",
  message: "",
};

const Contact = forwardRef<HTMLElement>((props, ref) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  const setRefs = (element: HTMLElement | null) => {
    sectionRef.current = element;
    if (typeof ref === "function") ref(element);
    else if (ref)
      (ref as React.MutableRefObject<HTMLElement | null>).current = element;
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const contactItems = sectionRef.current.querySelectorAll(".contact-item");

    gsap.fromTo(
      contactItems,
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [pathname]);

  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const validate = (): string | null => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.phone.trim()) return "Phone is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!isValidEmail(form.email)) return "Enter a valid email address.";
    if (!form.message.trim()) return "Message cannot be empty.";
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const validationError = validate();
    if (validationError) return setErrorMessage(validationError);

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/createContact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Server error");

      setSuccessMessage(data?.message || "Message sent successfully.");
      setForm(initialState);
    } catch (err: any) {
      setErrorMessage(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={setRefs}
      id="contact"
      className="w-full py-16 md:py-24 bg-[#e5f4eb]"
    >
      <div className="w-full px-6 md:px-12 lg:px-24">
        <div className="grid gap-8 lg:grid-cols-2 items-start">
          <div className="space-y-6">
            <div className="inline-block rounded-lg bg-[#5ebc66]/20 px-3 py-1 text-sm font-semibold text-[#172737] contact-item">
              Contact Us
            </div>
            <h2 className="text-4xl font-bold text-[#172737] contact-item">
              Let’s Connect & Transform Your Practice
            </h2>
            <p className="text-base text-[#5a5a5a] contact-item">
              Our specialists are ready to discuss how we can streamline your
              medical billing, reduce denials, and maximize your practice’s
              revenue cycle efficiency.
            </p>

            <div className="space-y-3 mt-4">
              <div className="flex items-center contact-item">
                <div className="h-10 w-10 rounded-full bg-[#5ebc66]/10 flex items-center justify-center mr-3">
                  <FaMapMarkerAlt className="text-[#5ebc66] text-lg" />
                </div>
                <p className="text-base text-[#172737]">
                  123 Tech Street, Silicon Valley, CA 94043
                </p>
              </div>
              <div className="flex items-center contact-item">
                <div className="h-10 w-10 rounded-full bg-[#5ebc66]/10 flex items-center justify-center mr-3">
                  <FaPhone className="text-[#5ebc66] text-lg" />
                </div>
                <p className="text-base text-[#172737]">484-806-0794</p>
              </div>
              <div className="flex items-center contact-item">
                <div className="h-10 w-10 rounded-full bg-[#5ebc66]/10 flex items-center justify-center mr-3">
                  <FaEnvelope className="text-[#5ebc66] text-lg" />
                </div>
                <p className="text-base text-[#172737]">info@demeta.com</p>
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="rounded-lg border bg-white p-6 shadow-md contact-item">
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-[#172737]"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John"
                    value={form.name}
                    onChange={handleChange}
                    className="border-[#c5ddca] focus-visible:ring-[#5ebc66] mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-[#172737]"
                  >
                    Phone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="1-123-678-0987"
                    value={form.phone}
                    onChange={handleChange}
                    className="border-[#c5ddca] focus-visible:ring-[#5ebc66] mt-1"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-[#172737]"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  placeholder="john.doe@example.com"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="border-[#c5ddca] focus-visible:ring-[#5ebc66] mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="practice"
                  className="text-sm font-medium text-[#172737]"
                >
                  Practice
                </label>
                <Input
                  id="practice"
                  name="practice"
                  placeholder="Your Practice"
                  value={form.practice}
                  onChange={handleChange}
                  className="border-[#c5ddca] focus-visible:ring-[#5ebc66] mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-[#172737]"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={handleChange}
                  className="min-h-[120px] border-[#c5ddca] focus-visible:ring-[#5ebc66] mt-1"
                />
              </div>

              {errorMessage && (
                <div className="rounded-md bg-red-50 text-red-700 px-3 py-2 text-sm">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="rounded-md bg-green-50 text-green-700 px-3 py-2 text-sm">
                  {successMessage}
                </div>
              )}

              <Button
                size="lg"
                type="submit"
                disabled={loading}
                className={`w-full bg-[#5ebc66] hover:bg-[#4dab58] text-white mt-2 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
});

Contact.displayName = "Contact";
export default Contact;
