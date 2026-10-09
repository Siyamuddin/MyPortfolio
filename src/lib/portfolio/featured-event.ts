import type { PortfolioEvent } from "@/lib/portfolio/events"

export const resolveFeaturedEvent = (
  events: PortfolioEvent[],
  featuredEventId: string | null | undefined
): PortfolioEvent | null => {
  if (!featuredEventId) return null
  return events.find((event) => event.id === featuredEventId) ?? null
}
