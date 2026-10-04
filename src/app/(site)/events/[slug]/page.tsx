import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { EventDetail } from "@/components/events/EventDetail"
import {
  formatEventDate,
  resolveEventCover,
  type PortfolioEvent,
} from "@/lib/portfolio/events"
import {
  getPublishedEventBySlug,
  getPublishedEvents,
} from "@/lib/portfolio/events-repository"
import { getPortfolio } from "@/lib/portfolio/repository"
import { resolveTags } from "@/lib/portfolio/tags-repository"
import {
  buildPageMetadata,
  resolveOgImage,
  toMetaDescription,
  twitterHandleFromUrl,
} from "@/lib/seo"
import {
  buildBreadcrumbJsonLd,
  buildEventJsonLd,
  JsonLdScript,
} from "@/lib/seo/jsonld"

type PageProps = {
  params: Promise<{ slug: string }>
}

/** Auto-generate a meta description from event fields when none is written. */
const eventDescription = (event: PortfolioEvent): string => {
  if (event.description.trim()) return toMetaDescription(event.description)
  const where = event.location ? ` in ${event.location}` : ""
  const host = event.organizer ? `, hosted by ${event.organizer}` : ""
  const base = `${event.title} — ${event.category} on ${formatEventDate(event.date)}${where}${host}.`
  return toMetaDescription(event.highlight ? `${base} ${event.highlight}` : base)
}

export const generateStaticParams = async () => {
  const events = await getPublishedEvents()
  return events.map((event) => ({ slug: event.slug }))
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params
  const event = await getPublishedEventBySlug(slug)
  if (!event) return {}

  const { profile } = await getPortfolio()
  const description = eventDescription(event)

  return buildPageMetadata({
    title: event.title,
    description,
    path: `/events/${event.slug}`,
    ogTitle: `${event.title} | Events`,
    openGraphType: "article",
    publishedTime: event.date,
    modifiedTime: event.updatedAt,
    ogImage: resolveOgImage(resolveEventCover(event), event.title),
    keywords: event.tags,
    twitterCreator: twitterHandleFromUrl(profile.socials.twitter),
  })
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params
  const event = await getPublishedEventBySlug(slug)
  if (!event) notFound()

  const tags = await resolveTags(event.tags)

  return (
    <>
      <JsonLdScript
        data={buildEventJsonLd({
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
        })}
      />
      <JsonLdScript
        data={buildBreadcrumbJsonLd(event.title, `/events/${event.slug}`, [
          { name: "Events", path: "/events" },
        ])}
      />
      <EventDetail event={event} tags={tags} />
    </>
  )
}
