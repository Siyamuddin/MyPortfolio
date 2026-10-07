import {
  assertAgentDbReady,
  revalidateAfterMutation,
  type AgentFail,
} from "@/lib/agent/common"
import {
  DESTRUCTIVE_SEED_DISABLED_ERROR,
  isDestructiveSeedAllowed,
  seedPortfolioFromStatic,
} from "@/lib/portfolio/seed-from-static"

export const SEED_CONFIRM = "SEED_FROM_STATIC"

export const seedFromStatic = async (
  confirm: string
): Promise<{ ok: true } | AgentFail> => {
  if (!isDestructiveSeedAllowed()) {
    return { ok: false, error: DESTRUCTIVE_SEED_DISABLED_ERROR, status: 403 }
  }

  if (confirm !== SEED_CONFIRM) {
    return {
      ok: false,
      error: `Destructive seed requires body { "confirm": "${SEED_CONFIRM}" }`,
      status: 400,
    }
  }

  if (!assertAgentDbReady()) {
    return { ok: false, error: "Supabase is not configured.", status: 503 }
  }

  const result = await seedPortfolioFromStatic()
  if (!result.ok) {
    return {
      ok: false,
      error: result.error,
      status: result.error === DESTRUCTIVE_SEED_DISABLED_ERROR ? 403 : 500,
    }
  }

  await revalidateAfterMutation()
  return { ok: true }
}
