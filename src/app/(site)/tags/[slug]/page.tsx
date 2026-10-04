import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { TagPage } from "@/components/pages/TagPage"
import { getBlogPostHref } from "@/lib/portfolio/blog"
import { SITE_URL } from "@/lib/seo"
import {
  getContentForTag,
  getTag,
  getTagsWithCounts,
} from "@/lib/portfolio/tags-repository"
import { tagSlugSchema } from "@/lib/portfolio/tags"
import { buildPageMetadata } from "@/lib/seo"
import {
  buildBreadcrumbJsonLd,
  buildTagItemListJsonLd,
  JsonLdScript,
} from "@/lib/seo/jsonld"

type PageProps = {
  params: Promise<{ slug: string }>
}

export const generateStaticParams = async () => {
  const tags = await getTagsWithCounts()
  return tags.map((tag) => ({ slug: tag.slug }))
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params
  if (!tagSlugSchema.safeParse(slug).success) return {}
  const content = await getContentForTag(slug)
  const total = content.posts.length + content.events.length + content.projects.length
  if (total === 0) return {}

  const tag = await getTag(slug)
  return buildPageMetadata({
    title: `#${tag.label}`,
    description: `Articles, events, and projects tagged ${tag.label} — ${total} ${total === 1 ? "item" : "items"} from Siyam Uddin.`,
    path: `/tags/${tag.slug}`,
    ogTitle: `#${tag.label} | Tags`,
    keywords: [tag.label, tag.slug],
  })
}

export default async function TagDetailPage({ params }: PageProps) {
  const { slug } = await params
  if (!tagSlugSchema.safeParse(slug).success) notFound()

  const content = await getContentForTag(slug)
  const total = content.posts.length + content.events.length + content.projects.length
  if (total === 0) notFound()

  const tag = await getTag(slug)

  const listItems = [
    ...content.posts.map((post) => {
      const href = getBlogPostHref(post)
      return {
        name: post.title,
        url: href?.startsWith("http") ? href : `${SITE_URL}${href ?? "/blog"}`,
        description: post.excerpt,
        type: "BlogPosting" as const,
      }
    }),
    ...content.events.map((event) => ({
      name: event.title,
      url: `${SITE_URL}/events/${event.slug}`,
      description: event.description || event.highlight,
      type: "Event" as const,
    })),
    ...content.projects.map((project) => ({
      name: project.title,
      url: project.url.startsWith("http") ? project.url : `${SITE_URL}/portfolio`,
      description: project.description,
      type: "CreativeWork" as const,
    })),
  ]

  return (
    <>
      <JsonLdScript data={buildTagItemListJsonLd(tag, listItems)} />
      <JsonLdScript
        data={buildBreadcrumbJsonLd(`#${tag.label}`, `/tags/${tag.slug}`, [
          { name: "Tags", path: "/tags" },
        ])}
      />
      <TagPage tag={tag} content={content} />
    </>
  )
}
