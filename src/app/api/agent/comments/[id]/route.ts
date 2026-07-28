import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { guardAgentRequest } from "@/lib/agent/auth"
import {
  commentStatusSchema,
  deleteComment,
  updateCommentStatus,
} from "@/lib/agent/comments"

const patchSchema = z.object({
  status: commentStatusSchema,
})

type CommentContext = { params: Promise<{ id: string }> }

export const PATCH = async (request: NextRequest, context: CommentContext) => {
  const blocked = guardAgentRequest(request)
  if (blocked) return blocked

  const { id } = await context.params
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 })
  }

  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", errors: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const result = await updateCommentStatus(id, parsed.data.status)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    )
  }
  return NextResponse.json({ ok: true, comment: result.comment })
}

export const DELETE = async (request: NextRequest, context: CommentContext) => {
  const blocked = guardAgentRequest(request)
  if (blocked) return blocked

  const { id } = await context.params
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 })
  }

  const result = await deleteComment(id)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    )
  }
  return NextResponse.json({ ok: true, deleted: result.deleted })
}
