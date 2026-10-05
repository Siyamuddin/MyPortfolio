import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/env"

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
})

const normalizePeriodStats = (value: unknown): AnalyticsPeriodStats => {
  if (!value || typeof value !== "object") return emptyStats()
  const row = value as Record<string, unknown>
  return {
    page_views: Number(row.page_views ?? 0) || 0,
    unique_visitors: Number(row.unique_visitors ?? 0) || 0,
  }
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
    // by_day, by_month, and by_year stay in the SQL function and are ignored here.

    return {
      summary: {
        today: normalizePeriodStats(summary.today),
        this_month: normalizePeriodStats(summary.this_month),
        this_year: normalizePeriodStats(summary.this_year),
      },
    }
  } catch (error) {
    console.error("[analytics] summary error", error)
    return emptyAnalyticsSummary()
  }
}
