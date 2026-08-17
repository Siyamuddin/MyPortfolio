"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
  requireAdmin,
  revalidatePortfolio,
  type ActionResult,
} from "@/lib/portfolio/auth-actions"
import { createServiceClient } from "@/lib/supabase/admin"
import { blogPosts as staticBlogPosts, faqs as staticFaqs, featuredProjectTitle } from "@/data/portfolio"
import { getStaticPortfolio } from "@/lib/portfolio/static"
import { isSupabaseConfigured } from "@/lib/supabase/env"

const socialsSchema = z.object({
  github: z.string(),
  linkedin: z.string(),
  googlescholar: z.string(),
  facebook: z.string(),
  youtube: z.string(),
  twitter: z.string(),
})

const profileSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  title: z.string().min(1),
  email: z.string().email(),
  location: z.string().min(1),
  bio: z.array(z.string()),
  bio_highlight: z.string(),
  socials: socialsSchema,
  avatar: z.string(),
  resume_url: z.string().nullable(),
  featured_project_id: z
    .union([z.string().uuid(), z.literal("")])
    .nullable()
    .optional()
    .transform((value) => (value ? value : null)),
})

const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  sort_order: z.coerce.number().int(),
})

const skillSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  color: z.string().min(1),
  icon: z.string(),
  sort_order: z.coerce.number().int(),
})

const educationSchema = z.object({
  id: z.string().uuid().optional(),
  school: z.string().min(1),
  degree: z.string().min(1),
  period: z.string().min(1),
  description: z.string(),
  sort_order: z.coerce.number().int(),
})

const experienceSchema = z.object({
  id: z.string().uuid().optional(),
  role: z.string().min(1),
  company: z.string().min(1),
  period: z.string().min(1),
  location: z.string(),
  highlights: z.array(z.string()),
  sort_order: z.coerce.number().int(),
})

const projectSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  category: z.enum(["Web Development", "Applications", "Automation"]),
  image: z.string(),
  url: z.string(),
  description: z.string(),
  sort_order: z.coerce.number().int(),
})

const blogSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  category: z.string(),
  date: z.string(),
  date_time: z.string(),
  excerpt: z.string(),
  image: z.string(),
  url: z.string(),
  slug: z.string().min(1),
  body: z.string(),
  status: z.enum(["draft", "published"]),
  sort_order: z.coerce.number().int(),
})

const faqSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().min(1),
  answer: z.string().min(1),
  sort_order: z.coerce.number().int(),
})

const commentStatusSchema = z.enum(["pending", "approved", "rejected"])

const messageStatusSchema = z.enum(["unread", "read", "archived"])

const parseJson = <T>(value: FormDataEntryValue | null, fallback: T): T => {
  if (typeof value !== "string" || !value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export const upsertProfileAction = async (
  formData: FormData
): Promise<ActionResult> => {
  try {
    const { supabase } = await requireAdmin()
    const payload = profileSchema.parse({
      id: formData.get("id") || undefined,
      name: formData.get("name"),
      title: formData.get("title"),
      email: formData.get("email"),
      location: formData.get("location"),
      bio: parseJson(formData.get("bio"), []),
      bio_highlight: formData.get("bio_highlight") ?? "",
      socials: parseJson(formData.get("socials"), {
        github: "",
        linkedin: "",
        googlescholar: "",
        facebook: "",
        youtube: "",
        twitter: "",
      }),
      avatar: formData.get("avatar") ?? "",
      resume_url: formData.get("resume_url") || null,
      featured_project_id: formData.get("featured_project_id") ?? null,
    })

    const row = {
      name: payload.name,
      title: payload.title,
      email: payload.email,
      location: payload.location,
      bio: payload.bio,
      bio_highlight: payload.bio_highlight,
      socials: payload.socials,
      avatar: payload.avatar,
      resume_url: payload.resume_url,
      featured_project_id: payload.featured_project_id,
      updated_at: new Date().toISOString(),
    }

    const query = payload.id
      ? supabase.from("profile").update(row).eq("id", payload.id)
      : supabase.from("profile").insert(row)

    const { error } = await query
    if (error) return { ok: false, error: error.message }

    await revalidatePortfolio()
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to save profile",
    }
  }
}

const upsertListItem = async (
  table: string,
  formData: FormData,
  schema: z.ZodTypeAny,
  mapPayload: (data: Record<string, unknown>) => Record<string, unknown>
): Promise<ActionResult> => {
  try {
    const { supabase } = await requireAdmin()
    const raw = Object.fromEntries(formData.entries())
    const parsed = schema.parse({
      ...raw,
      id: raw.id || undefined,
      highlights: parseJson(formData.get("highlights"), undefined),
      bio: parseJson(formData.get("bio"), undefined),
    })

    const { id, ...rest } = parsed as { id?: string } & Record<string, unknown>
    const row = {
      ...mapPayload(rest),
      updated_at: new Date().toISOString(),
    }

    const query = id
      ? supabase.from(table).update(row).eq("id", id)
      : supabase.from(table).insert(row)

    const { error } = await query
    if (error) return { ok: false, error: error.message }

    await revalidatePortfolio()
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to save item",
    }
  }
}

