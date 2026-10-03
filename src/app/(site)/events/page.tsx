import type { Metadata } from "next"
import { EventsPage } from "@/components/events/EventsPage"
import { getPublishedEvents } from "@/lib/portfolio/events-repository"
import { getPortfolio } from "@/lib/portfolio/repository"
import { buildProfileAwarePageSeo } from "@/lib/seo"
import { buildBreadcrumbJsonLd, JsonLdScript } from "@/lib/seo/jsonld"

export const generateMetadata = async (): Promise<Metadata> => {
  const { profile } = await getPortfolio()
  return buildProfileAwarePageSeo(profile, "events")
}

export default async function EventsRoute() {
  const events = await getPublishedEvents()
  return (
    <>
      <JsonLdScript data={buildBreadcrumbJsonLd("Events", "/events")} />
      <EventsPage events={events} />
    </>
  )
}
