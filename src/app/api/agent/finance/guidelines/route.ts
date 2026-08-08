import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { guardAgentRequest } from "@/lib/agent/auth"
import { getGuidelines } from "@/lib/finance/supabase"

export const GET = async (request: NextRequest) => {
  const blocked = guardAgentRequest(request)
  if (blocked) return blocked

  const data = await getGuidelines()
  return NextResponse.json({ ok: true, data })
}
