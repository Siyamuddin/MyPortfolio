import {
  blogPosts,
  education,
  experience,
  navPages,
  profile,
  projects,
  services,
  skills,
} from "@/data/portfolio"
import type { PortfolioData } from "@/lib/portfolio/types"

export const getStaticPortfolio = (): PortfolioData => ({
  profile,
  services,
  skills,
  education,
  experience,
  projects,
  blogPosts,
  navPages,
  source: "static",
})
