"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/cn"

export type StatTone = "emerald" | "rose" | "gold" | "sky" | "neutral"

type StatCardProps = {
  label: string
  value: string
  sub?: string
  icon?: LucideIcon
  tone?: StatTone
  trend?: {
    direction: "up" | "down" | "flat"
    label: string
  }
  className?: string
}

const TONE_STYLES: Record<
  StatTone,
  { glow: string; icon: string; trendUp: string; trendDown: string }
> = {
  emerald: {
    glow: "shadow-[0_0_40px_-12px_rgba(255,219,112,0.28)]",
    icon: "bg-gold/15 text-gold",
    trendUp: "text-gold",
    trendDown: "text-red-400",
  },
  rose: {
    glow: "shadow-[0_0_40px_-12px_rgba(248,113,113,0.35)]",
    icon: "bg-red-400/15 text-red-400",
    trendUp: "text-red-400",
    trendDown: "text-emerald-400",
  },
  gold: {
    glow: "shadow-[0_0_40px_-12px_rgba(255,219,112,0.4)]",
    icon: "bg-gold/15 text-gold",
    trendUp: "text-gold",
    trendDown: "text-red-400",
  },
  sky: {
    glow: "shadow-[0_0_40px_-12px_rgba(208,214,224,0.25)]",
    icon: "bg-light-gray/10 text-light-gray",
    trendUp: "text-light-gray",
    trendDown: "text-red-400",
  },
  neutral: {
    glow: "shadow-[0_0_40px_-12px_rgba(56,56,61,0.45)]",
    icon: "bg-onyx text-light-gray-70",
    trendUp: "text-gold",
    trendDown: "text-red-400",
  },
}

export const StatCard = ({
  label,
  value,
  sub,
  icon: Icon,
  tone = "neutral",
  trend,
  className,
}: StatCardProps) => {
  const styles = TONE_STYLES[tone]

  const trendClass =
    trend?.direction === "up"
      ? styles.trendUp
      : trend?.direction === "down"
        ? styles.trendDown
        : "text-light-gray-70"

  return (
    <article
      className={cn(
        "group relative min-w-0 overflow-hidden rounded-xl border border-jet bg-eerie-black-2/70 p-4 transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        styles.glow,
        className
      )}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="break-words text-xs font-medium tracking-wide text-light-gray-70 uppercase">
            {label}
          </p>
          <p className="break-words font-mono text-xl font-semibold tracking-tight text-balance text-white-2 tabular-nums sm:text-2xl">
            {value}
          </p>
        </div>
        {Icon ? (
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl",
              styles.icon
            )}
            aria-hidden="true"
          >
            <Icon className="size-4" />
          </div>
        ) : null}
      </div>

      {sub || trend ? (
        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          {trend ? (
            <span className={cn("shrink-0 font-medium", trendClass)}>
              {trend.direction === "up" ? "↑ " : null}
              {trend.direction === "down" ? "↓ " : null}
              {trend.label}
            </span>
          ) : null}
          {sub ? (
            <span className="min-w-0 break-words text-light-gray-70">{sub}</span>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}
