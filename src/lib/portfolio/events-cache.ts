import { revalidatePath, revalidateTag } from "next/cache"
import { EVENTS_CACHE_TAG } from "@/lib/portfolio/events"
import { TAGS_CACHE_TAG } from "@/lib/portfolio/tags"

/**
 * Drop cached event pages after a write.
 * Admin event actions and the agent events API both use this so a publish
 * shows up on /events/[slug] without waiting for the cache TTL.
 */
export const refreshEvents = (slug?: string) => {
  revalidateTag(EVENTS_CACHE_TAG)
  revalidateTag(TAGS_CACHE_TAG)
  revalidatePath("/")
  revalidatePath("/events")
  if (slug) revalidatePath(`/events/${slug}`)
  revalidatePath("/tags", "layout")
  revalidatePath("/admin/events")
  revalidatePath("/admin")
  revalidatePath("/sitemap.xml")
}
