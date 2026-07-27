"use client"

import { useMemo, useState } from "react"
import { ProjectCard } from "@/components/portfolio/ProjectCard"
import {
  ProjectFilter,
  type ProjectFilterValue,
} from "@/components/portfolio/ProjectFilter"
import type { Project } from "@/lib/types"

type PortfolioFilterListProps = {
  projects: Project[]
}

export const PortfolioFilterList = ({ projects }: PortfolioFilterListProps) => {
  const [filter, setFilter] = useState<ProjectFilterValue>("All")

  const filteredProjects = useMemo(() => {
    if (filter === "All") return projects
    return projects.filter((project) => project.category === filter)
  }, [filter, projects])

  return (
    <section>
      <ProjectFilter value={filter} onChange={setFilter} />
      <ul className="mb-2.5 grid grid-cols-1 gap-[30px] min-[768px]:grid-cols-2 min-[1024px]:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </ul>
    </section>
  )
}
