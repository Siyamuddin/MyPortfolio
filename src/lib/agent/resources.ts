import { z } from "zod"
import {
  assertAgentDbReady,
  revalidateAfterMutation,
  type AgentFail,
} from "@/lib/agent/common"
import { createServiceClient } from "@/lib/supabase/admin"

export const serviceCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  icon: z.string().min(1).max(100).default("Code2"),
  sort_order: z.coerce.number().int().optional(),
})

export const skillCreateSchema = z.object({
  name: z.string().min(1).max(200),
  color: z.string().min(1).max(50).default("#ffffff"),
  icon: z.string().max(2000).default(""),
  sort_order: z.coerce.number().int().optional(),
})

export const educationCreateSchema = z.object({
  school: z.string().min(1).max(300),
  degree: z.string().min(1).max(300),
  period: z.string().min(1).max(100),
  description: z.string().max(5000).default(""),
  sort_order: z.coerce.number().int().optional(),
})

export const experienceCreateSchema = z.object({
  role: z.string().min(1).max(300),
  company: z.string().min(1).max(300),
  period: z.string().min(1).max(100),
  location: z.string().max(200).default(""),
  highlights: z.array(z.string().max(1000)).default([]),
  sort_order: z.coerce.number().int().optional(),
})

export const projectCreateSchema = z.object({
  title: z.string().min(1).max(300),
  category: z.enum(["Web Development", "Applications", "Automation"]),
  image: z.string().max(2000).default(""),
  url: z.string().max(2000).default(""),
  description: z.string().max(5000).default(""),
  sort_order: z.coerce.number().int().optional(),
})

export const faqCreateSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(10000),
  sort_order: z.coerce.number().int().optional(),
})

export type ListTable =
  | "services"
  | "skills"
  | "education"
  | "experience"
  | "projects"
  | "faqs"

const partialFrom = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) =>
  schema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })

export const listUpdateSchemas = {
  services: partialFrom(serviceCreateSchema),
  skills: partialFrom(skillCreateSchema),
  education: partialFrom(educationCreateSchema),
  experience: partialFrom(experienceCreateSchema),
  projects: partialFrom(projectCreateSchema),
  faqs: partialFrom(faqCreateSchema),
} as const

export const listCreateSchemas = {
  services: serviceCreateSchema,
  skills: skillCreateSchema,
  education: educationCreateSchema,
  experience: experienceCreateSchema,
  projects: projectCreateSchema,
  faqs: faqCreateSchema,
} as const

export const listAll = async (table: ListTable) => {
  if (!assertAgentDbReady()) {
    return { ok: false as const, error: "Supabase is not configured.", status: 503 }
  }
  const admin = createServiceClient()
  const { data, error } = await admin
    .from(table)
    .select("*")
    .order("sort_order", { ascending: true })

  if (error) return { ok: false as const, error: error.message, status: 500 }
  return { ok: true as const, items: data ?? [] }
}

export const getById = async (table: ListTable, id: string) => {
  if (!assertAgentDbReady()) {
    return { ok: false as const, error: "Supabase is not configured.", status: 503 }
  }
  const admin = createServiceClient()
  const { data, error } = await admin
    .from(table)
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) return { ok: false as const, error: error.message, status: 500 }
  if (!data) return { ok: false as const, error: "Not found", status: 404 }
  return { ok: true as const, item: data }
}

export const createItem = async (
  table: ListTable,
  row: Record<string, unknown>
): Promise<{ ok: true; item: Record<string, unknown> } | AgentFail> => {
  if (!assertAgentDbReady()) {
    return { ok: false, error: "Supabase is not configured.", status: 503 }
  }
  const admin = createServiceClient()

  if (row.sort_order === undefined) {
    const { count } = await admin
      .from(table)
      .select("id", { count: "exact", head: true })
    row = { ...row, sort_order: count ?? 0 }
  }

  const { data, error } = await admin
    .from(table)
    .insert({ ...row, updated_at: new Date().toISOString() })
    .select("*")
    .single()

  if (error) return { ok: false, error: error.message, status: 500 }
  await revalidateAfterMutation()
  return { ok: true, item: data as Record<string, unknown> }
}

export const updateItem = async (
  table: ListTable,
  id: string,
  row: Record<string, unknown>
): Promise<{ ok: true; item: Record<string, unknown> } | AgentFail> => {
  if (!assertAgentDbReady()) {
    return { ok: false, error: "Supabase is not configured.", status: 503 }
  }
  const admin = createServiceClient()
  const { data: existing, error: findError } = await admin
    .from(table)
    .select("id")
    .eq("id", id)
    .maybeSingle()

  if (findError) return { ok: false, error: findError.message, status: 500 }
  if (!existing) return { ok: false, error: "Not found", status: 404 }

  const { data, error } = await admin
    .from(table)
    .update({ ...row, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single()

  if (error) return { ok: false, error: error.message, status: 500 }
  await revalidateAfterMutation()
  return { ok: true, item: data as Record<string, unknown> }
}

export const deleteItem = async (
  table: ListTable,
  id: string
): Promise<{ ok: true; deleted: { id: string } } | AgentFail> => {
  if (!assertAgentDbReady()) {
    return { ok: false, error: "Supabase is not configured.", status: 503 }
  }
  const admin = createServiceClient()
  const { data: existing, error: findError } = await admin
    .from(table)
    .select("id")
    .eq("id", id)
    .maybeSingle()

  if (findError) return { ok: false, error: findError.message, status: 500 }
  if (!existing) return { ok: false, error: "Not found", status: 404 }

  const { error } = await admin.from(table).delete().eq("id", id)
  if (error) return { ok: false, error: error.message, status: 500 }
  await revalidateAfterMutation()
  return { ok: true, deleted: { id } }
}
