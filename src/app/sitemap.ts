import type { MetadataRoute } from "next"
import { getPortfolio, getPortfolioFreshness } from "@/lib/portfolio/repository"
import { SITE_URL } from "@/lib/seo"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [lastModified, portfolio] = await Promise.all([
    getPortfolioFreshness(),
    getPortfolio(),
  ])

  const articleEntries = portfolio.blogPosts
    .filter((post) => post.status === "published" && post.body.trim() && post.slug)
    .map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }))

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
    ...articleEntries,
    {
      url: `${SITE_URL}/contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ]
}
