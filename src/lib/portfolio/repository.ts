import { cache } from "react"
import { unstable_cache } from "next/cache"
import { createClient } from "@supabase/supabase-js"
import { navPages } from "@/data/portfolio"
import { resolveFeaturedProject } from "@/lib/portfolio/featured-project"
import {
  mapBlogComment,
  mapBlogPost,
  mapEducation,
  mapExperience,
  mapFaq,
  mapProfile,
  mapProject,
  mapService,
  mapSkill,
} from "@/lib/portfolio/mappers"
import {
  getStaticBlogPostBySlug,
  getStaticPortfolio,
} from "@/lib/portfolio/static"
import type {
  BlogCommentRow,
  BlogPostRow,
  EducationRow,
  ExperienceRow,
  FaqRow,
  PortfolioData,
  ProfileRow,
  ProjectRow,
  ServiceRow,
  SkillRow,
} from "@/lib/portfolio/types"
import type { BlogComment, BlogPost, Faq } from "@/lib/types"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export const PORTFOLIO_CACHE_TAG = "portfolio"

const createAnonClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return null
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

const fetchPortfolioFromSupabase = async (): Promise<PortfolioData> => {
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
    faqsResult,
  ] = await Promise.all([
    supabase.from("profile").select("*").limit(1).maybeSingle(),
    supabase.from("services").select("*").order("sort_order", { ascending: true }),
    supabase.from("skills").select("*").order("sort_order", { ascending: true }),
    supabase.from("education").select("*").order("sort_order", { ascending: true }),
    supabase.from("experience").select("*").order("sort_order", { ascending: true }),
    supabase.from("projects").select("*").order("sort_order", { ascending: true }),
    supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true }),
    supabase.from("faqs").select("*").order("sort_order", { ascending: true }),
  ])

  if (profileResult.error) throw profileResult.error
  if (!profileResult.data) return getStaticPortfolio()

  if (servicesResult.error) throw servicesResult.error
  if (skillsResult.error) throw skillsResult.error
  if (educationResult.error) throw educationResult.error
  if (experienceResult.error) throw experienceResult.error
  if (projectsResult.error) throw projectsResult.error
  if (blogResult.error) throw blogResult.error
  if (faqsResult.error) throw faqsResult.error

  const profileRow = profileResult.data as ProfileRow
  const projects = ((projectsResult.data ?? []) as ProjectRow[]).map(mapProject)

  return {
    profile: mapProfile(profileRow),
    services: ((servicesResult.data ?? []) as ServiceRow[]).map(mapService),
    skills: ((skillsResult.data ?? []) as SkillRow[]).map(mapSkill),
    education: ((educationResult.data ?? []) as EducationRow[]).map(mapEducation),
    experience: ((experienceResult.data ?? []) as ExperienceRow[]).map(mapExperience),
    projects,
    featuredProject: resolveFeaturedProject(
      projects,
      profileRow.featured_project_id
    ),
    blogPosts: ((blogResult.data ?? []) as BlogPostRow[]).map(mapBlogPost),
    faqs: ((faqsResult.data ?? []) as FaqRow[]).map(mapFaq),
    navPages,
    source: "supabase",
  }
}

const getCachedSupabasePortfolio = unstable_cache(
  async () => {
    try {
      return await fetchPortfolioFromSupabase()
    } catch (error) {
      console.error("[portfolio] Supabase fetch failed, using static fallback", error)
      return getStaticPortfolio()
    }
  },
  ["portfolio-data"],
  {
    tags: [PORTFOLIO_CACHE_TAG],
    revalidate: 3600,
  }
)

export const getPortfolio = cache(async (): Promise<PortfolioData> => {
  if (!isSupabaseConfigured()) {
    return getStaticPortfolio()
  }
  return getCachedSupabasePortfolio()
})

export const getPortfolioFreshness = cache(async (): Promise<Date> => {
  if (!isSupabaseConfigured()) {
    return new Date("2026-07-28T00:00:00.000Z")
  }

  try {
    const supabase = createAnonClient()
    if (!supabase) return new Date("2026-07-28T00:00:00.000Z")

    const tables = [
      "profile",
      "services",
      "skills",
      "education",
      "experience",
      "projects",
      "blog_posts",
      "faqs",
    ] as const

    const results = await Promise.all(
      tables.map((table) =>
        supabase
          .from(table)
          .select("updated_at")
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      )
    )

    const timestamps = results
      .map((result) => result.data?.updated_at as string | undefined)
      .filter(Boolean)
      .map((value) => new Date(value as string).getTime())
      .filter((value) => !Number.isNaN(value))

    if (timestamps.length === 0) return new Date()
    return new Date(Math.max(...timestamps))
  } catch {
    return new Date()
  }
})

export const getBlogPostBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    if (!isSupabaseConfigured()) {
      return getStaticBlogPostBySlug(slug)
    }

    try {
      const supabase = createAnonClient()
      if (!supabase) return getStaticBlogPostBySlug(slug)

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle()

      if (error) throw error
      if (!data) return getStaticBlogPostBySlug(slug)
      return mapBlogPost(data as BlogPostRow)
    } catch (error) {
      console.error("[blog] getBlogPostBySlug failed", error)
      return getStaticBlogPostBySlug(slug)
    }
  }
)

export const getApprovedComments = cache(
  async (postId: string): Promise<BlogComment[]> => {
    if (!isSupabaseConfigured() || !postId) return []

    try {
      const supabase = createAnonClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("post_id", postId)
        .eq("status", "approved")
        .order("created_at", { ascending: true })

      if (error) throw error
      return ((data ?? []) as BlogCommentRow[]).map(mapBlogComment)
    } catch (error) {
      console.error("[blog] getApprovedComments failed", error)
      return []
    }
  }
)

export const getFaqs = cache(async (): Promise<Faq[]> => {
  const portfolio = await getPortfolio()
  return portfolio.faqs
})
