import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { guardAgentRequest } from "@/lib/agent/auth"
import { SEED_CONFIRM, seedFromStatic } from "@/lib/agent/seed"

const seedSchema = z.object({
  confirm: z.string(),
})

export const POST = async (request: NextRequest) => {
  const blocked = guardAgentRequest(request)
  if (blocked) return blocked

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 })
  }

  const parsed = seedSchema.safeParse(body)
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
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    )
  }
  return NextResponse.json({ ok: true, message: "Seeded from static portfolio data." })
}
