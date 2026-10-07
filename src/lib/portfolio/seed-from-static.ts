import {
  blogPosts as staticBlogPosts,
  faqs as staticFaqs,
  featuredProjectTitle,
} from "@/data/portfolio"
import { getStaticPortfolio } from "@/lib/portfolio/static"
import { createServiceClient } from "@/lib/supabase/admin"

export const DESTRUCTIVE_SEED_DISABLED_ERROR =
  "Static seeding is disabled outside explicitly enabled development environments."

export const isDestructiveSeedAllowed = (): boolean =>
  process.env.NODE_ENV === "development" &&
  process.env.ALLOW_DESTRUCTIVE_SEED === "true"

export type StaticSeedResult = { ok: true } | { ok: false; error: string }

const NIL_ID = "00000000-0000-0000-0000-000000000000"

/** Replace portfolio rows from static data. Refuses unless destructive seed is enabled. */
export const seedPortfolioFromStatic = async (): Promise<StaticSeedResult> => {
  if (!isDestructiveSeedAllowed()) {
    return { ok: false, error: DESTRUCTIVE_SEED_DISABLED_ERROR }
  }

  const admin = createServiceClient()
  const staticData = getStaticPortfolio()

  await Promise.all([
    admin.from("blog_comments").delete().neq("id", NIL_ID),
    admin.from("faqs").delete().neq("id", NIL_ID),
    admin.from("services").delete().neq("id", NIL_ID),
    admin.from("skills").delete().neq("id", NIL_ID),
    admin.from("education").delete().neq("id", NIL_ID),
    admin.from("experience").delete().neq("id", NIL_ID),
    admin.from("projects").delete().neq("id", NIL_ID),
    admin.from("blog_posts").delete().neq("id", NIL_ID),
    admin.from("profile").delete().neq("id", NIL_ID),
  ])

  const { data: profileData, error: profileError } = await admin
    .from("profile")
    .insert({
      name: staticData.profile.name,
      title: staticData.profile.title,
      email: staticData.profile.email,
      location: staticData.profile.location,
      bio: staticData.profile.bio,
      bio_highlight: staticData.profile.bioHighlight,
      socials: staticData.profile.socials,
      avatar: staticData.profile.avatar,
      resume_url: staticData.profile.resumeUrl ?? null,
    })
    .select("id")
    .single()
  if (profileError) return { ok: false, error: profileError.message }

  const { error: servicesError } = await admin.from("services").insert(
    staticData.services.map((item, index) => ({
      title: item.title,
      description: item.description,
      icon: item.icon,
      sort_order: index,
    }))
  )
  if (servicesError) return { ok: false, error: servicesError.message }

  const { error: skillsError } = await admin.from("skills").insert(
    staticData.skills.map((item, index) => ({
      name: item.name,
      color: item.color,
      icon: item.icon,
      sort_order: index,
    }))
  )
  if (skillsError) return { ok: false, error: skillsError.message }

  const { error: educationError } = await admin.from("education").insert(
    staticData.education.map((item, index) => ({
      school: item.school,
      degree: item.degree,
      period: item.period,
      description: item.description,
      sort_order: index,
    }))
  )
  if (educationError) return { ok: false, error: educationError.message }

  const { error: experienceError } = await admin.from("experience").insert(
    staticData.experience.map((item, index) => ({
      role: item.role,
      company: item.company,
      period: item.period,
      location: item.location,
      highlights: item.highlights,
      sort_order: index,
    }))
  )
  if (experienceError) return { ok: false, error: experienceError.message }

  const { data: insertedProjects, error: projectsError } = await admin
    .from("projects")
    .insert(
      staticData.projects.map((item, index) => ({
        title: item.title,
        category: item.category,
        image: item.image,
        url: item.url,
        description: item.description,
        tags: item.tags,
        sort_order: index,
      }))
    )
    .select("id, title")
  if (projectsError) return { ok: false, error: projectsError.message }

  const featuredProject = insertedProjects?.find(
    (project) => project.title === featuredProjectTitle
  )
  if (profileData?.id && featuredProject?.id) {
    const { error: featuredError } = await admin
      .from("profile")
      .update({ featured_project_id: featuredProject.id })
      .eq("id", profileData.id)
    if (featuredError) return { ok: false, error: featuredError.message }
  }

  const { error: blogError } = await admin.from("blog_posts").insert(
    staticBlogPosts.map((item, index) => ({
      title: item.title,
      category: item.category,
      date: item.date,
      date_time: item.dateTime,
      excerpt: item.excerpt,
      image: item.image,
      url: item.url,
      slug: item.slug,
      body: item.body,
      status: item.status,
      tags: item.tags,
      sort_order: index,
    }))
  )
  if (blogError) return { ok: false, error: blogError.message }

  const { error: faqsError } = await admin.from("faqs").insert(
    staticFaqs.map((item, index) => ({
      question: item.question,
      answer: item.answer,
      sort_order: index,
    }))
  )
  if (faqsError) return { ok: false, error: faqsError.message }

  return { ok: true }
}
