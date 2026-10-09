import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { guardAgentRequest } from "@/lib/agent/auth"
import { agentFailure } from "@/lib/agent/common"
import { getPortfolioSnapshot } from "@/lib/agent/profile"

export const GET = async (request: NextRequest) => {
  const blocked = await guardAgentRequest(request)
  if (blocked) return blocked

  const result = await getPortfolioSnapshot()
  if (!result.ok) return agentFailure(result)
  return NextResponse.json({ ok: true, portfolio: result.portfolio })
}
