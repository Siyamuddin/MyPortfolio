import { createClient } from "@supabase/supabase-js"
import { navPages } from "@/data/portfolio"
import {
  mapBlogPost,
  mapEducation,
  mapExperience,
  mapProfile,
  mapProject,
  mapService,
  mapSkill,
} from "@/lib/portfolio/mappers"
import { getStaticPortfolio } from "@/lib/portfolio/static"
import type {
  BlogPostRow,
  EducationRow,
  ExperienceRow,
  PortfolioData,
  ProfileRow,
  ProjectRow,
  ServiceRow,
  SkillRow,
} from "@/lib/portfolio/types"
import { isSupabaseConfigured } from "@/lib/supabase/env"

const createAnonClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return null
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export const getPortfolio = async (): Promise<PortfolioData> => {
  if (!isSupabaseConfigured()) {
    return getStaticPortfolio()
  }

  try {
    const supabase = createAnonClient()
    if (!supabase) return getStaticPortfolio()

    const [
      profileResult,
      servicesResult,
      skillsResult,
      educationResult,
      experienceResult,
      projectsResult,
      blogResult,
    ] = await Promise.all([
      supabase.from("profile").select("*").limit(1).maybeSingle(),
      supabase.from("services").select("*").order("sort_order", { ascending: true }),
      supabase.from("skills").select("*").order("sort_order", { ascending: true }),
      supabase.from("education").select("*").order("sort_order", { ascending: true }),
      supabase.from("experience").select("*").order("sort_order", { ascending: true }),
      supabase.from("projects").select("*").order("sort_order", { ascending: true }),
      supabase.from("blog_posts").select("*").order("sort_order", { ascending: true }),
    ])

    if (profileResult.error) throw profileResult.error
    if (!profileResult.data) return getStaticPortfolio()

    if (servicesResult.error) throw servicesResult.error
    if (skillsResult.error) throw skillsResult.error
    if (educationResult.error) throw educationResult.error
    if (experienceResult.error) throw experienceResult.error
    if (projectsResult.error) throw projectsResult.error
    if (blogResult.error) throw blogResult.error

    return {
      profile: mapProfile(profileResult.data as ProfileRow),
      services: ((servicesResult.data ?? []) as ServiceRow[]).map(mapService),
      skills: ((skillsResult.data ?? []) as SkillRow[]).map(mapSkill),
      education: ((educationResult.data ?? []) as EducationRow[]).map(mapEducation),
      experience: ((experienceResult.data ?? []) as ExperienceRow[]).map(mapExperience),
      projects: ((projectsResult.data ?? []) as ProjectRow[]).map(mapProject),
      blogPosts: ((blogResult.data ?? []) as BlogPostRow[]).map(mapBlogPost),
      navPages,
      source: "supabase",
    }
  } catch (error) {
    console.error("[portfolio] Supabase fetch failed, using static fallback", error)
    return getStaticPortfolio()
  }
}
