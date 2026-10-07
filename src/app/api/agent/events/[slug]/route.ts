import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { guardAgentRequest } from "@/lib/agent/auth"
import {
  assertAgentDbReady,
  deleteEventBySlug,
  getEventBySlug,
  updateEventBySlug,
  updateEventSchema,
} from "@/lib/agent/events"

type RouteContext = {
  params: Promise<{ slug: string }>
}

const dbUnavailable = () =>
  NextResponse.json(
    { ok: false, error: "Supabase is not configured." },
    { status: 503 }
  )

const readSlug = async (context: RouteContext) => {
  const { slug } = await context.params
  try {
    return decodeURIComponent(slug)
  } catch {
    return null
  }
}

export const GET = async (request: NextRequest, context: RouteContext) => {
  const blocked = guardAgentRequest(request)
  if (blocked) return blocked

  if (!assertAgentDbReady()) return dbUnavailable()

  const slug = await readSlug(context)
  if (!slug) {
    return NextResponse.json({ ok: false, error: "Invalid slug." }, { status: 400 })
  }

  const result = await getEventBySlug(slug)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    )
  }

  return NextResponse.json({ ok: true, event: result.event })
}

export const PUT = async (request: NextRequest, context: RouteContext) => {
  const blocked = guardAgentRequest(request)
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

  const parsed = updateEventSchema.safeParse(body)
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

  const slug = await readSlug(context)
  if (!slug) {
    return NextResponse.json({ ok: false, error: "Invalid slug." }, { status: 400 })
  }

  const result = await updateEventBySlug(slug, parsed.data)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    )
  }

  return NextResponse.json({ ok: true, event: result.event })
}

export const DELETE = async (request: NextRequest, context: RouteContext) => {
  const blocked = guardAgentRequest(request)
  if (blocked) return blocked

  if (!assertAgentDbReady()) return dbUnavailable()

  const slug = await readSlug(context)
  if (!slug) {
    return NextResponse.json({ ok: false, error: "Invalid slug." }, { status: 400 })
  }

  const result = await deleteEventBySlug(slug)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    )
  }

  return NextResponse.json({ ok: true, deleted: result.deleted })
}
