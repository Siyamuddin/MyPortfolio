import { createHmac } from "node:crypto"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServiceClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/supabase/env"

const localWindows = new Map<string, { count: number; resetAt: number }>()
const WINDOW_SECONDS = 60
const MAX_REQUESTS = 5

export const guardSubmissionRate = async (request: NextRequest, scope: "contact" | "comments") => {
  // Vercel replaces this header at its proxy. Other hosts must supply a trusted
  // forwarding header or all callers share the conservative unknown bucket.
  const ip = (process.env.VERCEL ? request.headers.get("x-vercel-forwarded-for") :
    request.headers.get("x-forwarded-for"))?.split(",")[0]?.trim() || "unknown"
  const secret = process.env.RATE_LIMIT_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || "local-only"
  const key = createHmac("sha256", secret).update(`${scope}:${ip}`).digest("hex")

  let allowed: boolean
  if (isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { data, error } = await createServiceClient().rpc("consume_submission_limit", {
        key_hash: key, window_seconds: WINDOW_SECONDS, max_requests: MAX_REQUESTS,
      })
      if (error || typeof data !== "boolean") throw new Error("Rate limiter unavailable")
      allowed = data
    } catch {
      return NextResponse.json({ message: "Submissions are temporarily unavailable. Please try again." }, { status: 503 })
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "Submissions are temporarily unavailable. Please use the email link." }, { status: 503 })
  } else {
    const now = Date.now()
    for (const [id, entry] of localWindows) if (entry.resetAt <= now) localWindows.delete(id)
    const entry = localWindows.get(key) ?? { count: 0, resetAt: now + WINDOW_SECONDS * 1000 }
    if (!localWindows.has(key) && localWindows.size >= 1000) {
      return NextResponse.json({ message: "Please try again shortly." }, { status: 429, headers: { "Retry-After": "60" } })
    }
    entry.count += 1
    localWindows.set(key, entry)
    allowed = entry.count <= MAX_REQUESTS
  }

  return allowed ? null : NextResponse.json(
    { message: "Too many requests. Please try again in a minute." },
    { status: 429, headers: { "Retry-After": String(WINDOW_SECONDS) } }
  )
}
