import { AnalyticsBeacon } from "@/components/analytics/AnalyticsBeacon"
import { MainShell } from "@/components/layout/MainShell"
import type { CommandData } from "@/components/command/CommandPalette"
import { getPortfolio } from "@/lib/portfolio/repository"
import { getPublishedEvents } from "@/lib/portfolio/events-repository"
import { getBlogPostHref } from "@/lib/portfolio/blog"
import { buildSiteGraph, JsonLdScript } from "@/lib/seo/jsonld"

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [portfolio, events] = await Promise.all([
    getPortfolio(),
    getPublishedEvents(),
  ])
  const jsonLd = buildSiteGraph(portfolio.profile, {
    education: portfolio.education,
    experience: portfolio.experience,
    skills: portfolio.skills.map((skill) => skill.name),
  })

  const commandData: CommandData = {
    email: portfolio.profile.email,
    resumeHref: portfolio.profile.resumeUrl ?? "/resume.pdf",
    events: events.map((event) => ({ title: event.title, slug: event.slug })),
    posts: portfolio.blogPosts
      .filter((post) => post.status === "published" && post.slug && post.body.trim())
      .map((post) => ({ title: post.title, href: getBlogPostHref(post) ?? "" }))
      .filter((post) => post.href && !post.href.startsWith("http")),
  }

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <AnalyticsBeacon />
      <MainShell profile={portfolio.profile} commandData={commandData}>
        {children}
      </MainShell>
    </>
  )
}
