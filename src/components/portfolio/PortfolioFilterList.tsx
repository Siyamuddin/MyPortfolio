"use client"

import { useLayoutEffect, useMemo, useRef, useState } from "react"
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
  const listRef = useRef<HTMLUListElement>(null)
  const previousRects = useRef<Map<string, DOMRect>>(new Map())

  const filteredProjects = useMemo(() => {
    if (filter === "All") return projects
    return projects.filter((project) => project.category === filter)
  }, [filter, projects])

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const nodes = [...list.querySelectorAll<HTMLElement>("[data-flip]")]
    nodes.forEach((node) => {
      const key = node.dataset.flip ?? ""
      const next = node.getBoundingClientRect()
      const last = previousRects.current.get(key)
      if (last && !reduce) {
        const dx = last.left - next.left
        const dy = last.top - next.top
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          node.animate(
            [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }],
            { duration: 280, easing: "cubic-bezier(.65, 0, .35, 1)" }
          )
        }
      }
    })
    const nextRects = new Map<string, DOMRect>()
    nodes.forEach((node) => {
      nextRects.set(node.dataset.flip ?? "", node.getBoundingClientRect())
    })
    previousRects.current = nextRects
  }, [filteredProjects])

  return (
    <section>
      <ProjectFilter value={filter} onChange={setFilter} />
      <ul
        ref={listRef}
        className="mb-2.5 grid grid-cols-1 gap-[30px] min-[768px]:grid-cols-2 min-[1024px]:grid-cols-3"
      >
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            priority={index < 3}
            enter
          />
        ))}
      </ul>
    </section>
  )
}
