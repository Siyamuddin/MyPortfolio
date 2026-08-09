import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { guardFinanceRequest } from "@/lib/finance/auth"
import { getConfig, updateConfig } from "@/lib/finance/supabase"

const budgetCapsSchema = z.object({
  rent: z.coerce.number().finite(),
  utilities: z.coerce.number().finite(),
  transport: z.coerce.number().finite(),
  phone: z.coerce.number().finite(),
  foodDaily: z.coerce.number().finite(),
  subscriptions: z.coerce.number().finite(),
})

const configPatchSchema = z
  .object({
    currency: z.string().trim().min(1).max(16).optional(),
    monthlyIncome: z.coerce.number().finite().optional(),
    budgetCaps: budgetCapsSchema.optional(),
    totalMonthlyBudget: z.coerce.number().finite().optional(),
    emergencyFundTarget: z.coerce.number().finite().optional(),
    emergencyFundSeed: z.coerce.number().finite().optional(),
    heroMetric: z.string().trim().min(1).max(100).optional(),
    tuitionDue: z.string().max(64).optional(),
    tuitionAmount: z.coerce.number().finite().optional(),
    passportCost: z.coerce.number().finite().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })

export const GET = async (request: NextRequest) => {
  const blocked = await guardFinanceRequest(request)
  if (blocked) return blocked

  const data = await getConfig()
  return NextResponse.json({ ok: true, data })
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

  const data = await updateConfig(parsed.data)
  if (!data) {
    return NextResponse.json(
      { ok: false, error: "Failed to update finance config." },
      { status: 503 }
    )
  }

  return NextResponse.json({ ok: true, data })
}
