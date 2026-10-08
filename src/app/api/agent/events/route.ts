import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { guardAgentRequest } from "@/lib/agent/auth"
import {
  assertAgentDbReady,
  createEvent,
  createEventSchema,
  listEvents,
} from "@/lib/agent/events"

const dbUnavailable = () =>
  NextResponse.json(
    { ok: false, error: "Supabase is not configured." },
    { status: 503 }
  )

export const GET = async (request: NextRequest) => {
  const blocked = await guardAgentRequest(request)
  if (blocked) return blocked

  if (!assertAgentDbReady()) return dbUnavailable()

  const result = await listEvents()
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    )
  }

  return NextResponse.json({ ok: true, events: result.events })
}

export const POST = async (request: NextRequest) => {
  const blocked = await guardAgentRequest(request)
  if (blocked) return blocked

  if (!assertAgentDbReady()) return dbUnavailable()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    )
  }

  const parsed = createEventSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed.",
        errors: parsed.error.flatten(),
      },
      { status: 400 }
    )
  }

  const result = await createEvent(parsed.data)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    )
  }

  return NextResponse.json({ ok: true, event: result.event }, { status: 201 })
}
