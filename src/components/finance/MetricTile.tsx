"use client"

import { useEffect, useRef, useState } from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/cn"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"

export type MetricTone = "emerald" | "rose" | "gold" | "sky" | "neutral"

type MetricTileProps = {
  label: string
  value: number
  sub?: string
  tone?: MetricTone
  icon?: LucideIcon
  formatValue?: (n: number) => string
  className?: string
}

const TONE_STYLES: Record<
  MetricTone,
  { glow: string; accent: string; icon: string }
> = {
  emerald: {
    glow: "before:bg-gold/20",
    accent: "text-gold",
    icon: "bg-gold/15 text-gold",
  },
  rose: {
    glow: "before:bg-red-400/20",
    accent: "text-red-400",
    icon: "bg-red-400/15 text-red-400",
  },
  gold: {
    glow: "before:bg-gold/20",
    accent: "text-gold",
    icon: "bg-gold/15 text-gold",
  },
  sky: {
    glow: "before:bg-light-gray/10",
    accent: "text-light-gray",
    icon: "bg-onyx text-light-gray",
  },
  neutral: {
    glow: "before:bg-onyx",
    accent: "text-white-2",
    icon: "bg-onyx text-light-gray-70",
  },
}

const defaultFormat = (n: number): string =>
  new Intl.NumberFormat("en-KR", { maximumFractionDigits: 0 }).format(
    Math.round(n)
  )

export const MetricTile = ({
  label,
  value,
  sub,
  tone = "emerald",
  icon: Icon,
  formatValue = defaultFormat,
  className,
}: MetricTileProps) => {
  const reducedMotion = usePrefersReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [animatedDisplay, setAnimatedDisplay] = useState(0)
  const display = reducedMotion ? value : animatedDisplay
  const styles = TONE_STYLES[tone]

  useEffect(() => {
    const node = ref.current
    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || reducedMotion) {
      return
    }

    let frame = 0
    const duration = 1100
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setAnimatedDisplay(value * eased)
      if (t < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reducedMotion, value])

  return (
    <article
      ref={ref}
      className={cn(
        "relative min-w-0 overflow-hidden rounded-xl border border-jet bg-eerie-black-2/70 p-6",
        "before:pointer-events-none before:absolute before:-top-24 before:left-1/2 before:h-48 before:w-48 before:-translate-x-1/2 before:rounded-full before:blur-3xl before:content-['']",
        styles.glow,
        className
      )}
    >
      <div className="relative flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <p className="break-words text-xs font-medium tracking-[0.14em] text-light-gray-70 uppercase">
            {label}
          </p>
          <p
            className={cn(
              "break-words font-mono text-[clamp(1.75rem,8vw,2.25rem)] font-semibold tracking-tight text-balance tabular-nums sm:text-5xl",
              styles.accent
            )}
          >
            {formatValue(display)}
          </p>
          {sub ? (
            <p className="max-w-prose break-words text-sm text-light-gray-70">
              {sub}
            </p>
          ) : null}
        </div>
        {Icon ? (
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-2xl",
              styles.icon
            )}
            aria-hidden="true"
          >
            <Icon className="size-5" />
          </div>
        ) : null}
      </div>
    </article>
  )
}
