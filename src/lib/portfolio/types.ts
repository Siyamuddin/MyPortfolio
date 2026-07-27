import type {
  BlogPost,
  Education,
  Experience,
  Faq,
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
  faqs: Faq[]
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
  slug: string
  body: string
  status: "draft" | "published"
  sort_order: number
  updated_at?: string
}

export type FaqRow = {
  id: string
  question: string
  answer: string
  sort_order: number
}

export type BlogCommentRow = {
  id: string
  post_id: string
  author_name: string
  author_email: string
  body: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}
