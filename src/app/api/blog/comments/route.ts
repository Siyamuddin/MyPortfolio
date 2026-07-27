import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@supabase/supabase-js"
import { notifyPendingComment } from "@/lib/comments/notify"
import { isSupabaseConfigured } from "@/lib/supabase/env"

const commentSchema = z.object({
  postId: z.string().uuid(),
  authorName: z.string().trim().min(2).max(100),
  authorEmail: z.string().trim().email().max(200),
  body: z.string().trim().min(3).max(2000),
  website: z.string().optional(),
})

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const getClientIp = (request: NextRequest) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  request.headers.get("x-real-ip") ??
  "unknown"

const isRateLimited = (ip: string) => {
  const now = Date.now()
  const windowMs = 60_000
  const maxRequests = 5
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return false
  }

  entry.count += 1
  return entry.count > maxRequests
}

const createAnonClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return null
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export const POST = async (request: NextRequest) => {
  const ip = getClientIp(request)

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { message: "Comments are unavailable right now." },
      { status: 503 }
    )
  }

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

  const supabase = createAnonClient()
  if (!supabase) {
    return NextResponse.json(
      { message: "Comments are unavailable right now." },
      { status: 503 }
    )
  }

  const { postId, authorName, authorEmail, body: commentBody } = parsed.data

  const { data: post, error: postError } = await supabase
    .from("blog_posts")
    .select("id, title, status")
    .eq("id", postId)
    .eq("status", "published")
    .maybeSingle()

  if (postError || !post) {
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
      { message: insertError.message || "Failed to submit comment." },
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
