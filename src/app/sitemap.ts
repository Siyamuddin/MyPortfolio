import type { MetadataRoute } from "next"
import { getPortfolio, getPortfolioFreshness } from "@/lib/portfolio/repository"
import { SITE_URL, pagePaths } from "@/lib/seo"
import { isoDate } from "@/lib/seo/dates"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [freshness, portfolio] = await Promise.all([getPortfolioFreshness(), getPortfolio()])
  const lastModified = portfolio.source === "supabase" ? freshness : undefined
  return [
    ...Object.values(pagePaths).map(path => ({ url: path === "/" ? SITE_URL : `${SITE_URL}${path}`, ...(lastModified ? { lastModified } : {}) })),
    ...portfolio.blogPosts.filter(post => post.status === "published" && post.slug && post.body.trim()).map(post => {
      const updated = isoDate(post.updatedAt)
      return { url: `${SITE_URL}/blog/${post.slug}`, ...(updated ? { lastModified: updated } : {}) }
    }),
  ]
}
