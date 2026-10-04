"use server"

import { randomUUID } from "node:crypto"
import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"
import { requireAdmin, type ActionResult } from "@/lib/portfolio/auth-actions"
import {
  EVENTS_CACHE_TAG,
  EVENTS_SETUP_MESSAGE,
  EVENT_PHOTO_MIME_TYPES,
  MAX_EVENT_PHOTO_BYTES,
  eventSchema,
  isMissingEventsTable,
} from "@/lib/portfolio/events"
import { syncTagRegistry } from "@/lib/portfolio/tag-registry"
import { parseTagInput, TAGS_CACHE_TAG } from "@/lib/portfolio/tags"

const refreshEvents = (slug?: string) => {
  revalidateTag(EVENTS_CACHE_TAG)
  revalidateTag(TAGS_CACHE_TAG)
  revalidatePath("/")
  revalidatePath("/events")
  if (slug) revalidatePath(`/events/${slug}`)
  revalidatePath("/tags", "layout")
  revalidatePath("/admin/events")
  revalidatePath("/admin")
  revalidatePath("/sitemap.xml")
}

const actionError = (error: unknown, fallback: string): ActionResult => ({
  ok: false,
  error: error instanceof z.ZodError
    ? error.issues[0]?.message ?? fallback
    : error instanceof Error ? error.message : fallback,
})

export const upsertEventAction = async (formData: FormData): Promise<ActionResult> => {
  try {
    const { supabase } = await requireAdmin()
    const photosJson = formData.get("photos")
    let photos: unknown = []
    if (photosJson !== null) {
      if (typeof photosJson !== "string" || photosJson.length > 100_000) {
        return { ok: false, error: "The photo collection is too large." }
      }
      try {
        photos = JSON.parse(photosJson)
      } catch {
        return { ok: false, error: "The photo collection could not be read. Please reload and try again." }
      }
    }
    const tags = parseTagInput(formData.get("tags"))
    const { id, ...payload } = eventSchema.parse({
      id: formData.get("id") || undefined,
      title: formData.get("title"),
      category: formData.get("category"),
      date: formData.get("date"),
      location: formData.get("location") ?? "",
      organizer: formData.get("organizer") ?? "",
      description: formData.get("description") ?? "",
      highlight: formData.get("highlight") ?? "",
      url: formData.get("url") ?? "",
      status: formData.get("status") ?? "draft",
      photos,
      tags: tags.map((tag) => tag.slug),
      og_image: formData.get("og_image") ?? "",
    })
    const row = { ...payload, updated_at: new Date().toISOString() }
    const query = id
      ? supabase.from("events").update(row).eq("id", id)
      : supabase.from("events").insert(row)
    const { data, error } = await query.select("id,slug").maybeSingle()
    if (error) return { ok: false, error: isMissingEventsTable(error) ? EVENTS_SETUP_MESSAGE : "Could not save this event. Please try again." }
    if (!data) return { ok: false, error: "This event no longer exists. Reload before saving again." }
    await syncTagRegistry(supabase, tags)
    refreshEvents((data as { slug?: string }).slug)
    return { ok: true }
  } catch (error) {
    return actionError(error, "Could not save this event.")
  }
}

export const deleteEventAction = async (id: string): Promise<ActionResult> => {
  try {
    const { supabase } = await requireAdmin()
    const eventId = z.string().uuid().parse(id)
    const { data, error } = await supabase.from("events").delete().eq("id", eventId).select("id").maybeSingle()
    if (error) return { ok: false, error: isMissingEventsTable(error) ? EVENTS_SETUP_MESSAGE : "Could not delete this event. Please try again." }
    if (!data) return { ok: false, error: "This event no longer exists. Reload to update your list." }
    refreshEvents()
    return { ok: true }
  } catch (error) {
    return actionError(error, "Could not delete this event.")
  }
}

const matchesImageSignature = (bytes: Uint8Array, mime: string) => {
  const text = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end))
  switch (mime) {
    case "image/jpeg": return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    case "image/png": return bytes[0] === 0x89 && text(1, 4) === "PNG" && bytes[4] === 13 && bytes[5] === 10 && bytes[6] === 26 && bytes[7] === 10
    case "image/gif": return text(0, 6) === "GIF87a" || text(0, 6) === "GIF89a"
    case "image/webp": return text(0, 4) === "RIFF" && text(8, 12) === "WEBP"
    case "image/avif": return text(4, 8) === "ftyp" && /avif|avis/.test(text(8, 32))
    default: return false
  }
}

export const uploadEventPhotoAction = async (formData: FormData): Promise<ActionResult> => {
  try {
    const { supabase } = await requireAdmin()
    const file = formData.get("file")
    if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choose a photo to upload." }
    if (file.size > MAX_EVENT_PHOTO_BYTES) return { ok: false, error: "Each photo must be 4 MB or smaller." }
    if (!(EVENT_PHOTO_MIME_TYPES as readonly string[]).includes(file.type)) {
      return { ok: false, error: "Use a JPEG, PNG, WebP, AVIF, or GIF photo." }
    }
    const signature = new Uint8Array(await file.slice(0, 32).arrayBuffer())
    if (!matchesImageSignature(signature, file.type)) {
      return { ok: false, error: "This file does not appear to be a valid photo. Export it as JPEG, PNG, WebP, AVIF, or GIF and try again." }
    }
    const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1]
    const path = `events/${randomUUID()}.${extension}`
    const { error } = await supabase.storage.from("portfolio").upload(path, file, {
      upsert: false,
      contentType: file.type,
      cacheControl: "31536000",
    })
    if (error) return { ok: false, error: "Could not upload this photo. Please try again." }
    const { data } = supabase.storage.from("portfolio").getPublicUrl(path)
    return { ok: true, url: data.publicUrl }
  } catch (error) {
    return actionError(error, "Could not upload this photo.")
  }
}
