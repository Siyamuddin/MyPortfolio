import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export type AnalyticsBucket = {
  period: string
  page_views: number
  unique_visitors: number
}

export type AnalyticsPeriodStats = {
  page_views: number
  unique_visitors: number
}

export type AnalyticsSummary = {
  summary: {
    today: AnalyticsPeriodStats
    this_month: AnalyticsPeriodStats
    this_year: AnalyticsPeriodStats
  }
  by_day: AnalyticsBucket[]
  by_month: AnalyticsBucket[]
  by_year: AnalyticsBucket[]
}

const emptyStats = (): AnalyticsPeriodStats => ({
  page_views: 0,
  unique_visitors: 0,
})

export const emptyAnalyticsSummary = (): AnalyticsSummary => ({
  summary: {
    today: emptyStats(),
    this_month: emptyStats(),
    this_year: emptyStats(),
  },
  by_day: [],
  by_month: [],
  by_year: [],
})

const normalizePeriodStats = (value: unknown): AnalyticsPeriodStats => {
  if (!value || typeof value !== "object") return emptyStats()
  const row = value as Record<string, unknown>
  return {
    page_views: Number(row.page_views ?? 0) || 0,
    unique_visitors: Number(row.unique_visitors ?? 0) || 0,
  }
}

const normalizeBuckets = (value: unknown): AnalyticsBucket[] => {
  if (!Array.isArray(value)) return []
  return value.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>
    return {
      period: String(row.period ?? ""),
      page_views: Number(row.page_views ?? 0) || 0,
      unique_visitors: Number(row.unique_visitors ?? 0) || 0,
    }
  })
}

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  if (!isSupabaseConfigured()) return emptyAnalyticsSummary()

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc("get_analytics_summary")

    if (error) {
      console.error("[analytics] summary failed", error.message)
      return emptyAnalyticsSummary()
    }

    const payload = (data ?? {}) as Record<string, unknown>
    const summary = (payload.summary ?? {}) as Record<string, unknown>

    return {
      summary: {
        today: normalizePeriodStats(summary.today),
        this_month: normalizePeriodStats(summary.this_month),
        this_year: normalizePeriodStats(summary.this_year),
      },
      by_day: normalizeBuckets(payload.by_day),
      by_month: normalizeBuckets(payload.by_month),
      by_year: normalizeBuckets(payload.by_year),
    }
  } catch (error) {
    console.error("[analytics] summary error", error)
    return emptyAnalyticsSummary()
  }
}
