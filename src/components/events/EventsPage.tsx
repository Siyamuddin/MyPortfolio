"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Camera, ChevronLeft, ChevronRight, Images, MapPin, Sparkles, X } from "lucide-react"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { EVENT_CATEGORIES, formatEventDate, type EventCategory, type PortfolioEvent } from "@/lib/portfolio/events"
import { EventImage } from "./EventImage"
import styles from "./Events.module.css"

function EventMeta({ event }: { event: PortfolioEvent }) {
  return <div className={styles.meta}><span><CalendarDays size={14} aria-hidden="true" /><time dateTime={event.date}>{formatEventDate(event.date)}</time></span>{event.location && <span><MapPin size={14} aria-hidden="true" />{event.location}</span>}</div>
}

function EventAlbum({ event, onClose }: { event: PortfolioEvent; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState(0)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const count = event.photos.length
  const photo = event.photos[index]
  const move = (direction: number) => setIndex((current) => (current + direction + count) % count)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previousFocus = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = "hidden"
    return () => {
      dialog.close()
      document.body.style.overflow = overflow
      previousFocus?.focus({ preventScroll: true })
    }
  }, [])

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="event-album-title" onCancel={onClose} onClick={(e) => { if (e.target === e.currentTarget) onClose() }} onKeyDown={(e) => {
      if (count < 2 || (e.target as HTMLElement).tagName === "INPUT") return
      if (e.key === "ArrowRight") { e.preventDefault(); move(1) }
      if (e.key === "ArrowLeft") { e.preventDefault(); move(-1) }
    }}>
      <div className={styles.album}>
        <header className={styles.albumHeader}>
          <span className={styles.eyebrow}>{event.category} <span className={styles.headerDot}>·</span> {count ? `${index + 1} of ${count} photos` : "Event story"}</span>
          <button autoFocus type="button" className={styles.iconButton} onClick={onClose} aria-label="Close event album"><X size={21} /></button>
        </header>
        {count > 0 && <>
          <div className={styles.albumStage} onTouchStart={(e) => { touchStart.current = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } }} onTouchEnd={(e) => {
            if (!touchStart.current || count < 2) return
            const dx = touchStart.current.x - e.changedTouches[0].clientX
            const dy = touchStart.current.y - e.changedTouches[0].clientY
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : -1)
            touchStart.current = null
          }}>
            <EventImage photo={photo} title={event.title} sizes="(max-width: 768px) 100vw, 1000px" priority />
            {count > 1 && <div className={styles.albumArrows}><button type="button" className={styles.iconButton} aria-label="Previous photo" onClick={() => move(-1)}><ChevronLeft size={23} /></button><button type="button" className={styles.iconButton} aria-label="Next photo" onClick={() => move(1)}><ChevronRight size={23} /></button></div>}
          </div>
          <div className={styles.caption} aria-live="polite" aria-atomic="true"><span className={styles.captionNumber}>{String(index + 1).padStart(2, "0")}</span><p>{photo?.caption || photo?.alt || event.title}</p></div>
          {count > 1 && <div className={styles.thumbnails} aria-label="Album photos">{event.photos.map((item, photoIndex) => <button type="button" key={item.id} aria-label={`View photo ${photoIndex + 1}${item.caption ? `: ${item.caption}` : ""}`} aria-pressed={index === photoIndex} className={styles.thumbnail} onClick={() => setIndex(photoIndex)}><EventImage photo={item} title={`${event.title}, photo ${photoIndex + 1}`} sizes="88px" /></button>)}</div>}
        </>}
        <div className={styles.albumDetails}>
          <h2 id="event-album-title">{event.title}</h2>
          <EventMeta event={event} />
          {event.organizer && <p className={styles.organizer}>Hosted by {event.organizer}</p>}
          {event.highlight && <p className={styles.highlight}><Sparkles size={16} aria-hidden="true" />{event.highlight}</p>}
          {event.description && <p className={styles.description}>{event.description}</p>}
          {event.url && <a href={event.url} target="_blank" rel="noopener noreferrer" className={styles.textLink}>Visit event website <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>}
        </div>
      </div>
    </dialog>
  )
}

function EventCard({ event, onOpen }: { event: PortfolioEvent; onOpen: () => void }) {
  return <li className={styles.card}><button type="button" className={styles.cardButton} onClick={onOpen} aria-label={`View ${event.title}${event.photos.length ? `, ${event.photos.length} photos` : ""}`}>
    <div className={styles.cardImage}><EventImage photo={event.photos[0]} title={event.title} sizes="(max-width: 579px) 90vw, (max-width: 767px) 440px, 400px" />{event.photos.length > 0 && <span className={styles.photoCount}><Images size={14} aria-hidden="true" />{event.photos.length}</span>}</div>
    <div className={styles.cardBody}><span className={styles.eyebrow}>{event.category}</span><h3>{event.title}</h3><EventMeta event={event} />{event.highlight && <p className={styles.cardHighlight}>{event.highlight}</p>}<span className={styles.cardAction}>{event.photos.length ? "Open album" : "Read story"}<ArrowUpRight size={17} aria-hidden="true" /></span></div>
  </button></li>
}

