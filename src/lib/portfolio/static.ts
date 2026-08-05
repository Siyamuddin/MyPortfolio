import {
  blogPosts,
  education,
  experience,
  faqs,
  featuredProjectTitle,
  navPages,
  profile,
  projects,
  services,
  skills,
} from "@/data/portfolio"
import { resolveFeaturedProject } from "@/lib/portfolio/featured-project"
import type { PortfolioData } from "@/lib/portfolio/types"

export const getStaticPortfolio = (): PortfolioData => ({
  profile,
  services,
  skills,
  education,
  experience,
  projects,
  featuredProject: resolveFeaturedProject(projects, null, featuredProjectTitle),
  blogPosts: blogPosts.filter((post) => post.status === "published"),
  faqs,
  navPages,
  source: "static",
})

export const getStaticBlogPostBySlug = (slug: string) =>
  blogPosts.find(
    (post) => post.slug === slug && post.status === "published"
  ) ?? null
