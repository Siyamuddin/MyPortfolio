import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { guardAgentRequest } from "@/lib/agent/auth"
import { createBlogPost, createBlogSchema } from "@/lib/agent/blog"
import {
  agentDbUnavailable,
  agentFailure,
  agentValidationError,
  assertAgentDbReady,
  readJsonBody,
} from "@/lib/agent/common"

export const POST = async (request: NextRequest) => {
  const blocked = await guardAgentRequest(request)
  if (blocked) return blocked
  if (!assertAgentDbReady()) return agentDbUnavailable()

  const json = await readJsonBody(request)
  if (!json.ok) return json.response

  const parsed = createBlogSchema.safeParse(json.body)
  if (!parsed.success) return agentValidationError(parsed.error)

  const result = await createBlogPost(parsed.data)
  if (!result.ok) return agentFailure(result)

  return NextResponse.json({ ok: true, post: result.post }, { status: 201 })
}
