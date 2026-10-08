import type { SupabaseClient } from "@supabase/supabase-js"
import { z } from "zod"
import { assertAgentDbReady, type AgentFail } from "@/lib/agent/common"
import { slugifyTitle } from "@/lib/portfolio/blog"
import {
  EVENTS_SETUP_MESSAGE,
  eventRowSchema,
  eventSchema,
  isMissingEventsTable,
  isSafeEventPhotoUrl,
  type EventRow,
} from "@/lib/portfolio/events"
import { refreshEvents } from "@/lib/portfolio/events-cache"
import { syncTagRegistry } from "@/lib/portfolio/tag-registry"
import {
  MAX_TAGS_PER_ITEM,
  labelFromSlug,
  tagSlugSchema,
} from "@/lib/portfolio/tags"
import { createServiceClient } from "@/lib/supabase/admin"

export { assertAgentDbReady }

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case")

const eventWriteSchema = eventSchema.omit({ id: true }).extend({
  slug: slugSchema.optional(),
})

/**
 * Create validates through eventSchema. Omitted optional fields default here
 * so a short JSON body still satisfies the admin schema. Status defaults to
 * draft unless the body sets published.
 */
export const createEventSchema = z.preprocess((input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) return input
  return {
    location: "",
    organizer: "",
    description: "",
    highlight: "",
    url: "",
    status: "draft",
    photos: [],
    tags: [],
    og_image: "",
    ...(input as Record<string, unknown>),
  }
}, eventWriteSchema)

/**
 * Partial update. Tags and og_image have no defaults here: an omitted field
 * stays as stored, instead of being cleared.
 */
export const updateEventSchema = z
  .object({
    title: eventSchema.shape.title.optional(),
    category: eventSchema.shape.category.optional(),
    date: eventSchema.shape.date.optional(),
    location: eventSchema.shape.location.optional(),
    organizer: eventSchema.shape.organizer.optional(),
    description: eventSchema.shape.description.optional(),
    highlight: eventSchema.shape.highlight.optional(),
    url: eventSchema.shape.url.optional(),
    status: eventSchema.shape.status.optional(),
    photos: eventSchema.shape.photos.optional(),
    tags: z
      .array(tagSlugSchema)
      .max(MAX_TAGS_PER_ITEM, `Add up to ${MAX_TAGS_PER_ITEM} tags.`)
      .transform((slugs) => Array.from(new Set(slugs)))
      .optional(),
    og_image: z
      .string()
      .trim()
      .max(2048)
      .refine(
        (value) => !value || isSafeEventPhotoUrl(value),
        "Use an HTTPS image URL for the social preview."
      )
      .optional(),
    slug: slugSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })

export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>

const EVENT_COLUMNS =
  "id,slug,title,category,date,location,organizer,description,highlight,url,status,photos,tags,og_image,created_at,updated_at"

type DbError = { code?: string; message: string }

export const toPublicEvent = (row: EventRow, raw?: unknown) => {
  const createdAt =
    raw &&
    typeof raw === "object" &&
    typeof (raw as { created_at?: unknown }).created_at === "string"
      ? (raw as { created_at: string }).created_at
      : null

  return {
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
    og_image: row.og_image ?? "",
    created_at: createdAt,
    updated_at: row.updated_at ?? null,
  }
}

const mapWriteError = (error: DbError): AgentFail => {
  if (isMissingEventsTable(error)) {
    return { ok: false, error: EVENTS_SETUP_MESSAGE, status: 503 }
  }
  if (error.code === "23505") {
    return { ok: false, error: "An event with this slug already exists", status: 409 }
  }
  return { ok: false, error: error.message, status: 500 }
}

const syncEventTags = async (admin: SupabaseClient, tags: string[]) => {
  await syncTagRegistry(
    admin,
    tags.map((slug) => ({ slug, label: labelFromSlug(slug) }))
  )
}

