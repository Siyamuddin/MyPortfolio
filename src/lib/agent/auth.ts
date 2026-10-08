import { timingSafeEqual } from "crypto"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { guardSubmissionRate } from "@/lib/rate-limit"

const unauthorized = () =>
  NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

const serviceUnavailable = () =>
  NextResponse.json(
    { ok: false, error: "Agent API is not configured." },
    { status: 503 }
  )

const temporarilyUnavailable = () =>
  NextResponse.json(
    { ok: false, error: "Agent API is temporarily unavailable." },
    { status: 503 }
  )

/**
 * Validates Authorization: Bearer <BLOG_API_KEY> with timing-safe compare.
 * Does not log the Authorization header or key.
 */
export const requireBlogApiKey = (request: NextRequest): NextResponse | null => {
  const expected = process.env.BLOG_API_KEY
  if (!expected) return serviceUnavailable()

  const header = request.headers.get("authorization") ?? ""
  const match = /^Bearer\s+(.+)$/i.exec(header)
  if (!match) return unauthorized()

  const provided = match[1].trim()
  const expectedBuf = Buffer.from(expected)
  const providedBuf = Buffer.from(provided)

  if (expectedBuf.length !== providedBuf.length) return unauthorized()
  if (!timingSafeEqual(expectedBuf, providedBuf)) return unauthorized()

  return null
}

/** Bearer auth, then the shared Postgres submission limit keyed as `agent`. */
export const guardAgentRequest = async (request: NextRequest): Promise<NextResponse | null> => {
  const authError = requireBlogApiKey(request)
  if (authError) return authError

  const blocked = await guardSubmissionRate(request, "agent")
  if (!blocked) return null
  if (blocked.status === 429) {
    const retryAfter = blocked.headers.get("Retry-After") ?? "60"
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": retryAfter } }
    )
  }

  return temporarilyUnavailable()
}
