import type { BlogPost } from "@/lib/types"

/** Published MDX article → /blog/slug; else external url; else null (static card). */
export const getBlogPostHref = (post: BlogPost): string | null => {
  if (post.status === "published" && post.slug && post.body.trim()) {
    return `/blog/${post.slug}`
  }
  if (post.url.startsWith("http")) return post.url
  return null
}

export const slugifyTitle = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
