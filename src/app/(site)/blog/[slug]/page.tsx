import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogArticle } from "@/components/blog/BlogArticle"
import { isPublishedArticle } from "@/lib/portfolio/blog"
import { renderMdx } from "@/lib/mdx/render"
import {
  getApprovedComments,
  getBlogPostBySlug,
  getPortfolio,
} from "@/lib/portfolio/repository"
import { resolveTags } from "@/lib/portfolio/tags-repository"
import {
  buildPageMetadata,
  resolveOgImage,
  SITE_URL,
  twitterHandleFromUrl,
} from "@/lib/seo"
import {
  buildBreadcrumbJsonLd,
  JsonLdScript,
} from "@/lib/seo/jsonld"

type PageProps = {
  params: Promise<{ slug: string }>
}

export const generateStaticParams = async () => {
  const portfolio = await getPortfolio()
  return portfolio.blogPosts
    .filter(isPublishedArticle)
    .map((post) => ({ slug: post.slug }))
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}

  const portfolio = await getPortfolio()

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    openGraphType: "article",
    publishedTime: post.dateTime,
    modifiedTime: post.updatedAt,
    ogImage: resolveOgImage(post.ogImage || post.image, post.title),
    keywords: post.tags,
    twitterCreator: twitterHandleFromUrl(portfolio.profile.socials.twitter),
  })
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post || !post.body.trim()) notFound()

  const content = await renderMdx(post.body)
  const comments = post.id ? await getApprovedComments(post.id) : []
  const tags = await resolveTags(post.tags)
  const url = `${SITE_URL}/blog/${post.slug}`
  const image = resolveOgImage(post.ogImage || post.image, post.title).url

  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.dateTime,
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    url,
    author: {
      "@type": "Person",
      name: "Siyam Uddin",
      url: SITE_URL,
    },
    mainEntityOfPage: url,
    ...(image ? { image } : {}),
    ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
  }

  return (
    <>
      <JsonLdScript data={blogPosting} />
      <JsonLdScript
        data={buildBreadcrumbJsonLd(post.title, `/blog/${post.slug}`, [
          { name: "Blog", path: "/blog" },
        ])}
      />
      <BlogArticle post={post} content={content} comments={comments} tags={tags} />
    </>
  )
}
