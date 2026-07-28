import { timingSafeEqual } from "crypto"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export const getClientIp = (request: NextRequest) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  request.headers.get("x-real-ip") ??
  "unknown"

export const isAgentRateLimited = (ip: string) => {
  const now = Date.now()
  const windowMs = 60_000
  const maxRequests = 30
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return false
  }

  entry.count += 1
  return entry.count > maxRequests
}

const unauthorized = () =>
  NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

const serviceUnavailable = () =>
  NextResponse.json(
    { ok: false, error: "Agent API is not configured." },
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

export const guardAgentRequest = (request: NextRequest): NextResponse | null => {
  const authError = requireBlogApiKey(request)
  if (authError) return authError

  if (isAgentRateLimited(getClientIp(request))) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }

  return null
}
