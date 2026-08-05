import { cn } from "@/lib/cn"

type SectionTitleProps = {
  children: React.ReactNode
  as?: "h1" | "h2" | "h3"
  className?: string
}

const pageTitleClassName =
  "gold-underline mb-4 text-2xl capitalize text-white-2 max-[579px]:text-2xl min-[580px]:mb-4 min-[580px]:pb-4 min-[580px]:text-[32px] min-[580px]:font-semibold"

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

  if (as === "h1") {
    return (
      <h1 className={cn(pageTitleClassName, className)}>
        {children}
      </h1>
    )
  }

  return (
    <h2 className={cn(pageTitleClassName, className)}>
      {children}
    </h2>
  )
}
