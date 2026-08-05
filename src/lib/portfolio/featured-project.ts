import type { Project } from "@/lib/types"

export const resolveFeaturedProject = (
  projects: Project[],
  featuredProjectId: string | null | undefined,
  fallbackTitle?: string
): Project | null => {
  if (featuredProjectId) {
    const match = projects.find((project) => project.id === featuredProjectId)
    if (match) return match
  }

  if (fallbackTitle) {
    const match = projects.find((project) => project.title === fallbackTitle)
    if (match) return match
  }

  return null
}
