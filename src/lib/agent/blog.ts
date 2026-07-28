import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"
import { slugifyTitle } from "@/lib/portfolio/blog"
import { PORTFOLIO_CACHE_TAG } from "@/lib/portfolio/repository"
import { createServiceClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import type { BlogPostRow } from "@/lib/portfolio/types"

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const revalidateAfterMutation = async () => {
  revalidateTag(PORTFOLIO_CACHE_TAG)
  revalidatePath("/", "layout")
  revalidatePath("/blog", "layout")
  revalidatePath("/admin", "layout")
}

export const createBlogSchema = z.object({
  title: z.string().trim().min(1).max(300),
  slug: z
    .string()
    .trim()
    .max(200)
    .regex(slugRegex, "slug must be lowercase kebab-case")
    .optional(),
  body: z.string().max(200_000).default(""),
  excerpt: z.string().max(2000).default(""),
  category: z.string().max(100).default("General"),
  date: z.string().max(50).default(""),
  date_time: z.string().max(50).default(""),
  image: z.string().max(2000).default(""),
  url: z.string().max(2000).default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  sort_order: z.coerce.number().int().optional(),
})

export const updateBlogSchema = z
  .object({
    title: z.string().trim().min(1).max(300).optional(),
    slug: z
      .string()
      .trim()
      .max(200)
      .regex(slugRegex, "slug must be lowercase kebab-case")
      .optional(),
    body: z.string().max(200_000).optional(),
    excerpt: z.string().max(2000).optional(),
    category: z.string().max(100).optional(),
    date: z.string().max(50).optional(),
    date_time: z.string().max(50).optional(),
    image: z.string().max(2000).optional(),
    url: z.string().max(2000).optional(),
    status: z.enum(["draft", "published"]).optional(),
    sort_order: z.coerce.number().int().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })

export type CreateBlogInput = z.infer<typeof createBlogSchema>
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>

export const toPublicPost = (row: BlogPostRow) => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  status: row.status,
  category: row.category,
  date: row.date,
  date_time: row.date_time,
  excerpt: row.excerpt,
  image: row.image,
  url: row.url,
  body: row.body,
  sort_order: row.sort_order,
})

const defaultDateLabels = () => {
  const now = new Date()
  const date_time = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`
  const date = now.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
  return { date, date_time }
}

export const assertAgentDbReady = () => {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return false
  }
  return true
}

export const createBlogPost = async (input: CreateBlogInput) => {
  const admin = createServiceClient()
  const defaults = defaultDateLabels()
  const slug = input.slug || slugifyTitle(input.title)

  if (!slug) {
    return { ok: false as const, error: "Could not derive a valid slug from title", status: 400 }
  }

  const { count } = await admin
    .from("blog_posts")
    .select("id", { count: "exact", head: true })

  const row = {
    title: input.title,
    slug,
    body: input.body,
    excerpt: input.excerpt,
    category: input.category,
    date: input.date || defaults.date,
    date_time: input.date_time || defaults.date_time,
    image: input.image,
    url: input.url,
    status: input.status,
    sort_order: input.sort_order ?? count ?? 0,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await admin
    .from("blog_posts")
    .insert(row)
    .select("*")
    .single()

  if (error) {
    if (error.code === "23505") {
      return { ok: false as const, error: "A post with this slug already exists", status: 409 }
    }
    return { ok: false as const, error: error.message, status: 500 }
  }

  await revalidateAfterMutation()
  return { ok: true as const, post: toPublicPost(data as BlogPostRow) }
}

export const getBlogPostBySlugAdmin = async (slug: string) => {
  const admin = createServiceClient()
  const { data, error } = await admin
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (error) return { ok: false as const, error: error.message, status: 500 }
  if (!data) return { ok: false as const, error: "Post not found", status: 404 }
  return { ok: true as const, post: toPublicPost(data as BlogPostRow) }
}

export const updateBlogPostBySlug = async (slug: string, input: UpdateBlogInput) => {
  const admin = createServiceClient()

  const { data: existing, error: findError } = await admin
    .from("blog_posts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle()

  if (findError) return { ok: false as const, error: findError.message, status: 500 }
  if (!existing) return { ok: false as const, error: "Post not found", status: 404 }

  const row = {
    ...input,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await admin
    .from("blog_posts")
    .update(row)
    .eq("id", existing.id)
    .select("*")
    .single()

  if (error) {
    if (error.code === "23505") {
      return { ok: false as const, error: "A post with this slug already exists", status: 409 }
    }
    return { ok: false as const, error: error.message, status: 500 }
  }

  await revalidateAfterMutation()
  return { ok: true as const, post: toPublicPost(data as BlogPostRow) }
}

export const deleteBlogPostBySlug = async (slug: string) => {
  const admin = createServiceClient()

  const { data: existing, error: findError } = await admin
    .from("blog_posts")
    .select("id, slug, title")
    .eq("slug", slug)
    .maybeSingle()

  if (findError) return { ok: false as const, error: findError.message, status: 500 }
  if (!existing) return { ok: false as const, error: "Post not found", status: 404 }

  const { error } = await admin.from("blog_posts").delete().eq("id", existing.id)
  if (error) return { ok: false as const, error: error.message, status: 500 }

  await revalidateAfterMutation()
  return {
    ok: true as const,
    deleted: { id: existing.id as string, slug: existing.slug as string, title: existing.title as string },
  }
}
