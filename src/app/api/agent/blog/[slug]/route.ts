import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { guardAgentRequest } from "@/lib/agent/auth"
import {
  deleteBlogPostBySlug,
  getBlogPostBySlugAdmin,
  updateBlogPostBySlug,
  updateBlogSchema,
} from "@/lib/agent/blog"
import {
  agentDbUnavailable,
  agentFailure,
  agentValidationError,
  assertAgentDbReady,
  readJsonBody,
} from "@/lib/agent/common"

type RouteContext = {
  params: Promise<{ slug: string }>
}

export const GET = async (request: NextRequest, context: RouteContext) => {
  const blocked = await guardAgentRequest(request)
  if (blocked) return blocked
  if (!assertAgentDbReady()) return agentDbUnavailable()

  const { slug } = await context.params
  const result = await getBlogPostBySlugAdmin(slug)
  if (!result.ok) return agentFailure(result)

  return NextResponse.json({ ok: true, post: result.post })
}

export const PUT = async (request: NextRequest, context: RouteContext) => {
  const blocked = await guardAgentRequest(request)
  if (blocked) return blocked
  if (!assertAgentDbReady()) return agentDbUnavailable()

  const json = await readJsonBody(request)
  if (!json.ok) return json.response

  const parsed = updateBlogSchema.safeParse(json.body)
  if (!parsed.success) return agentValidationError(parsed.error)

  const { slug } = await context.params
  const result = await updateBlogPostBySlug(slug, parsed.data)
  if (!result.ok) return agentFailure(result)

  return NextResponse.json({ ok: true, post: result.post })
}

export const DELETE = async (request: NextRequest, context: RouteContext) => {
  const blocked = await guardAgentRequest(request)
  if (blocked) return blocked
  if (!assertAgentDbReady()) return agentDbUnavailable()

  const { slug } = await context.params
  const result = await deleteBlogPostBySlug(slug)
  if (!result.ok) return agentFailure(result)

  return NextResponse.json({ ok: true, deleted: result.deleted })
}
