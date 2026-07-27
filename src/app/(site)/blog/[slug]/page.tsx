import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogArticle } from "@/components/blog/BlogArticle"
import { renderMdx } from "@/lib/mdx/render"
import {
  getApprovedComments,
  getBlogPostBySlug,
  getPortfolio,
} from "@/lib/portfolio/repository"
import { SITE_URL, twitterHandleFromUrl } from "@/lib/seo"
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
    .filter((post) => post.status === "published" && post.body.trim())
    .map((post) => ({ slug: post.slug }))
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}

  const portfolio = await getPortfolio()
  const url = `${SITE_URL}/blog/${post.slug}`
  const image =
    post.image.startsWith("http") || post.image.startsWith("/")
      ? post.image.startsWith("http")
        ? post.image
        : `${SITE_URL}${post.image}`
      : undefined

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url,
      siteName: "Siyam Uddin Portfolio",
      locale: "en_US",
      publishedTime: post.dateTime,
      images: image
        ? [{ url: image, alt: post.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      creator: twitterHandleFromUrl(portfolio.profile.socials.twitter),
      images: image ? [image] : undefined,
    },
  }
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post || !post.body.trim()) notFound()

  const content = await renderMdx(post.body)
  const comments = post.id ? await getApprovedComments(post.id) : []
  const url = `${SITE_URL}/blog/${post.slug}`
  const image =
    post.image.startsWith("http")
      ? post.image
      : post.image.startsWith("/")
        ? `${SITE_URL}${post.image}`
        : undefined

  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.dateTime,
    url,
    author: {
      "@type": "Person",
      name: "Siyam Uddin",
      url: SITE_URL,
    },
    mainEntityOfPage: url,
    ...(image ? { image } : {}),
  }

  return (
    <>
      <JsonLdScript data={blogPosting} />
      <JsonLdScript
        data={buildBreadcrumbJsonLd(post.title, `/blog/${post.slug}`, [
          { name: "Blog", path: "/blog" },
        ])}
      />
      <BlogArticle post={post} content={content} comments={comments} />
    </>
  )
}
