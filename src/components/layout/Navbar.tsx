"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { navPages } from "@/data/portfolio"
import { pagePaths, pathToNavPage } from "@/lib/seo"
import type { NavPage } from "@/lib/types"
import { cn } from "@/lib/cn"
import { CommandPaletteTrigger } from "@/components/command/CommandPaletteTrigger"

type Indicator = { x: number; y: number; w: number; h: number }

export const Navbar = () => {
  const pathname = usePathname()
  const activePage = pathToNavPage(pathname)

  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const [indicator, setIndicator] = useState<Indicator | null>(null)

  const measure = useCallback(() => {
    const item = itemRefs.current[activePage]
    if (!item) return
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches
    if (isDesktop) {
      // Vertical tick hugging the left edge of the active item.
      setIndicator({
        x: item.offsetLeft,
        y: item.offsetTop + item.offsetHeight / 2 - 10,
        w: 2,
        h: 20,
      })
    } else {
      // Horizontal tick under the active item.
      setIndicator({
        x: item.offsetLeft + item.offsetWidth / 2 - 10,
        y: item.offsetTop + item.offsetHeight - 12,
        w: 20,
        h: 2,
      })
    }
  }, [activePage])

  useEffect(() => {
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [measure])

  return (
    <nav
      className="fixed bottom-0 left-0 z-[5] w-full rounded-t-xl border border-jet bg-[rgba(43,43,44,0.75)] pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-2)] backdrop-blur-[10px] min-[580px]:rounded-t-[20px] min-[1024px]:absolute min-[1024px]:inset-[0_0_auto_auto] min-[1024px]:flex min-[1024px]:w-max min-[1024px]:items-center min-[1024px]:gap-1.5 min-[1024px]:rounded-tr-[20px] min-[1024px]:rounded-bl-none min-[1024px]:rounded-br-none min-[1024px]:rounded-tl-none min-[1024px]:border min-[1024px]:border-jet min-[1024px]:bg-eerie-black-2 min-[1024px]:px-3 min-[1024px]:pb-0 min-[1024px]:shadow-none min-[1024px]:backdrop-blur-none"
      aria-label="Primary"
    >
      <CommandPaletteTrigger className="hidden min-[1024px]:inline-flex" />
      <ul className="relative grid grid-cols-6 items-center px-1 text-center min-[580px]:flex min-[580px]:justify-center min-[580px]:gap-5 min-[1024px]:gap-4 min-[1024px]:px-2">
        {indicator ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 rounded-full bg-gold transition-[transform,width,height,opacity] duration-300 ease-[cubic-bezier(.65,0,.35,1)] motion-reduce:transition-none"
            style={{
              width: indicator.w,
              height: indicator.h,
              transform: `translate(${indicator.x}px, ${indicator.y}px)`,
            }}
          />
        ) : null}
        {navPages.map((page) => {
          const id = page.id as NavPage
          const href = pagePaths[id]
          const isActive = activePage === id

          return (
            <li
              key={page.id}
              ref={(node) => {
                itemRefs.current[page.id] = node
              }}
            >
              <Link
                href={href}
                className={cn(
                  "relative block px-1 py-5 text-[11px] text-light-gray transition-[color,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:text-light-gray-70 active:scale-[0.96] motion-reduce:active:scale-100 min-[1024px]:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold min-[580px]:px-[7px] min-[580px]:text-sm min-[768px]:text-[15px] min-[1024px]:px-1 min-[1024px]:font-medium",
                  isActive && "text-gold"
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
