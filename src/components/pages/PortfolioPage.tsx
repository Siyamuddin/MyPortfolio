"use client"

import { useMemo, useState } from "react"
import { projects } from "@/data/portfolio"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { ProjectCard } from "@/components/portfolio/ProjectCard"
import {
  ProjectFilter,
  type ProjectFilterValue,
} from "@/components/portfolio/ProjectFilter"

export const PortfolioPage = () => {
  const [filter, setFilter] = useState<ProjectFilterValue>("All")

  const filteredProjects = useMemo(() => {
    if (filter === "All") return projects
    return projects.filter((project) => project.category === filter)
  }, [filter])

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

      <section>
        <ProjectFilter value={filter} onChange={setFilter} />

        <ul className="mb-2.5 grid grid-cols-1 gap-[30px] min-[768px]:grid-cols-2 min-[1024px]:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </ul>
      </section>
    </article>
  )
}
