import { cn } from "@/lib/cn"

type ProgressProps = {
  value: number
  className?: string
}

export const Progress = ({ value, className }: ProgressProps) => {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0))

  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-onyx",
        className
      )}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-gold transition-[width] duration-500 ease-out motion-reduce:transition-none"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
