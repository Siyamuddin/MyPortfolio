import { SectionTitle } from "@/components/ui/SectionTitle"
import { PortfolioFilterList } from "@/components/portfolio/PortfolioFilterList"
import type { Project } from "@/lib/types"

type PortfolioPageProps = {
  projects: Project[]
}

export const PortfolioPage = ({ projects }: PortfolioPageProps) => {
  return (
    <article
      id="portfolio-panel"
      className="rounded-[20px] border border-jet bg-eerie-black-2 p-[15px] shadow-[var(--shadow-1)] min-[580px]:mx-auto min-[580px]:w-[520px] min-[580px]:p-[30px] min-[768px]:w-[700px] min-[1024px]:w-[950px] min-[1024px]:shadow-[var(--shadow-5)] min-[1250px]:w-auto min-[1250px]:min-h-full"
      aria-labelledby="portfolio-title"
    >
      <header>
        <SectionTitle>
          <span id="portfolio-title">Portfolio</span>
        </SectionTitle>
      </header>

      <PortfolioFilterList projects={projects} />
    </article>
  )
}