export function EventsPage({ events }: { events: PortfolioEvent[] }) {
  const [category, setCategory] = useState<EventCategory | "All">("All")
  const [selected, setSelected] = useState<PortfolioEvent | null>(null)
  const categories = EVENT_CATEGORIES.filter((item) => events.some((event) => event.category === item))
  const filtered = category === "All" ? events : events.filter((event) => event.category === category)
  const latest = events[0]
  const photoCount = events.reduce((sum, event) => sum + event.photos.length, 0)

  return <article className={`rounded-[20px] border border-jet bg-eerie-black-2 p-[15px] shadow-[var(--shadow-1)] min-[580px]:mx-auto min-[580px]:w-[520px] min-[580px]:p-[30px] min-[768px]:w-[700px] min-[1024px]:w-[950px] min-[1024px]:shadow-[var(--shadow-5)] min-[1250px]:w-auto min-[1250px]:min-h-full ${styles.page}`} aria-labelledby="events-title">
    <header><SectionTitle as="h1"><span id="events-title">Events</span></SectionTitle></header>
    <div className={styles.intro}><div><p className={styles.eyebrow}>Beyond the screen</p><h2>Good people.<br /><span>Great experiences.</span></h2><p className={styles.introCopy}>Building, learning, and showing up. A collection of hackathons, campus moments, and communities along the way.</p></div>{events.length > 0 && <div className={styles.stats} aria-label="Collection totals"><div><strong>{String(events.length).padStart(2, "0")}</strong><span>{events.length === 1 ? "experience" : "experiences"}</span></div><div><strong>{String(photoCount).padStart(2, "0")}</strong><span>{photoCount === 1 ? "photo" : "photos"}</span></div></div>}</div>
    {latest ? <>
      <button type="button" className={styles.featured} onClick={() => setSelected(latest)} aria-label={`Explore latest event: ${latest.title}`}>
        <div className={styles.featuredImage}><EventImage photo={latest.photos[0]} title={latest.title} sizes="(max-width: 767px) 90vw, 850px" priority /></div>
        <div className={styles.featuredTop}><span className={styles.glassPill}><span className={styles.liveDot} />Latest experience</span>{latest.photos.length > 0 && <span className={styles.glassPill}><Images size={14} aria-hidden="true" />{latest.photos.length} {latest.photos.length === 1 ? "photo" : "photos"}</span>}</div>
        <div className={styles.featuredContent}><div><p className={styles.featuredCategory}>{latest.category}</p><h3>{latest.title}</h3><EventMeta event={latest} />{latest.highlight && <p className={styles.featuredHighlight}>{latest.highlight}</p>}</div><span className={styles.featuredArrow}><ArrowUpRight size={24} aria-hidden="true" /></span></div>
      </button>
      <section className={styles.collection} aria-labelledby="collection-title"><div className={styles.collectionHeading}><h2 id="collection-title">The collection</h2><ArrowDown size={18} aria-hidden="true" /></div><div className={styles.filterBar} role="group" aria-label="Filter events by category">{(["All", ...categories] as const).map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)} className={styles.filter}>{item === "All" ? "All events" : item}<span>{item === "All" ? events.length : events.filter((event) => event.category === item).length}</span></button>)}</div><p className="sr-only" role="status">{filtered.length} {filtered.length === 1 ? "event" : "events"} shown</p><ul className={styles.grid}>{filtered.map((event) => <EventCard key={event.id} event={event} onOpen={() => setSelected(event)} />)}</ul></section>
      <footer className={styles.footer}><Camera size={16} aria-hidden="true" /><p>Small moments. Lasting memories.</p><ArrowRight size={16} aria-hidden="true" /></footer>
    </> : <section className={styles.empty} aria-labelledby="empty-events-title"><div className={styles.emptyIcon}><Images size={34} strokeWidth={1.3} aria-hidden="true" /></div><p className={styles.eyebrow}>A collection in the making</p><h3 id="empty-events-title">More moments, coming soon.</h3><p>Photos and stories from hackathons, university life, and community events will find their home here.</p><a href="/portfolio" className={styles.textLink}><ArrowLeft size={16} aria-hidden="true" />Explore my projects</a></section>}
    {selected && <EventAlbum key={selected.id} event={selected} onClose={() => setSelected(null)} />}
  </article>
}
