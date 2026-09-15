import { PortfolioFilterList } from "@/components/portfolio/PortfolioFilterList";
import type { Project } from "@/lib/types";

export const PortfolioPage = ({ projects }: { projects: Project[] }) => (
  <article className="page-content" aria-labelledby="portfolio-title">
    <header className="page-header">
      <p className="eyebrow">Selected projects</p>
      <h1 id="portfolio-title">Work in the real world.</h1>
      <p>
        Web applications, platforms, and automation. A closer look at what I
        build and the problems each project solves.
      </p>
    </header>
    <PortfolioFilterList projects={projects} />
  </article>
);
