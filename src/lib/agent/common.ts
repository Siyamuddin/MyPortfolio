import { NextResponse } from "next/server"
import type { ZodError } from "zod"
import { revalidatePortfolio } from "@/lib/portfolio/auth"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export const revalidateAfterMutation = async () => {
  revalidatePortfolio()
}

export const assertAgentDbReady = () =>
  Boolean(isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY)

export type AgentFail = {
  ok: false
  error: string
  status: number
}

export const agentDbUnavailable = () =>
  NextResponse.json({ ok: false, error: "Supabase is not configured." }, { status: 503 })

export const agentFailure = (result: AgentFail) =>
  NextResponse.json({ ok: false, error: result.error }, { status: result.status })

export const agentValidationError = (error: ZodError) =>
  NextResponse.json(
    { ok: false, error: "Validation failed.", errors: error.flatten() },
    { status: 400 }
  )

export const readJsonBody = async (request: Request) => {
  try {
    return { ok: true as const, body: (await request.json()) as unknown }
  } catch {
    return {
      ok: false as const,
      response: NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 }),
    }
  }
}
