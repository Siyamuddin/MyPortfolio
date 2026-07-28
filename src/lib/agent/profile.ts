import { z } from "zod"
import {
  assertAgentDbReady,
  revalidateAfterMutation,
  type AgentFail,
} from "@/lib/agent/common"
import { createServiceClient } from "@/lib/supabase/admin"

const socialsSchema = z.object({
  github: z.string().default(""),
  linkedin: z.string().default(""),
  googlescholar: z.string().default(""),
  facebook: z.string().default(""),
  youtube: z.string().default(""),
  twitter: z.string().default(""),
})

export const profileUpdateSchema = z.object({
  name: z.string().min(1).max(200),
  title: z.string().min(1).max(300),
  email: z.string().email().max(200),
  location: z.string().min(1).max(200),
  bio: z.array(z.string().max(5000)).default([]),
  bio_highlight: z.string().max(500).default(""),
  socials: socialsSchema.default({
    github: "",
    linkedin: "",
    googlescholar: "",
    facebook: "",
    youtube: "",
    twitter: "",
  }),
  avatar: z.string().max(2000).default(""),
  resume_url: z.string().max(2000).nullable().default(null),
})

export const getProfile = async () => {
  if (!assertAgentDbReady()) {
    return { ok: false as const, error: "Supabase is not configured.", status: 503 }
  }
  const admin = createServiceClient()
  const { data, error } = await admin.from("profile").select("*").limit(1).maybeSingle()
  if (error) return { ok: false as const, error: error.message, status: 500 }
  return { ok: true as const, profile: data }
}

export const upsertProfile = async (
  input: z.infer<typeof profileUpdateSchema>
): Promise<{ ok: true; profile: Record<string, unknown> } | AgentFail> => {
  if (!assertAgentDbReady()) {
    return { ok: false, error: "Supabase is not configured.", status: 503 }
  }
  const admin = createServiceClient()
  const { data: existing } = await admin
    .from("profile")
    .select("id")
    .limit(1)
    .maybeSingle()

  const row = {
    ...input,
    updated_at: new Date().toISOString(),
  }

  const query = existing?.id
    ? admin.from("profile").update(row).eq("id", existing.id)
    : admin.from("profile").insert(row)

  const { data, error } = await query.select("*").single()
  if (error) return { ok: false, error: error.message, status: 500 }
  await revalidateAfterMutation()
  return { ok: true, profile: data as Record<string, unknown> }
}

export const getPortfolioSnapshot = async () => {
  if (!assertAgentDbReady()) {
    return { ok: false as const, error: "Supabase is not configured.", status: 503 }
  }
  const admin = createServiceClient()
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
    admin.from("profile").select("*").limit(1).maybeSingle(),
    admin.from("services").select("*").order("sort_order"),
    admin.from("skills").select("*").order("sort_order"),
    admin.from("education").select("*").order("sort_order"),
    admin.from("experience").select("*").order("sort_order"),
    admin.from("projects").select("*").order("sort_order"),
    admin.from("blog_posts").select("*").order("sort_order"),
    admin.from("faqs").select("*").order("sort_order"),
  ])

  const firstError = [
    profile.error,
    services.error,
    skills.error,
    education.error,
    experience.error,
    projects.error,
    blogPosts.error,
    faqs.error,
  ].find(Boolean)

  if (firstError) {
    return { ok: false as const, error: firstError.message, status: 500 }
  }

  return {
    ok: true as const,
    portfolio: {
      profile: profile.data,
      services: services.data ?? [],
      skills: skills.data ?? [],
      education: education.data ?? [],
      experience: experience.data ?? [],
      projects: projects.data ?? [],
      blogPosts: blogPosts.data ?? [],
      faqs: faqs.data ?? [],
    },
  }
}
