import {
  assertAgentDbReady,
  revalidateAfterMutation,
  type AgentFail,
} from "@/lib/agent/common"
import { createServiceClient } from "@/lib/supabase/admin"
import { MAX_UPLOAD_BYTES, preparePortfolioUpload, uploadTooLargeError } from "@/lib/upload-limit"

export const uploadPortfolioFile = async (
  file: File,
  folder: string
): Promise<{ ok: true; url: string; path: string } | AgentFail> => {
  if (!assertAgentDbReady()) {
    return { ok: false, error: "Supabase is not configured.", status: 503 }
  }

  if (!file || file.size === 0) {
    return { ok: false, error: "No file provided", status: 400 }
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: uploadTooLargeError, status: 400 }
  }

  const prepared = await preparePortfolioUpload(file, folder)
  if (!prepared.ok) return { ok: false, error: prepared.error, status: 400 }

  const admin = createServiceClient()
  const path = `${prepared.folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${prepared.extension}`

  const { error } = await admin.storage
    .from("portfolio")
    .upload(path, file, { upsert: false, contentType: prepared.contentType })

  if (error) return { ok: false, error: error.message, status: 500 }

  const { data } = admin.storage.from("portfolio").getPublicUrl(path)
  await revalidateAfterMutation()
  return { ok: true, url: data.publicUrl, path }
}
