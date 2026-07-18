import { cn } from "@/lib/cn"

type SectionTitleProps = {
  children: React.ReactNode
  as?: "h2" | "h3"
  className?: string
}

export const SectionTitle = ({
  children,
  as = "h2",
  className,
}: SectionTitleProps) => {
  if (as === "h3") {
    return (
      <h3 className={cn("mb-5 text-lg capitalize text-white-2", className)}>
        {children}
      </h3>
    )
  }

  return (
    <h2
      className={cn(
        "gold-underline mb-4 text-2xl capitalize text-white-2 max-[579px]:text-2xl min-[580px]:mb-4 min-[580px]:pb-4 min-[580px]:text-[32px] min-[580px]:font-semibold",
        className
      )}
    >
      {children}
    </h2>
  )
}
