"use client"

import { useId, useMemo, useState } from "react"
import { cn } from "@/lib/cn"
import { formatKRW } from "@/lib/finance/format"
import type { BudgetBarDatum } from "@/lib/finance/types"

export type { BudgetBarDatum }

type BudgetBarsProps = {
  data: BudgetBarDatum[]
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

export const BudgetBars = ({
  data,
  className,
  height = 280,
}: BudgetBarsProps) => {
  const gradientId = useId()
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const maxValue = useMemo(() => {
    if (data.length === 0) {
      return 1
    }
    return Math.max(...data.flatMap((d) => [d.spent, d.cap]), 1)
  }, [data])

  if (data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border border-jet bg-eerie-black-2/70 p-6 text-sm text-light-gray-70",
          className
        )}
      >
        No budget data yet
      </div>
    )
  }

  const labelWidth = 72
  const rightPad = 56
  const topPad = 8
  const bottomPad = 28
  const rowGap = 10
  const barHeight = 8
  const pairHeight = barHeight * 2 + 4
  const chartWidth = 420
  const innerHeight = data.length * (pairHeight + rowGap)
  const svgHeight = Math.max(height, topPad + innerHeight + bottomPad)
  const plotWidth = chartWidth - labelWidth - rightPad

  const hovered = hoverIndex !== null ? data[hoverIndex] : null

  return (
    <div
      className={cn(
        "rounded-xl border border-jet bg-eerie-black-2/70 p-4",
        className
      )}
    >
      <div className="mb-3">
        <h3 className="text-sm font-medium text-white-2">Budget vs spend</h3>
        <p className="text-xs text-light-gray-70">
          Gold = spent · Slate = category cap
        </p>
      </div>

      <div
        className="relative w-full min-w-0 overflow-x-auto"
        role="img"
        aria-label="Budget versus spend bar chart"
      >
        <svg
          viewBox={`0 0 ${chartWidth} ${svgHeight}`}
          width="100%"
          height={height}
          className="max-w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffdb70" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#e8b84b" stopOpacity={1} />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const x = labelWidth + ratio * plotWidth
            return (
              <g key={ratio}>
                <line
                  x1={x}
                  y1={topPad}
                  x2={x}
                  y2={topPad + innerHeight}
                  stroke="rgba(56,56,61,0.9)"
                  strokeDasharray="3 3"
                />
                <text
                  x={x}
                  y={svgHeight - 8}
                  textAnchor="middle"
                  fill="#d0d6e0"
                  opacity={0.7}
                  fontSize={10}
                >
                  {formatAxisTick(maxValue * ratio)}
                </text>
              </g>
            )
          })}

          {data.map((item, index) => {
            const y = topPad + index * (pairHeight + rowGap)
            const spentW = (item.spent / maxValue) * plotWidth
            const capW = (item.cap / maxValue) * plotWidth

            return (
              <g
                key={item.category}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                onFocus={() => setHoverIndex(index)}
                onBlur={() => setHoverIndex(null)}
                tabIndex={0}
                role="listitem"
                aria-label={`${item.category}: spent ${formatKRW(item.spent)}, cap ${formatKRW(item.cap)}`}
              >
                <text
                  x={labelWidth - 8}
                  y={y + pairHeight / 2 + 3}
                  textAnchor="end"
                  fill="#d0d6e0"
                  fontSize={11}
                >
                  {item.category}
                </text>
                <rect
                  x={labelWidth}
                  y={y}
                  width={Math.max(spentW, 0)}
                  height={barHeight}
                  rx={4}
                  fill={`url(#${gradientId})`}
                />
                <rect
                  x={labelWidth}
                  y={y + barHeight + 4}
                  width={Math.max(capW, 0)}
                  height={barHeight}
                  rx={4}
                  fill="#38383d"
                />
                <text
                  x={labelWidth + Math.max(spentW, 0) + 4}
                  y={y + barHeight - 1}
                  fill="#d0d6e0"
                  opacity={0.75}
                  fontSize={9}
                >
                  {formatKRW(item.spent)}
                </text>
                <text
                  x={labelWidth + Math.max(capW, 0) + 4}
                  y={y + barHeight * 2 + 3}
                  fill="#d0d6e0"
                  opacity={0.55}
                  fontSize={9}
                >
                  {formatKRW(item.cap)}
                </text>
              </g>
            )
          })}
        </svg>

        {hovered ? (
          <div className="pointer-events-none absolute top-2 right-2 rounded-xl border border-jet bg-eerie-black-1/95 px-3 py-2 text-xs shadow-lg">
            <p className="mb-1.5 font-medium text-white-2">{hovered.category}</p>
            <p className="flex justify-between gap-4 text-light-gray-70">
              <span>spent</span>
              <span className="font-mono text-gold tabular-nums">
                {formatKRW(hovered.spent)}
              </span>
            </p>
            <p className="flex justify-between gap-4 text-light-gray-70">
              <span>cap</span>
              <span className="font-mono text-white-2 tabular-nums">
                {formatKRW(hovered.cap)}
              </span>
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-2 flex flex-wrap gap-4 text-[11px] text-light-gray-70">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-gold" aria-hidden="true" />
          spent
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-jet" aria-hidden="true" />
          cap
        </span>
      </div>
    </div>
  )
}
