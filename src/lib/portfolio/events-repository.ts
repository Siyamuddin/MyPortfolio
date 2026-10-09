import { cache } from "react"
import { unstable_cache } from "next/cache"
import { requireAdmin } from "@/lib/portfolio/auth"
import { createAnonClient } from "@/lib/portfolio/repository"
import {
  EVENTS_CACHE_TAG,
  EVENTS_SETUP_MESSAGE,
  eventRowSchema,
  isMissingEventsTable,
  mapEventRow,
  type PortfolioEvent,
} from "@/lib/portfolio/events"
import { isSupabaseConfigured } from "@/lib/supabase/env"

const EVENT_COLUMNS =
  "id,slug,title,category,date,location,organizer,description,highlight,url,status,photos,tags,og_image,updated_at"

const parseEvents = (data: unknown): PortfolioEvent[] =>
  eventRowSchema.array().parse(data ?? []).map(mapEventRow)

const getCachedPublishedEvents = unstable_cache(
  async (): Promise<PortfolioEvent[]> => {
    const supabase = createAnonClient()
    if (!supabase) return []
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
    return parseEvents(data)
  },
  ["published-portfolio-events"],
  { tags: [EVENTS_CACHE_TAG], revalidate: 3600 }
)

export const getPublishedEvents = cache(async (): Promise<PortfolioEvent[]> => {
  if (!isSupabaseConfigured()) return []
  return getCachedPublishedEvents()
})

export const getPublishedEventBySlug = cache(
  async (slug: string): Promise<PortfolioEvent | null> => {
    if (!isSupabaseConfigured() || !slug) return null
    const events = await getCachedPublishedEvents()
    return events.find((event) => event.slug === slug) ?? null
  }
)

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
  return parseEvents(data)
}
