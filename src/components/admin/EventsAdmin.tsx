"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState, type FormEvent } from "react"
import {
  ArrowDown, ArrowUp, CalendarDays, Camera, Check, ExternalLink,
  ImagePlus, LoaderCircle, MapPin, Pencil, Plus, Trash2, X,
} from "lucide-react"
import {
  EVENT_CATEGORIES, EVENT_PHOTO_MIME_TYPES, MAX_EVENT_PHOTO_BYTES,
  MAX_EVENT_PHOTOS, type EventPhoto, type PortfolioEvent,
} from "@/lib/portfolio/events"
import {
  deleteEventAction, uploadEventPhotoAction, upsertEventAction,
} from "@/lib/portfolio/event-actions"
import { labelFromSlug, type Tag } from "@/lib/portfolio/tags"
import { TagsInput } from "@/components/admin/TagsInput"
import { DeleteConfirmDialog, StudioEmpty, StudioFilter, StudioNotice } from "@/components/admin/studio/StudioChrome"
import { useModalDialog } from "@/hooks/useModalDialog"
import { EventImage } from "@/components/events/EventImage"
import styles from "./studio/AdminStudio.module.css"

type EventFilter = "all" | "published" | "draft"
const maximumPhotoSizeLabel = `${MAX_EVENT_PHOTO_BYTES / (1024 * 1024)} MB`

const displayDate = (date: string) => new Intl.DateTimeFormat("en", {
  month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
}).format(new Date(`${date}T00:00:00Z`))

