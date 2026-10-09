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
import {
  deleteEventBySlug,
  getEventBySlug,
  updateEventBySlug,
  updateEventSchema,
} from "@/lib/agent/events"

type RouteContext = {
  params: Promise<{ slug: string }>
}

const readSlug = async (context: RouteContext) => {
  const { slug } = await context.params
  try {
    return decodeURIComponent(slug)
  } catch {
    return null
  }
}

export const GET = async (request: NextRequest, context: RouteContext) => {
  const blocked = await guardAgentRequest(request)
  if (blocked) return blocked
  if (!assertAgentDbReady()) return agentDbUnavailable()

  const slug = await readSlug(context)
  if (!slug) {
    return NextResponse.json({ ok: false, error: "Invalid slug." }, { status: 400 })
  }

  const result = await getEventBySlug(slug)
  if (!result.ok) return agentFailure(result)

  return NextResponse.json({ ok: true, event: result.event })
}

export const PUT = async (request: NextRequest, context: RouteContext) => {
  const blocked = await guardAgentRequest(request)
  if (blocked) return blocked
  if (!assertAgentDbReady()) return agentDbUnavailable()

  const json = await readJsonBody(request)
  if (!json.ok) return json.response

  const parsed = updateEventSchema.safeParse(json.body)
  if (!parsed.success) return agentValidationError(parsed.error)

  const slug = await readSlug(context)
  if (!slug) {
    return NextResponse.json({ ok: false, error: "Invalid slug." }, { status: 400 })
  }

  const result = await updateEventBySlug(slug, parsed.data)
  if (!result.ok) return agentFailure(result)

  return NextResponse.json({ ok: true, event: result.event })
}

export const DELETE = async (request: NextRequest, context: RouteContext) => {
  const blocked = await guardAgentRequest(request)
  if (blocked) return blocked
  if (!assertAgentDbReady()) return agentDbUnavailable()

  const slug = await readSlug(context)
  if (!slug) {
    return NextResponse.json({ ok: false, error: "Invalid slug." }, { status: 400 })
  }

  const result = await deleteEventBySlug(slug)
  if (!result.ok) return agentFailure(result)

  return NextResponse.json({ ok: true, deleted: result.deleted })
}
