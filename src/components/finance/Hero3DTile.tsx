"use client"

import dynamic from "next/dynamic"
import { useState, type ChangeEvent } from "react"
import { Skeleton } from "@/components/ui/Skeleton"
import { putConfig } from "@/lib/finance/client-api"
import type { FinanceConfig } from "@/lib/finance/types"
import { formatKRW } from "@/lib/finance/format"
import { cn } from "@/lib/cn"
import type { MetricTone } from "@/components/finance/MetricTile"

const CoinStack3D = dynamic(
  () =>
    import("@/components/finance/CoinStack3D").then((mod) => mod.CoinStack3D),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        className="h-[260px] w-full rounded-xl sm:h-[280px]"
        aria-label="Loading 3D visualization"
      />
    ),
  }
)

export type HeroMetricOption = {
  value: string
  label: string
}

export const HERO_METRIC_OPTIONS: readonly HeroMetricOption[] = [
  { value: "moneyLeftThisMonth", label: "Money left" },
  { value: "efProgressPercent", label: "EF progress" },
  { value: "daysUntilTuition", label: "Days until tuition" },
] as const

type Hero3DTileProps = {
  progress: number
  target: number
  heroMetric: string
  metricLabel: string
  metricValue: string
  metricSub?: string
  tone?: MetricTone
  onConfigChange: (config: FinanceConfig) => void
  className?: string
}

const TONE_ACCENT: Record<MetricTone, string> = {
  emerald: "text-gold",
  rose: "text-red-400",
  gold: "text-gold",
  sky: "text-light-gray",
  neutral: "text-white-2",
}

const TONE_GLOW: Record<MetricTone, string> = {
  emerald: "before:bg-gold/20",
  rose: "before:bg-red-400/20",
  gold: "before:bg-gold/20",
  sky: "before:bg-light-gray/10",
  neutral: "before:bg-onyx",
}

export const Hero3DTile = ({
  progress,
  target,
  heroMetric,
  metricLabel,
  metricValue,
  metricSub,
  tone = "gold",
  onConfigChange,
  className,
}: Hero3DTileProps) => {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleHeroMetricChange = async (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value
    if (!value || value === heroMetric || saving) {
      return
    }

    setSaving(true)
    setError(null)

    try {
      const updated = await putConfig({ heroMetric: value })
      onConfigChange(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update metric")
    } finally {
      setSaving(false)
    }
  }

  return (
    <article
      className={cn(
        "relative min-w-0 overflow-hidden rounded-xl border border-jet bg-eerie-black-2/70 p-4 sm:p-5",
        "before:pointer-events-none before:absolute before:-top-24 before:left-1/2 before:h-48 before:w-48 before:-translate-x-1/2 before:rounded-full before:blur-3xl before:content-['']",
        TONE_GLOW[tone],
        className
      )}
    >
      <div className="relative z-10 mb-3 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="break-words text-xs font-medium tracking-[0.14em] text-light-gray-70 uppercase">
            {metricLabel}
          </p>
          <p
            className={cn(
              "break-words font-mono text-[clamp(1.5rem,7vw,2.25rem)] font-semibold tracking-tight text-balance tabular-nums sm:text-4xl",
              TONE_ACCENT[tone]
            )}
          >
            {metricValue}
          </p>
          {metricSub ? (
            <p className="break-words text-xs text-light-gray-70 sm:text-sm">
              {metricSub}
            </p>
          ) : null}
        </div>

        <div className="flex w-full min-w-0 flex-col items-stretch gap-1 sm:w-auto sm:shrink-0 sm:items-end">
          <label className="sr-only" htmlFor="hero-metric-select">
            Switch hero metric
          </label>
          <select
            id="hero-metric-select"
            value={heroMetric}
            onChange={(event) => {
              void handleHeroMetricChange(event)
            }}
            disabled={saving}
            className="min-h-10 w-full min-w-0 rounded-lg border border-jet bg-onyx px-3 py-2 text-sm text-white-2 outline-none focus:border-gold disabled:opacity-50 touch-manipulation sm:w-auto sm:min-w-[9.5rem]"
            aria-label="Switch hero metric"
            tabIndex={0}
          >
            {HERO_METRIC_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error ? (
            <p
              className="max-w-full break-words text-right text-[11px] text-red-400 sm:max-w-[12rem]"
              role="alert"
            >
              {error}
            </p>
          ) : null}
        </div>
      </div>

      <CoinStack3D
        progress={progress}
        target={target}
        label={`EF · ${formatKRW(target)}`}
      />
    </article>
  )
}
