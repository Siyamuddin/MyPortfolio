"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/cn"

const FINANCE_LINKS = [
  { href: "/admin/finance", label: "Overview" },
  { href: "/admin/finance/spend", label: "Spend" },
  { href: "/admin/finance/obligations", label: "Obligations" },
  { href: "/admin/finance/guidelines", label: "Guidelines" },
] as const

export const FinanceSubNav = () => {
  const pathname = usePathname()

  return (
    <nav
      className="flex min-w-0 flex-wrap gap-2"
      aria-label="Finance sections"
    >
      {FINANCE_LINKS.map((item) => {
        const active =
          item.href === "/admin/finance"
            ? pathname === item.href
            : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
              active
                ? "border-gold/40 bg-gold/10 text-gold"
                : "border-jet bg-onyx text-light-gray hover:text-gold"
            )}
            aria-label={`Finance ${item.label}`}
            aria-current={active ? "page" : undefined}
            tabIndex={0}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
