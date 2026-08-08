"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import {
  CalendarDays,
  Flame,
  PiggyBank,
  Shield,
  Wallet,
  ArrowRight,
} from "lucide-react"
import { BudgetBars } from "@/components/finance/BudgetBars"
import { SpendTrend } from "@/components/finance/SpendTrend"
import { EfProgressRing } from "@/components/finance/EfProgressRing"
import { Hero3DTile } from "@/components/finance/Hero3DTile"
import { type MetricTone } from "@/components/finance/MetricTile"
import { StatCard } from "@/components/finance/StatCard"
import { ErrorState } from "@/components/finance/ErrorState"
import { SeverityBadge } from "@/components/finance/SeverityBadge"
import { FinanceSubNav } from "@/components/finance/FinanceSubNav"
import { Skeleton } from "@/components/ui/Skeleton"
import {
  budgetStatus,
  daysUntil,
  efProgress,
  moneyLeftThisMonth,
  monthlyTotals,
} from "@/lib/finance/calculations"
import {
  getConfig,
  getGuidelines,
  getSpends,
} from "@/lib/finance/client-api"
import type { FinanceConfig, Guideline, SpendEntry } from "@/lib/finance/types"
import {
  formatDate,
  formatKRW,
  formatPercent,
  monthKey,
  todayISO,
} from "@/lib/finance/format"
import {
  buildFourteenDayTrend,
  toBudgetBarData,
} from "@/lib/finance/spend-utils"

type OverviewData = {
  config: FinanceConfig
  spends: SpendEntry[]
  monthSpends: SpendEntry[]
  guidelines: Guideline[]
}

type HeroResolved = {
  label: string
  value: number
  sub: string
  tone: MetricTone
  formatValue: (n: number) => string
}

const resolveHero = (
  config: FinanceConfig,
  left: number,
  efPercent: number,
  tuitionDays: number
): HeroResolved => {
  switch (config.heroMetric) {
    case "moneyLeftThisMonth":
      return {
        label: "Money left this month",
        value: left,
        sub: `After spend · income ${formatKRW(config.monthlyIncome)}`,
        tone: left >= 0 ? "emerald" : "rose",
        formatValue: formatKRW,
      }
    case "efProgressPercent":
      return {
        label: "Emergency fund progress",
        value: efPercent,
        sub: `Target ${formatKRW(config.emergencyFundTarget)}`,
        tone: "gold",
        formatValue: (n) => formatPercent(n, 0),
      }
    case "daysUntilTuition":
      return {
        label: "Days until tuition",
        value: tuitionDays,
        sub: `Due ${formatDate(config.tuitionDue)} · ${formatKRW(config.tuitionAmount)}`,
        tone: tuitionDays <= 14 ? "rose" : "sky",
        formatValue: (n) => `${Math.round(n)}`,
      }
    default: {
      const custom = Number(config.heroMetric)
      return {
        label: "Hero metric",
        value: Number.isFinite(custom) ? custom : 0,
        sub: "Custom value from config",
        tone: "neutral",
        formatValue: (n) =>
          Number.isFinite(custom) && Math.abs(custom) >= 1000
            ? formatKRW(n)
            : `${Math.round(n)}`,
      }
    }
  }
}

const OverviewSkeleton = () => (
  <div className="space-y-4" aria-busy="true" aria-label="Loading overview">
    <div className="grid min-w-0 gap-4 lg:grid-cols-5">
      <Skeleton className="h-44 min-w-0 lg:col-span-2" />
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-3">
        <Skeleton className="h-28 min-w-0" />
        <Skeleton className="h-28 min-w-0" />
        <Skeleton className="h-28 min-w-0" />
        <Skeleton className="h-28 min-w-0" />
      </div>
    </div>
    <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Skeleton className="h-72 min-w-0" />
      <Skeleton className="h-72 min-w-0" />
      <Skeleton className="h-72 min-w-0" />
      <Skeleton className="h-72 min-w-0" />
    </div>
  </div>
)

