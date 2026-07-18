import { cn } from "@/lib/cn"

type IconBoxProps = {
  children: React.ReactNode
  className?: string
}

export const IconBox = ({ children, className }: IconBoxProps) => {
  return (
    <div className={cn("icon-box shrink-0", className)} aria-hidden="true">
      {children}
    </div>
  )
}
