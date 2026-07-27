import type { Metadata } from "next"
import { ResumePage } from "@/components/pages/ResumePage"
import { getPortfolio } from "@/lib/portfolio/repository"
import { pageSeo } from "@/lib/seo"

export const metadata: Metadata = pageSeo.resume

export default async function ResumeRoute() {
  const portfolio = await getPortfolio()

  return (
    <ResumePage
      profile={portfolio.profile}
      education={portfolio.education}
      experience={portfolio.experience}
    />
  )
}
