import type {
  FinanceConfig,
  Guideline,
  Obligation,
  SpendEntry,
} from "@/lib/finance/types"
import type { z } from "zod"
import { configSchema, guidelineSchema, obligationSchema, spendSchema } from "@/lib/finance/schemas"

type ApiErrorBody = {
  message?: string
  error?: string
}

const parseError = async (response: Response): Promise<string> => {
  try {
    const body = (await response.json()) as ApiErrorBody
    if (typeof body.error === "string" && body.error.length > 0) return body.error
    if (typeof body.message === "string" && body.message.length > 0) {
      return body.message
    }
  } catch {
    // fall through
  }

  return `Request failed (${response.status})`
}

export const fetchJson = async <T>(
  input: string,
  init?: RequestInit,
  schema?: z.ZodType<T>
): Promise<T> => {
  const response = await fetch(input, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const body: unknown = await response.json()
  if (!body || typeof body !== "object" || !("ok" in body) || body.ok !== true || !("data" in body)) {
    throw new Error("The server returned an invalid finance response. Please try again.")
  }
  if (!schema) return body.data as T
  const result = schema.safeParse(body.data)
  if (!result.success) throw new Error("Finance data is incomplete or unavailable. Please try again.")
  return result.data
}

export const getConfig = (): Promise<FinanceConfig> =>
  fetchJson<FinanceConfig>("/api/agent/finance/config", undefined, configSchema)

export const putConfig = (
  patch: Partial<FinanceConfig>
): Promise<FinanceConfig> =>
  fetchJson<FinanceConfig>("/api/agent/finance/config", {
    method: "PUT",
    body: JSON.stringify(patch),
  }, configSchema)

export const getSpends = (month?: string): Promise<SpendEntry[]> => {
  const query = month ? `?month=${encodeURIComponent(month)}` : ""
  return fetchJson<SpendEntry[]>(`/api/agent/finance/spends${query}`, undefined, spendSchema.array())
}

export const postSpend = (
  entry: Omit<SpendEntry, "total"> & { total?: number }
): Promise<SpendEntry> =>
  fetchJson<SpendEntry>("/api/agent/finance/spends", {
    method: "POST",
    body: JSON.stringify(entry),
  }, spendSchema)

export const getObligations = (): Promise<Obligation[]> =>
  fetchJson<Obligation[]>("/api/agent/finance/obligations", undefined, obligationSchema.array())

export const toggleObligation = (id: string): Promise<Obligation> =>
  fetchJson<Obligation>("/api/agent/finance/obligations", {
    method: "PATCH",
    body: JSON.stringify({ id }),
  }, obligationSchema)

export const getGuidelines = (): Promise<Guideline[]> =>
  fetchJson<Guideline[]>("/api/agent/finance/guidelines", undefined, guidelineSchema.array())
