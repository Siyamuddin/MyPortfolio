import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import type {
  BlogPostRow,
  EducationRow,
  ExperienceRow,
  FaqRow,
  ProfileRow,
  ProjectRow,
  ServiceRow,
  SkillRow,
} from "@/lib/portfolio/types"
import type { AdminCommentRow } from "@/components/admin/CommentsAdmin"

export const getAdminRows = async () => {
  if (!isSupabaseConfigured()) {
    return null
  }

  const supabase = await createClient()

  const [
    profile,
    services,
    skills,
    education,
    experience,
    projects,
    blogPosts,
    faqs,
  ] = await Promise.all([
    supabase.from("profile").select("*").limit(1).maybeSingle(),
    supabase.from("services").select("*").order("sort_order"),
    supabase.from("skills").select("*").order("sort_order"),
    supabase.from("education").select("*").order("sort_order"),
    supabase.from("experience").select("*").order("sort_order"),
    supabase.from("projects").select("*").order("sort_order"),
    supabase.from("blog_posts").select("*").order("sort_order"),
    supabase.from("faqs").select("*").order("sort_order"),
  ])

  return {
    profile: (profile.data as ProfileRow | null) ?? null,
    services: (services.data as ServiceRow[]) ?? [],
    skills: (skills.data as SkillRow[]) ?? [],
    education: (education.data as EducationRow[]) ?? [],
    experience: (experience.data as ExperienceRow[]) ?? [],
    projects: (projects.data as ProjectRow[]) ?? [],
    blogPosts: (blogPosts.data as BlogPostRow[]) ?? [],
    faqs: (faqs.data as FaqRow[]) ?? [],
    errors: [
      profile.error?.message,
      services.error?.message,
      skills.error?.message,
      education.error?.message,
      experience.error?.message,
      projects.error?.message,
      blogPosts.error?.message,
      faqs.error?.message,
    ].filter((message): message is string => Boolean(message)),
  }
}

export const getAdminComments = async (): Promise<AdminCommentRow[]> => {
  if (!isSupabaseConfigured()) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("blog_comments")
    .select("*, blog_posts(title, slug)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[admin] comments fetch failed", error.message)
    return []
  }

  return (data as AdminCommentRow[]) ?? []
}

export const getPendingCommentCount = async () => {
  if (!isSupabaseConfigured()) return 0
  const supabase = await createClient()
  const { count, error } = await supabase
    .from("blog_comments")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending")

  if (error) return 0
  return count ?? 0
}
