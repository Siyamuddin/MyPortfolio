import { z } from "zod"
import { contentTagsSchema } from "@/lib/portfolio/tags"
import { slugifyTitle } from "@/lib/portfolio/blog"

export const EVENT_CATEGORIES = [
  "Hackathon",
  "University",
  "Conference",
  "Workshop",
  "Community",
  "Other",
] as const

export type EventCategory = (typeof EVENT_CATEGORIES)[number]
export type EventPhoto = { id: string; url: string; caption: string; alt: string }
export type PortfolioEvent = {
  id: string
  slug: string
  title: string
  category: EventCategory
  date: string
  location: string
  organizer: string
  description: string
  highlight: string
  url: string
  status: "draft" | "published"
  photos: EventPhoto[]
  tags: string[]
  ogImage: string
  updatedAt?: string
}

export const EVENTS_CACHE_TAG = "portfolio-events"
export const MAX_EVENT_PHOTOS = 20
// Leave room for multipart fields below Vercel's 4.5 MB request limit.
export const MAX_EVENT_PHOTO_BYTES = 4 * 1024 * 1024
export const EVENT_PHOTO_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
] as const

const isHttpUrl = (value: string, httpsOnly = false) => {
  if (/[\u0000-\u0020\\]/.test(value)) return false
  try {
    const url = new URL(value)
    return (
      (url.protocol === "https:" || (!httpsOnly && url.protocol === "http:")) &&
      !url.username &&
      !url.password
    )
  } catch {
    return false
  }
}

export const isSafeEventPhotoUrl = (value: string) =>
  (/^\/images\//.test(value) && !/[\u0000-\u0020\\]/.test(value)) ||
  isHttpUrl(value, true)

export const isValidEventDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith("0000-")) return false
  const date = new Date(`${value}T12:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export const formatEventDate = (value: string) => {
  if (!isValidEventDate(value)) return "Date to be announced"
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`))
}

export const eventPhotoSchema = z.object({
  id: z.string().uuid("Each photo needs a valid identifier."),
  url: z.string().trim().max(2048).refine(isSafeEventPhotoUrl, "Use an HTTPS photo URL."),
  caption: z.string().trim().max(500, "Photo captions can contain up to 500 characters."),
  alt: z.string().trim().max(300, "Photo descriptions can contain up to 300 characters."),
})

export const eventSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1, "Give this event a title.").max(160, "Titles can contain up to 160 characters."),
  category: z.enum(EVENT_CATEGORIES),
  date: z.string().refine(isValidEventDate, "Choose a valid event date."),
  location: z.string().trim().max(200),
  organizer: z.string().trim().max(200),
  description: z.string().trim().max(6000, "Event descriptions can contain up to 6,000 characters."),
  highlight: z.string().trim().max(300),
  url: z.string().trim().max(2048).refine((value) => !value || isHttpUrl(value), "Use a complete HTTP or HTTPS event link."),
  status: z.enum(["draft", "published"]),
  photos: z.array(eventPhotoSchema).max(MAX_EVENT_PHOTOS, `Add up to ${MAX_EVENT_PHOTOS} photos per event.`)
    .refine((photos) => new Set(photos.map((photo) => photo.id)).size === photos.length, "Each photo must have a unique identifier."),
  tags: contentTagsSchema,
  og_image: z.string().trim().max(2048).refine((value) => !value || isSafeEventPhotoUrl(value), "Use an HTTPS image URL for the social preview.").optional().default(""),
})

/** Shape read back from the database. */
export const eventRowSchema = eventSchema.extend({
  id: z.string().uuid(),
  slug: z.string().trim().optional(),
  updated_at: z.string().optional(),
})

export type EventRow = z.infer<typeof eventRowSchema>

/** The event cover: an explicit OG image, else the first photo, else empty. */
export const resolveEventCover = (event: Pick<PortfolioEvent, "ogImage" | "photos">): string =>
  event.ogImage || event.photos[0]?.url || ""

/** Map a validated database row to the camelCase domain object pages consume. */
export const mapEventRow = (row: EventRow): PortfolioEvent => ({
  id: row.id,
  slug: row.slug?.trim() || slugifyTitle(row.title) || "event",
  title: row.title,
  category: row.category,
  date: row.date,
  location: row.location,
  organizer: row.organizer,
  description: row.description,
  highlight: row.highlight,
  url: row.url,
  status: row.status,
  photos: row.photos,
  tags: row.tags ?? [],
  ogImage: row.og_image ?? "",
  updatedAt: row.updated_at,
})

export const isMissingEventsTable = (error: { code?: string }) =>
  error.code === "42P01" || error.code === "PGRST205"

export const EVENTS_SETUP_MESSAGE =
  "Events storage is not set up yet. Apply the portfolio_events Supabase migration, then reload this page."
