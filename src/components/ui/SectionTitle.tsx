import { cn } from "@/lib/cn"

type SectionTitleProps = {
  children: React.ReactNode
  as?: "h1"
  className?: string
  section?: boolean
}

const pageTitleClassName =
  "gold-underline mb-4 text-2xl capitalize text-white-2 max-[579px]:text-2xl min-[580px]:mb-4 min-[580px]:pb-4 min-[580px]:text-[32px] min-[580px]:font-semibold"

export const SectionTitle = ({
  children,
  className,
  section = false,
}: SectionTitleProps) => {
  if (section) return <h2 className={cn("mb-5 text-lg capitalize text-white-2", className)}>{children}</h2>

  return (
    <h1 className={cn(pageTitleClassName, className)}>
      {children}
    </h1>
  )
}
