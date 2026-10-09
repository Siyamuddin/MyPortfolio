import type { Metadata } from "next"
import { AboutPage } from "@/components/pages/AboutPage"
import { isPublishedArticle } from "@/lib/portfolio/blog"
import { getPortfolio } from "@/lib/portfolio/repository"
import { getPublishedEvents } from "@/lib/portfolio/events-repository"
import { resolveFeaturedEvent } from "@/lib/portfolio/featured-event"
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
  const [portfolio, events] = await Promise.all([
    getPortfolio(),
    getPublishedEvents(),
  ])
  const faqJsonLd = buildFaqPageJsonLd(portfolio.faqs)
  const featuredEvent = resolveFeaturedEvent(
    events,
    portfolio.profile.featuredEventId
  )

  return (
    <>
      <JsonLdScript data={buildProfilePageJsonLd(portfolio.profile)} />
      {faqJsonLd ? <JsonLdScript data={faqJsonLd} /> : null}
      <AboutPage
        profile={portfolio.profile}
        services={portfolio.services}
        skills={portfolio.skills}
        faqs={portfolio.faqs}
        featuredPosts={portfolio.blogPosts.filter(isPublishedArticle)}
        featuredEvent={featuredEvent}
      />
    </>
  )
}
