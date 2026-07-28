import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { guardAgentRequest } from "@/lib/agent/auth"
import { listComments } from "@/lib/agent/comments"

export const GET = async (request: NextRequest) => {
  const blocked = guardAgentRequest(request)
  if (blocked) return blocked

  const status = request.nextUrl.searchParams.get("status") ?? undefined
  const result = await listComments(status)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    )
  }
  return NextResponse.json({ ok: true, comments: result.comments })
}
