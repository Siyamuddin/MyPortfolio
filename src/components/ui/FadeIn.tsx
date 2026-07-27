import { cn } from "@/lib/cn"

type FadeInProps = {
  children: React.ReactNode
  className?: string
  delay?: number
}

export const FadeIn = ({ children, className, delay = 0 }: FadeInProps) => {
  return (
    <div
      className={cn("fade-in", className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  )
}
