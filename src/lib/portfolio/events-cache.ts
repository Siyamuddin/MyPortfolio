import { revalidateTag } from "next/cache"
import { revalidatePortfolio } from "@/lib/portfolio/auth"
import { EVENTS_CACHE_TAG } from "@/lib/portfolio/events"

/**
 * Drop cached event pages after a write.
 * Admin event actions and the agent events API both use this so a publish
 * shows up on /events/[slug] without waiting for the cache TTL.
 */
export const refreshEvents = () => {
  revalidatePortfolio()
  revalidateTag(EVENTS_CACHE_TAG)
}
