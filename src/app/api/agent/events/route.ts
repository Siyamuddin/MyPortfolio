import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { guardAgentRequest } from "@/lib/agent/auth"
import {
  agentDbUnavailable,
  agentFailure,
  agentValidationError,
  assertAgentDbReady,
  readJsonBody,
} from "@/lib/agent/common"
import { createEvent, createEventSchema, listEvents } from "@/lib/agent/events"

export const GET = async (request: NextRequest) => {
  const blocked = await guardAgentRequest(request)
  if (blocked) return blocked
  if (!assertAgentDbReady()) return agentDbUnavailable()

  const result = await listEvents()
  if (!result.ok) return agentFailure(result)

  return NextResponse.json({ ok: true, events: result.events })
}

export const POST = async (request: NextRequest) => {
  const blocked = await guardAgentRequest(request)
  if (blocked) return blocked
  if (!assertAgentDbReady()) return agentDbUnavailable()

  const json = await readJsonBody(request)
  if (!json.ok) return json.response

  const parsed = createEventSchema.safeParse(json.body)
  if (!parsed.success) return agentValidationError(parsed.error)

  const result = await createEvent(parsed.data)
  if (!result.ok) return agentFailure(result)

  return NextResponse.json({ ok: true, event: result.event }, { status: 201 })
}
