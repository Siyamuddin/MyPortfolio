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
      <p className="sr-only" role="status">{filteredProjects.length} projects shown</p>
      <ul className="project-grid">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </ul>
      {filteredProjects.length === 0 && <p>No projects in this category yet.</p>}
    </section>
  )
}
