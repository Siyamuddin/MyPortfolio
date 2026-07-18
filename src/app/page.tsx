"use client"

import { MainShell } from "@/components/layout/MainShell"
import { AboutPage } from "@/components/pages/AboutPage"
import { ResumePage } from "@/components/pages/ResumePage"
import { PortfolioPage } from "@/components/pages/PortfolioPage"
import { BlogPage } from "@/components/pages/BlogPage"
import { ContactPage } from "@/components/pages/ContactPage"
import { useActivePage } from "@/hooks/useActivePage"

export default function Home() {
  const { activePage, setActivePage } = useActivePage("about")

  return (
    <MainShell activePage={activePage} onNavigate={setActivePage}>
      {activePage === "about" ? <AboutPage /> : null}
      {activePage === "resume" ? <ResumePage /> : null}
      {activePage === "portfolio" ? <PortfolioPage /> : null}
      {activePage === "blog" ? <BlogPage /> : null}
      {activePage === "contact" ? <ContactPage /> : null}
    </MainShell>
  )
}
