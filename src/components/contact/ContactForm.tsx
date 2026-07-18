"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Send } from "lucide-react"
import { z } from "zod"
import { cn } from "@/lib/cn"

const contactSchema = z.object({
  fullname: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactSchema>

export const ContactForm = () => {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [serverMessage, setServerMessage] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullname: "",
      email: "",
      message: "",
    },
  })

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("idle")
    setServerMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = (await response.json()) as { message?: string }

      if (!response.ok) {
        setStatus("error")
        setServerMessage(data.message ?? "Something went wrong. Try again.")
        return
      }

      setStatus("success")
      setServerMessage(data.message ?? "Message sent successfully.")
      reset()
    } catch {
      setStatus("error")
      setServerMessage("Network error. Please try again.")
    }
  }

  return (
    <form
      className="mb-2.5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Contact form"
    >
      <div className="mb-6 grid grid-cols-1 gap-6 min-[580px]:mb-8 min-[580px]:grid-cols-2 min-[580px]:gap-[30px]">
        <div>
          <label htmlFor="fullname" className="sr-only">
            Full name
          </label>
          <input
            id="fullname"
            type="text"
            placeholder="Full name"
            autoComplete="name"
            className={cn(
              "w-full rounded-[14px] border border-jet bg-transparent px-5 py-3 text-sm font-normal text-white-2 placeholder:font-medium placeholder:text-light-gray-70 focus:border-gold focus:outline-none min-[580px]:px-5 min-[580px]:py-4",
              errors.fullname && "border-red-400"
            )}
            aria-invalid={Boolean(errors.fullname)}
            aria-describedby={errors.fullname ? "fullname-error" : undefined}
            {...register("fullname")}
          />
          {errors.fullname ? (
            <p id="fullname-error" className="mt-2 text-xs text-red-400">
              {errors.fullname.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            className={cn(
              "w-full rounded-[14px] border border-jet bg-transparent px-5 py-3 text-sm font-normal text-white-2 placeholder:font-medium placeholder:text-light-gray-70 focus:border-gold focus:outline-none min-[580px]:px-5 min-[580px]:py-4",
              errors.email && "border-red-400"
            )}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p id="email-error" className="mt-2 text-xs text-red-400">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mb-6 min-[580px]:mb-8">
        <label htmlFor="message" className="sr-only">
          Your message
        </label>
        <textarea
          id="message"
          placeholder="Your message"
          rows={5}
          className={cn(
            "min-h-[100px] max-h-[200px] w-full resize-y rounded-[14px] border border-jet bg-transparent px-5 py-3 text-sm font-normal text-white-2 placeholder:font-medium placeholder:text-light-gray-70 focus:border-gold focus:outline-none min-[580px]:px-5 min-[580px]:py-4",
            errors.message && "border-red-400"
          )}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
        {errors.message ? (
          <p id="message-error" className="mt-2 text-xs text-red-400">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="relative z-[1] flex w-full items-center justify-center gap-2.5 rounded-[14px] bg-gradient-to-br from-[#38383d] to-transparent px-5 py-3 text-sm capitalize text-gold shadow-[var(--shadow-3)] transition-colors before:absolute before:inset-px before:-z-[1] before:rounded-[inherit] before:bg-[linear-gradient(to_bottom_right,hsla(240,1%,18%,0.251),hsla(240,2%,11%,0)),#222226] before:transition-colors hover:bg-gradient-to-br hover:from-[#ffdb70] hover:to-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-60 min-[768px]:ml-auto min-[768px]:w-max min-[768px]:px-5 min-[768px]:py-4"
        aria-label="Send message"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-4 w-4" aria-hidden="true" />
        )}
        <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
      </button>

      {status !== "idle" ? (
        <p
          className={cn(
            "mt-4 text-sm",
            status === "success" ? "text-gold" : "text-red-400"
          )}
          role="status"
          aria-live="polite"
        >
          {serverMessage}
        </p>
      ) : null}
    </form>
  )
}
