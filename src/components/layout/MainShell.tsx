"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { Navbar } from "@/components/layout/Navbar"
import { FadeIn } from "@/components/ui/FadeIn"
import type { Profile } from "@/lib/types"

type MainShellProps = {
  children: React.ReactNode
  profile: Profile
}

export const MainShell = ({ children, profile }: MainShellProps) => {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })
  }, [pathname])

  return (
    <div className="mx-3 mb-[75px] mt-[15px] min-w-[259px] min-[580px]:mb-[60px] min-[1024px]:mb-[60px] min-[1250px]:mx-auto min-[1250px]:flex min-[1250px]:max-w-[1200px] min-[1250px]:items-stretch min-[1250px]:justify-center min-[1250px]:gap-[25px]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-gold focus:px-4 focus:py-3 focus:text-smoky-black">Skip to content</a>
      <Sidebar profile={profile} />

      <div className="relative min-[1024px]:mx-auto min-[1024px]:w-max min-[1250px]:m-0 min-[1250px]:min-w-[75%] min-[1250px]:w-[75%]">
        <Navbar />

        <main id="main-content" tabIndex={-1} className="outline-none">
        <FadeIn key={pathname} className="min-[1250px]:min-h-full">
          {children}
        </FadeIn>
        </main>
      </div>
    </div>
  )
}