const finishWrite = (
  data: unknown,
  previousSlug?: string
): { ok: true; event: ReturnType<typeof toPublicEvent> } | AgentFail => {
  const parsed = eventRowSchema.safeParse(data)
  const rawSlug =
    data &&
    typeof data === "object" &&
    typeof (data as { slug?: unknown }).slug === "string"
      ? (data as { slug: string }).slug
      : undefined

  if (previousSlug) refreshEvents(previousSlug)
  if (rawSlug && rawSlug !== previousSlug) refreshEvents(rawSlug)
  if (!previousSlug && !rawSlug) refreshEvents()

  if (!parsed.success) {
    return { ok: false, error: "Saved event could not be read back.", status: 500 }
  }
  return { ok: true, event: toPublicEvent(parsed.data, data) }
}

export const listEvents = async () => {
  const admin = createServiceClient()
  const { data, error } = await admin
    .from("events")
    .select(EVENT_COLUMNS)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) return mapWriteError(error)

  const events = []
  for (const row of data ?? []) {
    const parsed = eventRowSchema.safeParse(row)
    if (!parsed.success) {
      return { ok: false as const, error: "Could not read events.", status: 500 }
    }
    events.push(toPublicEvent(parsed.data, row))
  }
  return { ok: true as const, events }
}

export const createEvent = async (input: CreateEventInput) => {
  const admin = createServiceClient()
  const { slug, tags, ...rest } = input
  const row = {
    ...rest,
    tags,
    ...(slug ? { slug } : {}),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await admin.from("events").insert(row).select(EVENT_COLUMNS).single()
  if (error) return mapWriteError(error)
  if (!data) return { ok: false as const, error: "Could not save this event.", status: 500 }

  await syncEventTags(admin, tags)
  return finishWrite(data)
}

export const getEventBySlug = async (slug: string) => {
  const key = slug.trim()
  if (!key) return { ok: false as const, error: "Event not found", status: 404 }

  const admin = createServiceClient()
  const { data, error } = await admin
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("slug", key)
    .maybeSingle()

  if (error) return mapWriteError(error)
  if (!data) return { ok: false as const, error: "Event not found", status: 404 }

  const parsed = eventRowSchema.safeParse(data)
  if (!parsed.success) {
    return { ok: false as const, error: "Could not read this event.", status: 500 }
  }
  return { ok: true as const, event: toPublicEvent(parsed.data, data) }
}

export const updateEventBySlug = async (slug: string, input: UpdateEventInput) => {
  const key = slug.trim()
  if (!key) return { ok: false as const, error: "Event not found", status: 404 }

  const admin = createServiceClient()
  const { data: existing, error: findError } = await admin
    .from("events")
    .select("id, slug")
    .eq("slug", key)
    .maybeSingle()

  if (findError) return mapWriteError(findError)
  if (!existing) return { ok: false as const, error: "Event not found", status: 404 }

  const row = {
    ...input,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await admin
    .from("events")
    .update(row)
    .eq("id", existing.id)
    .select(EVENT_COLUMNS)
    .single()

  if (error) return mapWriteError(error)
  if (!data) return { ok: false as const, error: "Could not save this event.", status: 500 }

  if (input.tags) await syncEventTags(admin, input.tags)
  return finishWrite(data, typeof existing.slug === "string" ? existing.slug : key)
}

export const deleteEventBySlug = async (slug: string) => {
  const key = slug.trim()
  if (!key) return { ok: false as const, error: "Event not found", status: 404 }

  const admin = createServiceClient()
  const { data: existing, error: findError } = await admin
    .from("events")
    .select("id, slug, title")
    .eq("slug", key)
    .maybeSingle()

  if (findError) return mapWriteError(findError)
  if (!existing) return { ok: false as const, error: "Event not found", status: 404 }

  const { data: removed, error } = await admin
    .from("events")
    .delete()
    .eq("id", existing.id)
    .select("id")
    .maybeSingle()
  if (error) return mapWriteError(error)
  if (!removed) return { ok: false as const, error: "Event not found", status: 404 }

  const deletedSlug = typeof existing.slug === "string" ? existing.slug : key
  refreshEvents(deletedSlug)
  return {
    ok: true as const,
    deleted: {
      id: existing.id as string,
      slug: deletedSlug,
      title: existing.title as string,
    },
  }
}
