import { createServerClient } from "@supabase/ssr"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { requireBlogApiKey } from "@/lib/agent/auth"

const unauthorized = () =>
  NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

const serviceUnavailable = () =>
  NextResponse.json(
    { ok: false, error: "Finance API is not configured." },
    { status: 503 }
  )

/**
 * Allows finance API access via either:
 * 1. Authorization: Bearer <BLOG_API_KEY> (Finance bot / automation), or
 * 2. A valid Supabase admin session (browser logged into /admin).
 *
 * Returns null when allowed, otherwise a 401/503 NextResponse.
 */
export const guardFinanceRequest = async (
  request: NextRequest
): Promise<NextResponse | null> => {
  const header = request.headers.get("authorization") ?? ""
  const hasBearer = /^Bearer\s+\S+/i.test(header)

  if (hasBearer) {
    const bearerError = requireBlogApiKey(request)
    if (!bearerError) return null
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (url && anonKey) {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) return null
    return unauthorized()
  }

  if (!process.env.BLOG_API_KEY) return serviceUnavailable()

  return unauthorized()
}
