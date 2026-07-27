"use client"

import { useState } from "react"
import type { AnalyticsSummary } from "@/lib/analytics/stats"

type PeriodTab = "day" | "month" | "year"

type AnalyticsPanelProps = {
  analytics: AnalyticsSummary
}

const formatLabel = (tab: PeriodTab, period: string) => {
  if (tab === "day") return period
  if (tab === "month") return period
  return period
}

export const AnalyticsPanel = ({ analytics }: AnalyticsPanelProps) => {
  const [tab, setTab] = useState<PeriodTab>("day")

  const rows =
    tab === "day"
      ? analytics.by_day
      : tab === "month"
        ? analytics.by_month
        : analytics.by_year

  const tabs: { id: PeriodTab; label: string }[] = [
    { id: "day", label: "By day" },
    { id: "month", label: "By month" },
    { id: "year", label: "By year" },
  ]

  const cards = [
    { label: "Today", stats: analytics.summary.today },
    { label: "This month", stats: analytics.summary.this_month },
    { label: "This year", stats: analytics.summary.this_year },
  ]

  return (
    <section
      className="space-y-4 rounded-2xl border border-jet bg-eerie-black-2 p-6"
      aria-labelledby="analytics-title"
    >
      <div>
        <h2 id="analytics-title" className="mb-1 text-xl text-white-2">
          Visitors
        </h2>
        <p className="text-sm text-light-gray-70">
          First-party page views and unique visitors (no third-party cookies).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-jet bg-eerie-black-1 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-light-gray-70">
              {card.label}
            </p>
            <p className="mt-2 text-2xl text-gold">{card.stats.page_views}</p>
            <p className="text-xs text-light-gray-70">page views</p>
            <p className="mt-2 text-lg text-white-2">
              {card.stats.unique_visitors}
            </p>
            <p className="text-xs text-light-gray-70">unique visitors</p>
          </div>
        ))}
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Analytics period"
      >
        {tabs.map((item) => {
          const selected = tab === item.id
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              tabIndex={0}
              aria-label={item.label}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                selected
                  ? "bg-gold text-eerie-black-1"
                  : "bg-onyx text-light-gray hover:text-gold"
              }`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="overflow-x-auto" role="tabpanel">
        {rows.length === 0 ? (
          <p className="text-sm text-light-gray-70">
            No visits recorded for this period yet. Browse the public site to
            generate data.
          </p>
        ) : (
          <table className="w-full min-w-[320px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-jet text-light-gray-70">
                <th className="px-2 py-2 font-medium">Period</th>
                <th className="px-2 py-2 font-medium">Page views</th>
                <th className="px-2 py-2 font-medium">Unique visitors</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.period} className="border-b border-jet/60">
                  <td className="px-2 py-2 text-white-2">
                    {formatLabel(tab, row.period)}
                  </td>
                  <td className="px-2 py-2 text-light-gray">{row.page_views}</td>
                  <td className="px-2 py-2 text-light-gray">
                    {row.unique_visitors}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
