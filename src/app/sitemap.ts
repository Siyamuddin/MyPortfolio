import type { MetadataRoute } from "next"
import { getPortfolio, getPortfolioFreshness } from "@/lib/portfolio/repository"
import { getPublishedEvents } from "@/lib/portfolio/events-repository"
import { getTagsWithCounts } from "@/lib/portfolio/tags-repository"
import { SITE_URL } from "@/lib/seo"

const toLastModified = (value: string | Date | undefined) => {
  if (!value) return undefined
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [siteFreshness, portfolio, events, tags] = await Promise.all([
    getPortfolioFreshness(),
    getPortfolio(),
    getPublishedEvents(),
    getTagsWithCounts(),
  ])
  const lastModified = toLastModified(siteFreshness)

  const articleEntries = portfolio.blogPosts
    .filter((post) => post.status === "published" && post.body.trim() && post.slug)
    .map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: toLastModified(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }))

  // Each published event is a crawlable detail URL with its own freshness.
  const eventEntries = events.map((event) => ({
    url: `${SITE_URL}/events/${event.slug}`,
    lastModified: toLastModified(event.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const tagEntries = tags.map((tag) => ({
    url: `${SITE_URL}/tags/${tag.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }))

  const tagsIndexEntry = tags.length
    ? [
        {
          url: `${SITE_URL}/tags`,
          lastModified,
          changeFrequency: "weekly" as const,
          priority: 0.5,
        },
      ]
    : []

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/resume`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/portfolio`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/events`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...eventEntries,
    ...articleEntries,
    ...tagsIndexEntry,
    ...tagEntries,
    {
      url: `${SITE_URL}/contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ]
}
