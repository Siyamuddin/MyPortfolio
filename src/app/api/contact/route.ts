import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"

const contactSchema = z.object({
  fullname: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(5000),
})

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const getClientIp = (request: NextRequest) => {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  )
}

const isRateLimited = (ip: string) => {
  const now = Date.now()
  const windowMs = 60_000
  const maxRequests = 5
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return false
  }

  entry.count += 1
  return entry.count > maxRequests
}

export const POST = async (request: NextRequest) => {
  const ip = getClientIp(request)

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }

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

  const { fullname, email, message } = parsed.data
  const resendApiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "siyamuddin177@gmail.com"

  if (!resendApiKey) {
    console.info("[contact]", { fullname, email, message })
    return NextResponse.json({
      message:
        "Message received. Email delivery is not configured yet — I'll follow up soon.",
    })
  }

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
        reply_to: email,
        subject: `Portfolio message from ${fullname}`,
        text: `From: ${fullname} <${email}>\n\n${message}`,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[contact] Resend error:", errorText)
      return NextResponse.json(
        { message: "Failed to send message. Please try again later." },
        { status: 502 }
      )
    }

    return NextResponse.json({ message: "Message sent successfully." })
  } catch (error) {
    console.error("[contact] Unexpected error:", error)
    return NextResponse.json(
      { message: "Failed to send message. Please try again later." },
      { status: 500 }
    )
  }
}
