import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { guardAgentRequest } from "@/lib/agent/auth"
import { getProfile, profileUpdateSchema, upsertProfile } from "@/lib/agent/profile"

export const GET = async (request: NextRequest) => {
  const blocked = guardAgentRequest(request)
  if (blocked) return blocked

  const result = await getProfile()
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    )
  }
  return NextResponse.json({ ok: true, profile: result.profile })
}

export const PUT = async (request: NextRequest) => {
  const blocked = guardAgentRequest(request)
  if (blocked) return blocked

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 })
  }

  const parsed = profileUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", errors: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const result = await upsertProfile(parsed.data)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    )
  }
  return NextResponse.json({ ok: true, profile: result.profile })
}
