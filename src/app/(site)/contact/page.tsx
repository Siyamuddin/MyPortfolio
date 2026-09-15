import type { Metadata } from "next"
import { ContactPage } from "@/components/pages/ContactPage"
import { getPortfolio } from "@/lib/portfolio/repository"
import { buildProfileAwarePageSeo } from "@/lib/seo"
import {
  buildBreadcrumbJsonLd,
  buildContactJsonLd,
  JsonLdScript,
} from "@/lib/seo/jsonld"

export const generateMetadata = async (): Promise<Metadata> => {
  const portfolio = await getPortfolio()
  return buildProfileAwarePageSeo(portfolio.profile, "contact")
}

export default async function ContactRoute() {
  const portfolio = await getPortfolio()

  return (
    <>
      <JsonLdScript data={buildContactJsonLd(portfolio.profile)} />
      <JsonLdScript data={buildBreadcrumbJsonLd("Contact", "/contact")} />
      <ContactPage />
    </>
  )
}
