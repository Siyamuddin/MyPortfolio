import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import {
  hashVisitor,
  isLikelyBot,
  isTrackablePath,
} from "@/lib/analytics/hash"
import { guardSubmissionRate, trustedClientIp } from "@/lib/rate-limit"
import { createServiceClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/supabase/env"

const collectSchema = z.object({
  path: z.string().min(1).max(500),
})

export const POST = async (request: NextRequest) => {
  try {
    if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
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

    const blocked = await guardSubmissionRate(request, "analytics")
    if (blocked) return new NextResponse(null, { status: 204 })

    const visitorHash = hashVisitor(trustedClientIp(request), userAgent)
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
