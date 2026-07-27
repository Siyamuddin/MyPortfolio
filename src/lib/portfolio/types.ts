import type {
  BlogPost,
  Education,
  Experience,
  NavPage,
  Profile,
  Project,
  Service,
  Skill,
} from "@/lib/types"

export type PortfolioData = {
  profile: Profile
  services: Service[]
  skills: Skill[]
  education: Education[]
  experience: Experience[]
  projects: Project[]
  blogPosts: BlogPost[]
  navPages: { id: NavPage | string; label: string }[]
  source: "supabase" | "static"
}

export type ProfileRow = {
  id: string
  name: string
  title: string
  email: string
  location: string
  bio: string[]
  bio_highlight: string
  socials: Profile["socials"]
  avatar: string
  resume_url: string | null
}

export type ServiceRow = {
  id: string
  title: string
  description: string
  icon: string
  sort_order: number
}

export type SkillRow = {
  id: string
  name: string
  color: string
  icon: string
  sort_order: number
}

export type EducationRow = {
  id: string
  school: string
  degree: string
  period: string
  description: string
  sort_order: number
}

export type ExperienceRow = {
  id: string
  role: string
  company: string
  period: string
  location: string
  highlights: string[]
  sort_order: number
}

export type ProjectRow = {
  id: string
  title: string
  category: Project["category"]
  image: string
  url: string
  description: string
  sort_order: number
}

export type BlogPostRow = {
  id: string
  title: string
  category: string
  date: string
  date_time: string
  excerpt: string
  image: string
  url: string
  sort_order: number
}
