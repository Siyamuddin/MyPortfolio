import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { guardAgentRequest } from "@/lib/agent/auth"
import {
  assertAgentDbReady,
  deleteBlogPostBySlug,
  getBlogPostBySlugAdmin,
  updateBlogPostBySlug,
  updateBlogSchema,
} from "@/lib/agent/blog"

type RouteContext = {
  params: Promise<{ slug: string }>
}

export const GET = async (request: NextRequest, context: RouteContext) => {
  const blocked = guardAgentRequest(request)
  if (blocked) return blocked

  if (!assertAgentDbReady()) {
    return NextResponse.json(
      { ok: false, error: "Supabase is not configured." },
      { status: 503 }
    )
  }

  const { slug } = await context.params
  const result = await getBlogPostBySlugAdmin(slug)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    )
  }

  return NextResponse.json({ ok: true, post: result.post })
}

export const PUT = async (request: NextRequest, context: RouteContext) => {
  const blocked = guardAgentRequest(request)
  if (blocked) return blocked

  if (!assertAgentDbReady()) {
    return NextResponse.json(
      { ok: false, error: "Supabase is not configured." },
      { status: 503 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    )
  }

  const parsed = updateBlogSchema.safeParse(body)
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

  const { slug } = await context.params
  const result = await updateBlogPostBySlug(slug, parsed.data)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    )
  }

  return NextResponse.json({ ok: true, post: result.post })
}

export const DELETE = async (request: NextRequest, context: RouteContext) => {
  const blocked = guardAgentRequest(request)
  if (blocked) return blocked

  if (!assertAgentDbReady()) {
    return NextResponse.json(
      { ok: false, error: "Supabase is not configured." },
      { status: 503 }
    )
  }

  const { slug } = await context.params
  const result = await deleteBlogPostBySlug(slug)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    )
  }

  return NextResponse.json({ ok: true, deleted: result.deleted })
}
