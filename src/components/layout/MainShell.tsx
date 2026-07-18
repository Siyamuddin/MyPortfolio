"use client"

import { Sidebar } from "@/components/layout/Sidebar"
import { Navbar } from "@/components/layout/Navbar"
import { FadeIn } from "@/components/ui/FadeIn"
import type { NavPage } from "@/lib/types"

type MainShellProps = {
  activePage: NavPage
  onNavigate: (page: NavPage) => void
  children: React.ReactNode
}

export const MainShell = ({
  activePage,
  onNavigate,
  children,
}: MainShellProps) => {
  return (
    <main className="mx-3 mb-[75px] mt-[15px] min-w-[259px] min-[580px]:mb-[60px] min-[1024px]:mb-[60px] min-[1250px]:mx-auto min-[1250px]:flex min-[1250px]:max-w-[1200px] min-[1250px]:items-stretch min-[1250px]:justify-center min-[1250px]:gap-[25px]">
      <Sidebar />

      <div className="relative min-[1024px]:mx-auto min-[1024px]:w-max min-[1250px]:m-0 min-[1250px]:min-w-[75%] min-[1250px]:w-[75%]">
        <Navbar activePage={activePage} onNavigate={onNavigate} />

        <FadeIn key={activePage} className="min-[1250px]:min-h-full">
          {children}
        </FadeIn>
      </div>
    </main>
  )
}
