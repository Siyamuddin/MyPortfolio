import { revalidatePath, revalidateTag } from "next/cache"
import { PORTFOLIO_CACHE_TAG } from "@/lib/portfolio/repository"
import { TAGS_CACHE_TAG } from "@/lib/portfolio/tags"
import { isPortfolioAdmin } from "@/lib/supabase/authorization"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { createClient } from "@/lib/supabase/server"

export const requireAdmin = async () => {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured")
  }

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user || !(await isPortfolioAdmin(supabase))) {
    throw new Error("Unauthorized")
  }

  return { supabase, user }
}

export const revalidatePortfolio = () => {
  revalidateTag(PORTFOLIO_CACHE_TAG)
  revalidateTag(TAGS_CACHE_TAG)
  revalidatePath("/", "layout")
  revalidatePath("/blog", "layout")
  revalidatePath("/admin", "layout")
  revalidatePath("/tags", "layout")
  revalidatePath("/sitemap.xml")
}
