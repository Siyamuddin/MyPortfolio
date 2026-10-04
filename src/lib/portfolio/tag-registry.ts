import type { SupabaseClient } from "@supabase/supabase-js"
import type { Tag } from "@/lib/portfolio/tags"

/**
 * Best-effort upsert of the display labels for a set of tags. Called whenever an
 * admin saves tagged content so the normalized `tags` registry stays in sync
 * with the slugs stored on each item. Failures (e.g. the registry table is not
 * migrated yet) are logged but never block the content save.
 */
export const syncTagRegistry = async (
  client: SupabaseClient,
  tags: Tag[]
): Promise<void> => {
  if (!tags.length) return
  const now = new Date().toISOString()
  const rows = tags.map((tag) => ({
    slug: tag.slug,
    label: tag.label,
    updated_at: now,
  }))
  const { error } = await client.from("tags").upsert(rows, { onConflict: "slug" })
  if (error) {
    console.error("[tags] registry sync skipped", error.message)
  }
}
