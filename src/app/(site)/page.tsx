import type { Metadata } from "next"
import { AboutPage } from "@/components/pages/AboutPage"
import { getPortfolio } from "@/lib/portfolio/repository"
import { pageSeo, SITE_URL } from "@/lib/seo"

export const metadata: Metadata = pageSeo.about

export default async function HomePage() {
  const portfolio = await getPortfolio()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${portfolio.profile.name} — ${portfolio.profile.title}`,
    url: SITE_URL,
    mainEntity: {
      "@type": "Person",
      name: portfolio.profile.name,
      url: SITE_URL,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutPage
        profile={portfolio.profile}
        services={portfolio.services}
        skills={portfolio.skills}
      />
    </>
  )
}
