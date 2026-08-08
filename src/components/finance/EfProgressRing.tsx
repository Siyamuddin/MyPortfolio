"use client"

import { cn } from "@/lib/cn"
import { formatKRW, formatPercent } from "@/lib/finance/format"

type EfProgressRingProps = {
  percent: number
  target: number
  size?: number
  strokeWidth?: number
  className?: string
}

export const EfProgressRing = ({
  percent,
  target,
  size = 168,
  strokeWidth = 12,
  className,
}: EfProgressRingProps) => {
  const clamped = Math.max(0, Math.min(percent, 100))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference
  const center = size / 2

  return (
    <div
      className={cn(
        "relative flex min-w-0 max-w-full items-center justify-center rounded-xl border border-jet bg-eerie-black-2/70 p-4",
        className
      )}
      role="img"
      aria-label={`Emergency fund ${formatPercent(clamped)} of ${formatKRW(target)} target`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="max-w-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-jet"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-gold transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
        />
      </svg>

      <div className="absolute inset-0 flex min-w-0 flex-col items-center justify-center px-2 text-center">
        <p className="break-words font-mono text-2xl font-semibold tracking-tight text-white-2 tabular-nums">
          {formatPercent(clamped, 0)}
        </p>
        <p className="mt-1 break-words text-xs text-light-gray-70">
          of {formatKRW(target)}
        </p>
      </div>
    </div>
  )
}
