import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { guardAgentRequest } from "@/lib/agent/auth"
import { getPortfolioSnapshot } from "@/lib/agent/profile"

export const GET = async (request: NextRequest) => {
  const blocked = guardAgentRequest(request)
  if (blocked) return blocked

  const result = await getPortfolioSnapshot()
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    )
  }
  return NextResponse.json({ ok: true, portfolio: result.portfolio })
}
