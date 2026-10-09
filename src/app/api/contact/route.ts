import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { getMailConfig, sendEmail } from "@/lib/email"
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
  // Recipient and verified from address are both required. No mailbox fallback.
  const canEmail = Boolean(getMailConfig())

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
    sendEmail({
      replyTo: payload.email,
      subject: `Portfolio message from ${payload.fullname}`,
      text: `From: ${payload.fullname} <${payload.email}>\n\n${payload.message}`,
    }),
  ])

  if (stored || emailed) {
    return NextResponse.json({ message: "Message sent successfully." })
  }

  return NextResponse.json(
    { message: "Failed to send message. Please try again later." },
    { status: 502 }
  )
}
