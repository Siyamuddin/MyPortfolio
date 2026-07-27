import type { Metadata } from "next"
import { ResumePage } from "@/components/pages/ResumePage"
import { getPortfolio } from "@/lib/portfolio/repository"
import { buildProfileAwarePageSeo } from "@/lib/seo"
import {
  buildBreadcrumbJsonLd,
  buildResumeJsonLd,
  JsonLdScript,
} from "@/lib/seo/jsonld"

export const generateMetadata = async (): Promise<Metadata> => {
  const portfolio = await getPortfolio()
  return buildProfileAwarePageSeo(portfolio.profile, "resume")
}

export default async function ResumeRoute() {
  const portfolio = await getPortfolio()

  return (
    <>
      <JsonLdScript
        data={buildResumeJsonLd(
          portfolio.profile,
          portfolio.education,
          portfolio.experience,
          portfolio.skills.map((skill) => skill.name)
        )}
      />
      <JsonLdScript data={buildBreadcrumbJsonLd("Resume", "/resume")} />
      <ResumePage
        profile={portfolio.profile}
        education={portfolio.education}
        experience={portfolio.experience}
      />
    </>
  )
}
