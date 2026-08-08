import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { guardAgentRequest } from "@/lib/agent/auth"
import { getSpends, upsertSpend } from "@/lib/finance/supabase"

const monthQuerySchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "month must be YYYY-MM")

const spendBodySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  food: z.coerce.number().finite().optional(),
  transport: z.coerce.number().finite().optional(),
  shopping: z.coerce.number().finite().optional(),
  subscriptions: z.coerce.number().finite().optional(),
  remittance: z.coerce.number().finite().optional(),
  other: z.coerce.number().finite().optional(),
  note: z.string().max(5000).optional(),
})

export const GET = async (request: NextRequest) => {
  const blocked = guardAgentRequest(request)
  if (blocked) return blocked

  const monthParam = request.nextUrl.searchParams.get("month")
  if (monthParam) {
    const parsed = monthQuerySchema.safeParse(monthParam)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid month. Use YYYY-MM." },
        { status: 400 }
      )
    }
  }

  const data = await getSpends(monthParam ?? undefined)
  return NextResponse.json({ ok: true, data })
}

export const POST = async (request: NextRequest) => {
  const blocked = guardAgentRequest(request)
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

  const parsed = spendBodySchema.safeParse(body)
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

  const data = await upsertSpend(parsed.data)
  if (!data) {
    return NextResponse.json(
      { ok: false, error: "Failed to upsert spend entry." },
      { status: 503 }
    )
  }

  return NextResponse.json({ ok: true, data })
}
