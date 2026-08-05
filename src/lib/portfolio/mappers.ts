import type {
  BlogComment,
  BlogPost,
  Education,
  Experience,
  Faq,
  Profile,
  Project,
  Service,
  Skill,
} from "@/lib/types"
import type {
  BlogCommentRow,
  BlogPostRow,
  EducationRow,
  ExperienceRow,
  FaqRow,
  ProfileRow,
  ProjectRow,
  ServiceRow,
  SkillRow,
} from "@/lib/portfolio/types"

export const mapProfile = (row: ProfileRow): Profile => ({
  name: row.name,
  title: row.title,
  email: row.email,
  location: row.location,
  bio: Array.isArray(row.bio) ? row.bio : [],
  bioHighlight: row.bio_highlight ?? "",
  socials: {
    github: row.socials?.github ?? "",
    linkedin: row.socials?.linkedin ?? "",
    googlescholar: row.socials?.googlescholar ?? "",
    facebook: row.socials?.facebook ?? "",
    youtube: row.socials?.youtube ?? "",
    twitter: row.socials?.twitter ?? "",
  },
  avatar: row.avatar,
  resumeUrl: row.resume_url ?? undefined,
})

export const mapService = (row: ServiceRow): Service => ({
  title: row.title,
  description: row.description,
  icon: row.icon,
})

export const mapSkill = (row: SkillRow): Skill => ({
  name: row.name,
  color: row.color,
  icon: row.icon,
})

export const mapEducation = (row: EducationRow): Education => ({
  school: row.school,
  degree: row.degree,
  period: row.period,
  description: row.description,
})

export const mapExperience = (row: ExperienceRow): Experience => ({
  role: row.role,
  company: row.company,
  period: row.period,
  location: row.location,
  highlights: Array.isArray(row.highlights) ? row.highlights : [],
})

export const mapProject = (row: ProjectRow): Project => ({
  id: row.id,
  title: row.title,
  category: row.category,
  image: row.image,
  url: row.url ?? "",
  description: row.description,
})

export const mapBlogPost = (row: BlogPostRow): BlogPost => ({
  id: row.id,
  title: row.title,
  category: row.category,
  date: row.date,
  dateTime: row.date_time,
  excerpt: row.excerpt,
  image: row.image,
  url: row.url ?? "",
  slug: row.slug,
  body: row.body ?? "",
  status: row.status === "published" ? "published" : "draft",
})

export const mapFaq = (row: FaqRow): Faq => ({
  id: row.id,
  question: row.question,
  answer: row.answer,
  sortOrder: row.sort_order,
})

export const mapBlogComment = (row: BlogCommentRow): BlogComment => ({
  id: row.id,
  postId: row.post_id,
  authorName: row.author_name,
  authorEmail: row.author_email,
  body: row.body,
  status: row.status,
  createdAt: row.created_at,
})
