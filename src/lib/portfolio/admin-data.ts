import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import type {
  BlogPostRow,
  EducationRow,
  ExperienceRow,
  ProfileRow,
  ProjectRow,
  ServiceRow,
  SkillRow,
} from "@/lib/portfolio/types"

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
  ] = await Promise.all([
    supabase.from("profile").select("*").limit(1).maybeSingle(),
    supabase.from("services").select("*").order("sort_order"),
    supabase.from("skills").select("*").order("sort_order"),
    supabase.from("education").select("*").order("sort_order"),
    supabase.from("experience").select("*").order("sort_order"),
    supabase.from("projects").select("*").order("sort_order"),
    supabase.from("blog_posts").select("*").order("sort_order"),
  ])

  return {
    profile: (profile.data as ProfileRow | null) ?? null,
    services: (services.data as ServiceRow[]) ?? [],
    skills: (skills.data as SkillRow[]) ?? [],
    education: (education.data as EducationRow[]) ?? [],
    experience: (experience.data as ExperienceRow[]) ?? [],
    projects: (projects.data as ProjectRow[]) ?? [],
    blogPosts: (blogPosts.data as BlogPostRow[]) ?? [],
    errors: [
      profile.error?.message,
      services.error?.message,
      skills.error?.message,
      education.error?.message,
      experience.error?.message,
      projects.error?.message,
      blogPosts.error?.message,
    ].filter((message): message is string => Boolean(message)),
  }
}
