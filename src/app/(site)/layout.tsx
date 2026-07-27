import { MainShell } from "@/components/layout/MainShell"
import { getPortfolio } from "@/lib/portfolio/repository"

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const portfolio = await getPortfolio()

  return <MainShell profile={portfolio.profile}>{children}</MainShell>
}
