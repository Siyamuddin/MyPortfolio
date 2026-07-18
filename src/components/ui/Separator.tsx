import { cn } from "@/lib/cn"

type SeparatorProps = {
  className?: string
}

export const Separator = ({ className }: SeparatorProps) => {
  return (
    <div
      className={cn("my-4 h-px w-full bg-jet", className)}
      role="separator"
    />
  )
}
