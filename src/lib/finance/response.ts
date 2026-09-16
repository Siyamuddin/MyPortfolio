import { NextResponse } from "next/server"

export const financeResponse = async <T>(operation: () => Promise<T>) => {
  try {
    return NextResponse.json({ ok: true, data: await operation() }, {
      headers: { "Cache-Control": "private, no-store" },
    })
  } catch {
    return NextResponse.json(
      { ok: false, error: "Finance data is unavailable. Please try again." },
      { status: 503, headers: { "Cache-Control": "private, no-store" } }
    )
  }
}
