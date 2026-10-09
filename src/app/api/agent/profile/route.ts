import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { guardAgentRequest } from "@/lib/agent/auth"
import { agentFailure, agentValidationError, readJsonBody } from "@/lib/agent/common"
import { getProfile, profileUpdateSchema, upsertProfile } from "@/lib/agent/profile"

export const GET = async (request: NextRequest) => {
  const blocked = await guardAgentRequest(request)
  if (blocked) return blocked

  const result = await getProfile()
  if (!result.ok) return agentFailure(result)
  return NextResponse.json({ ok: true, profile: result.profile })
}

export const PUT = async (request: NextRequest) => {
  const blocked = await guardAgentRequest(request)
  if (blocked) return blocked

  const json = await readJsonBody(request)
  if (!json.ok) return json.response

  const parsed = profileUpdateSchema.safeParse(json.body)
  if (!parsed.success) return agentValidationError(parsed.error)

  const result = await upsertProfile(parsed.data)
  if (!result.ok) return agentFailure(result)
  return NextResponse.json({ ok: true, profile: result.profile })
}
