import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { guardFinanceRequest } from "@/lib/finance/auth"
import { getObligations, toggleObligation } from "@/lib/finance/supabase"

const toggleSchema = z.object({
  id: z.string().trim().min(1).max(200),
})

export const GET = async (request: NextRequest) => {
  const blocked = await guardFinanceRequest(request)
  if (blocked) return blocked

  const data = await getObligations()
  return NextResponse.json({ ok: true, data })
}

export const PATCH = async (request: NextRequest) => {
  const blocked = await guardFinanceRequest(request)
  if (blocked) return blocked

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    )
  }

  const parsed = toggleSchema.safeParse(body)
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

  const data = await toggleObligation(parsed.data.id)
  if (!data) {
    return NextResponse.json(
      { ok: false, error: "Obligation not found or database unavailable." },
      { status: 404 }
    )
  }

  return NextResponse.json({ ok: true, data })
}
