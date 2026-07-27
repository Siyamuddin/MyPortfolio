import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export const middleware = async (request: NextRequest) => {
  return updateSession(request)
}

export const config = {
  matcher: [
    "/admin/:path*",
  ],
}
