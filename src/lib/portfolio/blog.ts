import type { BlogPost } from "@/lib/types"

/** Published MDX article → /blog/slug; else external url; else null (static card). */
export const getBlogPostHref = (post: BlogPost): string | null => {
  if (post.status === "published" && post.slug && post.body.trim()) {
    return `/blog/${post.slug}`
  }
  if (post.url.startsWith("http")) return post.url
  return null
}

/** Newest posts first, based on the machine-readable dateTime (fallback: date). */
export const sortBlogPostsByNewest = (posts: BlogPost[]): BlogPost[] =>
  [...posts].sort((a, b) => {
    const aTime = new Date(a.dateTime || a.date).getTime()
    const bTime = new Date(b.dateTime || b.date).getTime()
    if (Number.isNaN(aTime) || Number.isNaN(bTime)) return 0
    return bTime - aTime
  })

export const slugifyTitle = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
