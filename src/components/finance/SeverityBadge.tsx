"use client"

import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/cn"

const SEVERITY_STYLES: Record<string, string> = {
  watch: "border-gold/30 bg-gold/15 text-gold",
  rule: "border-light-gray/30 bg-onyx text-light-gray",
  plan: "border-emerald-400/30 bg-emerald-400/15 text-emerald-400",
  deadline: "border-red-400/30 bg-red-400/15 text-red-400",
  goal: "border-gold/40 bg-gold/10 text-gold-dark",
}

type SeverityBadgeProps = {
  severity: string
  className?: string
}

export const SeverityBadge = ({ severity, className }: SeverityBadgeProps) => {
  const key = severity.toLowerCase()
  const styles =
    SEVERITY_STYLES[key] ?? "border-jet bg-onyx text-light-gray-70"

  return (
    <Badge
      variant="outline"
      className={cn("capitalize", styles, className)}
      aria-label={`Severity: ${severity}`}
    >
      {severity}
    </Badge>
  )
}
