import { amountSchema, dateSchema } from "@/lib/finance/validation"
import { financeResponse } from "@/lib/finance/response"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { guardFinanceRequest } from "@/lib/finance/auth"
import { getConfig, updateConfig } from "@/lib/finance/supabase"

const budgetCapsSchema = z.object({
  rent: amountSchema,
  utilities: amountSchema,
  transport: amountSchema,
  phone: amountSchema,
  foodDaily: amountSchema,
  subscriptions: amountSchema,
})

const configPatchSchema = z
  .object({
    currency: z.string().trim().min(1).max(16).optional(),
    monthlyIncome: amountSchema.optional(),
    budgetCaps: budgetCapsSchema.optional(),
    totalMonthlyBudget: amountSchema.optional(),
    emergencyFundTarget: amountSchema.optional(),
    emergencyFundSeed: amountSchema.optional(),
    heroMetric: z.string().trim().min(1).max(100).optional(),
    tuitionDue: z.union([dateSchema, z.literal("")]).optional(),
    tuitionAmount: amountSchema.optional(),
    passportCost: amountSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })

export const GET = async (request: NextRequest) => {
  const blocked = await guardFinanceRequest(request)
  if (blocked) return blocked

  return financeResponse(() => getConfig())
}

export const PUT = async (request: NextRequest) => {
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

  const parsed = configPatchSchema.safeParse(body)
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
    const data = await updateConfig(parsed.data)
    if (!data) {
      return NextResponse.json(
        { ok: false, error: "Failed to update finance config." },
        { status: 503 }
      )
    }

    return NextResponse.json({ ok: true, data })
  } catch {
    return NextResponse.json({ ok: false, error: "Finance data is unavailable. Please try again." }, { status: 503 })
  }
}
