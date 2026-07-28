import { z } from "zod"
import {
  assertAgentDbReady,
  revalidateAfterMutation,
  type AgentFail,
} from "@/lib/agent/common"
import { createServiceClient } from "@/lib/supabase/admin"

export const commentStatusSchema = z.enum(["pending", "approved", "rejected"])

export const listComments = async (status?: string) => {
  if (!assertAgentDbReady()) {
    return { ok: false as const, error: "Supabase is not configured.", status: 503 }
  }
  const admin = createServiceClient()
  let query = admin
    .from("blog_comments")
    .select("*, blog_posts(title, slug)")
    .order("created_at", { ascending: false })

  if (status && commentStatusSchema.safeParse(status).success) {
    query = query.eq("status", status)
  }

  const { data, error } = await query
  if (error) return { ok: false as const, error: error.message, status: 500 }
  return { ok: true as const, comments: data ?? [] }
}

export const updateCommentStatus = async (
  id: string,
  status: z.infer<typeof commentStatusSchema>
): Promise<{ ok: true; comment: Record<string, unknown> } | AgentFail> => {
  if (!assertAgentDbReady()) {
    return { ok: false, error: "Supabase is not configured.", status: 503 }
  }
  const admin = createServiceClient()
  const { data, error } = await admin
    .from("blog_comments")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle()

  if (error) return { ok: false, error: error.message, status: 500 }
  if (!data) return { ok: false, error: "Not found", status: 404 }
  await revalidateAfterMutation()
  return { ok: true, comment: data as Record<string, unknown> }
}

export const deleteComment = async (
  id: string
): Promise<{ ok: true; deleted: { id: string } } | AgentFail> => {
  if (!assertAgentDbReady()) {
    return { ok: false, error: "Supabase is not configured.", status: 503 }
  }
  const admin = createServiceClient()
  const { data: existing, error: findError } = await admin
    .from("blog_comments")
    .select("id")
    .eq("id", id)
    .maybeSingle()

  if (findError) return { ok: false, error: findError.message, status: 500 }
  if (!existing) return { ok: false, error: "Not found", status: 404 }

  const { error } = await admin.from("blog_comments").delete().eq("id", id)
  if (error) return { ok: false, error: error.message, status: 500 }
  await revalidateAfterMutation()
  return { ok: true, deleted: { id } }
}
