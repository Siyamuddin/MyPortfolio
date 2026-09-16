import type { Project } from "@/lib/types"

export const getProjectLinks = (project: Project) => {
  const validUrl = (value?: string) => {
    try {
      const url = new URL(value ?? "")
      return ["http:", "https:"].includes(url.protocol) ? url : null
    } catch { return null }
  }
  const destination = validUrl(project.url)
  const isSource = destination && ["github.com", "www.github.com"].includes(destination.hostname)
  return {
    liveUrl: destination && !isSource ? destination.href : null,
    githubUrl: validUrl(project.githubUrl)?.href ?? (isSource ? destination.href : null),
  }
}
