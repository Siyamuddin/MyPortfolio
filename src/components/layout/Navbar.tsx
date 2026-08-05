"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navPages } from "@/data/portfolio"
import { pagePaths, pathToNavPage } from "@/lib/seo"
import type { NavPage } from "@/lib/types"
import { cn } from "@/lib/cn"

export const Navbar = () => {
  const pathname = usePathname()
  const activePage = pathToNavPage(pathname)

  return (
    <nav
      className="fixed bottom-0 left-0 z-[5] w-full rounded-t-xl border border-jet bg-[rgba(43,43,44,0.75)] shadow-[var(--shadow-2)] backdrop-blur-[10px] min-[580px]:rounded-t-[20px] min-[1024px]:absolute min-[1024px]:inset-[0_0_auto_auto] min-[1024px]:w-max min-[1024px]:rounded-tr-[20px] min-[1024px]:rounded-bl-none min-[1024px]:rounded-br-none min-[1024px]:rounded-tl-none min-[1024px]:border min-[1024px]:border-jet min-[1024px]:bg-eerie-black-2 min-[1024px]:px-5 min-[1024px]:shadow-none min-[1024px]:backdrop-blur-none"
      aria-label="Primary"
    >
      <ul className="flex flex-wrap items-center justify-center px-2.5 min-[580px]:gap-5 min-[1024px]:gap-[30px] min-[1024px]:px-5">
        {navPages.map((page) => {
          const id = page.id as NavPage
          const href = pagePaths[id]
          const isActive = activePage === id

          return (
            <li key={page.id}>
              <Link
                href={href}
                className={cn(
                  "relative block px-[7px] py-5 text-[11px] text-light-gray transition-colors duration-250 hover:text-light-gray-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold min-[580px]:text-sm min-[768px]:text-[15px] min-[1024px]:font-medium",
                  isActive && "text-gold after:absolute after:bottom-2 after:left-1/2 after:h-0.5 after:w-5 after:-translate-x-1/2 after:rounded-full after:bg-gold min-[1024px]:after:bottom-auto min-[1024px]:after:left-0 min-[1024px]:after:top-1/2 min-[1024px]:after:h-5 min-[1024px]:after:w-0.5 min-[1024px]:after:-translate-x-0 min-[1024px]:after:-translate-y-1/2"
                )}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Navigate to ${page.label}`}
                tabIndex={0}
              >
                {page.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
