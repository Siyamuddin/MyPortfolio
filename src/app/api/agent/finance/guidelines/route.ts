import { financeResponse } from "@/lib/finance/response"
import type { NextRequest } from "next/server"
import { guardFinanceRequest } from "@/lib/finance/auth"
import { getGuidelines } from "@/lib/finance/supabase"

export const GET = async (request: NextRequest) => {
  const blocked = await guardFinanceRequest(request)
  if (blocked) return blocked

  return financeResponse(() => getGuidelines())
}
