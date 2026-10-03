import { cache } from "react"
import { unstable_cache } from "next/cache"
import { createClient } from "@supabase/supabase-js"
import { requireAdmin } from "@/lib/portfolio/auth-actions"
import {
  EVENTS_CACHE_TAG,
  EVENTS_SETUP_MESSAGE,
  isMissingEventsTable,
  portfolioEventSchema,
  type PortfolioEvent,
} from "@/lib/portfolio/events"
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/env"

const EVENT_COLUMNS = "id,title,category,date,location,organizer,description,highlight,url,status,photos"

const getCachedPublishedEvents = unstable_cache(
  async (): Promise<PortfolioEvent[]> => {
    const { url, anonKey } = getSupabaseEnv()
    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data, error } = await supabase
      .from("events")
      .select(EVENT_COLUMNS)
      .eq("status", "published")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      if (isMissingEventsTable(error)) return []
      console.error("[events] Could not load published events", error)
      throw new Error("Events are temporarily unavailable. Please try again shortly.")
    }
    return portfolioEventSchema.array().parse(data ?? [])
  },
  ["published-portfolio-events"],
  { tags: [EVENTS_CACHE_TAG], revalidate: 3600 }
)

export const getPublishedEvents = cache(async (): Promise<PortfolioEvent[]> => {
  if (!isSupabaseConfigured()) return []
  return getCachedPublishedEvents()
})

export const getAdminEvents = async (): Promise<PortfolioEvent[]> => {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    if (isMissingEventsTable(error)) throw new Error(EVENTS_SETUP_MESSAGE)
    throw new Error("Could not load events. Please reload and try again.")
  }
  return portfolioEventSchema.array().parse(data ?? [])
}
