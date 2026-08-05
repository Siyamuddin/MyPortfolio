import type { Metadata } from "next"
import { AboutPage } from "@/components/pages/AboutPage"
import { getPortfolio } from "@/lib/portfolio/repository"
import { buildProfileAwarePageSeo } from "@/lib/seo"
import {
  buildFaqPageJsonLd,
  buildProfilePageJsonLd,
  JsonLdScript,
} from "@/lib/seo/jsonld"

export const generateMetadata = async (): Promise<Metadata> => {
  const portfolio = await getPortfolio()
  return buildProfileAwarePageSeo(portfolio.profile, "about")
}

export default async function HomePage() {
  const portfolio = await getPortfolio()
  const faqJsonLd = buildFaqPageJsonLd(portfolio.faqs)

  return (
    <>
      <JsonLdScript data={buildProfilePageJsonLd(portfolio.profile)} />
      {faqJsonLd ? <JsonLdScript data={faqJsonLd} /> : null}
      <AboutPage
        profile={portfolio.profile}
        services={portfolio.services}
        skills={portfolio.skills}
        faqs={portfolio.faqs}
        featuredPosts={portfolio.blogPosts.filter(
          (post) => post.status === "published" && post.slug && post.body.trim(),
        )}
        featuredProject={portfolio.featuredProject}
      />
    </>
  )
}
