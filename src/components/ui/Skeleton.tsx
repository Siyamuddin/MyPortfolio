import type { HTMLAttributes } from "react"
import { cn } from "@/lib/cn"

type SkeletonProps = HTMLAttributes<HTMLDivElement>

export const Skeleton = ({ className, ...props }: SkeletonProps) => (
  <div
    className={cn(
      "animate-pulse rounded-xl bg-onyx motion-reduce:animate-none",
      className
    )}
    {...props}
  />
)
