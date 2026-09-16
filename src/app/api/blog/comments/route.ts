import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { createServiceClient } from "@/lib/supabase/admin"
import { guardSubmissionRate } from "@/lib/rate-limit"
import { notifyPendingComment } from "@/lib/comments/notify"
import { isSupabaseConfigured } from "@/lib/supabase/env"

const commentSchema = z.object({
  postId: z.string().uuid(),
  authorName: z.string().trim().min(2).max(100),
  authorEmail: z.string().trim().email().max(200),
  body: z.string().trim().min(3).max(2000),
  website: z.string().optional(),
})

export const POST = async (request: NextRequest) => {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 })
  }

  const parsed = commentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed.", errors: parsed.error.flatten() },
      { status: 400 }
    )
  }

  if (parsed.data.website) {
    return NextResponse.json({
      message: "Thanks — your comment was received.",
    })
  }

  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { message: "Comments are unavailable right now." },
      { status: 503 }
    )
  }

  const blocked = await guardSubmissionRate(request, "comments")
  if (blocked) return blocked
  const supabase = createServiceClient()

  const { postId, authorName, authorEmail, body: commentBody } = parsed.data

  const { data: post, error: postError } = await supabase
    .from("blog_posts")
    .select("id, title, status")
    .eq("id", postId)
    .eq("status", "published")
    .maybeSingle()

  if (postError) {
    return NextResponse.json({ message: "Comments are temporarily unavailable." }, { status: 503 })
  }
  if (!post) {
    return NextResponse.json(
      { message: "Blog post not found." },
      { status: 404 }
    )
  }

  const { error: insertError } = await supabase.from("blog_comments").insert({
    post_id: postId,
    author_name: authorName,
    author_email: authorEmail,
    body: commentBody,
    status: "pending",
  })

  if (insertError) {
    return NextResponse.json(
      { message: "Failed to submit comment. Please try again." },
      { status: 500 }
    )
  }

  await notifyPendingComment({
    postTitle: post.title as string,
    authorName,
    authorEmail,
    body: commentBody,
  })

  return NextResponse.json({
    message:
      "Thanks — your comment was submitted and is awaiting moderation.",
  })
}
