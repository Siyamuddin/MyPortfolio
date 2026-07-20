import type { Metadata } from "next"
import { PortfolioPage } from "@/components/pages/PortfolioPage"
import { projects } from "@/data/portfolio"
import { pageSeo, SITE_URL } from "@/lib/seo"

export const metadata: Metadata = pageSeo.portfolio

export default function PortfolioRoute() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Siyam Uddin Portfolio Projects",
    url: `${SITE_URL}/portfolio`,
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.title,
      description: project.description,
      ...(project.url.startsWith("http") ? { url: project.url } : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortfolioPage />
    </>
  )
}
