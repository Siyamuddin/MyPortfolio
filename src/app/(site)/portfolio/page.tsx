import type { Metadata } from "next"
import { PortfolioPage } from "@/components/pages/PortfolioPage"
import { getPortfolio } from "@/lib/portfolio/repository"
import { buildProfileAwarePageSeo } from "@/lib/seo"
import {
  buildBreadcrumbJsonLd,
  buildProjectItemListJsonLd,
  JsonLdScript,
} from "@/lib/seo/jsonld"

export const generateMetadata = async (): Promise<Metadata> => {
  const portfolio = await getPortfolio()
  return buildProfileAwarePageSeo(portfolio.profile, "portfolio")
}

export default async function PortfolioRoute() {
  const portfolio = await getPortfolio()
  const { projects } = portfolio

  return (
    <>
      <JsonLdScript data={buildProjectItemListJsonLd(projects)} />
      <JsonLdScript data={buildBreadcrumbJsonLd("Portfolio", "/portfolio")} />
      <PortfolioPage projects={projects} />
    </>
  )
}
