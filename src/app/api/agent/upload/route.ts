import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { guardAgentRequest } from "@/lib/agent/auth"
import { uploadPortfolioFile } from "@/lib/agent/upload"

export const POST = async (request: NextRequest) => {
  const blocked = guardAgentRequest(request)
  if (blocked) return blocked

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json(
      { ok: false, error: "Expected multipart form data." },
      { status: 400 }
    )
  }

  const file = formData.get("file")
  const folder = String(formData.get("folder") ?? "")

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "file field is required" },
      { status: 400 }
    )
  }

  const result = await uploadPortfolioFile(file, folder)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    )
  }
  return NextResponse.json({
    ok: true,
    url: result.url,
    path: result.path,
  })
}
