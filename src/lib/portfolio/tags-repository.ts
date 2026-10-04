import { cache } from "react"
import { unstable_cache } from "next/cache"
import { createClient } from "@supabase/supabase-js"
import { getPublishedEvents } from "@/lib/portfolio/events-repository"
import type { PortfolioEvent } from "@/lib/portfolio/events"
import { getPortfolio } from "@/lib/portfolio/repository"
import {
  labelFromSlug,
  TAGS_CACHE_TAG,
  type Tag,
  type TagWithCount,
} from "@/lib/portfolio/tags"
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/env"
import type { BlogPost, Project } from "@/lib/types"

export { syncTagRegistry } from "@/lib/portfolio/tag-registry"

export type TagContent = {
  events: PortfolioEvent[]
  posts: BlogPost[]
  projects: Project[]
}

const getCachedRegistry = unstable_cache(
  async (): Promise<Tag[]> => {
    const { url, anonKey } = getSupabaseEnv()
    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data, error } = await supabase
      .from("tags")
      .select("slug,label")
      .order("label", { ascending: true })

    if (error) {
      // Registry table absent (pre-migration) → fall back to derived labels.
      return []
    }
    return (data ?? []).map((row) => ({
      slug: String(row.slug),
      label: String(row.label),
    }))
  },
  ["portfolio-tag-registry"],
  { tags: [TAGS_CACHE_TAG], revalidate: 3600 }
)

/** The owner-managed tag registry (slug → display label). Empty in static mode. */
export const getTagRegistry = cache(async (): Promise<Tag[]> => {
  if (!isSupabaseConfigured()) return []
  try {
    return await getCachedRegistry()
  } catch {
    return []
  }
})

const getRegistryMap = cache(async (): Promise<Map<string, string>> => {
  const registry = await getTagRegistry()
  return new Map(registry.map((tag) => [tag.slug, tag.label]))
})

/** Resolve a slug to its display label, deriving a readable fallback if unknown. */
export const resolveTagLabel = (
  slug: string,
  registry: Map<string, string>
): string => registry.get(slug) ?? labelFromSlug(slug)

const collectContent = cache(async (): Promise<{
  events: PortfolioEvent[]
  posts: BlogPost[]
  projects: Project[]
}> => {
  const [portfolio, events] = await Promise.all([
    getPortfolio(),
    getPublishedEvents(),
  ])
  return {
    events,
    posts: portfolio.blogPosts.filter((post) => post.status === "published"),
    projects: portfolio.projects,
  }
})

/** Every tag used by published content, with usage counts and display labels. */
export const getTagsWithCounts = cache(async (): Promise<TagWithCount[]> => {
  const [{ events, posts, projects }, registry] = await Promise.all([
    collectContent(),
    getRegistryMap(),
  ])
  const counts = new Map<string, number>()
  const tally = (slugs: string[]) => {
    for (const slug of slugs) counts.set(slug, (counts.get(slug) ?? 0) + 1)
  }
  events.forEach((event) => tally(event.tags))
  posts.forEach((post) => tally(post.tags))
  projects.forEach((project) => tally(project.tags))

  return Array.from(counts.entries())
    .map(([slug, count]) => ({
      slug,
      label: resolveTagLabel(slug, registry),
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
})

/** Published content carrying a given tag slug, grouped by content type. */
export const getContentForTag = cache(
  async (slug: string): Promise<TagContent> => {
    const { events, posts, projects } = await collectContent()
    return {
      events: events.filter((event) => event.tags.includes(slug)),
      posts: posts.filter((post) => post.tags.includes(slug)),
      projects: projects.filter((project) => project.tags.includes(slug)),
    }
  }
)

/** Resolve a tag's display label for a detail page. */
export const getTag = cache(async (slug: string): Promise<Tag> => {
  const registry = await getRegistryMap()
  return { slug, label: resolveTagLabel(slug, registry) }
})
