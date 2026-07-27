import { MainShell } from "@/components/layout/MainShell"
import { getPortfolio } from "@/lib/portfolio/repository"
import { buildSiteGraph, JsonLdScript } from "@/lib/seo/jsonld"

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const portfolio = await getPortfolio()
  const jsonLd = buildSiteGraph(portfolio.profile, {
    education: portfolio.education,
    experience: portfolio.experience,
    skills: portfolio.skills.map((skill) => skill.name),
  })

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <MainShell profile={portfolio.profile}>{children}</MainShell>
    </>
  )
}
