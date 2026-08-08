"use client"

import { useId, useMemo, useState } from "react"
import { cn } from "@/lib/cn"
import { formatDate, formatKRW } from "@/lib/finance/format"

export type SpendTrendDatum = {
  date: string
  total: number
}

type SpendTrendProps = {
  data: SpendTrendDatum[]
  className?: string
  height?: number
}

const formatAxisTick = (value: number): string => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`
  }

  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}k`
  }

  return String(value)
}

const formatDayTick = (dateStr: string): string => {
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) {
    return dateStr
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export const SpendTrend = ({
  data,
  className,
  height = 260,
}: SpendTrendProps) => {
  const gradientId = useId()
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const maxValue = useMemo(() => {
    if (data.length === 0) {
      return 1
    }
    return Math.max(...data.map((d) => d.total), 1)
  }, [data])

  const points = useMemo(() => {
    const left = 44
    const right = 12
    const top = 12
    const bottom = 28
    const width = 420
    const plotW = width - left - right
    const plotH = height - top - bottom
    const step = data.length > 1 ? plotW / (data.length - 1) : 0

    return data.map((item, index) => {
      const x = left + index * step
      const y = top + plotH - (item.total / maxValue) * plotH
      return { ...item, x, y, index }
    })
  }, [data, height, maxValue])

  if (data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border border-jet bg-eerie-black-2/70 p-6 text-sm text-light-gray-70",
          className
        )}
      >
        No spend trend data yet
      </div>
    )
  }

  const left = 44
  const right = 12
  const top = 12
  const bottom = 28
  const width = 420
  const plotH = height - top - bottom
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ")
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(top + plotH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(top + plotH).toFixed(1)} Z`
      : ""

  const hovered = hoverIndex !== null ? points[hoverIndex] : null

  return (
    <div
      className={cn(
        "rounded-xl border border-jet bg-eerie-black-2/70 p-4",
        className
      )}
    >
      <div className="mb-3">
        <h3 className="text-sm font-medium text-white-2">14-day spend</h3>
        <p className="text-xs text-light-gray-70">Daily totals in KRW</p>
      </div>

      <div
        className="relative w-full min-w-0"
        role="img"
        aria-label="Fourteen day spend trend chart"
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height={height}
          className="max-w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffdb70" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#ffdb70" stopOpacity={0} />
            </linearGradient>
          </defs>

          {[0, 0.5, 1].map((ratio) => {
            const y = top + plotH - ratio * plotH
            return (
              <g key={ratio}>
                <line
                  x1={left}
                  y1={y}
                  x2={width - right}
                  y2={y}
                  stroke="rgba(56,56,61,0.9)"
                  strokeDasharray="3 3"
                />
                <text
                  x={left - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill="#d0d6e0"
                  opacity={0.7}
                  fontSize={10}
                >
                  {formatAxisTick(maxValue * ratio)}
                </text>
              </g>
            )
          })}

          <path d={areaPath} fill={`url(#${gradientId})`} />
          <path
            d={linePath}
            fill="none"
            stroke="#ffdb70"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {points.map((point) => (
            <g key={point.date}>
              <circle
                cx={point.x}
                cy={point.y}
                r={hoverIndex === point.index ? 4 : 2.5}
                fill="#ffdb70"
                stroke="#121214"
                strokeWidth={2}
                className="cursor-pointer"
                tabIndex={0}
                role="listitem"
                aria-label={`${formatDate(point.date)}: ${formatKRW(point.total)}`}
                onMouseEnter={() => setHoverIndex(point.index)}
                onMouseLeave={() => setHoverIndex(null)}
                onFocus={() => setHoverIndex(point.index)}
                onBlur={() => setHoverIndex(null)}
              />
              {point.index % 3 === 0 || point.index === points.length - 1 ? (
                <text
                  x={point.x}
                  y={height - 8}
                  textAnchor="middle"
                  fill="#d0d6e0"
                  opacity={0.7}
                  fontSize={10}
                >
                  {formatDayTick(point.date)}
                </text>
              ) : null}
            </g>
          ))}
        </svg>

        {hovered ? (
          <div className="pointer-events-none absolute top-2 right-2 rounded-xl border border-jet bg-eerie-black-1/95 px-3 py-2 text-xs shadow-lg">
            <p className="mb-1 font-medium text-white-2">
              {formatDate(hovered.date)}
            </p>
            <p className="font-mono text-gold tabular-nums">
              {formatKRW(hovered.total)}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
