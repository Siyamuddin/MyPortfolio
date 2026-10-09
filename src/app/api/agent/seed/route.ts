import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { guardAgentRequest } from "@/lib/agent/auth"
import { agentFailure, readJsonBody } from "@/lib/agent/common"
import { SEED_CONFIRM, seedFromStatic } from "@/lib/agent/seed"

const seedSchema = z.object({
  confirm: z.string(),
})

export const POST = async (request: NextRequest) => {
  const blocked = await guardAgentRequest(request)
  if (blocked) return blocked

  const json = await readJsonBody(request)
  if (!json.ok) return json.response

  const parsed = seedSchema.safeParse(json.body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: `Destructive seed requires body { "confirm": "${SEED_CONFIRM}" }`,
      },
      { status: 400 }
    )
  }

  const result = await seedFromStatic(parsed.data.confirm)
  if (!result.ok) return agentFailure(result)
  return NextResponse.json({ ok: true, message: "Seeded from static portfolio data." })
}
