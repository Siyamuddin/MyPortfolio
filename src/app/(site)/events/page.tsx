import type { Metadata } from "next"
import { EventsPage } from "@/components/events/EventsPage"
import { getPublishedEvents } from "@/lib/portfolio/events-repository"
import { resolveEventCover } from "@/lib/portfolio/events"
import { getPortfolio } from "@/lib/portfolio/repository"
import { buildProfileAwarePageSeo } from "@/lib/seo"
import {
  buildBreadcrumbJsonLd,
  buildEventItemListJsonLd,
  JsonLdScript,
} from "@/lib/seo/jsonld"

export const generateMetadata = async (): Promise<Metadata> => {
  const { profile } = await getPortfolio()
  return buildProfileAwarePageSeo(profile, "events")
}

export default async function EventsRoute() {
  const events = await getPublishedEvents()
  return (
    <>
      <JsonLdScript data={buildBreadcrumbJsonLd("Events", "/events")} />
      {events.length ? (
        <JsonLdScript
          data={buildEventItemListJsonLd(
            events.map((event) => ({
              title: event.title,
              slug: event.slug,
              date: event.date,
              description: event.description,
              highlight: event.highlight,
              location: event.location,
              organizer: event.organizer,
              url: event.url,
              image: resolveEventCover(event) || undefined,
              tags: event.tags,
            }))
          )}
        />
      ) : null}
      <EventsPage events={events} />
    </>
  )
}
