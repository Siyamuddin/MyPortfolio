import type { Metadata } from "next"
import { AboutPage } from "@/components/pages/AboutPage"
import { pageSeo, SITE_URL } from "@/lib/seo"

export const metadata: Metadata = pageSeo.about

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: "Siyam Uddin — Full-Stack Software Engineer",
    url: SITE_URL,
    mainEntity: {
      "@type": "Person",
      name: "Siyam Uddin",
      url: SITE_URL,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutPage />
    </>
  )
}
