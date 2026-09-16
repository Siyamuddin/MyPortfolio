import { amountSchema, monthSchema, dateSchema } from "@/lib/finance/validation"
import { financeResponse } from "@/lib/finance/response"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { guardFinanceRequest } from "@/lib/finance/auth"
import { getSpends, upsertSpend } from "@/lib/finance/supabase"

const monthQuerySchema = monthSchema

const spendBodySchema = z.object({
  date: dateSchema,
  food: amountSchema.optional(),
  transport: amountSchema.optional(),
  shopping: amountSchema.optional(),
  subscriptions: amountSchema.optional(),
  remittance: amountSchema.optional(),
  other: amountSchema.optional(),
  note: z.string().max(5000).optional(),
})

export const GET = async (request: NextRequest) => {
  const blocked = await guardFinanceRequest(request)
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

  return financeResponse(() => getSpends(monthParam ?? undefined))
}

export const POST = async (request: NextRequest) => {
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

  try {
    const data = await upsertSpend(parsed.data)
    if (!data) {
      return NextResponse.json(
        { ok: false, error: "Failed to upsert spend entry." },
        { status: 503 }
      )
    }

    return NextResponse.json({ ok: true, data })
  } catch {
    return NextResponse.json({ ok: false, error: "Finance data is unavailable. Please try again." }, { status: 503 })
  }
}
