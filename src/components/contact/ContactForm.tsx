"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Loader2 } from "lucide-react";
import {
  contactSchema,
  type ContactFormValues,
} from "@/lib/contact/validation";

export const ContactForm = () => {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { fullname: "", email: "", message: "" },
  });
  const onSubmit = async (values: ContactFormValues) => {
    setStatus("idle");
    setServerMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setStatus("error");
        setServerMessage(
          data.message ||
            "Your message could not be sent. Try again or use the email link.",
        );
        return;
      }
      setStatus("success");
      setServerMessage("Thank you. Your message has been received.");
      reset();
    } catch {
      setStatus("error");
      setServerMessage(
        "Connection interrupted. Your message is still here. Try again or use the email link.",
      );
    }
  };
  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Contact form"
      aria-busy={isSubmitting}
    >
      <div className="field-row">
        <div className="field">
          <label htmlFor="fullname">Your name</label>
          <input
            id="fullname"
            autoComplete="name"
            required
            maxLength={100}
            aria-invalid={Boolean(errors.fullname)}
            aria-describedby={errors.fullname ? "fullname-error" : undefined}
            {...register("fullname")}
          />
          {errors.fullname && (
            <p className="field-error" id="fullname-error">
              {errors.fullname.message}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p className="field-error" id="email-error">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">About your project</label>
        <p className="field-help" id="message-help">
          Your goal, timeline, and budget (if you have one).
        </p>
        <textarea
          id="message"
          rows={7}
          required
          maxLength={5000}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={`message-help${errors.message ? " message-error" : ""}`}
          {...register("message")}
        />
        {errors.message && (
          <p className="field-error" id="message-error">
            {errors.message.message}
          </p>
        )}
      </div>
      <button
        className="site-button primary"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            Sending…{" "}
            <Loader2 className="animate-spin" size={18} aria-hidden="true" />
          </>
        ) : (
          <>
            Send message <ArrowUpRight size={18} aria-hidden="true" />
          </>
        )}
      </button>
      <div role="status" aria-live="polite" aria-atomic="true">
        {status !== "idle" && (
          <p className={status === "success" ? "form-success" : "form-error"}>
            {serverMessage}
          </p>
        )}
      </div>
    </form>
  );
};
