import type { CSSProperties } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin, Sparkles, Users } from "lucide-react"
import { EventImage } from "@/components/events/EventImage"
import { EventGallery } from "@/components/events/EventGallery"
import { TagChips } from "@/components/ui/TagChips"
import { formatEventDate, resolveEventCover, type PortfolioEvent } from "@/lib/portfolio/events"
import type { Tag } from "@/lib/portfolio/tags"

export function EventDetail({ event, tags }: { event: PortfolioEvent; tags: Tag[] }) {
  const cover = resolveEventCover(event)
  const coverPhoto = event.photos.find((photo) => photo.url === cover) ?? event.photos[0]

  return (
    <article
      className="rounded-[20px] border border-jet bg-eerie-black-2 p-[15px] shadow-[var(--shadow-1)] min-[580px]:mx-auto min-[580px]:w-[520px] min-[580px]:p-[30px] min-[768px]:w-[700px] min-[1024px]:w-[950px] min-[1024px]:shadow-[var(--shadow-5)] min-[1250px]:w-auto"
      aria-labelledby="event-title"
    >
      <nav className="mb-6 text-sm text-light-gray-70 min-[1024px]:pr-[360px]" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href="/events"
              className="hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              tabIndex={0}
              aria-label="Back to events"
            >
              Events
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-light-gray">{event.title}</li>
        </ol>
      </nav>

      <header className="mb-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-gold">
          {event.category}
        </p>
        <h1
          id="event-title"
          className="mb-4 text-2xl font-medium leading-tight text-white-2 min-[580px]:text-3xl"
        >
          {event.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-light text-light-gray">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={15} aria-hidden="true" />
            <time dateTime={event.date}>{formatEventDate(event.date)}</time>
          </span>
          {event.location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={15} aria-hidden="true" />
              {event.location}
            </span>
          ) : null}
          {event.organizer ? (
            <span className="inline-flex items-center gap-1.5">
              <Users size={15} aria-hidden="true" />
              {event.organizer}
            </span>
          ) : null}
        </div>
      </header>

      {coverPhoto ? (
        <figure className="cover-reveal relative mb-6 aspect-[16/9] overflow-hidden rounded-xl border border-jet bg-eerie-black-1">
          <EventImage
            photo={coverPhoto}
            title={event.title}
            sizes="(min-width:1024px) 950px, 100vw"
            priority
          />
        </figure>
      ) : null}

      {event.highlight ? (
        <p className="hero-enter mb-6 flex items-start gap-2 rounded-xl border border-gold/20 bg-gold/5 p-4 text-sm leading-relaxed text-gold" style={{ "--enter-delay": "120ms" } as CSSProperties}>
          <Sparkles size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          {event.highlight}
        </p>
      ) : null}

      {event.description ? (
        <div className="max-w-[70ch] whitespace-pre-wrap text-sm font-light leading-7 text-light-gray min-[580px]:text-[15px] min-[580px]:leading-8">
          {event.description}
        </div>
      ) : null}

      {tags.length ? (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-medium text-white-2">Tags</h2>
          <TagChips tags={tags} label={`Tags for ${event.title}`} />
        </div>
      ) : null}

      <EventGallery title={event.title} photos={event.photos} />

      {event.url ? (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-medium text-smoky-black transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          tabIndex={0}
        >
          Visit event website
          <ArrowUpRight size={16} aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : null}

      <footer className="mt-10 border-t border-jet pt-6">
        <Link
          href="/events"
          className="inline-flex min-h-[44px] items-center gap-2 text-sm text-light-gray-70 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          tabIndex={0}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          All events
        </Link>
      </footer>
    </article>
  )
}
