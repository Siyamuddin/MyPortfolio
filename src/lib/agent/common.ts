import { revalidatePath, revalidateTag } from "next/cache"
import { PORTFOLIO_CACHE_TAG } from "@/lib/portfolio/repository"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export const revalidateAfterMutation = async () => {
  revalidateTag(PORTFOLIO_CACHE_TAG)
  revalidatePath("/", "layout")
  revalidatePath("/blog", "layout")
  revalidatePath("/admin", "layout")
}

export const assertAgentDbReady = () =>
  Boolean(isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY)

export type AgentFail = {
  ok: false
  error: string
  status: number
}

export type AgentOk<T> = { ok: true } & T
