import type { AnalyticsSummary } from "@/lib/analytics/stats"

type AnalyticsPanelProps = {
  analytics: AnalyticsSummary
}

export const AnalyticsPanel = ({ analytics }: AnalyticsPanelProps) => {
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
    </section>
  )
}
