import {
  blogPosts,
  education,
  experience,
  faqs,
  navPages,
  profile,
  projects,
  services,
  skills,
} from "@/data/portfolio"
import { sortBlogPostsByNewest } from "@/lib/portfolio/blog"
import type { PortfolioData } from "@/lib/portfolio/types"

export const getStaticPortfolio = (): PortfolioData => ({
  profile,
  services,
  skills,
  education,
  experience,
  projects,
  blogPosts: sortBlogPostsByNewest(
    blogPosts.filter((post) => post.status === "published")
  ),
  faqs,
  navPages,
  source: "static",
})
