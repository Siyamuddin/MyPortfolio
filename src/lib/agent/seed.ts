import { blogPosts as staticBlogPosts, faqs as staticFaqs } from "@/data/portfolio"
import {
  assertAgentDbReady,
  revalidateAfterMutation,
  type AgentFail,
} from "@/lib/agent/common"
import { getStaticPortfolio } from "@/lib/portfolio/static"
import { createServiceClient } from "@/lib/supabase/admin"

export const SEED_CONFIRM = "SEED_FROM_STATIC"

export const seedFromStatic = async (
  confirm: string
): Promise<{ ok: true } | AgentFail> => {
  if (confirm !== SEED_CONFIRM) {
    return {
      ok: false,
      error: `Destructive seed requires body { "confirm": "${SEED_CONFIRM}" }`,
      status: 400,
    }
  }

  if (!assertAgentDbReady()) {
    return { ok: false, error: "Supabase is not configured.", status: 503 }
  }

  const admin = createServiceClient()
  const staticData = getStaticPortfolio()

  await Promise.all([
    admin.from("blog_comments").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    admin.from("faqs").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    admin.from("services").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    admin.from("skills").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    admin.from("education").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    admin.from("experience").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    admin.from("projects").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    admin.from("blog_posts").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    admin.from("profile").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
  ])

  const { error: profileError } = await admin.from("profile").insert({
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
  if (profileError) return { ok: false, error: profileError.message, status: 500 }

  const { error: servicesError } = await admin.from("services").insert(
    staticData.services.map((item, index) => ({
      title: item.title,
      description: item.description,
      icon: item.icon,
      sort_order: index,
    }))
  )
  if (servicesError) return { ok: false, error: servicesError.message, status: 500 }

  const { error: skillsError } = await admin.from("skills").insert(
    staticData.skills.map((item, index) => ({
      name: item.name,
      color: item.color,
      icon: item.icon,
      sort_order: index,
    }))
  )
  if (skillsError) return { ok: false, error: skillsError.message, status: 500 }

  const { error: educationError } = await admin.from("education").insert(
    staticData.education.map((item, index) => ({
      school: item.school,
      degree: item.degree,
      period: item.period,
      description: item.description,
      sort_order: index,
    }))
  )
  if (educationError) return { ok: false, error: educationError.message, status: 500 }

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
  if (experienceError) return { ok: false, error: experienceError.message, status: 500 }

  const { error: projectsError } = await admin.from("projects").insert(
    staticData.projects.map((item, index) => ({
      title: item.title,
      category: item.category,
      image: item.image,
      url: item.url,
      description: item.description,
      sort_order: index,
    }))
  )
  if (projectsError) return { ok: false, error: projectsError.message, status: 500 }

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
      sort_order: index,
    }))
  )
  if (blogError) return { ok: false, error: blogError.message, status: 500 }

  const { error: faqsError } = await admin.from("faqs").insert(
    staticFaqs.map((item, index) => ({
      question: item.question,
      answer: item.answer,
      sort_order: index,
    }))
  )
  if (faqsError) return { ok: false, error: faqsError.message, status: 500 }

  await revalidateAfterMutation()
  return { ok: true }
}
