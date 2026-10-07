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
