import type {
  FinanceConfig,
  Guideline,
  Obligation,
  SpendEntry,
} from "@/lib/finance/types"

type ApiErrorBody = {
  message?: string
}

const parseError = async (response: Response): Promise<string> => {
  try {
    const body = (await response.json()) as ApiErrorBody
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
  init?: RequestInit
): Promise<T> => {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return (await response.json()) as T
}

export const getConfig = (): Promise<FinanceConfig> =>
  fetchJson<FinanceConfig>("/api/agent/finance/config")

export const putConfig = (
  patch: Partial<FinanceConfig>
): Promise<FinanceConfig> =>
  fetchJson<FinanceConfig>("/api/agent/finance/config", {
    method: "PUT",
    body: JSON.stringify(patch),
  })

export const getSpends = (month?: string): Promise<SpendEntry[]> => {
  const query = month ? `?month=${encodeURIComponent(month)}` : ""
  return fetchJson<SpendEntry[]>(`/api/agent/finance/spends${query}`)
}

export const postSpend = (
  entry: Omit<SpendEntry, "total"> & { total?: number }
): Promise<SpendEntry> =>
  fetchJson<SpendEntry>("/api/agent/finance/spends", {
    method: "POST",
    body: JSON.stringify(entry),
  })

export const getObligations = (): Promise<Obligation[]> =>
  fetchJson<Obligation[]>("/api/agent/finance/obligations")

export const toggleObligation = (id: string): Promise<Obligation> =>
  fetchJson<Obligation>("/api/agent/finance/obligations", {
    method: "PATCH",
    body: JSON.stringify({ id }),
  })

export const getGuidelines = (): Promise<Guideline[]> =>
  fetchJson<Guideline[]>("/api/agent/finance/guidelines")
