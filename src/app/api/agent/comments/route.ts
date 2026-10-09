import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { guardAgentRequest } from "@/lib/agent/auth"
import { commentStatusSchema, listComments } from "@/lib/agent/comments"
import {
  agentDbUnavailable,
  agentFailure,
  agentValidationError,
  assertAgentDbReady,
} from "@/lib/agent/common"

export const GET = async (request: NextRequest) => {
  const blocked = await guardAgentRequest(request)
  if (blocked) return blocked
  if (!assertAgentDbReady()) return agentDbUnavailable()

  const status = request.nextUrl.searchParams.get("status")
  if (status !== null) {
    const parsed = commentStatusSchema.safeParse(status)
    if (!parsed.success) return agentValidationError(parsed.error)
  }

  const result = await listComments(status ?? undefined)
  if (!result.ok) return agentFailure(result)
  return NextResponse.json({ ok: true, comments: result.comments })
}