export default function FinanceOverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const month = monthKey(todayISO())
      const [config, spends, monthSpends, guidelines] = await Promise.all([
        getConfig(),
        getSpends(),
        getSpends(month),
        getGuidelines(),
      ])

      setData({ config, spends, monthSpends, guidelines })
      setError(null)
    } catch (err) {
      setData(null)
      setError(err instanceof Error ? err.message : "Failed to load overview")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void (async () => {
      await load()
    })()
  }, [load])

  if (loading) {
    return (
      <div className="min-w-0 space-y-4 overflow-x-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-white-2">
              Finance
            </h1>
            <p className="text-sm text-light-gray-70">
              Personal finance at a glance
            </p>
          </div>
          <FinanceSubNav />
        </div>
        <OverviewSkeleton />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-w-0 space-y-4 overflow-x-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-white-2">
              Finance
            </h1>
            <p className="text-sm text-light-gray-70">
              Personal finance at a glance
            </p>
          </div>
          <FinanceSubNav />
        </div>
        <ErrorState
          message={error ?? undefined}
          onRetry={() => {
            setLoading(true)
            void load()
          }}
        />
      </div>
    )
  }

  const { config, spends, monthSpends, guidelines } = data
  const totals = monthlyTotals(monthSpends)
  const left = moneyLeftThisMonth(config, totals)
  const ef = efProgress(config)
  const tuitionDays = daysUntil(config.tuitionDue)
  const status = budgetStatus(config, totals)
  const hero = resolveHero(config, left, ef.percent, tuitionDays)
  const budgetBars = toBudgetBarData(config, totals)
  const trend = buildFourteenDayTrend(spends)
  const topGuidelines = guidelines.slice(0, 3)
  const burnTone =
    status.overall.percentUsed > 100
      ? "rose"
      : status.overall.percentUsed > 80
        ? "gold"
        : "emerald"

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium tracking-tight text-white-2">
            Finance
          </h1>
          <p className="text-sm text-light-gray-70">
            Personal finance at a glance
          </p>
        </div>
        <FinanceSubNav />
      </div>

      <section
        className="grid min-w-0 gap-4 lg:grid-cols-5"
        aria-label="Hero metrics"
      >
        <Hero3DTile
          className="min-w-0 lg:col-span-2"
          progress={ef.percent}
          target={ef.target}
          heroMetric={config.heroMetric}
          metricLabel={hero.label}
          metricValue={hero.formatValue(hero.value)}
          metricSub={hero.sub}
          tone={hero.tone}
          onConfigChange={(nextConfig) => {
            setData((prev) =>
              prev ? { ...prev, config: nextConfig } : prev
            )
          }}
        />

        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-3">
          <StatCard
            className="min-w-0"
            label="Cash position"
            value={formatKRW(left)}
            sub="Income minus month spend"
            icon={Wallet}
            tone={left >= 0 ? "emerald" : "rose"}
          />
          <StatCard
            className="min-w-0"
            label="Monthly burn"
            value={formatKRW(totals.total)}
            sub={`of ${formatKRW(config.totalMonthlyBudget)}`}
            icon={Flame}
            tone={burnTone}
            trend={{
              direction:
                status.overall.percentUsed > 100
                  ? "up"
                  : status.overall.percentUsed < 50
                    ? "down"
                    : "flat",
              label: formatPercent(status.overall.percentUsed, 0),
            }}
          />
          <StatCard
            className="min-w-0"
            label="EF progress"
            value={formatPercent(ef.percent, 0)}
            sub={`${formatKRW(ef.seeded)} seeded`}
            icon={Shield}
            tone="gold"
          />
          <StatCard
            className="min-w-0"
            label="Days until tuition"
            value={`${tuitionDays}`}
            sub={`${formatDate(config.tuitionDue)} · ${formatKRW(config.tuitionAmount)}`}
            icon={CalendarDays}
            tone={tuitionDays <= 14 ? "rose" : "sky"}
          />
        </div>
      </section>

      <section
        className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        aria-label="Detail tiles"
      >
        <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-jet bg-eerie-black-2/70 p-4">
          <div className="min-w-0">
            <h2 className="text-sm font-medium text-white-2">Emergency fund</h2>
            <p className="break-words text-xs text-light-gray-70">
              Seed toward {formatKRW(ef.target)}
            </p>
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-center">
            <EfProgressRing percent={ef.percent} target={ef.target} />
          </div>
          <p className="break-words text-center text-xs text-light-gray-70">
            <PiggyBank className="mr-1 inline size-3.5" aria-hidden="true" />
            {formatKRW(ef.seeded)} of {formatKRW(ef.target)}
          </p>
        </div>

        <BudgetBars
          data={budgetBars}
          height={240}
          className="min-h-72 min-w-0"
        />

        <SpendTrend data={trend} height={240} className="min-h-72 min-w-0" />

        <article className="flex min-w-0 flex-col rounded-xl border border-jet bg-eerie-black-2/70 p-4">
          <div className="mb-3 flex min-w-0 items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-sm font-medium text-white-2">
                Guidelines snapshot
              </h2>
              <p className="text-xs text-light-gray-70">Top priorities</p>
            </div>
            <Link
              href="/admin/finance/guidelines"
              className="inline-flex items-center gap-1 text-xs font-medium text-gold outline-none hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-label="Open Guidelines"
              tabIndex={0}
            >
              View all
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          {topGuidelines.length === 0 ? (
            <p className="flex flex-1 items-center justify-center text-sm text-light-gray-70">
              No guidelines yet
            </p>
          ) : (
            <ul className="flex flex-1 flex-col gap-3">
              {topGuidelines.map((guideline) => (
                <li
                  key={guideline.id}
                  className="rounded-xl border border-jet bg-onyx/60 p-3"
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <p className="line-clamp-1 text-sm font-medium text-white-2">
                      {guideline.title}
                    </p>
                    <SeverityBadge severity={guideline.severity} />
                  </div>
                  <p className="line-clamp-2 text-xs text-light-gray-70">
                    {guideline.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </div>
  )
}
