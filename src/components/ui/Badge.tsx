import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/cn"

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "outline" | "default"
  children?: ReactNode
}

export const Badge = ({
  className,
  variant = "outline",
  children,
  ...props
}: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide",
      variant === "outline" && "border border-jet bg-onyx text-light-gray",
      variant === "default" && "bg-gold/15 text-gold",
      className
    )}
    {...props}
  >
    {children}
  </span>
)
