import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { guardSubmissionRate } from "@/lib/rate-limit"
import { createServiceClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/supabase/env"

const contactSchema = z.object({
  fullname: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(5000),
})

type ContactPayload = z.infer<typeof contactSchema>

/** Store the submission so it is never lost, even when email delivery is off. */
const persistMessage = async (payload: ContactPayload): Promise<boolean> => {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return false
  }

  try {
    const supabase = createServiceClient()
    const { error } = await supabase.from("contact_messages").insert({
      fullname: payload.fullname,
      email: payload.email,
      message: payload.message,
      status: "unread",
    })

    if (error) {
      console.error("[contact] persist failed", error.code)
      return false
    }

    return true
  } catch {
    console.error("[contact] persistence unavailable")
    return false
  }
}

/** Attempt to forward the submission by email via Resend, if configured. */
const sendEmail = async (payload: ContactPayload): Promise<boolean> => {
  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) return false

  const toEmail = process.env.CONTACT_TO_EMAIL ?? "siyamuddin177@gmail.com"

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [toEmail],
        reply_to: payload.email,
        subject: `Portfolio message from ${payload.fullname}`,
        text: `From: ${payload.fullname} <${payload.email}>\n\n${payload.message}`,
      }),
    })

    if (!response.ok) {
      console.error("[contact] email rejected", response.status)
      return false
    }

    return true
  } catch {
    console.error("[contact] email unavailable")
    return false
  }
}

export const POST = async (request: NextRequest) => {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed.", errors: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const payload = parsed.data
  const canPersist =
    isSupabaseConfigured() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  const canEmail = Boolean(process.env.RESEND_API_KEY)

  if (!canPersist && !canEmail) {
    return NextResponse.json({
      message:
        "Messages are unavailable right now. Please use the email link.",
    }, { status: 503 })
  }

  const blocked = await guardSubmissionRate(request, "contact")
  if (blocked) return blocked

  const [stored, emailed] = await Promise.all([
    persistMessage(payload),
    sendEmail(payload),
  ])

  if (stored || emailed) {
    return NextResponse.json({ message: "Message sent successfully." })
  }

  return NextResponse.json(
    { message: "Failed to send message. Please try again later." },
    { status: 502 }
  )
}
