"use server"

import { randomUUID } from "node:crypto"
import { z } from "zod"
import type { ActionResult } from "@/lib/portfolio/auth-actions"
import { requireAdmin } from "@/lib/portfolio/auth"
import {
  EVENTS_SETUP_MESSAGE,
  EVENT_PHOTO_MIME_TYPES,
  eventSchema,
  isMissingEventsTable,
} from "@/lib/portfolio/events"
import { MAX_UPLOAD_BYTES, preparePortfolioUpload } from "@/lib/upload-limit"
import { refreshEvents } from "@/lib/portfolio/events-cache"
import { syncTagRegistry } from "@/lib/portfolio/tag-registry"
import { parseTagInput } from "@/lib/portfolio/tags"

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

const eventUploadError = (reason: "folder" | "type" | "bytes", fallback: string) => {
  if (reason === "type") return "Use a JPEG, PNG, WebP, AVIF, or GIF photo."
  if (reason === "bytes") return "This file does not appear to be a valid photo. Export it as JPEG, PNG, WebP, AVIF, or GIF and try again."
  return fallback
}

export const uploadEventPhotoAction = async (formData: FormData): Promise<ActionResult> => {
  try {
    const { supabase } = await requireAdmin()
    const file = formData.get("file")
    if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choose a photo to upload." }
    if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: "Each photo must be 4 MB or smaller." }
    const prepared = await preparePortfolioUpload(file, "events", {
      types: EVENT_PHOTO_MIME_TYPES,
      folders: ["events"],
    })
    if (!prepared.ok) return { ok: false, error: eventUploadError(prepared.reason, prepared.error) }
    const path = `events/${randomUUID()}.${prepared.extension}`
    const { error } = await supabase.storage.from("portfolio").upload(path, file, {
      upsert: false,
      contentType: prepared.contentType,
      cacheControl: "31536000",
    })
    if (error) return { ok: false, error: "Could not upload this photo. Please try again." }
    const { data } = supabase.storage.from("portfolio").getPublicUrl(path)
    return { ok: true, url: data.publicUrl }
  } catch (error) {
    return actionError(error, "Could not upload this photo.")
  }
}
