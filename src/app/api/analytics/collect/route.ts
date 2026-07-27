import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import {
  hashVisitor,
  isLikelyBot,
  isTrackablePath,
} from "@/lib/analytics/hash"
import { createServiceClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/supabase/env"

const collectSchema = z.object({
  path: z.string().min(1).max(500),
})

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const getClientIp = (request: NextRequest) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  request.headers.get("x-real-ip") ??
  "unknown"

const isRateLimited = (ip: string) => {
  const now = Date.now()
  const windowMs = 60_000
  const maxRequests = 60
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return false
  }

  entry.count += 1
  return entry.count > maxRequests
}

export const POST = async (request: NextRequest) => {
  try {
    if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return new NextResponse(null, { status: 204 })
    }

    const ip = getClientIp(request)
    if (isRateLimited(ip)) {
      return new NextResponse(null, { status: 204 })
    }

    const userAgent = request.headers.get("user-agent") ?? ""
    if (isLikelyBot(userAgent)) {
      return new NextResponse(null, { status: 204 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return new NextResponse(null, { status: 204 })
    }

    const parsed = collectSchema.safeParse(body)
    if (!parsed.success) {
      return new NextResponse(null, { status: 204 })
    }

    const path = parsed.data.path.split("?")[0] ?? parsed.data.path
    if (!isTrackablePath(path)) {
      return new NextResponse(null, { status: 204 })
    }

    const visitorHash = hashVisitor(ip, userAgent)
    const admin = createServiceClient()
    const { error } = await admin.from("analytics_events").insert({
      path,
      visitor_hash: visitorHash,
    })

    if (error) {
      console.error("[analytics] insert failed", error.message)
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[analytics] collect error", error)
    return new NextResponse(null, { status: 204 })
  }
}
