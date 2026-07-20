import type { Metadata } from "next"
import { BlogPage } from "@/components/pages/BlogPage"
import { blogPosts } from "@/data/portfolio"
import { pageSeo, SITE_URL } from "@/lib/seo"

export const metadata: Metadata = pageSeo.blog

export default function BlogRoute() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Siyam Uddin Blog Posts",
    url: `${SITE_URL}/blog`,
    numberOfItems: blogPosts.length,
    itemListElement: blogPosts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      description: post.excerpt,
      ...(post.dateTime ? { datePublished: post.dateTime } : {}),
      ...(post.url.startsWith("http") ? { url: post.url } : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPage />
    </>
  )
}
