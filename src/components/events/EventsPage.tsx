"use client"

import { useLayoutEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Camera, Images, MapPin } from "lucide-react"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { CountUp } from "@/components/ui/CountUp"
import { EVENT_CATEGORIES, formatEventDate, type EventCategory, type PortfolioEvent } from "@/lib/portfolio/events"
import { EventImage } from "./EventImage"
import styles from "./Events.module.css"

function EventMeta({ event }: { event: PortfolioEvent }) {
  return (
    <div className={styles.meta}>
      <span>
        <CalendarDays size={14} aria-hidden="true" />
        <time dateTime={event.date}>{formatEventDate(event.date)}</time>
      </span>
      {event.location && (
        <span>
          <MapPin size={14} aria-hidden="true" />
          {event.location}
        </span>
      )}
    </div>
  )
}

function EventCard({ event, delay = 0 }: { event: PortfolioEvent; delay?: number }) {
  return (
    <li className={styles.card} style={{ "--stagger": `${delay}ms` } as React.CSSProperties}>
      <Link
        href={`/events/${event.slug}`}
        className={styles.cardButton}
        aria-label={`View ${event.title}${event.photos.length ? `, ${event.photos.length} photos` : ""}`}
      >
        <div className={styles.cardImage}>
          <EventImage photo={event.photos[0]} title={event.title} sizes="(max-width: 579px) 90vw, (max-width: 767px) 440px, 400px" />
          {event.photos.length > 0 && (
            <span className={styles.photoCount}>
              <Images size={14} aria-hidden="true" />
              {event.photos.length}
            </span>
          )}
        </div>
        <div className={styles.cardBody}>
          <span className={styles.eyebrow}>{event.category}</span>
          <h3>{event.title}</h3>
          <EventMeta event={event} />
          {event.highlight && <p className={styles.cardHighlight}>{event.highlight}</p>}
          <span className={styles.cardAction}>
            {event.photos.length ? "View event" : "Read story"}
            <ArrowUpRight size={17} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </li>
  )
}

export function EventsPage({ events }: { events: PortfolioEvent[] }) {
  const [category, setCategory] = useState<EventCategory | "All">("All")
  const categories = EVENT_CATEGORIES.filter((item) => events.some((event) => event.category === item))
  const filters = ["All", ...categories] as const
  const filtered = category === "All" ? events : events.filter((event) => event.category === category)
  const latest = events[0]
  const photoCount = events.reduce((sum, event) => sum + event.photos.length, 0)
  const filterBarRef = useRef<HTMLDivElement>(null)
  const filterRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [pill, setPill] = useState<{ x: number; y: number; w: number; h: number } | null>(null)

  useLayoutEffect(() => {
    const bar = filterBarRef.current
    const button = filterRefs.current[category]
    if (!bar || !button) return
    const measure = () => {
      setPill({
        x: button.offsetLeft,
        y: button.offsetTop,
        w: button.offsetWidth,
        h: button.offsetHeight,
      })
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [category, filters.length])

  return (
    <article className={`rounded-[20px] border border-jet bg-eerie-black-2 p-[15px] shadow-[var(--shadow-1)] min-[580px]:mx-auto min-[580px]:w-[520px] min-[580px]:p-[30px] min-[768px]:w-[700px] min-[1024px]:w-[950px] min-[1024px]:shadow-[var(--shadow-5)] min-[1250px]:w-auto min-[1250px]:min-h-full ${styles.page}`} aria-labelledby="events-title">
      <header><SectionTitle><span id="events-title">Events</span></SectionTitle></header>
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>Beyond the screen</p>
          <h2>Good people.<br /><span>Great experiences.</span></h2>
          <p className={styles.introCopy}>Building, learning, and showing up. A collection of hackathons, campus moments, and communities along the way.</p>
        </div>
        {events.length > 0 && (
          <div className={styles.stats} aria-label="Collection totals">
            <div><strong><CountUp value={events.length} /></strong><span>{events.length === 1 ? "experience" : "experiences"}</span></div>
            <div><strong><CountUp value={photoCount} /></strong><span>{photoCount === 1 ? "photo" : "photos"}</span></div>
          </div>
        )}
      </div>
      {latest ? (
        <>
          <Link href={`/events/${latest.slug}`} className={styles.featured} aria-label={`Explore latest event: ${latest.title}`}>
            <div className={styles.featuredImage}><EventImage photo={latest.photos[0]} title={latest.title} sizes="(max-width: 767px) 90vw, 850px" priority /></div>
            <div className={styles.featuredTop}>
              <span className={styles.glassPill}><span className={styles.liveDot} />Latest experience</span>
              {latest.photos.length > 0 && <span className={styles.glassPill}><Images size={14} aria-hidden="true" />{latest.photos.length} {latest.photos.length === 1 ? "photo" : "photos"}</span>}
            </div>
            <div className={styles.featuredContent}>
              <div>
                <p className={styles.featuredCategory}>{latest.category}</p>
                <h3>{latest.title}</h3>
                <EventMeta event={latest} />
                {latest.highlight && <p className={styles.featuredHighlight}>{latest.highlight}</p>}
              </div>
              <span className={styles.featuredArrow}>
                View event
                <ArrowUpRight size={18} aria-hidden="true" />
              </span>
            </div>
          </Link>
          <section className={styles.collection} aria-labelledby="collection-title">
            <div className={styles.collectionHeading}><h2 id="collection-title">The collection</h2><ArrowDown size={18} aria-hidden="true" /></div>
            <div ref={filterBarRef} className={styles.filterBar} role="group" aria-label="Filter events by category">
              {pill ? (
                <span
                  aria-hidden="true"
                  className={styles.filterPill}
                  style={{ width: pill.w, height: pill.h, transform: `translate(${pill.x}px, ${pill.y}px)` }}
                />
              ) : null}
              {filters.map((item) => (
                <button
                  type="button"
                  key={item}
                  ref={(node) => { filterRefs.current[item] = node }}
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                  className={styles.filter}
                >
                  {item === "All" ? "All events" : item}
                  <span>{item === "All" ? events.length : events.filter((event) => event.category === item).length}</span>
                </button>
              ))}
            </div>
            <p className="sr-only" role="status">{filtered.length} {filtered.length === 1 ? "event" : "events"} shown</p>
            <ul className={styles.grid} key={category}>{filtered.map((event, index) => <EventCard key={event.id} event={event} delay={Math.min(index * 50, 400)} />)}</ul>
          </section>
          <footer className={styles.footer}><Camera size={16} aria-hidden="true" /><p>Small moments. Lasting memories.</p><ArrowRight size={16} aria-hidden="true" /></footer>
        </>
      ) : (
        <section className={styles.empty} aria-labelledby="empty-events-title">
          <div className={styles.emptyIcon}><Images size={34} strokeWidth={1.3} aria-hidden="true" /></div>
          <p className={styles.eyebrow}>A collection in the making</p>
          <h3 id="empty-events-title">More moments, coming soon.</h3>
          <p>Photos and stories from hackathons, university life, and community events will find their home here.</p>
          <Link href="/portfolio" className={styles.textLink}><ArrowLeft size={16} aria-hidden="true" />Explore my projects</Link>
        </section>
      )}
    </article>
  )
}