export const upsertServiceAction = async (formData: FormData) =>
  upsertListItem("services", formData, serviceSchema, (d) => d)

export const upsertSkillAction = async (formData: FormData) =>
  upsertListItem("skills", formData, skillSchema, (d) => d)

export const upsertEducationAction = async (formData: FormData) =>
  upsertListItem("education", formData, educationSchema, (d) => d)

export const upsertExperienceAction = async (formData: FormData) =>
  upsertListItem("experience", formData, experienceSchema, (d) => ({
    ...d,
    highlights: Array.isArray(d.highlights)
      ? d.highlights
      : parseJson(String(d.highlights ?? "[]"), []),
  }))

export const upsertProjectAction = async (formData: FormData) =>
  upsertListItem("projects", formData, projectSchema, (d) => d)

export const upsertBlogAction = async (formData: FormData) =>
  upsertListItem("blog_posts", formData, blogSchema, (d) => d)

export const upsertFaqAction = async (formData: FormData) =>
  upsertListItem("faqs", formData, faqSchema, (d) => d)

export const updateCommentStatusAction = async (
  id: string,
  status: "pending" | "approved" | "rejected"
): Promise<ActionResult> => {
  try {
    const { supabase } = await requireAdmin()
    const parsedStatus = commentStatusSchema.parse(status)
    const { error } = await supabase
      .from("blog_comments")
      .update({
        status: parsedStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) return { ok: false, error: error.message }
    await revalidatePortfolio()
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to update comment",
    }
  }
}

export const deleteCommentAction = async (id: string): Promise<ActionResult> => {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from("blog_comments").delete().eq("id", id)
    if (error) return { ok: false, error: error.message }
    await revalidatePortfolio()
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to delete comment",
    }
  }
}

export const updateMessageStatusAction = async (
  id: string,
  status: "unread" | "read" | "archived"
): Promise<ActionResult> => {
  try {
    const { supabase } = await requireAdmin()
    const parsedStatus = messageStatusSchema.parse(status)
    const { error } = await supabase
      .from("contact_messages")
      .update({
        status: parsedStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) return { ok: false, error: error.message }
    revalidatePath("/admin/messages")
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to update message",
    }
  }
}

export const deleteMessageAction = async (id: string): Promise<ActionResult> => {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id)
    if (error) return { ok: false, error: error.message }
    revalidatePath("/admin/messages")
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to delete message",
    }
  }
}

export const deleteItemAction = async (
  table: string,
  id: string
): Promise<ActionResult> => {
  try {
    const { supabase } = await requireAdmin()
    const allowed = [
      "services",
      "skills",
      "education",
      "experience",
      "projects",
      "blog_posts",
      "faqs",
    ]
    if (!allowed.includes(table)) {
      return { ok: false, error: "Invalid table" }
    }

    const { error } = await supabase.from(table).delete().eq("id", id)
    if (error) return { ok: false, error: error.message }

    await revalidatePortfolio()
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to delete",
    }
  }
}

export const uploadFileAction = async (
  formData: FormData
): Promise<ActionResult> => {
  try {
    const { supabase } = await requireAdmin()
    const file = formData.get("file")
    const folder = String(formData.get("folder") ?? "misc")

    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: "No file provided" }
    }

    const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "") || "misc"
    const ext = file.name.split(".").pop() || "bin"
    const path = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabase.storage
      .from("portfolio")
      .upload(path, file, { upsert: false, contentType: file.type })

    if (error) return { ok: false, error: error.message }

    const { data } = supabase.storage.from("portfolio").getPublicUrl(path)
    await revalidatePortfolio()
    return { ok: true, url: data.publicUrl }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}

export const seedFromStaticAction = async (): Promise<ActionResult> => {
  try {
    await requireAdmin()

    if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return {
        ok: false,
        error: "SUPABASE_SERVICE_ROLE_KEY is required for seeding",
      }
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

    const { data: profileData, error: profileError } = await admin.from("profile").insert({
      name: staticData.profile.name,
      title: staticData.profile.title,
      email: staticData.profile.email,
      location: staticData.profile.location,
      bio: staticData.profile.bio,
      bio_highlight: staticData.profile.bioHighlight,
      socials: staticData.profile.socials,
      avatar: staticData.profile.avatar,
      resume_url: staticData.profile.resumeUrl ?? null,
    }).select("id").single()
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

    const { data: insertedProjects, error: projectsError } = await admin.from("projects").insert(
      staticData.projects.map((item, index) => ({
        title: item.title,
        category: item.category,
        image: item.image,
        url: item.url,
        description: item.description,
        sort_order: index,
      }))
    ).select("id, title")
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

    await revalidatePortfolio()
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Seed failed",
    }
  }
}
