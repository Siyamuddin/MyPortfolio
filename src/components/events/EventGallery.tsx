"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react"
import type { EventPhoto } from "@/lib/portfolio/events"
import { EventImage } from "./EventImage"
import styles from "./Events.module.css"

/**
 * Photo gallery for an event detail page: a responsive grid of thumbnails that
 * open an accessible lightbox with keyboard and swipe navigation.
 */
export function EventGallery({ title, photos }: { title: string; photos: EventPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  if (!photos.length) return null

  return (
    <section aria-label={`Photos from ${title}`} className="mt-8">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-medium text-white-2">
        <Images size={18} aria-hidden="true" /> Gallery
        <span className="text-sm font-light text-light-gray-70">
          {photos.length} {photos.length === 1 ? "photo" : "photos"}
        </span>
      </h2>
      <ul className="grid grid-cols-2 gap-3 min-[580px]:grid-cols-3">
        {photos.map((photo, index) => (
          <li
            key={photo.id}
            className="min-w-0 motion-safe:animate-[fadeIn_var(--dur-4)_var(--ease-out)_backwards]"
            style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-jet bg-eerie-black-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-label={`Open photo ${index + 1}${photo.caption ? `: ${photo.caption}` : ""}`}
            >
              <EventImage photo={photo} title={`${title}, photo ${index + 1}`} sizes="(max-width: 580px) 50vw, 300px" />
            </button>
            {photo.caption ? (
              <p className="mt-1.5 line-clamp-2 text-xs font-light leading-relaxed text-light-gray-70">
                {photo.caption}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
      {openIndex !== null ? (
        <Lightbox
          title={title}
          photos={photos}
          startIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      ) : null}
    </section>
  )
}

function Lightbox({
  title,
  photos,
  startIndex,
  onClose,
}: {
  title: string
  photos: EventPhoto[]
  startIndex: number
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState(startIndex)
  const [direction, setDirection] = useState<1 | -1>(1)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const count = photos.length
  const photo = photos[index]
  const move = (next: number) => {
    setDirection(next > 0 ? 1 : -1)
    setIndex((current) => (current + next + count) % count)
  }

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
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={`${title} photo viewer`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      onKeyDown={(e) => {
        if (count < 2) return
        if (e.key === "ArrowRight") {
          e.preventDefault()
          move(1)
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault()
          move(-1)
        }
      }}
    >
      <div className={styles.album}>
        <header className={styles.albumHeader}>
          <span className={styles.eyebrow}>
            {count ? `${index + 1} of ${count} photos` : "Event photo"}
          </span>
          <button autoFocus type="button" className={styles.iconButton} onClick={onClose} aria-label="Close photo viewer">
            <X size={21} />
          </button>
        </header>
        <div
          className={styles.albumStage}
          onTouchStart={(e) => {
            touchStart.current = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
          }}
          onTouchEnd={(e) => {
            if (!touchStart.current || count < 2) return
            const dx = touchStart.current.x - e.changedTouches[0].clientX
            const dy = touchStart.current.y - e.changedTouches[0].clientY
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : -1)
            touchStart.current = null
          }}
        >
          <div key={`${index}-${direction}`} className={direction > 0 ? styles.slideNext : styles.slidePrev}>
            <EventImage photo={photo} title={title} sizes="(max-width: 768px) 100vw, 1000px" priority />
          </div>
          {count > 1 ? (
            <div className={styles.albumArrows}>
              <button type="button" className={styles.iconButton} aria-label="Previous photo" onClick={() => move(-1)}>
                <ChevronLeft size={23} />
              </button>
              <button type="button" className={styles.iconButton} aria-label="Next photo" onClick={() => move(1)}>
                <ChevronRight size={23} />
              </button>
            </div>
          ) : null}
        </div>
        <div className={styles.caption} aria-live="polite" aria-atomic="true">
          <span className={styles.captionNumber}>{String(index + 1).padStart(2, "0")}</span>
          <p>{photo?.caption || photo?.alt || title}</p>
        </div>
        {count > 1 ? (
          <div className={styles.thumbnails} aria-label="All photos">
            {photos.map((item, photoIndex) => (
              <button
                type="button"
                key={item.id}
                aria-label={`View photo ${photoIndex + 1}${item.caption ? `: ${item.caption}` : ""}`}
                aria-pressed={index === photoIndex}
                className={styles.thumbnail}
                onClick={() => setIndex(photoIndex)}
              >
                <EventImage photo={item} title={`${title}, photo ${photoIndex + 1}`} sizes="88px" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </dialog>
  )
}
