import {
  assertAgentDbReady,
  revalidateAfterMutation,
  type AgentFail,
} from "@/lib/agent/common"
import { createServiceClient } from "@/lib/supabase/admin"

const ALLOWED_FOLDERS = new Set([
  "avatars",
  "projects",
  "blog",
  "skills",
  "resume",
])

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export const uploadPortfolioFile = async (
  file: File,
  folder: string
): Promise<{ ok: true; url: string; path: string } | AgentFail> => {
  if (!assertAgentDbReady()) {
    return { ok: false, error: "Supabase is not configured.", status: 503 }
  }

  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "") || "misc"
  if (!ALLOWED_FOLDERS.has(safeFolder)) {
    return {
      ok: false,
      error: `Invalid folder. Allowed: ${[...ALLOWED_FOLDERS].join(", ")}`,
      status: 400,
    }
  }

  if (!file || file.size === 0) {
    return { ok: false, error: "No file provided", status: 400 }
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "File too large (max 10MB)", status: 400 }
  }

  const admin = createServiceClient()
  const ext = file.name.split(".").pop() || "bin"
  const path = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await admin.storage
    .from("portfolio")
    .upload(path, file, { upsert: false, contentType: file.type })

  if (error) return { ok: false, error: error.message, status: 500 }

  const { data } = admin.storage.from("portfolio").getPublicUrl(path)
  await revalidateAfterMutation()
  return { ok: true, url: data.publicUrl, path }
}
