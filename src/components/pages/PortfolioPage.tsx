import { SectionTitle } from "@/components/ui/SectionTitle"
import { pageShellClassName } from "@/lib/cn"
import { PortfolioFilterList } from "@/components/portfolio/PortfolioFilterList"
import type { Project } from "@/lib/types"

type PortfolioPageProps = {
  projects: Project[]
}

export const PortfolioPage = ({ projects }: PortfolioPageProps) => {
  return (
    <article
      id="portfolio-panel"
      className={`${pageShellClassName} min-[1250px]:min-h-full`}
      aria-labelledby="portfolio-title"
    >
      <header>
        <SectionTitle as="h1">
          <span id="portfolio-title">Portfolio</span>
        </SectionTitle>
      </header>

      <PortfolioFilterList projects={projects} />
    </article>
  )
}
