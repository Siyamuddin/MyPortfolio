import Link from "next/link"
import { ArrowUpRight, CalendarDays, Images, MapPin } from "lucide-react"
import { EventImage } from "@/components/events/EventImage"
import { formatEventDate, type PortfolioEvent } from "@/lib/portfolio/events"

type FeaturedEventCardProps = {
  event: PortfolioEvent
}

export const FeaturedEventCard = ({ event }: FeaturedEventCardProps) => {
  const eventHref = `/events/${event.slug}`
  const photoCount = event.photos.length

  return (
    <article className="group/card overflow-hidden rounded-2xl border border-jet bg-eerie-black-1 shadow-[var(--shadow-3)] transition-colors duration-200 hover:border-gold/40">
      <div className="grid min-[768px]:grid-cols-2">
        <Link
          href={eventHref}
          className="group relative block aspect-[16/10] min-h-[220px] min-[768px]:aspect-auto min-[768px]:min-h-[260px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          tabIndex={0}
          aria-label={`View event: ${event.title}`}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
              <EventImage
                photo={event.photos[0]}
                title={event.title}
                sizes="(min-width:768px) 50vw, 100vw"
              />
            </div>
          </div>
          {photoCount > 0 ? (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-smoky-black/70 px-2.5 py-1 text-[11px] font-medium text-white-2 backdrop-blur">
              <Images className="h-3.5 w-3.5" aria-hidden="true" />
              {photoCount} {photoCount === 1 ? "photo" : "photos"}
            </span>
          ) : null}
        </Link>
        <div className="flex flex-col justify-center p-5 min-[580px]:p-6">
          <p className="mb-2 w-max rounded-lg bg-onyx px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-gold">
            {event.category}
          </p>
          <h3 className="mb-2 text-lg font-medium text-white-2 min-[580px]:text-xl">
            {event.title}
          </h3>
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-light-gray-70 min-[580px]:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              <time dateTime={event.date}>{formatEventDate(event.date)}</time>
            </span>
            {event.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {event.location}
              </span>
            ) : null}
          </div>
          {event.highlight ? (
            <p className="mb-4 text-sm font-light leading-relaxed text-light-gray min-[580px]:text-[15px]">
              {event.highlight}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={eventHref}
              className="group/cta inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-gold px-4 py-2 text-sm font-medium text-smoky-black transition-[opacity,transform] duration-150 hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              tabIndex={0}
              aria-label={`View event: ${event.title}`}
            >
              {photoCount ? "View event" : "Read story"}
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-[180ms] group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 motion-reduce:transform-none"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/events"
              className="inline-flex min-h-11 items-center gap-1 text-sm text-light-gray-70 underline-offset-2 transition-colors hover:text-gold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              tabIndex={0}
              aria-label="View all events"
            >
              All events
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
