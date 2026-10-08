import { z } from "zod"

export const MAX_TAGS_PER_ITEM = 12
export const TAG_SLUG_MAX = 50
export const TAG_LABEL_MAX = 40
export const TAGS_CACHE_TAG = "portfolio-tags"

export type Tag = { slug: string; label: string }
export type TagWithCount = Tag & { count: number }

export const TAG_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Produce a clean, URL-safe tag slug from arbitrary user input. */
export const slugifyTag = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, TAG_SLUG_MAX)
    .replace(/-$/g, "")

/** Fallback human label when a slug has no registry entry. */
export const labelFromSlug = (slug: string): string =>
  slug
    .split("-")
    .filter(Boolean)
    .map((part) => (part.length <= 3 ? part.toUpperCase() : part[0].toUpperCase() + part.slice(1)))
    .join(" ")

/** Normalize a single raw label into a `{ slug, label }` pair, or null if empty. */
export const normalizeTag = (raw: string): Tag | null => {
  const label = raw.replace(/\s+/g, " ").trim().slice(0, TAG_LABEL_MAX)
  const slug = slugifyTag(label)
  if (!slug) return null
  return { slug, label }
}

/** Accept raw labels (array or comma/newline-separated string) → deduped, capped tags. */
export const normalizeTags = (input: string[] | string): Tag[] => {
  const raws = Array.isArray(input)
    ? input
    : input.split(/[\n,]/)
  const seen = new Set<string>()
  const tags: Tag[] = []
  for (const raw of raws) {
    const tag = normalizeTag(raw)
    if (!tag || seen.has(tag.slug)) continue
    seen.add(tag.slug)
    tags.push(tag)
    if (tags.length >= MAX_TAGS_PER_ITEM) break
  }
  return tags
}

export const tagSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(TAG_SLUG_MAX)
  .regex(TAG_SLUG_PATTERN, "Tags may only contain lowercase letters, numbers and hyphens.")

/** Slugs stored on content rows (events, posts, projects). */
export const contentTagsSchema = z
  .array(tagSlugSchema)
  .max(MAX_TAGS_PER_ITEM, `Add up to ${MAX_TAGS_PER_ITEM} tags.`)
  .default([])
  .transform((slugs) => Array.from(new Set(slugs)))

/**
 * Parse the admin tag field. Accepts a JSON array of raw labels and returns the
 * normalized registry entries plus the slugs to store on the content row.
 */
export const parseTagInput = (value: FormDataEntryValue | null): Tag[] => {
  if (typeof value !== "string" || !value.trim()) return []
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return normalizeTags(parsed.map((entry) => String(entry)))
    }
  } catch {
    // Fall back to treating the raw value as comma/newline separated labels.
    return normalizeTags(value)
  }
  return []
}
