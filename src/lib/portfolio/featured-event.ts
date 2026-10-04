import type { PortfolioEvent } from "@/lib/portfolio/events"

/**
 * Resolve the single event spotlighted on the About / landing page.
 *
 * Only published events are passed in, so a draft, deleted, or unset
 * `featured_event_id` resolves to null and the homepage hides the section.
 */
export const resolveFeaturedEvent = (
  events: PortfolioEvent[],
  featuredEventId: string | null | undefined
): PortfolioEvent | null => {
  if (!featuredEventId) return null
  return events.find((event) => event.id === featuredEventId) ?? null
}
