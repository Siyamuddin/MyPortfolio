import type { Metadata } from "next"
import { BlogPage } from "@/components/pages/BlogPage"
import { getBlogPostHref } from "@/lib/portfolio/blog"
import { getPortfolio } from "@/lib/portfolio/repository"
import { buildProfileAwarePageSeo } from "@/lib/seo"
import {
  buildBlogItemListJsonLd,
  buildBreadcrumbJsonLd,
  JsonLdScript,
} from "@/lib/seo/jsonld"

export const generateMetadata = async (): Promise<Metadata> => {
  const portfolio = await getPortfolio()
  return buildProfileAwarePageSeo(portfolio.profile, "blog")
}

export default async function BlogRoute() {
  const portfolio = await getPortfolio()
  const { blogPosts } = portfolio

  return (
    <>
      <JsonLdScript
        data={buildBlogItemListJsonLd(
          blogPosts.map((post) => ({
            ...post,
            href: getBlogPostHref(post),
          }))
        )}
      />
      <JsonLdScript data={buildBreadcrumbJsonLd("Blog", "/blog")} />
      <BlogPage blogPosts={blogPosts} />
    </>
  )
}