export function EventsAdmin({ items, tagLabels = {} }: { items: PortfolioEvent[]; tagLabels?: Record<string, string> }) {
  const router = useRouter()
  const [filter, setFilter] = useState<EventFilter>("all")
  const [editing, setEditing] = useState<PortfolioEvent | "new" | null>(null)
  const [deleting, setDeleting] = useState<PortfolioEvent | null>(null)
  const [removedIds, setRemovedIds] = useState<string[]>([])
  const [notice, setNotice] = useState("")
  const events = items.filter((item) => !removedIds.includes(item.id))
  const visibleEvents = events.filter((item) => filter === "all" || item.status === filter)
  const counts = {
    all: events.length,
    published: events.filter((event) => event.status === "published").length,
    draft: events.filter((event) => event.status === "draft").length,
  }

  function startNewEvent() {
    setNotice("")
    setEditing("new")
  }

  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Your experiences</p>
          <h2>Events</h2>
          <p className={styles.intro}>The people, places, and moments behind your work.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/events" className={styles.secondaryButton}>
            View showcase <ExternalLink size={15} aria-hidden="true" />
          </Link>
          <button id="event-add-button" type="button" className={styles.primaryButton} onClick={startNewEvent}>
            <Plus size={18} aria-hidden="true" /> Add event
          </button>
        </div>
      </div>

      {notice ? <StudioNotice>{notice}</StudioNotice> : null}

      <StudioFilter
        label="Filter events by visibility"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All events", count: counts.all },
          { value: "published", label: "Published", count: counts.published },
          { value: "draft", label: "Drafts", count: counts.draft },
        ]}
        summary={`${counts.published} on your portfolio`}
      />

      {visibleEvents.length ? (
        <div className={styles.itemList}>
          {visibleEvents.map((event) => (
            <article key={event.id} className={styles.itemCard}>
              <div className={styles.itemCover}>
                {event.photos[0] ? (
                  <EventImage photo={event.photos[0]} title={event.title} sizes="160px" />
                ) : <Camera size={30} strokeWidth={1.3} aria-hidden="true" />}
                {event.photos.length ? <span className={styles.photoCount}><Camera size={12} aria-hidden="true" />{event.photos.length}</span> : null}
              </div>
              <div className={styles.itemInfo}>
                <div className={styles.itemTags}>
                  <span className={styles.category}>{event.category}</span>
                  <span className={styles.status} data-published={event.status === "published"}>{event.status === "published" ? "Published" : "Draft"}</span>
                </div>
                <h3>{event.title}</h3>
                <div className={styles.itemMeta}>
                  <span><CalendarDays size={14} aria-hidden="true" /><time dateTime={event.date}>{displayDate(event.date)}</time></span>
                  {event.location ? <span><MapPin size={14} aria-hidden="true" />{event.location}</span> : null}
                </div>
              </div>
              <div className={styles.rowActions}>
                <button type="button" className={styles.secondaryButton} aria-label={`Edit ${event.title}`} onClick={() => { setNotice(""); setEditing(event) }}>
                  <Pencil size={15} aria-hidden="true" /> Edit
                </button>
                <button type="button" className={styles.iconButton} aria-label={`Delete ${event.title}`} onClick={() => setDeleting(event)}>
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <StudioEmpty
          icon={<Camera size={32} strokeWidth={1.3} aria-hidden="true" />}
          title={filter === "all" ? "Every event has a story." : `No ${filter === "draft" ? "drafts" : "published events"} yet.`}
          description={filter === "all" ? "Start with a hackathon, a campus moment, or a community gathering. Add your photos and make it yours." : "Choose All events to see your collection, or start a new story."}
          actionLabel={filter === "all" ? "Add your first event" : "Add event"}
          onAction={startNewEvent}
        />
      )}

      {editing ? <EventEditor key={editing === "new" ? "new" : editing.id} event={editing === "new" ? undefined : editing} tagLabels={tagLabels} onClose={() => setEditing(null)} onSaved={(status) => {
        setNotice(status === "published" ? "Event saved and published to your showcase." : "Draft saved. Publish it when you’re ready.")
        setEditing(null)
        router.refresh()
      }} /> : null}
      {deleting ? <DeleteEventDialog event={deleting} onClose={() => setDeleting(null)} onDeleted={() => {
        setRemovedIds((ids) => [...ids, deleting.id])
        setNotice("Event deleted.")
        setDeleting(null)
        router.refresh()
      }} /> : null}
    </div>
  )
}

function EventEditor({ event, tagLabels, onClose, onSaved }: {
  event?: PortfolioEvent
  tagLabels: Record<string, string>
  onClose: () => void
  onSaved: (status: "draft" | "published") => void
}) {
  const dialogRef = useModalDialog("event-add-button")
  const defaultTags: Tag[] = (event?.tags ?? []).map((slug) => ({
    slug,
    label: tagLabels[slug] ?? labelFromSlug(slug),
  }))
  const uploadRef = useRef<HTMLInputElement>(null)
  const busyRef = useRef(false)
  const [photos, setPhotos] = useState<EventPhoto[]>(event?.photos ?? [])
  const [status, setStatus] = useState<"draft" | "published">(event?.status ?? "draft")
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")
  const [uploadErrors, setUploadErrors] = useState<string[]>([])
  const [error, setError] = useState("")
  const busy = saving || uploading

  const closeEditor = () => {
    if (busyRef.current) return
    if (dirty && !window.confirm("Discard your unsaved event changes?")) return
    onClose()
  }

  async function saveEvent(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault()
    if (busyRef.current) return
    const data = new FormData(formEvent.currentTarget)
    data.set("photos", JSON.stringify(photos))
    data.set("status", status)
    busyRef.current = true
    setSaving(true)
    setError("")
    try {
      const result = await upsertEventAction(data)
      if (!result.ok) { setError(result.error ?? "The event couldn’t be saved. Please try again."); return }
      onSaved(status)
    } catch {
      setError("The event couldn’t be saved. Check your connection and try again.")
    } finally {
      busyRef.current = false
      setSaving(false)
    }
  }

  async function uploadPhotos(files: FileList | null) {
    if (!files?.length || busyRef.current) return
    const selected = Array.from(files)
    if (uploadRef.current) uploadRef.current.value = ""
    if (photos.length + selected.length > MAX_EVENT_PHOTOS) {
      setUploadErrors([`You can add up to ${MAX_EVENT_PHOTOS} photos per event. Remove a photo or choose fewer files.`])
      return
    }
    const failures: string[] = []
    busyRef.current = true
    setUploading(true)
    setUploadErrors([])
    for (const [index, file] of selected.entries()) {
      setUploadProgress(`Uploading photo ${index + 1} of ${selected.length}…`)
      if (!(EVENT_PHOTO_MIME_TYPES as readonly string[]).includes(file.type)) {
        failures.push(`${file.name}: choose a JPEG, PNG, WebP, AVIF, or GIF image.`)
        continue
      }
      if (file.size > MAX_EVENT_PHOTO_BYTES || file.size === 0) {
        failures.push(`${file.name}: choose a nonempty image no larger than ${maximumPhotoSizeLabel}.`)
        continue
      }
      try {
        const data = new FormData()
        data.set("file", file)
        const result = await uploadEventPhotoAction(data)
        if (result.ok && result.url) {
          const photo: EventPhoto = { id: crypto.randomUUID(), url: result.url, caption: "", alt: "" }
          setPhotos((current) => [...current, photo])
          setDirty(true)
        } else {
          failures.push(`${file.name}: ${result.error ?? "Upload failed. Please try again."}`)
        }
      } catch {
        failures.push(`${file.name}: upload failed. Check your connection and try again.`)
      }
    }
    setUploadErrors(failures)
    setUploadProgress(failures.length ? "Upload finished. Some photos need your attention." : `${selected.length} ${selected.length === 1 ? "photo" : "photos"} added.`)
    setUploading(false)
    busyRef.current = false
  }

  function updatePhoto(id: string, field: "caption" | "alt", value: string) {
    setPhotos((current) => current.map((photo) => photo.id === id ? { ...photo, [field]: value } : photo))
    setDirty(true)
  }

  function movePhoto(index: number, destination: number) {
    setPhotos((current) => {
      const ordered = [...current]
      const [photo] = ordered.splice(index, 1)
      ordered.splice(destination, 0, photo)
      return ordered
    })
    setDirty(true)
  }

  return (
    <dialog ref={dialogRef} className={`${styles.dialog} ${styles.editor}`} aria-labelledby="event-editor-title" onCancel={(e) => { e.preventDefault(); closeEditor() }}>
      <form onSubmit={saveEvent} onChange={() => setDirty(true)} className={styles.editorForm}>
        {event ? <input type="hidden" name="id" value={event.id} /> : null}
        <header className={styles.dialogHeader}>
          <div><p className={styles.eyebrow}>{event ? "Your event" : "A new memory"}</p><h2 id="event-editor-title">{event ? "Edit event" : "Add event"}</h2></div>
          <button type="button" className={styles.iconButton} onClick={closeEditor} disabled={busy} aria-label="Close event editor"><X size={21} aria-hidden="true" /></button>
        </header>
        <div className={styles.editorBody}>
          <fieldset className={styles.formSection} disabled={saving}>
            <legend>The essentials</legend>
            <p className={styles.sectionDescription}>Give this experience a name and a place in your story.</p>
            <label className={styles.field}>Event name <span aria-hidden="true">*</span><input name="title" required maxLength={160} defaultValue={event?.title} placeholder="e.g. Seoul Campus Hackathon" autoFocus /></label>
            <div className={styles.fieldGrid}>
              <label className={styles.field}>Category<select name="category" defaultValue={event?.category ?? "Hackathon"}>{EVENT_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
              <label className={styles.field}>Date <span aria-hidden="true">*</span><input name="date" type="date" required defaultValue={event?.date} /></label>
              <label className={styles.field}>Location<input name="location" maxLength={200} defaultValue={event?.location} placeholder="City, venue, or online" /></label>
              <label className={styles.field}>Organizer<input name="organizer" maxLength={200} defaultValue={event?.organizer} placeholder="University or community" /></label>
            </div>
          </fieldset>

          <fieldset className={styles.formSection} disabled={saving}>
            <legend>The story</legend>
            <label className={styles.field}>Your experience<textarea name="description" rows={4} maxLength={6000} defaultValue={event?.description} placeholder="What did you create, learn, or take away from the event?" /></label>
            <label className={styles.field}>A highlight<input name="highlight" maxLength={300} defaultValue={event?.highlight} placeholder="e.g. Finalist · Built a project with a team of four" /><small>A memorable achievement or moment to feature.</small></label>
            <label className={styles.field}>Event or project link<input name="url" type="url" maxLength={2048} defaultValue={event?.url} placeholder="https://" /></label>
          </fieldset>

          <fieldset className={styles.formSection} disabled={busy}>
            <legend>Photos <span className={styles.legendCount}>{photos.length}/{MAX_EVENT_PHOTOS}</span></legend>
            <p className={styles.sectionDescription}>Your first photo is the cover. Add captions to tell the story behind each moment.</p>
            <input ref={uploadRef} id="event-photo-upload" className={styles.hiddenInput} type="file" accept={EVENT_PHOTO_MIME_TYPES.join(",")} multiple disabled={busy || photos.length >= MAX_EVENT_PHOTOS} onChange={(e) => { void uploadPhotos(e.target.files) }} />
            <button className={styles.uploadButton} type="button" disabled={busy || photos.length >= MAX_EVENT_PHOTOS} onClick={() => uploadRef.current?.click()}>
              <ImagePlus size={25} strokeWidth={1.5} aria-hidden="true" /><span>Add photos<small>JPEG, PNG, WebP, AVIF, or GIF · Up to {maximumPhotoSizeLabel} each</small></span><Plus size={19} aria-hidden="true" />
            </button>
            <div className={styles.uploadFeedback}>
              {uploadProgress ? <p className={styles.uploadStatus} role="status">{uploading ? <LoaderCircle size={16} className={styles.spinner} aria-hidden="true" /> : null}{uploadProgress}</p> : null}
              {uploadErrors.length ? <div className={styles.error} role="alert"><p>Some photos weren’t added. You can select them again to retry.</p><ul>{uploadErrors.map((message, index) => <li key={`${index}-${message}`}>{message}</li>)}</ul></div> : null}
            </div>
            <div className={styles.photoList}>
              {photos.map((photo, index) => <div className={styles.photoEditor} key={photo.id}>
                <div className={styles.photoPreview}><EventImage photo={photo} title={`Event photo ${index + 1}`} sizes="(max-width: 600px) 80vw, 160px" />{index === 0 ? <span className={styles.coverLabel}>Cover photo</span> : null}</div>
                <div className={styles.photoFields}>
                  <label className={styles.field}>Caption for photo {index + 1}<textarea rows={2} value={photo.caption} maxLength={500} onChange={(e) => updatePhoto(photo.id, "caption", e.target.value)} placeholder="The moment behind the photo…" /></label>
                  <label className={styles.field}>Image description<input value={photo.alt} maxLength={300} onChange={(e) => updatePhoto(photo.id, "alt", e.target.value)} placeholder="Describe the photo for screen readers" /></label>
                  <div className={styles.photoActions}>
                    {index > 0 ? <button type="button" className={styles.textButton} onClick={() => movePhoto(index, 0)}>Make cover</button> : <span className={styles.coverHint}><Check size={13} aria-hidden="true" /> Showcase cover</span>}
                    <div className={styles.photoIconActions}>
                      <button type="button" className={styles.iconButton} disabled={busy || index === 0} onClick={() => movePhoto(index, index - 1)} aria-label={`Move photo ${index + 1} earlier`}><ArrowUp size={16} aria-hidden="true" /></button>
                      <button type="button" className={styles.iconButton} disabled={busy || index === photos.length - 1} onClick={() => movePhoto(index, index + 1)} aria-label={`Move photo ${index + 1} later`}><ArrowDown size={16} aria-hidden="true" /></button>
                      <button type="button" className={styles.iconButton} onClick={() => { setPhotos((current) => current.filter((item) => item.id !== photo.id)); setDirty(true) }} aria-label={`Remove photo ${index + 1}`}><Trash2 size={16} aria-hidden="true" /></button>
                    </div>
                  </div>
                </div>
              </div>)}
            </div>
          </fieldset>

          <fieldset className={styles.formSection} disabled={saving}>
            <legend>Tags &amp; social preview</legend>
            <p className={styles.sectionDescription}>Tags create crawlable topic pages at <code>/tags</code>. The social image defaults to your cover photo when left blank.</p>
            <TagsInput defaultTags={defaultTags} onChange={() => setDirty(true)} />
            <label className={styles.field}>Social image URL<input name="og_image" type="url" maxLength={2048} defaultValue={event?.ogImage} placeholder="Defaults to the cover photo" /><small>Optional. Used for link previews when sharing this event.</small></label>
          </fieldset>

          <fieldset className={styles.visibilitySection} disabled={saving}>
            <legend>Visibility</legend>
            <div className={styles.visibilityRow}>
              <p>{status === "published" ? "This event will appear on your public showcase." : "Only you can see this event until you publish it."}</p>
              <label className={styles.field}><span className={styles.visuallyHidden}>Event visibility</span><select value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")}><option value="draft">Draft</option><option value="published">Published</option></select></label>
            </div>
          </fieldset>
        </div>
        <footer className={styles.dialogFooter}>
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          <div className={styles.footerRow}><p>{uploading ? "Finish uploading before saving." : status === "published" ? "Ready for your portfolio." : "Save now. Share when you’re ready."}</p><div className={styles.footerButtons}>
            <button type="button" className={styles.secondaryButton} disabled={busy} onClick={closeEditor}>Cancel</button>
            <button type="submit" className={styles.primaryButton} disabled={busy}>{saving ? <><LoaderCircle size={16} className={styles.spinner} aria-hidden="true" />Saving…</> : status === "published" ? "Save & publish" : "Save draft"}</button>
          </div></div>
        </footer>
      </form>
    </dialog>
  )
}

function DeleteEventDialog({ event, onClose, onDeleted }: { event: PortfolioEvent; onClose: () => void; onDeleted: () => void }) {
  return (
    <DeleteConfirmDialog
      titleId="delete-event-title"
      descriptionId="delete-event-description"
      title="Delete this event?"
      description={`“${event.title}” and its captions will be removed from your showcase. This cannot be undone.`}
      cancelLabel="Keep event"
      confirmLabel="Delete event"
      restoreFocusId="event-add-button"
      fallbackError="Couldn’t delete this event. Please try again."
      networkError="Couldn’t delete this event. Check your connection and try again."
      onClose={onClose}
      onDeleted={onDeleted}
      onConfirm={() => deleteEventAction(event.id)}
    />
  )
}
